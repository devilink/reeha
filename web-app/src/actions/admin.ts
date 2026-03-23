"use server";

import { currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";

function getAwsClients() {
    const region = process.env.AWS_REGION || "eu-north-1";
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
    const tableName = process.env.AWS_TABLE_NAME || "Products";
    const bucketName = process.env.AWS_BUCKET_NAME || "label-reeha-shop-images";

    if (!accessKeyId || !secretAccessKey) {
        throw new Error("Missing AWS Credentials! Please set them in .env.local");
    }

    const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
    const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region, credentials: { accessKeyId, secretAccessKey } }));

    return { s3, db, region, tableName, bucketName };
}

export async function addProduct(formData: FormData) {
    await checkAdmin();

    const file = formData.get("image") as File;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const instaUrl = formData.get("instaUrl") as string;
    const fbUrl = formData.get("fbUrl") as string;
    const status = formData.get("status") as string || "Available";
    
    if (!file || !name || !price) {
        throw new Error("Missing required fields");
    }

    const { s3, db, region, tableName, bucketName } = getAwsClients();

    const productId = `prod_${Date.now()}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `products/${productId}.${fileExtension}`;

    // Upload to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
    }));

    const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    // Save to DynamoDB
    await db.send(new PutCommand({
        TableName: tableName,
        Item: {
            id: productId,
            name,
            price,
            imageUrl,
            instaUrl,
            fbUrl,
            status,
            createdAt: new Date().toISOString()
        }
    }));

    revalidatePath("/shop");
    revalidatePath("/admin");
    return { success: true };
}

export async function updateProduct(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const instaUrl = formData.get("instaUrl") as string;
    const fbUrl = formData.get("fbUrl") as string;
    const status = formData.get("status") as string || "Available";
    let imageUrl = formData.get("currentImageUrl") as string;
    const file = formData.get("image") as File | null;

    if (!id || !name || !price) {
        throw new Error("Missing required fields");
    }

    const { s3, db, region, tableName, bucketName } = getAwsClients();

    // Optional new image upload
    if (file && file.size > 0) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `products/${id}_update_${Date.now()}.${fileExtension}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        }));
        imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    }

    // Save to DynamoDB (Put replaces the whole item, which is fine here since we have all fields)
    await db.send(new PutCommand({
        TableName: tableName,
        Item: {
            id,
            name,
            price,
            imageUrl,
            instaUrl,
            fbUrl,
            status,
            createdAt: formData.get("createdAt") as string || new Date().toISOString()
        }
    }));

    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteProduct(formData: FormData) {
    await checkAdmin();
    
    const id = formData.get("id") as string;
    const { db, tableName } = getAwsClients();

    await db.send(new DeleteCommand({
        TableName: tableName,
        Key: { id }
    }));

    revalidatePath("/shop");
    revalidatePath("/admin");
    return { success: true };
}
