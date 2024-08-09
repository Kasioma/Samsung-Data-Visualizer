"use client";
import { useState } from "react";
import Chart from "./_components/chart";
import FileUpload from "./_components/fileUpload";
import BarChart from "./_components/barChart";
import LineChart from "./_components/lineChart";
import AreaChart from "./_components/areaChart";
import PieChart from "./_components/pieChart";

type Datasets = {
  label: string;
  data: number[];
}[];

type Label = {
  label: string;
  data: string[];
};

const defaultDatasets: Datasets = [
  {
    label: "value_heart_rate",
    data: [70, 75, 72, 80, 78, 76],
  },
  {
    label: "value_ibi_0",
    data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
  },
  {
    label: "value_ibi_1",
    data: [0.82, 0.88, 0.85, 0.86, 0.87, 0.83],
  },
  {
    label: "value_ibi_2",
    data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
  },
  {
    label: "value_ibi_3",
    data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
  },
  {
    label: "value_ibi_4",
    data: [0.82, 0.88, 0.85, 0.86, 0.87, 0.83],
  },
];

function maskedLabel(input: string) {
  switch (input) {
    case "id_student":
      return "Students";
    case "id_activity":
      return "Activity";
    case "id_session":
      return "Session";
    case "timestamp":
      return "Time";
    default:
      return input;
  }
}

const abscissaDefault: Label[] = [
  { label: "id_student", data: ["Student 1", "Student 2", "Student 3"] },
  { label: "id_activity", data: ["1", "2", "3"] },
  { label: "id_session", data: ["1", "2", "3"] },
  { label: "timestamp", data: ["1", "2", "3", "4", "5", "6"] },
  { label: "Validity", data: ["Valid", "Invalid"] },
];

