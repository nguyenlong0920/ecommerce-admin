import axios from "axios";
import Spinner from "@/components/Spinner";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,
}) {
    const [title,setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [description,setDescription] = useState(existingDescription || '');
    const [price,setPrice] = useState(existingPrice || '');
    const [images,setImages] = useState(existingImages || []);
    const [isUploading,setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        setCategoriesLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setCategoriesLoading(false);
        });
    }

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title,description,price,images, category, properties:productProperties};
        if (_id) {
            // update
            await axios.put('/api/products', {...data,_id});
        } else {
            //create
            await axios.post('/api/products', data);
        }
        fetchCategories();
        await router.push('/products')
    }

    function cancelChanges() {
        router.push('/products')
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file',file);
            }
            const res = await axios.post('/api/upload',data);
            setImages(oldImages => {
               return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function removeImage(imageLink) {
        setImages(oldImages => {
            const updatedImages = oldImages.filter(link => link !== imageLink);
            return updatedImages;
        });
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
    }

    function setProductProp(propName,value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}/>
            <label>Category</label>
            <select value={category} onChange={ ev => setCategory(ev.target.value)}>
                <option value=""> Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {categoriesLoading && (
                <div className="py-4">
                    <Spinner fullwidth={true}/>
                </div>
            )}
            {propertiesToFill.length > 0 && propertiesToFill.map((p, index) => (
                <div key={`${p._id}-${index}`} className=''>
                    <label>{p.name[0].toUpperCase() + p.name.substring(1).toLowerCase()}</label>
                    <div>
                        <select value={productProperties[p.name]}
                                onChange={ev => setProductProp(p.name, ev.target.value)}>
                            {p.values.map((v, index) => (
                                <option key={`${p._id}-${index}`} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key = {link} className="text-center flex flex-col items-center
                        justify-center text-sm w-32 h-32 bg-white p-4 shadow-md rounded-md
                        border border-gray-200 relative">
                            <button onClick={() => removeImage(link)} className='absolute top-0 right-0'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            <img src={link} alt="" className="rounded-lg py-1"/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="w-32 h-32 flex items-center justify-center">
                        <Spinner/>
                    </div>
                )}
                <label className="w-32 h-32 cursor-pointer text-center flex flex-col items-center
                justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-md border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add images</div>
                    <input type="file" onChange={uploadImages} className="hidden"/>
                </label>
            </div>
            <label>Description</label>
            <textarea className='desc'
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}/>
            <label>Price (in USD)</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}/>
            <button type="button" className="btn-default mr-1" onClick={cancelChanges}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
        </form>
    );
}