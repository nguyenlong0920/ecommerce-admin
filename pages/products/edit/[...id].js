import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import ProductForm from "@/components/ProductForm";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        setIsLoading(true);
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
            setIsLoading(false);
        });
    }, [id]);
    return (
        <Layout>
            <h1>Edit Product</h1>
            {isLoading && (
                <div className="py-4">
                    <Spinner fullwidth={true}/>
                </div>
            )}
            {productInfo && (
                <ProductForm {...productInfo}/>
            )}
        </Layout>
    )
}