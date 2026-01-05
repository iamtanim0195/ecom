import OrdersList from "@/components/orders/OrdersList";

export default function OrdersPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            <OrdersList />
        </div>
    );
}
