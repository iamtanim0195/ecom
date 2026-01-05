import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import ManagerOnly from "@/components/ui/ManagerOnly";
import Testui from "@/components/ui/Testui";

export default function ManagerProductsPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <p className="text-sm opacity-70">
                    Create products and view recent items.
                </p>
            </div>

            <ManagerOnly>
                <ProductForm />
            </ManagerOnly>
            <ProductList />
            <Testui />
        </div>
    );
}
