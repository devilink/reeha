"use server";

import { s3, BUCKET_NAME } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

export async function getPresignedUrl(fileType: string) {
    const fileId = randomUUID();
    const extension = fileType.split("/")[1] || "jpeg";
    const fileName = `products/${fileId}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return { signedUrl, fileName: `https://${BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileName}` };
}
