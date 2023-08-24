import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

export default function OrdersPage() {
    const [orders,setOrders] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(response => {
           setOrders(response.data);
            setIsLoading(false);
        });
    },[]);
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic text-center">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Address</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={4}>
                                <div className="py-4">
                                    <Spinner fullwidth={true}/>
                                </div>
                            </td>
                        </tr>
                    )}
                    {orders.length > 0 && orders.map(order => (
                    <tr key={order._id}>
                        <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                        <td className='address-div'>
                            {order.name} - {order.email} <br/>
                            {order.streetAddress} <br/>
                            {order.city} {order.postalCode}, {order.country} <br/>
                        </td>
                        <td>
                            {order.line_items.map((l, index) => (
                                <div key={`${order._id}-${index}`}>
                                    {l.quantity} x {l.price_data?.product_data.name}<br/>
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    );
}