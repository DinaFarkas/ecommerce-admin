import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs"; 


export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,
   
  })  {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category,setCategory] = useState(assignedCategory || '');
    const [productProperties,setProductProperties] = useState(assignedProperties || {});
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories,setCategories] = useState([])
    const router = useRouter();

    useEffect(() => {
      axios.get('/api/categories').then(result => {
        setCategories(result.data);
      })
    },[])

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
          title,
          description,
          price,
          images,
          category,
          properties:productProperties
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
    
        for (let i = 0; i < files.length; i++) {
          data.append(`file${i}`, files[i]);
        }
    
        // Dodajemo Cloudinary upload preset
        data.append("upload_preset", "nextproduct");
    
        try {
          const res = await axios.post('/api/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          console.log(res.data);
        } catch (error) {
          console.error("Error uploading images:", error);
          if (error.response) {
            console.error("Server responded with an error:", error.response.status, error.response.data);
          } else if (error.request) {
            console.error("No response received:", error.request);
          } else {
            console.error("Error setting up the request:", error.message);
          }
        } finally {
          setIsUploading(false);
        }
      }
    }

    
  
      function updateImagesOrder(images){
        setImages(images);
      }

      function setProductProp(propName,value) {
        setProductProperties(prev => {
          const newProductProps = {...prev};
          newProductProps[propName] = value;
          return newProductProps;
        });
      }

      const propertiesToFill = [];
      if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);//trazenje kategorije
        propertiesToFill.push(...catInfo.properties);  //uzimamo sve propertije iz izabrane kategorije
        while(catInfo?.parent?._id) { //da li ima parent kategoriju, proverice svaku koliko god da ih ima 
          const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
          propertiesToFill.push(...parentCat.properties);//ako ima propertije dodaje ih u red 
          catInfo = parentCat;
        }
      }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input type="text" placeholder="product name" value={title} onChange={(ev) => setTitle(ev.target.value)} />
            
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                  //PROVERI JEL OVO RADI
                  // eslint-disable-next-line react/jsx-key    
                  <option value={c._id}>{c.name}</option>
                ))}
            </select>
            
            {propertiesToFill.length > 0&& propertiesToFill.map(p => (
              <div key={p.name} className="">
                <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                <div>
                  <select value={productProperties[p.name]}
                          onChange={ev =>
                            setProductProp(p.name,ev.target.value)
                          }
                  >
                    {p.values.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

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

            <label>Price(Euro)</label>
            <input type="number" placeholder="price" value={price} onChange={(ev) => setPrice(ev.target.value)} />

            <button type="submit" className="btn-primary float-right">
            Save
            </button>
        </form>
    );
};

