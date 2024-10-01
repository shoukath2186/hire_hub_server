"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3"); // AWS SDK v3
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
// import {} from '../middlewares/uploads'
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
class S3Service {
    saveS3Image(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const processedImagePath = path_1.default.join(__dirname, 'processed_image.jpg');
                yield (0, sharp_1.default)(file.path)
                    .resize(800, 800)
                    .toFormat('jpeg')
                    .toFile(processedImagePath);
                const fileStream = fs_1.default.createReadStream(processedImagePath);
                const bucketName = process.env.S3_BUCKET_NAME;
                const region = process.env.AWS_REGION;
                const filename = `${Date.now()}-${path_1.default.basename(processedImagePath)}`;
                const fileKey = `uploads/profile/${filename}`;
                const uploadParams = {
                    Bucket: bucketName,
                    Key: fileKey,
                    Body: fileStream,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read',
                };
                yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
                fs_1.default.unlinkSync(processedImagePath);
                fs_1.default.unlinkSync(file.path);
                const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
                return publicUrl;
            }
            catch (error) {
                console.error('Error uploading image to S3:', error);
                throw new Error('Error uploading image to S3');
            }
        });
    }
    saveAudioFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucketName = process.env.S3_BUCKET_NAME;
                const region = process.env.AWS_REGION;
                const fileKey = `uploads/audio/${Date.now()}-${path_1.default.basename(file.originalname)}`;
                const s3Client = new client_s3_1.S3Client({ region });
                let body;
                if (file.buffer) {
                    body = yield file.buffer;
                }
                else if (file.path) {
                    body = fs_1.default.createReadStream(file.path);
                }
                else {
                    throw new Error('No valid file data found');
                }
                const upload = new lib_storage_1.Upload({
                    client: s3Client,
                    params: {
                        Bucket: bucketName,
                        Key: fileKey,
                        Body: body,
                        ContentType: 'audio/wav',
                        ACL: 'public-read',
                    },
                });
                yield upload.done();
                fs_1.default.unlinkSync(file.path);
                const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
                return publicUrl;
            }
            catch (error) {
                console.error('Error uploading audio to S3:', error);
                throw new Error('Error uploading audio to S3');
            }
        });
    }
    saveS3Resume(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileStream = fs_1.default.createReadStream(file.path);
                const bucketName = process.env.S3_BUCKET_NAME;
                const region = process.env.AWS_REGION;
                const fileKey = `uploads/resumes/${path_1.default.basename(file.path)}`;
                const uploadParams = {
                    Bucket: bucketName,
                    Key: fileKey,
                    Body: fileStream,
                    ContentType: 'application/pdf',
                    ACL: 'public-read',
                };
                yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
                fs_1.default.unlinkSync(file.path);
                const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
                return fileUrl;
            }
            catch (error) {
                console.error('Error uploading resume to S3:', error);
                throw new Error('Error uploading resume to S3');
            }
        });
    }
    saveVideoFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucketName = process.env.S3_BUCKET_NAME;
                const region = process.env.AWS_REGION;
                if (!bucketName || !region) {
                    throw new Error('S3 bucket name or AWS region is not set');
                }
                // Generate a unique filename
                const filename = `${Date.now()}-${path_1.default.basename(file.originalname)}`;
                const fileKey = `uploads/chatVedio/${filename}`;
                let body;
                if (file.buffer) {
                    body = file.buffer;
                }
                else if (file.path) {
                    body = fs_1.default.createReadStream(file.path);
                }
                else {
                    throw new Error('No valid file data found');
                }
                const uploadParams = {
                    Bucket: bucketName,
                    Key: fileKey,
                    Body: body,
                    ContentType: 'video/mp4',
                    ACL: 'public-read',
                };
                yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
                if (file.path) {
                    fs_1.default.unlinkSync(file.path);
                }
                const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
                return publicUrl; // Return the public URL
            }
            catch (error) {
                console.error('Error uploading video to S3:', error.message || error);
                throw new Error('Error uploading video to S3');
            }
        });
    }
    saveImageFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucketName = process.env.S3_BUCKET_NAME;
                const region = process.env.AWS_REGION;
                const filename = `${Date.now()}-${path_1.default.basename(file.originalname)}`;
                const fileKey = `uploads/${filename}`;
                let body;
                if (file.buffer) {
                    body = file.buffer;
                }
                else if (file.path) {
                    body = fs_1.default.createReadStream(file.path);
                }
                else {
                    throw new Error('No valid file data found');
                }
                const uploadParams = {
                    Bucket: bucketName,
                    Key: fileKey,
                    Body: body,
                    ContentType: file.mimetype,
                    ACL: 'public-read',
                };
                const upload = new lib_storage_1.Upload({
                    client: s3Client,
                    params: uploadParams,
                });
                yield upload.done();
                if (file.path) {
                    fs_1.default.unlinkSync(file.path);
                }
                const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
                return publicUrl;
            }
            catch (error) {
                console.error('Error uploading file to S3:', error);
                throw new Error('Error uploading file to S3');
            }
        });
    }
    removeS3File(fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucketName = process.env.S3_BUCKET_NAME;
                const key = fileUrl.split('/').slice(3).join('/');
                const deleteParams = {
                    Bucket: bucketName,
                    Key: key,
                };
                yield s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
            }
            catch (error) {
                console.error('Error deleting file from S3:', error);
                throw new Error('Error deleting file from S3');
            }
        });
    }
}
exports.default = S3Service;
