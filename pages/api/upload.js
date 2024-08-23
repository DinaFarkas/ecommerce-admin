import multiparty from 'multiparty'; 
import { v2 as cloudinary } from 'cloudinary'; 
import { mongooseConnect } from "@/lib/mongoose"; 
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Konfigurišem Cloudinary koristeći kredencijale iz okruženja (environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  console.log("API funkcija je pokrenuta");
  try {
    await mongooseConnect();
    await isAdminRequest(req,res); //DODATA LINIJA ZA PROVERU ADMINA

    const form = new multiparty.Form();
    console.log("Forma je kreirana");

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Greška pri parsiranju forme:", err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    console.log("Forma je parsirana:", files);

    if (!files.file0 || !Array.isArray(files.file0) || files.file0.length === 0) {
      console.error("Nema fajlova u uploadu ili je struktura pogrešna.");
      return res.status(400).json({ error: 'No files uploaded or incorrect file structure' });
    }

    const uploadPromises = files.file0.map(file =>
      cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'nextproduct',  // Dodajemo folder u koji će se uploadovati slike
      }).catch(error => {
        console.error("Greška pri upload-u na Cloudinary:", error);
        throw error;
      })
    );

    const results = await Promise.all(uploadPromises);
    const links = results.map(result => result.secure_url);
    console.log("Linkovi za upis u bazu:", links);  // - Dodato logovanje linkova za upis
    return res.json({ links });
  } catch (error) {
    console.error("Greška u API funkciji:", error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: { bodyParser: false }, 
};


/** 
 * 
 * BEZ ADMIN PROVERE IZNACI GRESKU :Greška koju dobijaš TypeError: Cannot read properties of undefined (reading 'map') sugeriše da pokušavaš da pozoveš map na nečemu što je undefined. U ovom slučaju, to je verovatno zbog files.file koji izgleda nije definisan.
*
*Da bi rešio ovaj problem, proveri da li files.file zaista sadrži podatke pre nego što pokušaš da koristiš map funkciju. Evo kako možeš izmeniti kod da se pobrine za to:

import multiparty from 'multiparty'; 
import { v2 as cloudinary } from 'cloudinary'; 
import { mongooseConnect } from "@/lib/mongoose"; 
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Konfigurišem Cloudinary koristeći kredencijale iz okruženja (environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Naziv Cloudinary naloga
  api_key: process.env.CLOUDINARY_API_KEY, // API ključ za pristup Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET, // API za pristup Cloudinary
});

export default async function handle(req, res) {
  console.log("API funkcija je pokrenuta");
  try {
    await mongooseConnect();

    const form = new multiparty.Form();
    console.log("Forma je kreirana");
    
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Greška pri parsiranju forme:", err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    console.log("Forma je parsirana:", files);

    const uploadPromises = files.file.map(file =>
      cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
      }).catch(error => {
        console.error("Greška pri upload-u na Cloudinary:", error);
        throw error;
      })
    );

    const results = await Promise.all(uploadPromises);
    const links = results.map(result => result.secure_url);
    return res.json({ links });
  } catch (error) {
    console.error("Greška u API funkciji:", error);
    return res.status(500).json({ error: error.message });
  }
}


export const config = {
  api: { bodyParser: false }, 
};
 */
