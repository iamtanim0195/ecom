import OrdersAdminTable from "@/components/admin/OrdersAdminTable";

export default function AdminOrdersPage() {
    return (
        <div className="p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">All Orders</h1>
                <p className="opacity-70 text-sm">
                    View and manage customer orders.
                </p>
            </div>

            <OrdersAdminTable />
        </div>
    );
}
