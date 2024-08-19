import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
   
  })  {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
          title,
          description,
          price,
          images,
        };
        if (_id) {
          //update
          await axios.put('/api/products', {...data,_id});
        } else {
          //create
          await axios.post('/api/products', data);
        }
        setGoToProducts(true);
      }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {

          setIsUploading(true);
          const data = new FormData();
          for (const file of files) {
            data.append('file', file);
          }
          setIsUploading(false);
        }
      }

      function updateImagesOrder(images){
        setImages(images);
      }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input type="text" placeholder="product name" value={title} onChange={(ev) => setTitle(ev.target.value)} />

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
               
                <ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
                {!!images?.length && images.map(Link => (

                    <div key={link} className="h-24">                        
                        <img src={link} alt="" className="rounded-lg"/>
                    </div>

                ))}
                </ReactSortable>

                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner/>
                    </div>
                )}

                <label className="w-24 h-24 cursor-pointer border border-orc0 text-center flex flex-col items-center justify-center text-sm text-lil1 rounded-lg bg-lil0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                    </svg>
                    <div>
                        Upload
                    </div>                 
                    <input type="file" onChange={uploadImages} className="hidden" /> 
                </label>

            </div>

            <label>Description</label>
            <textarea placeholder="description" value={description} onChange={(ev) => setDescription(ev.target.value)} />

            <label>Price</label>
            <input type="number" placeholder="price" value={price} onChange={(ev) => setPrice(ev.target.value)} />

            <button type="submit" className="btn-primary">
                Save
            </button>
        </form>
    );
};

