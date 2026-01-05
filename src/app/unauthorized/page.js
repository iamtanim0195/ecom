export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="card bg-base-100 shadow-xl p-6 text-center">
                <h1 className="text-2xl font-bold text-error">Access Denied</h1>
                <p className="mt-2">
                    You do not have permission to access this page.
                </p>
            </div>
        </div>
    );
}
