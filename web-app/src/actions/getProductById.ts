import { db, TABLE_NAME } from "@/lib/db";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from "@/types";

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id },
        });

        const response = await db.send(command);
        return (response.Item as Product) || null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
