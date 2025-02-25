import request from 'supertest';
import app from '../../../../app';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../../jest.setup';

describe('User API', () => {
  let testUserId: number;
  let refreshToken: string;
  let accessToken: string;

  describe('POST /register - Create User', () => {
    it('should create a new user successfully', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      // Updated to match router path
      const response = await request(app)
        .post('/v1/users/register')
        .send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('New User');
      expect(response.body.accessToken).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();

      const user = await prisma.user.findUnique({
        where: { email: 'new@example.com' },
      });
      expect(user).not.toBeNull();
      testUserId = user!.id;
    });

    it('should fail with duplicate email', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: 'new@example.com',
        password: 'password123',
      };

      // Updated to match router path
      const response = await request(app)
        .post('/v1/users/register')
        .send(duplicateUser);
      expect(response.status).toBe(500);
    });
  });

  describe('POST /v1/users/login - User Login', () => {
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: hashedPassword,
        },
      });
    });

    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Updated to match router path
      const response = await request(app)
        .post('/v1/users/login')
        .send(loginData);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login Success');
      expect(response.body.accessToken).toBeDefined();
      expect(response.headers['set-cookie']).toContainEqual(
        expect.stringContaining('refreshToken')
      );

      refreshToken = response.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      accessToken = response.body.accessToken;
    });

    it('should fail with wrong credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/v1/users/login')
        .send(loginData);
      expect(response.status).toBe(401);
    });
  });

  describe('POST /logout - User Logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/v1/users/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'test@example.com' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout Success');
      expect(response.headers['set-cookie']).toContainEqual(
        expect.stringContaining('refreshToken=;')
      );
    });
  });

  describe('POST /refresh - Refresh Token', () => {
    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/v1/users/refresh')
        .set('Cookie', [`refreshToken=${refreshToken}`]);
      expect(response.status).toBe(201);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/v1/users/refresh')
        .set('Cookie', ['refreshToken=invalidtoken']);
      expect(response.status).toBe(401);
    });
  });

  describe('POST /request-reset - Password Reset Request', () => {
    it('should send password reset email', async () => {
      // Updated to match router path
      const response = await request(app)
        .post('/v1/users/request-reset')
        .send({ email: 'test@example.com' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Password Reset Email sent to your Registered email'
      );
    });
  });

  describe('GET /:id - Get User by ID', () => {
    it('should get user by ID successfully', async () => {
      const response = await request(app)
        .get(`/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testUserId);
      expect(response.body.meta).toBeDefined();
    });
  });

  describe('Calendar Endpoints', () => {
    it('should enable calendar and return auth URL', async () => {
      // Updated to match router path
      const response = await request(app)
        .post('/v1/users/calendar/enable')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.authUrl).toContain('https://accounts.google.com');
    });

    it('should get calendar status', async () => {
      // Updated to match router path
      const response = await request(app)
        .get('/v1/users/calendar-status')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });
});
