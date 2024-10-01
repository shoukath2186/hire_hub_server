import { S3Client, PutObjectCommand, DeleteObjectCommand, PutObjectCommandInput,GetObjectCommand  } from '@aws-sdk/client-s3'; // AWS SDK v3
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Upload } from "@aws-sdk/lib-storage";
import mime from 'mime-types';
import { buffer } from 'stream/consumers';

// import {} from '../middlewares/uploads'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '', 
  },
});

class S3Service {
  async saveS3Image(file: any) {
    try {
      const processedImagePath = path.join(__dirname, 'processed_image.jpg');

      
      await sharp(file.path)
        .resize(800, 800) 
        .toFormat('jpeg')
        .toFile(processedImagePath);

      const fileStream = fs.createReadStream(processedImagePath);
      const bucketName = process.env.S3_BUCKET_NAME as string;
      const region = process.env.AWS_REGION as string;
       
      const filename = `${Date.now()}-${path.basename(processedImagePath)}`;
      const fileKey = `uploads/profile/${filename}`;
    
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fileKey,
        Body: fileStream,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };

     
      await s3Client.send(new PutObjectCommand(uploadParams));

      
      fs.unlinkSync(processedImagePath);
      fs.unlinkSync(file.path)
      
      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error('Error uploading image to S3');
    }
  }

  async saveAudioFile(file: any) { 
    try {
     
        const bucketName = process.env.S3_BUCKET_NAME as string;
        const region = process.env.AWS_REGION as string;
       

        const fileKey = `uploads/audio/${Date.now()}-${path.basename(file.originalname)}`;
       

        const s3Client = new S3Client({ region });

        
        let body;
        if (file.buffer) {
            body =await file.buffer;
        } else if (file.path) {
            body =fs.createReadStream(file.path);
        } else {
            throw new Error('No valid file data found');
        }
       
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucketName,
                Key: fileKey,
                Body: body,
                ContentType: 'audio/wav',
                ACL: 'public-read',
            },
        });

        await upload.done();
       
        fs.unlinkSync(file.path)

        const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
       
        return publicUrl;
    } catch (error) {
        console.error('Error uploading audio to S3:', error);
        throw new Error('Error uploading audio to S3');
     }
}
  async saveS3Resume(file: any) {
    try {
      const fileStream = fs.createReadStream(file.path);
      const bucketName = process.env.S3_BUCKET_NAME as string;
      const region = process.env.AWS_REGION as string;

      const fileKey = `uploads/resumes/${path.basename(file.path)}`; 

     
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fileKey,
        Body: fileStream,
        ContentType: 'application/pdf',
        ACL: 'public-read', 
      };

      
      await s3Client.send(new PutObjectCommand(uploadParams));

     
      fs.unlinkSync(file.path);

     
      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      return fileUrl;
    } catch (error) {
      console.error('Error uploading resume to S3:', error);
      throw new Error('Error uploading resume to S3');
    }
  }

  async saveVideoFile(file: any) {
    try {
      const bucketName = process.env.S3_BUCKET_NAME as string;
      const region = process.env.AWS_REGION as string;

      if (!bucketName || !region) {
        throw new Error('S3 bucket name or AWS region is not set');
      }

      // Generate a unique filename
      const filename = `${Date.now()}-${path.basename(file.originalname)}`;
      const fileKey = `uploads/chatVedio/${filename}`;

    
      let body;
      if (file.buffer) {
        body = file.buffer;
      } else if (file.path) {
        body = fs.createReadStream(file.path);
      } else {
        throw new Error('No valid file data found');
      }

      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fileKey,
        Body: body,
        ContentType: 'video/mp4',
        ACL: 'public-read',
      };

    
       await s3Client.send(new PutObjectCommand(uploadParams));
     
    
      if (file.path) {
        fs.unlinkSync(file.path);
      }

      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;

      return publicUrl; // Return the public URL
    } catch (error: any) {
      console.error('Error uploading video to S3:', error.message || error);
      throw new Error('Error uploading video to S3');
    }
}

async saveImageFile(file: any) {
  try {
    const bucketName = process.env.S3_BUCKET_NAME as string;
    const region = process.env.AWS_REGION as string;

    
    const filename = `${Date.now()}-${path.basename(file.originalname)}`;
    const fileKey = `uploads/${filename}`;

    let body;
    if (file.buffer) {
      body = file.buffer;
    } else if (file.path) {
      body = fs.createReadStream(file.path);
    } else {
      throw new Error('No valid file data found');
    }

    const uploadParams: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: fileKey,
      Body: body,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    await upload.done();

    
    if (file.path) {
      fs.unlinkSync(file.path);
    }

    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Error uploading file to S3');
  }
}


  async removeS3File(fileUrl: any): Promise<void> {
    try {
      const bucketName = process.env.S3_BUCKET_NAME as string;

     
      const key = fileUrl.split('/').slice(3).join('/'); 

      
      const deleteParams = {
        Bucket: bucketName,
        Key: key,
      };

      
      await s3Client.send(new DeleteObjectCommand(deleteParams));

    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Error deleting file from S3');
    }
  }
}

export default S3Service;