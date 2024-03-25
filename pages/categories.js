import axios from "axios";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import {withSwal} from 'react-sweetalert2';
import {useEffect, useState} from "react";

function Categories({swal}) {
    const [editedCategory,setEditedCategory] = useState(null);
    const [name,setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        setIsLoading(true);
        try {
            const categoriesResponse = await axios.get('/api/categories');
            const categoriesData = categoriesResponse.data;

            const categoriesWithProducts = await Promise.all(categoriesData.map(async (category) => {
                const productsResponse = await axios.get('/api/products', {
                    params: {
                        category: category._id
                    }
                });

                const productsData = productsResponse.data;
                return {
                    ...category,
                    products: productsData
                };
            }));

            setCategories(categoriesWithProducts);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setIsLoading(false);
        }
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            properties:properties.map(p => ({
                name:p.name,
                values:p.values.split(','),
            })),
        };

        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }

        setName('');
        setProperties([]);
        await fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setProperties(category.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
        })));
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${category.name}"?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                await fetchCategories();
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
            <label>{editedCategory ? `Edit category ${editedCategory.name}` : 'Creat new category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input type="text" placeholder={'Category name'}
                           value={name} onChange={ev => setName(ev.target.value)}/>
                    <button type='button' onClick={addProperty}
                            className="btn-default text-md mb-2 whitespace-nowrap">
                        Add new properties
                    </button>
                </div>
                <div className='mb-2'>
                    <label className='block'>Properties</label>
                    {properties.length>0 && properties.map((property,index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text" placeholder="property name (example: color)"
                                   value={property.name} className='mb-0'
                                   onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}/>
                            <input type="text" placeholder="values, comma seperated"
                                   onChange={ev => handlePropertyValuesChange(index,property,ev.target.value)}
                                   value={property.values} className='mb-0'/>
                            <button className="btn-red" type='button'
                                    onClick={() => removeProperty(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button className="btn-default" type="button"
                                onClick={() => {
                                    setEditedCategory(null);
                                    setName('');
                                    setProperties([]);
                                }}>
                            Cancel
                        </button>
                    )}
                    <button type='submit' className="btn-primary py-1">Save</button>
                </div>
            </form>
            {!editedCategory && (
                <table className='basic mt-4 text-center'>
                    <thead>
                        <tr>
                            <td>Category</td>
                            <td>Properties</td>
                            <td>Products</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                        <tr>
                            <td colSpan={4}>
                                <div className="py-4">
                                    <Spinner fullwidth={true} />
                                </div>
                            </td>
                        </tr>
                        ) : (
                        categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>
                                    <div className="category-div">
                                        {category.name}
                                    </div>
                                </td>
                                <td>{category.properties.length}</td>
                                <td>{category.products.length}</td>
                                <td>
                                    <button onClick={() => editCategory(category)} className='btn-default w-24'>
                        <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                            </svg>
                            Edit
                        </span>
                                    </button>
                                    <button onClick={() => deleteCategory(category)} className='btn-red w-24'>
                        <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete
                        </span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </Layout>
    )
}
export default withSwal(({swal}) => (
    <Categories swal = {swal}/>
));