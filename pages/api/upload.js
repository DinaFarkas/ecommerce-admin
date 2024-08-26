import multiparty from 'multiparty'; 
import { v2 as cloudinary } from 'cloudinary'; 
import { mongooseConnect } from "@/lib/mongoose"; 
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import { Product } from "@/models/Product";

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
    // Citanje product-a iz baze
    console.log(fields.product_id[0]); //[0]
    var product = await Product.findOne({_id:fields.product_id})//[0]
    product.images = links;
    // Cuvanje nove vrednosti producta u bazu
    product = await Product.updateOne(product);
    return res.json({ product });
  } catch (error) {
    console.error("Greška u API funkciji:", error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: { bodyParser: false }, 
};

/*  // Citanje product-a iz baze
    const productId = fields.product_id[0]; // Provera product_id
    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Ažuriranje slika u bazi
    product.images = [...product.images, ...links]; // Dodavanje novih slika uz postojeće
    await product.save(); // Snimanje u bazu */





