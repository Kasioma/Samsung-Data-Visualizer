type ResponseType = {
  data: (Record<string, number | null> | null)[];
  invalidData: number;
  id_student: string[];
  id_activity: string[];
  id_session: string[];
  timestamp: Record<number, string>[];
};

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

    const headers = rows[0] ?? [];
    const dataRows = rows.slice(1);

    // HEART_RATE_VALID = 10
    // HEART_RATE_IBI_VALID = 11
    // HEART_RATE_IBI_INVALID = 110
    // HEART_RATE_WEARABLE_DETACHED = 111
    // HEART_RATE_INITIALIZING = 112
    // HEART_RATE_SIGNAL_WEAK = 113
    let minTemp = Infinity,
      maxTemp = -Infinity;
    const students: string[] = [],
      sessions: string[] = [],
      activities: string[] = [];
    const objects: (Record<string, number | null> | null)[] = dataRows
      .map((row) => {
        const obj: Record<string, number | null> = {};
        let hasValidValue = false;
        headers?.forEach((header, index) => {
          if (row[index] !== undefined) {
            const value = row[index] ?? "";
            const parsedValue = parseInt(value);
            if (value != "NULL" && !isNaN(parsedValue)) {
              obj[header] = parsedValue;
              hasValidValue = true;
              if (header === "timestamp") {
                if (parsedValue > maxTemp) maxTemp = parsedValue;
                if (parsedValue < minTemp) minTemp = parsedValue;
              }
              if (header === "id_student" && !students.includes(value))
                students.push(value);
              if (header === "id_activity" && !activities.includes(value))
                activities.push(value);
              if (header === "id_session" && !sessions.includes(value))
                sessions.push(value);
            }
          } else obj[header] = null;
        });
        return hasValidValue ? obj : null;
      })
      .filter((obj) => obj !== null);
    objects.sort((a, b) => (a!.timestamp ?? 0) - (b!.timestamp ?? 0));
    students.sort((a, b) => parseInt(a) - parseInt(b));
    sessions.sort((a, b) => parseInt(a) - parseInt(b));
    activities.sort((a, b) => parseInt(a) - parseInt(b));
    const intervals = generateIntervals(minTemp, maxTemp);
    const intervalValues: number[] = intervals.map((item) => {
      const firstKey = Object.keys(item)[0];

      return firstKey ? parseInt(firstKey, 10) : NaN;
    });
    let j = 0;
    for (let i = 0; i < intervalValues.length; ) {
      const currentValue = intervalValues[i]!;

      while (j < objects.length) {
        const obj = objects[j];
        if (
          obj &&
          "timestamp" in obj &&
          obj.timestamp !== null &&
          obj.timestamp <= currentValue
        ) {
          objects[j]!.timestamp = currentValue;
          j++;
        } else {
          i++;
          break;
        }
      }
    }

    const invalidData = objects.filter(
      (obj) => obj!.value_heart_rate === 0,
    ).length;

    const resp: ResponseType = {
      data: objects,
      invalidData: invalidData,
      id_student: students,
      id_activity: activities,
      id_session: sessions,
      timestamp: intervals,
    };
    return new Response(JSON.stringify(resp), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function generateIntervals(
  minTemp: number,
  maxTemp: number,
): Record<number, string>[] {
  const millisecondsInTenMinutes = 20 * 60 * 1000;
  const intervals: Record<number, string>[] = [];

  for (
    let intervalStart = minTemp;
    intervalStart <= maxTemp;
    intervalStart += millisecondsInTenMinutes
  ) {
    const intervalStartDate = new Date(intervalStart);

    const formattedTime = intervalStartDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    intervals.push({ [intervalStart]: formattedTime });
  }

  return intervals;
}
