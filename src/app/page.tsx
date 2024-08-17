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

type GeneralDatasets = {
  label: string;
  datasets: Datasets;
}[];

const defaultDatasets: GeneralDatasets = [
  {
    label: "value_heart_rate",
    datasets: [
      {
        label: "Student 1",
        data: [70, 75, 72, 80, 78, 76],
      },
      {
        label: "Student 3",
        data: [70, 75, 72, 80, 78, 76],
      },
      {
        label: "Student 2",
        data: [70, 75, 72, 80, 78, 76],
      },
    ],
  },
  {
    label: "value_ibi_0",
    datasets: [
      {
        label: "Student 1",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 2",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 3",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
    ],
  },
  {
    label: "value_ibi_1",
    datasets: [
      {
        label: "Student 1",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 2",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 3",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
    ],
  },
  {
    label: "value_ibi_2",
    datasets: [
      {
        label: "Student 1",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 2",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 3",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
    ],
  },
  {
    label: "value_ibi_3",
    datasets: [
      {
        label: "Student 1",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 2",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 3",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
    ],
  },
  {
    label: "value_ibi_4",
    datasets: [
      {
        label: "Student 1",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 2",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
      {
        label: "Student 3",
        data: [0.85, 0.9, 0.88, 0.87, 0.86, 0.89],
      },
    ],
  },
];

type StudentsTimes = {
  student: string;
  data: Record<number, number[]>;
}[];

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

const createStudentDataObjects = (students: string[], inputTime: number[]) => {
  return students.map((student) => {
    const data = inputTime.reduce(
      (acc, time) => {
        acc[time] = [];
        return acc;
      },
      {} as Record<number, number[]>,
    );

    return {
      student,
      data,
    };
  });
};

async function fetchData(
  inputLabel: Label,
  inputDatasets: string,
  inputTime: number[],
): Promise<Datasets> {
  return new Promise((resolve, reject) => {
    console.log(inputLabel, inputDatasets);
    const request = indexedDB.open("File", 1);
    const result: Datasets = [];
    let inputData: number[] = inputTime;
    if (inputLabel.label !== "timestamp" && inputLabel.label !== "Validity") {
      const matchingLabel = abscissaDefault.find(
        (labelObj) => labelObj.label === inputLabel.label,
      );

      if (matchingLabel && Array.isArray(matchingLabel.data)) {
        inputData = matchingLabel.data
          .map((item) => {
            const number = Number(item);

            if (!isNaN(number)) {
              return number;
            } else {
              const match = item.match(/\d+/);
              return match ? Number(match[0]) : 0;
            }
          })
          .filter((number) => number !== null);
      }
    }
    let studentDataObjects: StudentsTimes;
    if (inputLabel.label === "Validity")
      result.push({
        label: "Validity",
        data: [0, 0],
      });
    else {
      const students = abscissaDefault
        .filter((labels) => labels.label === "id_student")
        .flatMap((item) => item.data.map((value) => value));
      students.map((item) =>
        result.push({
          label: "Student " + item,
          data: [],
        }),
      );

      studentDataObjects = createStudentDataObjects(students, inputData);
    }
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("data", "readonly");
      const objectStore = transaction.objectStore("data");
      const dataRequest = objectStore.getAll();

      dataRequest.onsuccess = () => {
        const allRecords = dataRequest.result;
        if (inputLabel.label !== "Validity") {
          allRecords.forEach((record) => {
            const currentObject = studentDataObjects.find(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              (obj) => parseInt(obj.student) === record.id_student,
            );

            if (
              currentObject &&
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              record[inputDatasets] !== null &&
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              record[inputDatasets] != 0
            ) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              const key = record[inputLabel.label];
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (currentObject.data[key]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
                currentObject.data[key]?.push(record[inputDatasets]);
              } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                currentObject.data[key] = [record[inputDatasets]];
              }
            }
          });
          studentDataObjects.forEach((item) => {
            const studentKey = "Student " + item.student;

            const studentResult = result.find(
              (res) => res.label === studentKey,
            );

            if (studentResult) {
              Object.entries(item.data).forEach(([timestamp, values]) => {
                if (values.length === 0) {
                  studentResult.data.push(0);
                } else {
                  const sum = values.reduce((acc, value) => acc + value, 0);
                  const average = sum / values.length;
                  studentResult.data.push(average);
                }
              });
            }
          });
          resolve(result);
        } else {
          allRecords.forEach((record) => {
            const studentResult = result.find(
              (res) => res.label === "Validity",
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (record[inputDatasets] !== null) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (record[inputDatasets] !== 0) studentResult!.data[0]++;
              else studentResult!.data[1]++;
            }
          });
          resolve(result);
        }
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

  const [defaultOrdinate, setDefaultOrdinate] = useState<string>("");

  const [invalidData, setInvalidData] = useState<number>(0);

  const [parsedTime, setParsedTime] = useState<number[]>([]);

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

  const handleLabelChange = async (input: string) => {
    const selectedLabel = abscissaSet.find((label) => label.label === input);
    if (selectedLabel) {
      if (selectedFile === "default") {
        setAbscissa(selectedLabel);
        setProperties((prevProperties) => ({
          ...prevProperties,
          type: selectedChart,
          structure: {
            labels: selectedLabel,
            datasets: ordinate,
          },
        }));
      } else {
        const newProperties: Datasets = await fetchData(
          selectedLabel,
          defaultOrdinate,
          parsedTime,
        );
        setAbscissa(selectedLabel);
        setOrdinate(newProperties);
        setProperties((prevProperties) => ({
          ...prevProperties,
          type: selectedChart,
          structure: {
            labels: selectedLabel,
            datasets: newProperties,
          },
        }));
      }
    }
  };

  const handleDatasetChange = async (input: string) => {
    if (selectedFile === "default") {
      const selectedDataset = defaultDatasets.find(
        (set) => set.label === input,
      );
      if (selectedDataset) {
        setOrdinate(selectedDataset.datasets);
        setProperties((prevProperties) => ({
          ...prevProperties,
          type: selectedChart,
          structure: {
            labels: abscissa,
            datasets: selectedDataset.datasets,
          },
        }));
      }
      setDefaultOrdinate(input);
    } else {
      const newProperties: Datasets = await fetchData(
        abscissa,
        input,
        parsedTime,
      );
      setOrdinate(newProperties);
      setProperties((prevProperties) => ({
        ...prevProperties,
        type: selectedChart,
        structure: {
          labels: abscissa,
          datasets: newProperties,
        },
      }));
      setDefaultOrdinate(input);
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

    const timestampReceived: number[] = [];
    timestamp.forEach((item) => {
      const keys = Object.keys(item).map(Number);
      timestampReceived.push(...keys);
    });
    setParsedTime(timestampReceived);
    setAbscissaSet(abscissaDefault);
    setAbscissa(abscissaDefault[0] ?? { label: "Student", data: id_student });
    setOrdinate(empty);
    setDefaultOrdinate("");
    setProperties({
      type: "bar",
      structure: {
        labels: abscissaDefault[0] ?? { label: "Student", data: id_student },
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
                      type="radio"
                      onChange={() => handleDatasetChange(tag.label)}
                      checked={defaultOrdinate === tag.label}
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
    </div>
  );
}
