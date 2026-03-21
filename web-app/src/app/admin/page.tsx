import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProducts } from "@/actions/getProducts";
import AdminDashboard from "./AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
    const user = await currentUser();
    const ADMIN_EMAILS = ["labelreeha@gmail.com", "princedas000555@gmail.com"];

    if (!ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress || "")) {
        redirect("/");
    }

    const products = await getProducts();

    return (
        <div className="min-h-screen bg-[#f9f7f2]">
            <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-40 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-serif font-bold text-[#d4af37]">
                        Label Reeha <span className="text-sm font-sans text-[#1a1a1a] uppercase tracking-widest ml-2">Admin</span>
                    </h1>
                </div>
            </header>
            
            <main className="container mx-auto px-6 py-12 max-w-5xl">
                <AdminDashboard initialProducts={products} />
            </main>
        </div>
    );
}
