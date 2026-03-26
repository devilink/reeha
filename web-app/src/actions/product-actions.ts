"use server";

import { db, TABLE_NAME } from "@/lib/db";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { checkAdmin } from "@/lib/auth";

export async function createProduct(formData: FormData) {
    await checkAdmin();
    
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const instaUrl = formData.get("instaUrl") as string;
    const fbUrl = formData.get("fbUrl") as string;
    const status = (formData.get("status") as string) || "Available";

    if (!name || !price || !imageUrl) {
        throw new Error("Missing required fields");
    }

    const product = {
        id: randomUUID(),
        name,
        price,
        description,
        imageUrl,
        instaUrl,
        fbUrl,
        status,
        createdAt: new Date().toISOString(),
    };

    await db.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: product,
        })
    );

    revalidatePath("/shop");
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function updateProductStatus(id: string, newStatus: string) {
    await checkAdmin();
    if (!id || !newStatus) throw new Error("Missing parameters");

    await db.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "set #s = :s",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: { ":s": newStatus }
        })
    );

    revalidatePath("/shop");
    revalidatePath("/admin/products");
}
