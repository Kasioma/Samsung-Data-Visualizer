export async function POST(request: Request): Promise<Response> {
  try {
    const blob = await request.blob();

    const csvText = await blob.text();

    const rows = csvText.split("\n").map((row) =>
      row
        .trim()
        .split(";")
        .map((cell) => cell.replace(/"/g, "")),
    );

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const objects: Record<string, number | null>[] = dataRows.map((row) => {
      const obj: Record<string, number | null> = {};
      headers?.forEach((header, index) => {
        if (row[index] != "NULL") obj[header] = parseInt(row[index] ?? "");
        else obj[header] = null;
      });
      return obj;
    });

    return new Response(JSON.stringify(objects), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
