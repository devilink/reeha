import { currentUser } from "@clerk/nextjs/server";

export const ADMIN_EMAILS = ["labelreeha@gmail.com", "princedas000555@gmail.com"];

export async function checkAdmin() {
    const user = await currentUser();
    if (!ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress || "")) {
        throw new Error("Unauthorized");
    }
}
