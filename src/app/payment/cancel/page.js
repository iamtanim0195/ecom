export default function PaymentCancelPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="card bg-base-100 shadow p-6 text-center">
                <h1 className="text-2xl font-bold text-error">
                    Payment Cancelled
                </h1>
                <p className="mt-2">
                    Your order is still saved. You can try payment again.
                </p>
                <a href="/dashboard/orders" className="btn btn-outline mt-4">
                    Back to Orders
                </a>
            </div>
        </div>
    );
}
