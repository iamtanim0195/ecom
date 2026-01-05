import UsersTable from "@/components/admin/UsersTable";

export default function AdminUsersPage() {
    return (
        <div className="p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="opacity-70 text-sm">
                    Promote managers, disable accounts.
                </p>
            </div>

            <UsersTable />
        </div>
    );
}
