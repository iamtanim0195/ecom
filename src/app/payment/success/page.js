export default function PaymentSuccessPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="card bg-base-100 shadow p-6 text-center">
                <h1 className="text-2xl font-bold text-success">
                    Payment Successful 🎉
                </h1>
                <p className="mt-2">
                    Your payment is being verified.
                    You’ll see the order marked as paid shortly.
                </p>
                <a href="/dashboard/orders" className="btn btn-primary mt-4">
                    View Orders
                </a>
            </div>
        </div>
    );
}
