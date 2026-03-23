import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ADMIN_EMAILS } from "@/actions/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();

    if (!ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress || "")) {
        redirect("/");
    }

    return <>{children}</>;
}
