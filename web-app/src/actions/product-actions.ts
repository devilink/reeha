"use server";

import { db, TABLE_NAME } from "@/lib/db";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const instaUrl = formData.get("instaUrl") as string;
    const fbUrl = formData.get("fbUrl") as string;

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
