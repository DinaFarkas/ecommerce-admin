import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";


function Categories({swal}){

    const[editedCategory,setEditedCategory]= useState(null);
    const [name,setName]=useState('');
    const[parentCategory,setParentCategory]= useState('');
    const [categories, setCategories] = useState([]);
    const [properties,setProperties]= useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories(){
         axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data={
            name,
            parentCategory,
            properties:properties.map(p=>({
                name:p.name,
                values:p.values.split(','),})),
        }
        if(editedCategory){
            data._id=editedCategory._id
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }else{
            await axios.post('/api/categories', data);
        }
        
        setName('');
        setParentCategory('');
        setProperties([])
        fetchCategories();

    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
          }))
        );
          
    }

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete ${category.name} category?`,
            showCancelButton:true,
            cancelButtonText: 'Cancel',
            confirmButtonText:'Yes, delete!',
            customClass: {
                confirmButton: 'swal2-confirm',
                cancelButton : 'swal2-cancel',
            }
        }).then( async result => {
            if(result.isConfirmed){
                const {_id}= category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
          return [...prev, {name:'',values:''}];
        });
    }
      
    function handlePropertyNameChange(index,property,newName) {
        setProperties(prev => {
          const properties = [...prev];
          properties[index].name = newName;
          return properties;
        });
    }

    function handlePropertyValuesChange(index,property,newValues) {
        setProperties(prev => {
          const properties = [...prev];
          properties[index].values = newValues;
          return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
          return [...prev].filter((p,pIndex) => {
            return pIndex !== indexToRemove;
          });
        });
    }

    return(
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input  type="text" placeholder={'Category name'} onChange={ev => setName(ev.target.value)} value={name}/>
                    <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option> 
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button  type="button" className="btn-purple text-sm mb-2" onClick={addProperty}>Add new property</button>
                    {properties.length > 0 && properties.map((property,index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text"    
                                className="mb-0"
                                onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                                value={property.name}
                                placeholder="property name (example: color)"/>

                            <input type="text"
                                    className="mb-0"
                                    onChange={ev => handlePropertyValuesChange(index,property,ev.target.value)}
                                    value={property.values}
                                    placeholder="values, comma separated"/>

                            <button onClick={() => removeProperty(index)}  type="button" className="btn-purple text-sm p-15">Remove</button>
                        </div>
                    ))}
    
                </div>
                <div className="flex gap-1">
                    <button className="btn-primary" type="submit">Save</button>
                    {editedCategory && (
                        <button type="button"  className="btn-default" onClick={() => {
                            setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                        }}> Cancel</button>
                    )}
                
                
                </div>
                
            </form>

            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <div className="flex">
                                    <button onClick={() => editCategory(category)} className="btn-primary mr-2" >Edit</button>
                                    <button onClick={() => deleteCategory(category)} className="btn-primary">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
        </Layout>
    )

}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
));