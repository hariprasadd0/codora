import multer,{StorageEngine} from "multer";
import path from "path";
import crypto from "crypto";
import {Request} from "express";

const storage : StorageEngine = multer.diskStorage({
    destination:(_req,_file , cb)=>{
        cb(null, 'uploads');
    },
    filename:(req,file,cb)=>{
     const suffix = crypto.randomBytes(8).toString('hex');
     const ext = path.extname(file.originalname);
     cb(null, `${file.fieldname}-${suffix}${ext}`);
    }
})
function fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) {
    const allowed = ['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type.'));
    }
}
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})