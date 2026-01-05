import OrdersAdminTable from "@/components/admin/OrdersAdminTable";

export default function ManagerOrdersPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Orders</h1>
            <OrdersAdminTable />
        </div>
    );
}
