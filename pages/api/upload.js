import multiparty from 'multiparty';
import { v2 as cloudinary } from 'cloudinary';
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Konfigurišemo Cloudinary koristeći kredencijale iz okruženja
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const links = [];
  for (const file of files.file) {
    // Uploadujemo fajl na Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto',
    });
    links.push(result.secure_url);
  }

  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};


/** 
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { mongooseConnect } from './path/to/mongooseConnect';
import YourModel from './models/YourModel'; // Pretpostavimo da imate model definisan

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    await mongooseConnect();

    // Pretpostavimo da je 'image' ime polja u formi
    const result = await cloudinary.uploader.upload(req.files.image.path);

    // Kreirajte novi dokument sa URL-om slike
    const newDocument = new YourModel({
      // ... ostali podaci
      imageUrl: result.secure_url
    });

    // Sačuvajte dokument u MongoDB
    await newDocument.save();

    res.status(200).json({ message: 'Slika je uspešno otpremljena i sačuvana u bazi.', imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Došlo je do greške prilikom otpremanja slike.', error: error.message });
  }
});

export default router;



import multiparty from 'multiparty';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";
const bucketName = 'dawid-next-ecommerce';

export default async function handle(req,res) {
  await mongooseConnect();
  await isAdminRequest(req,res);

  const form = new multiparty.Form();
  const {fields,files} = await new Promise((resolve,reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({fields,files});
    });
  });
  console.log('length:', files.file.length);
  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read',
      ContentType: mime.lookup(file.path),
    }));
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }
  return res.json({links});
}

export const config = {
  api: {bodyParser: false},
};
 */