function fetchData(
  inputLabel: Label,
  inputDatasets: Datasets,
  inputModifier: string,
) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("File", 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("data", "readonly");
      const objectStore = transaction.objectStore("data");
      const dataRequest = objectStore.getAll();

      dataRequest.onsuccess = () => {
        const allRecords = dataRequest.result;
        const labels = allRecords.map(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          (record) => record[inputLabel.label],
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        resolve(labels);
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
  const empty: Datasets = [];

  const [selectedFile, setSelectedFile] = useState("default");

  const [selectedChart, setSelectedChart] = useState("bar");

  const [abscissaSet, setAbscissaSet] = useState<Label[]>(abscissaDefault);

  const [abscissa, setAbscissa] = useState<Label>(
    abscissaDefault[0] ?? { label: "Students", data: ["1", "2", "3"] },
  );

  const [ordinate, setOrdinate] = useState<Datasets>(empty);

  const [invalidData, setInvalidData] = useState<number>(0);

  const handleChartType = (chartType: string) => {
    setSelectedChart(chartType);
    setProperties({
      type: chartType,
      structure: {
        labels: abscissa,
        datasets: ordinate,
      },
    });
  };

  const [selectedPage, setSelectedPage] = useState("charts");

  const handlePageType = (pageType: string) => {
    setSelectedPage(pageType);
  };

  const [properties, setProperties] = useState({
    type: "bar",
    structure: {
      labels: abscissa,
      datasets: empty,
    },
  });

  const handleLabelChange = (input: string) => {
    const selectedLabel = abscissaSet.find((label) => label.label === input);
    if (selectedLabel) {
      setAbscissa(selectedLabel);
      setProperties((prevProperties) => ({
        ...prevProperties,
        type: selectedChart,
        structure: {
          labels: selectedLabel,
          datasets: ordinate,
        },
      }));
    }
  };

  const handleDatasetChange = (input: string) => {
    if (selectedFile === "default") {
      setOrdinate((prevOrdinate) => {
        const exists = prevOrdinate.find((set) => set.label === input);
        const updatedDatasets = exists
          ? prevOrdinate.filter((set) => set.label !== input)
          : [
              ...prevOrdinate,
              ...(defaultDatasets.find((set) => set.label === input)
                ? [defaultDatasets.find((set) => set.label === input)!]
                : []),
            ];

        setProperties((prevProperties) => ({
          ...prevProperties,
          type: selectedChart,
          structure: {
            labels: abscissa,
            datasets: updatedDatasets,
          },
        }));

        return updatedDatasets;
      });
    }
  };

  const handleFileChange = (
    fileName: string,
    invalidData: number,
    id_student: string[],
    id_activity: string[],
    id_session: string[],
    timestamp: Record<number, string>[],
  ) => {
    setSelectedFile(fileName);
    setInvalidData(invalidData);
    setOrdinate(empty);
    abscissaDefault.forEach((item) => {
      switch (item.label) {
        case "id_student":
          item.data = id_student;
          break;
        case "id_activity":
          item.data = id_activity;
          break;
        case "id_session":
          item.data = id_session;
          break;
        case "timestamp":
          item.data = timestamp
            .map((record) => Object.values(record)[0])
            .filter((value): value is string => value !== undefined);
          break;
      }
    });
    setAbscissaSet(abscissaDefault);
    setAbscissa(abscissaDefault[0] ?? { label: "Student", data: id_student });
    setProperties({
      type: "bar",
      structure: {
        labels: abscissa,
        datasets: empty,
      },
    });
  };

  return (
    <div className="roboto-regular flex h-screen w-full gap-6 bg-background-800">
      <aside className="flex h-screen w-1/4 flex-col justify-between bg-background-700 p-3 text-text-100">
        <div>
          <h1 className="text-2xl">Data Visualizer</h1>
          <div className="my-1 h-[0.13rem] rounded-full bg-secondary-50"></div>
          <div className="mt-5 flex justify-around">
            <h2
              className={`page-type ${selectedPage === "charts" ? "selected-page" : ""}`}
              onClick={() => handlePageType("charts")}
            >
              Charts
            </h2>
            <h2
              className={`page-type ${selectedPage === "tags" ? "selected-page" : ""}`}
              onClick={() => handlePageType("tags")}
            >
              Tags
            </h2>
          </div>
          {selectedPage === "charts" ? (
            <section className="p-3">
              <ul>
                <li
                  className={`chart-type ${selectedChart === "bar" ? "selected-chart" : ""}`}
                  onClick={() => handleChartType("bar")}
                >
                  <BarChart />
                  <span>Bar Chart</span>
                </li>
                <li
                  className={`chart-type ${selectedChart === "area" ? "selected-chart" : ""}`}
                  onClick={() => handleChartType("area")}
                >
                  <AreaChart />
                  <span>Area Chart</span>
                </li>
                <li
                  className={`chart-type ${selectedChart === "line" ? "selected-chart" : ""}`}
                  onClick={() => handleChartType("line")}
                >
                  <LineChart />
                  <span>Line Chart</span>
                </li>
                <li
                  className={`chart-type ${selectedChart === "pie" ? "selected-chart" : ""}`}
                  onClick={() => handleChartType("pie")}
                >
                  <PieChart />
                  <span>Pie Chart</span>
                </li>
              </ul>
            </section>
          ) : (
            <section className="p-3">
              <h2>Y - Axix</h2>
              <ul className="mx-auto grid grid-cols-2 overflow-y-scroll p-3">
                {defaultDatasets.map((tag) => (
                  <li key={tag.label} className="flex items-center gap-3">
                    <input
                      id={tag.label}
                      type="checkbox"
                      onChange={() => handleDatasetChange(tag.label)}
                      checked={ordinate.some(
                        (dataset) => dataset.label === tag.label,
                      )}
                    />
                    <label htmlFor={tag.label}>{tag.label}</label>
                  </li>
                ))}
              </ul>
              <h2>X - Axis</h2>
              <ul className="mx-auto grid grid-cols-2 overflow-y-scroll p-3">
                {abscissaSet.map((tag) => (
                  <li key={tag.label} className="flex items-center gap-3">
                    <input
                      id={tag.label}
                      type="radio"
                      onChange={() => handleLabelChange(tag.label)}
                      checked={abscissa.label === tag.label}
                    />
                    <label htmlFor={tag.label}>{maskedLabel(tag.label)}</label>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <FileUpload onFileUploadComplete={handleFileChange} />
      </aside>
      <section className="flex w-3/4 flex-col items-center justify-center gap-4">
        <Chart {...properties} />
      </section>
      <button
        onClick={() => fetchData({ label: "timestamp", data: [] }, empty, "")}
      >
        CLICK ME
      </button>
    </div>
  );
}
