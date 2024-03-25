import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
    const [products, setProducts] = useState([]);
    const [featuredProductId, setFeaturedProductId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [shippingFee, setShippingFee] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetchAll().then(() => {
            setIsLoading(false);
        });
    }, []);

    async function fetchAll() {
        await axios.get("/api/products").then((res) => {
            setProducts(res.data);
        });
        await axios.get("/api/settings?name=featuredProductId").then((res) => {
            setFeaturedProductId(res.data?.value || ""); // Set initial value or an empty string if value is null
        });
        await axios.get("/api/settings?name=shippingFee").then((res) => {
            setShippingFee(res.data?.value || ""); // Set initial value or an empty string if value is null
        });
    }

    async function saveSettings() {
        setIsLoading(true);
        await axios.put("/api/settings", {
            name: "featuredProductId",
            value: featuredProductId,
        });
        await axios.put("/api/settings", {
            name: "shippingFee",
            value: shippingFee,
        });
        setIsLoading(false);
        await swal.fire({
            title: "Settings saved!",
            icon: "success",
        });
    }

    return (
        <Layout>
            <h1>Settings</h1>
            {isLoading ? (
                <Spinner fullwidth={true} />
            ) : (
                <>
                    <div className="flex gap-4 w-full">
                        <div className='w-1/2'>
                            <label>Featured product</label>
                            <select value={featuredProductId} className='h-10'
                                    onChange={(ev) => setFeaturedProductId(ev.target.value)}>
                                {products.length > 0 && products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='w-1/2'>
                            <label>Shipping price (in USD)</label>
                            <input type="number" value={shippingFee} className='h-10'
                                   onChange={(ev) => setShippingFee(ev.target.value)}/>
                        </div>
                    </div>
                    <div>
                        <button onClick={saveSettings} className="btn-primary mt-2">
                            Save settings
                        </button>
                    </div>
                </>
            )}
        </Layout>
    );
}

export default withSwal(({ swal }) => <SettingsPage swal={swal} />);
