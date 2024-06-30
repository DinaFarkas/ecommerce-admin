import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct(){
    const [title,setTitle]= useState('');
    const [description,setDescription]= useState('');
    const [price,setPrice]= useState('');
    const [goToProducts,setGoToProducts]= useState(false);
    const router=useRouter();
    async function createProduct(ev){
        ev.preventDefault();
        const data= {title,description,price};
        await axios.post('/api/products', data);
        setGoToProducts(true);
    }

    if(goToProducts){
        router.push('/products');
    }
    return(
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New product</h1>

                <label>Product name</label>
                <input type="text" placeholder="Product name" value={title} onChange={ev=> setTitle(ev.target.value)}/>
                <label>Description</label>
                <textarea placeholder="Description" value={description} onChange={ev=> setDescription(ev.target.value)}/>
                <label>Price</label>
                <input type="number" placeholder="Price" value={price} onChange={ev=> setPrice(ev.target.value)}/>

                <button type="submit" className="btn-primary">
                    Create
                </button>  
            </form>   
        </Layout>
    );
}