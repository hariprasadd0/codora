import {Request, Response,NextFunction} from 'express';
import {upload} from '../config/multer.config'

export const uploadAttachment = upload.single('attachment');

export const handleUploadError = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err) {
        res.status(400).json({ error: err.message });
    }
};