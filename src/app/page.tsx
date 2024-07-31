"use client";
import { useState } from "react";
import Chart from "./_components/chart";
import FileUpload from "./_components/fileUpload";
import BarChart from "./_components/barChart";
import LineChart from "./_components/lineChart";
import AreaChart from "./_components/areaChart";
import PieChart from "./_components/pieChart";

function getData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("File", 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("data", "readonly");
      const objectStore = transaction.objectStore("data");
      const dataRequest = objectStore.getAll();

      dataRequest.onsuccess = () => {
        const allRecords = dataRequest.result;
        const heartRateValues = allRecords.map(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          (record) => record.status_heart_rate,
        );
        resolve(heartRateValues);
      };
      dataRequest.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    };
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export default function HomePage() {
  const [heartRateData, setHeartRateData] = useState([]);

  // const handleButtonClick = async () => {
  //   try {
  //     const heartRateValues = await getData();
  //     console.log(heartRateValues);
  //   } catch (error) {
  //     console.error("Error fetching heart rate data:", error);
  //   }
  // };
  const [properties, setProperties] = useState({
    type: "bar",
    structure: {
      labels: ["January", "February", "March", "April"],
      datasets: [
        {
          label: "Dataset 1",
          data: [65, 59, 80, 81],
        },
      ],
    },
  });

  const [selectedChart, setSelectedChart] = useState("");

  const handleChartType = (chartType: string) => {
    setSelectedChart(chartType);
  };

  const handleButtonClick = () => {
    setProperties((prev) => ({
      ...prev,
      type: prev.type === "bar" ? "line" : "bar",
    }));
  };

  return (
    <div className="roboto-regular h-screen w-full bg-background-800">
      <aside className="h-screen w-1/4 bg-background-700 p-3 text-text-100">
        <h1 className="text-2xl">Data Visualizer</h1>
        <div className="my-1 h-[0.13rem] rounded-full bg-secondary-50"></div>
        <section className="p-3">
          <h2 className="text-xl">Chat Types</h2>
          <ul>
            <li
              className={`chart-type ${selectedChart === "bar" ? "selected" : ""}`}
              onClick={() => handleChartType("bar")}
            >
              <BarChart />
              <span>Bar Chart</span>
            </li>
            <li
              className={`chart-type ${selectedChart === "area" ? "selected" : ""}`}
              onClick={() => handleChartType("area")}
            >
              <AreaChart />
              <span>Area Chart</span>
            </li>
            <li
              className={`chart-type ${selectedChart === "line" ? "selected" : ""}`}
              onClick={() => handleChartType("line")}
            >
              <LineChart />
              <span>Line Chart</span>
            </li>
            <li
              className={`chart-type ${selectedChart === "pie" ? "selected" : ""}`}
              onClick={() => handleChartType("pie")}
            >
              <PieChart />
              <span>Pie Chart</span>
            </li>
          </ul>
        </section>
        <section className="p-3">
          <h2 className="text-xl">Tags</h2>
          
        </section>
      </aside>
      {/* <Chart {...properties} />
      <FileUpload /> */}
    </div>
  );
}
