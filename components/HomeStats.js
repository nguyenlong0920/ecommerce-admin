import Spinner from "@/components/Spinner";
import {useEffect, useState} from "react";
import {subHours, eachDayOfInterval} from "date-fns";
import axios from "axios";
import {Line, Bar} from "react-chartjs-2";
import {LinearScale, CategoryScale, BarElement, LineElement, PointElement, Chart } from "chart.js/auto";

// Register necessary elements and scales
Chart.register(LinearScale, CategoryScale, BarElement, LineElement, PointElement);

export default function HomeStats() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(res => {
            setOrders(res.data);
            setIsLoading(false);
        });
    }, []);

    function ordersTotal(orders) {
        let sum = 0;
        orders.forEach(order => {
            const { line_items } = order;
            line_items.forEach(li => {
                const lineSum = li.quantity * li.price_data.unit_amount / 100;
                sum += lineSum;
            });
        });
        return new Intl.NumberFormat('sv-SE').format(sum);
    }

    function calculateOrderTotal(order) {
        return order.line_items.reduce((total, li) => {
            const lineSum = li.quantity * li.price_data.unit_amount / 100;
            return total + lineSum;
        }, 0);
    }

    if (isLoading) {
        return (
            <div className='justify-center items-center flex'>
                <Spinner fullWidth={true} />
            </div>
        );
    }

    const today = new Date();
    const ordersToday = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24));

    const dayOfWeek = today.getDay(); // Get the day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
    const daysUntilMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Calculate the number of days until Monday
    const startOfCurrentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysUntilMonday);
    const daysUntilSunday = (dayOfWeek === 0 ? 0 : 7 - dayOfWeek); // Calculate the number of days until Sunday
    const endOfCurrentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilSunday);

    const ordersWeek = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfCurrentWeek && orderDate <= endOfCurrentWeek;
    });

    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInCurrentMonth = eachDayOfInterval({
        start: startOfCurrentMonth,
        end: endOfCurrentMonth,
    });

    const ordersMonth = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfCurrentMonth && orderDate <= endOfCurrentMonth;
    });

    const ordersByDay = daysInCurrentMonth.map((day) => ({
        date: day,
        count: orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const isSameMonth = orderDate.getMonth() === startOfCurrentMonth.getMonth() && orderDate.getFullYear() === startOfCurrentMonth.getFullYear();
            return isSameMonth && orderDate.getDate() === day.getDate();
        }).length,
    }));

    const ordersRevenueByDay = daysInCurrentMonth.map(day => {
        const ordersOnDate = ordersMonth.filter(order => {
            const orderDate = new Date(order.createdAt);
            return (
                orderDate.getMonth() === day.getMonth() &&
                orderDate.getDate() === day.getDate()
            );
        });
        const revenue = ordersOnDate.reduce((total, order) => {
            return total + calculateOrderTotal(order);
        }, 0);
        return {
            date: day.getDate(),
            revenue: revenue.toFixed(2),
        };
    });

    // const getDates = (data) => data.map((entry) => entry.date.getDate());
    // const getValues = (data, key) => data.map((entry) => entry[key]);

    // const chartData = {
    //     labels: getDates(ordersByDay),
    //     datasets: [
    //         {
    //             label: "Revenue",
    //             data: getValues(ordersRevenueByDay, 'revenue'),
    //             borderColor: "rgba(255, 99, 132, 1)",
    //             backgroundColor: "rgba(255, 99, 132, 0.6)",
    //             type: "line",
    //             yAxisID: "revenue",
    //         },
    //         {
    //             label: "Number of Orders",
    //             data: getValues(ordersByDay, 'count'),
    //             backgroundColor: "rgba(75, 192, 192, 0.6)",
    //         },
    //     ],
    // };

    const staticOrdersByDay = [
        { date: new Date(2024, 2, 1), count: 5 },
        { date: new Date(2024, 2, 2), count: 8 },
        { date: new Date(2024, 2, 3), count: 12 },
        { date: new Date(2024, 2, 4), count: 6 },
        { date: new Date(2024, 2, 5), count: 10 },
        { date: new Date(2024, 2, 6), count: 15 },
        { date: new Date(2024, 2, 7), count: 9 },
        { date: new Date(2024, 2, 8), count: 11 },
        { date: new Date(2024, 2, 9), count: 7 },
        { date: new Date(2024, 2, 10), count: 13 },
        { date: new Date(2024, 2, 11), count: 8 },
        { date: new Date(2024, 2, 12), count: 10 },
        { date: new Date(2024, 2, 13), count: 14 },
        { date: new Date(2024, 2, 14), count: 6 },
        { date: new Date(2024, 2, 15), count: 9 },
        { date: new Date(2024, 2, 16), count: 12 },
        { date: new Date(2024, 2, 17), count: 8 },
        { date: new Date(2024, 2, 18), count: 11 },
        { date: new Date(2024, 2, 19), count: 7 },
        { date: new Date(2024, 2, 20), count: 10 },
        { date: new Date(2024, 2, 21), count: 13 },
        { date: new Date(2024, 2, 22), count: 9 },
        { date: new Date(2024, 2, 23), count: 12 },
        { date: new Date(2024, 2, 24), count: 6 },
        { date: new Date(2024, 2, 25), count: 11 },
        { date: new Date(2024, 2, 26), count: 8 },
        { date: new Date(2024, 2, 27), count: 10 },
        { date: new Date(2024, 2, 28), count: 14 },
        { date: new Date(2024, 2, 29), count: 7 },
        { date: new Date(2024, 2, 30), count: 9 },
        { date: new Date(2024, 2, 31), count: 12 },
    ];
    
    const staticOrdersRevenueByDay = [
        { date: 1, revenue: "100.00" },
        { date: 2, revenue: "150.00" },
        { date: 3, revenue: "200.00" },
        { date: 4, revenue: "120.00" },
        { date: 5, revenue: "180.00" },
        { date: 6, revenue: "250.00" },
        { date: 7, revenue: "190.00" },
        { date: 8, revenue: "220.00" },
        { date: 9, revenue: "160.00" },
        { date: 10, revenue: "230.00" },
        { date: 11, revenue: "150.00" },
        { date: 12, revenue: "180.00" },
        { date: 13, revenue: "240.00" },
        { date: 14, revenue: "110.00" },
        { date: 15, revenue: "200.00" },
        { date: 16, revenue: "210.00" },
        { date: 17, revenue: "170.00" },
        { date: 18, revenue: "220.00" },
        { date: 19, revenue: "140.00" },
        { date: 20, revenue: "190.00" },
        { date: 21, revenue: "230.00" },
        { date: 22, revenue: "180.00" },
        { date: 23, revenue: "220.00" },
        { date: 24, revenue: "130.00" },
        { date: 25, revenue: "210.00" },
        { date: 26, revenue: "160.00" },
        { date: 27, revenue: "180.00" },
        { date: 28, revenue: "240.00" },
        { date: 29, revenue: "150.00" },
        { date: 30, revenue: "190.00" },
        { date: 31, revenue: "220.00" },
    ];
    
    // Replace the dynamic data with static data for testing
    const chartData = {
        labels: staticOrdersByDay.map(entry => entry.date.getDate()),
        datasets: [
            {
                label: "Revenue",
                data: staticOrdersRevenueByDay.map(entry => parseFloat(entry.revenue)),
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                type: "line",
                yAxisID: "revenue",
            },
            {
                label: "Number of Orders",
                data: staticOrdersByDay.map(entry => entry.count),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                type: "bar",
            },
        ],
    };
    
    const chartOptions = {
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
            revenue: {
                position: "right",
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return "$" + value;
                    },
                },
            },
        },
        // Add responsive settings
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div>
            <h2>Orders</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">{ordersToday.length}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This week</h3>
                    <div className="tile-number">{ordersWeek.length}</div>
                    <div className="tile-desc">{ordersWeek.length} orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month</h3>
                    <div className="tile-number">{ordersMonth.length}</div>
                    <div className="tile-desc">{ordersMonth.length} orders this month</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">$ {ordersTotal(ordersToday)}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This week</h3>
                    <div className="tile-number">$ {ordersTotal(ordersWeek)}</div>
                    <div className="tile-desc">{ordersWeek.length} orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month</h3>
                    <div className="tile-number">$ {ordersTotal(ordersMonth)}</div>
                    <div className="tile-desc">{ordersMonth.length} orders this month</div>
                </div>
            </div>
            <h2>Overview</h2>
            <div className="chart-container">
                <div className="chart-wrapper">
                    <Bar data={chartData} options={chartOptions} />
                    {/* <Line data={chartData} options={chartOptions} /> */}
                </div>
            </div>
        </div>
    );
}