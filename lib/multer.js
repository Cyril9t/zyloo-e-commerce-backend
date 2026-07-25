import pkg from 'multer';

const multer = pkg;

const storage = multer.memoryStorage();

export const uploads = multer({ storage });