import { db, TABLE_NAME } from "@/lib/db";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
        });

        const response = await db.send(command);
        const items = (response.Items || []) as Product[];

        // Sort by Name Descending (Numeric awareness for "Label Reeha 1" vs "10")
        items.sort((a, b) => {
            return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
        });

        return items;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
