import Layout from "@/components/Layout";
import { useState } from "react";

export default function Categories(){

    const [name,setName]=useState('');
    function saveCategory(){

    }
    return(
        <Layout>
            <h1>Categories</h1>
            <label>New category name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                className="mt-2 mb-0" 
                type="text" 
                placeholder={'Category name'}
                onChange={ev => setName(ev.target.value)}
                value={name}/>
                <button className="btn-primary" type="submit">Save</button>
            </form>
            
        </Layout>
    )
}