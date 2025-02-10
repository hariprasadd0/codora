import { Request } from 'express';
import jwt from 'jsonwebtoken';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  Profile,
} from 'passport-google-oauth20';
import prisma from './prisma';
import passport from 'passport';
import { OAuth2Client } from 'google-auth-library';
import logger from '../utils/logger';

const googleClientId: string = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret: string = process.env.GOOGLE_CLIENT_SECRET!;

if (!googleClientId || !googleClientSecret) {
  throw new Error('clientID not found');
}

export const googleClient = new OAuth2Client({
  clientId: googleClientId,
  clientSecret: googleClientSecret,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: 'http://localhost:3000/v1/users/google/redirect',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0]?.value!,
              name: profile.displayName,
            },
          });
        }
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_ACCESS_SECRET!,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
        const newRefreshToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_REFRESH_SECRET!,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: newRefreshToken },
        });
        return done(null, { user, accessToken, refreshToken: newRefreshToken });
      } catch (error) {
        logger.error('Google strategy error:', error);
        return done(error);
      }
    }
  )
);
