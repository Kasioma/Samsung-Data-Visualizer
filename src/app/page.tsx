"use client";
import { ChangeEvent, useState } from "react";
import Chart from "./_components/chart";
import FileUpload from "./_components/fileUpload";
import BarChart from "./_components/barChart";
import LineChart from "./_components/lineChart";
import AreaChart from "./_components/areaChart";
import PieChart from "./_components/pieChart";

type Stick = {
  t: Date;
  o: number;
  h: number;
  l: number;
  c: number;
}[];

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

const sticksDefault: Stick = [
  { t: new Date("2024-08-18T09:10:00Z"), o: 820, h: 850, l: 800, c: 830 },

  { t: new Date("2024-08-18T09:30:00Z"), o: 830, h: 840, l: 790, c: 810 },

  { t: new Date("2024-08-18T09:50:00Z"), o: 810, h: 820, l: 800, c: 810 },

  { t: new Date("2024-08-18T10:10:00Z"), o: 810, h: 830, l: 805, c: 825 },

  { t: new Date("2024-08-18T10:30:00Z"), o: 825, h: 830, l: 790, c: 800 },
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
  optionalActivity = 0,
): Promise<Datasets> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("File", 1);
    const result: Datasets = [];
    console.log(inputLabel);
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
              if (optionalActivity === 0) {
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
              } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (record.id_activity === optionalActivity) {
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

async function otherFetchData(
  inputStudent: number,
  inputDatasets: string,
  inputTime: number[],
): Promise<Stick> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("File", 1);
    const result: Stick = [];
    const studentDataObjects: StudentsTimes = createStudentDataObjects(
      [`${inputStudent}`],
      inputTime,
    );

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("data", "readonly");
      const objectStore = transaction.objectStore("data");
      const dataRequest = objectStore.getAll();

      dataRequest.onsuccess = () => {
        const allRecords = dataRequest.result;
        const filteredRecords = allRecords.filter(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (record) => record.id_student === inputStudent,
        );
        filteredRecords.forEach((record) => {
          if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            record[inputDatasets] !== null &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            record[inputDatasets] != 0
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const key = record.timestamp;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (studentDataObjects[0]!.data[key]) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
              studentDataObjects[0]!.data[key]?.push(record[inputDatasets]);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              studentDataObjects[0]!.data[key] = [record[inputDatasets]];
            }
          }
        });
        for (const [timestamp, values] of Object.entries(
          studentDataObjects[0]!.data,
        )) {
          if (values.length > 0) {
            const time = new Date(Number(timestamp));

            const o = values[0]!;
            const h = Math.max(...values);
            const l = Math.min(...values);
            const c = values[values.length - 1]!;
            result.push({
              t: time,
              o: o,
              h: h,
              l: l,
              c: c,
            });
          }
        }
        resolve(result);
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
  const emptyCandle: Stick = [];

  const [selectedFile, setSelectedFile] = useState("default");

  const [selectedChart, setSelectedChart] = useState("bar");

  const [abscissaSet, setAbscissaSet] = useState<Label[]>(abscissaDefault);

  const [abscissa, setAbscissa] = useState<Label>(
    abscissaDefault[0] ?? { label: "Students", data: ["1", "2", "3"] },
  );

  const [selectedActivity, setSelectedActivity] = useState("");

  const [selectedValue, setSelectedValue] = useState("");

  const [ordinate, setOrdinate] = useState<Datasets>(empty);

  const [sticks, setSticks] = useState<Stick>(sticksDefault);

  const [defaultOrdinate, setDefaultOrdinate] = useState<string>("");

  const [invalidData, setInvalidData] = useState<number>(0);

  const [parsedTime, setParsedTime] = useState<number[]>([]);

  const handleChartType = (chartType: string) => {
    if (chartType === "candlestick") {
      setAbscissa({ label: "timestamp", data: [] });
      setSticks(emptyCandle);
      setSelectedChart(chartType);
      setDefaultOrdinate("");
      setOrdinate(empty);
      setSelectedValue("");
      setProperties({
        type: chartType,
        structure: {
          labels: { label: "timestamp", data: [] },
          datasets: empty,
          sticks: emptyCandle,
        },
      });
    } else {
      if (selectedChart === "candlestick") {
        setAbscissa(abscissaDefault[0] ?? { label: "Students", data: [] });
        setDefaultOrdinate("");
        setOrdinate(empty);
        setSelectedChart(chartType);
        setProperties({
          type: chartType,
          structure: {
            labels: abscissaDefault[0] ?? {
              label: "Students",
              data: [],
            },
            datasets: empty,
            sticks: sticks,
          },
        });
      } else {
        setSelectedChart(chartType);
        setProperties({
          type: chartType,
          structure: {
            labels: abscissa,
            datasets: ordinate,
            sticks: sticks,
          },
        });
      }
    }
  };

  const selectedActivityPool = abscissaDefault.find(
    (option) => option.label === "id_activity",
  );

  const selectedAbscissa = abscissaDefault.find(
    (option) => option.label === "id_student",
  );

  const activityOptions = selectedActivityPool ? selectedActivityPool.data : [];

  const dataOptions = selectedAbscissa ? selectedAbscissa.data : [];

  const handleDropdownChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    if (ordinate !== empty) {
      setSelectedValue(event.target.value);
      const newProperties: Stick = await otherFetchData(
        parseInt(event.target.value),
        defaultOrdinate,
        parsedTime,
      );
      setProperties((prevProperties) => ({
        ...prevProperties,
        type: selectedChart,
        structure: {
          labels: abscissa,
          datasets: empty,
          sticks: newProperties,
        },
      }));
    } else {
      setSelectedValue(event.target.value);
    }
  };

  const handleDropdownChangeActivity = async (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    if (ordinate !== empty) {
      setSelectedActivity(event.target.value);
      const input: Label = { label: "id_activity", data: [event.target.value] };
      const newProperties: Datasets = await fetchData(
        input,
        defaultOrdinate,
        parsedTime,
        parseInt(event.target.value),
      );
      setOrdinate(newProperties);
      setProperties((prevProperties) => ({
        ...prevProperties,
        type: selectedChart,
        structure: {
          labels: abscissa,
          datasets: newProperties,
          sticks: emptyCandle,
        },
      }));
    } else {
      setSelectedActivity(event.target.value);
    }
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
      sticks: sticksDefault,
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
            sticks: sticks,
          },
        }));
      } else {
        if (selectedChart !== "candlestick") {
          const newProperties: Datasets = await fetchData(
            selectedLabel,
            defaultOrdinate,
            parsedTime,
          );
          setSelectedActivity("");
          setAbscissa(selectedLabel);
          setOrdinate(newProperties);
          setProperties((prevProperties) => ({
            ...prevProperties,
            type: selectedChart,
            structure: {
              labels: selectedLabel,
              datasets: defaultOrdinate === "" ? empty : newProperties,
              sticks: sticks,
            },
          }));
        } else {
          setAbscissa(selectedLabel);
          setProperties((prevProperties) => ({
            ...prevProperties,
            type: selectedChart,
            structure: {
              labels: selectedLabel,
              datasets: empty,
              sticks: emptyCandle,
            },
          }));
        }
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
            sticks: sticks,
          },
        }));
      }
      setDefaultOrdinate(input);
    } else {
      if (selectedChart !== "candlestick") {
        let temp = 0;
        if (selectedActivity) temp = parseInt(selectedActivity);
        const newProperties: Datasets = await fetchData(
          abscissa,
          input,
          parsedTime,
          temp,
        );
        setOrdinate(newProperties);
        setProperties((prevProperties) => ({
          ...prevProperties,
          type: selectedChart,
          structure: {
            labels: abscissa,
            datasets: newProperties,
            sticks: sticks,
          },
        }));
        setDefaultOrdinate(input);
      } else {
        const newProperties: Stick = await otherFetchData(
          parseInt(selectedValue),
          input,
          parsedTime,
        );
        setProperties((prevProperties) => ({
          ...prevProperties,
          type: selectedChart,
          structure: {
            labels: abscissa,
            datasets: empty,
            sticks: newProperties,
          },
        }));
        setDefaultOrdinate(input);
      }
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
    setSelectedChart("bar");
    setParsedTime(timestampReceived);
    setAbscissaSet(abscissaDefault);
    setSticks(emptyCandle);
    setAbscissa(abscissaDefault[0] ?? { label: "Student", data: id_student });
    setOrdinate(empty);
    setDefaultOrdinate("");
    setProperties({
      type: "bar",
      structure: {
        labels: abscissaDefault[0] ?? { label: "Student", data: id_student },
        datasets: empty,
        sticks: sticks,
      },
    });
  };

  console.log(properties);
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
                  onClick={async () => handleChartType("bar")}
                >
                  <BarChart />
                  <span>Bar Chart</span>
                </li>
                <li
                  className={`chart-type ${selectedChart === "area" ? "selected-chart" : ""}`}
                  onClick={async () => handleChartType("area")}
                >
                  <AreaChart />
                  <span>Area Chart</span>
                </li>
                <li
                  className={`chart-type ${selectedChart === "line" ? "selected-chart" : ""}`}
                  onClick={async () => handleChartType("line")}
                >
                  <LineChart />
                  <span>Line Chart</span>
                </li>
                <li
                  className={`chart-type ${selectedChart === "pie" ? "selected-chart" : ""}`}
                  onClick={async () => handleChartType("pie")}
                >
                  <PieChart />
                  <span>Pie Chart</span>
                </li>
                <li
                  className={`chart-type ${selectedChart === "candlestick" ? "selected-chart" : ""}`}
                  onClick={async () => handleChartType("candlestick")}
                >
                  <BarChart />
                  <span>Candlestick</span>
                </li>
              </ul>
            </section>
          ) : (
            <section className="p-3">
              <section>
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
                <ul
                  className={`mx-auto grid grid-cols-2 overflow-y-scroll p-3 ${selectedChart === "candlestick" ? "candlestick--class" : ""}`}
                >
                  {abscissaSet.map((tag) => (
                    <li key={tag.label} className="flex items-center gap-3">
                      <input
                        id={tag.label}
                        type="radio"
                        onChange={() => handleLabelChange(tag.label)}
                        checked={abscissa.label === tag.label}
                      />
                      <label htmlFor={tag.label}>
                        {maskedLabel(tag.label)}
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            </section>
          )}
          {selectedPage !== "charts" &&
          selectedChart === "candlestick" &&
          selectedFile !== "default" ? (
            <section className="p-3">
              <label htmlFor="abscissaDropdown">Select an option:</label>
              <select
                id="abscissaDropdown"
                value={selectedValue}
                onChange={handleDropdownChange}
                className="rounded border border-gray-300 bg-white p-2 text-black"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {dataOptions.map((dataItem, index) => (
                  <option key={index} value={dataItem}>
                    {dataItem}
                  </option>
                ))}
              </select>
              <div>
                <p>Selected Value: {selectedValue}</p>
              </div>
            </section>
          ) : (
            ""
          )}
          {selectedPage !== "charts" &&
          selectedChart !== "candlestick" &&
          selectedFile !== "default" &&
          abscissa.label === "timestamp" ? (
            <section className="p-3">
              <label htmlFor="abscissaDropdown">Select an activity:</label>
              <select
                id="abscissaDropdown"
                value={selectedActivity}
                onChange={handleDropdownChangeActivity}
                className="rounded border border-gray-300 bg-white p-2 text-black"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {activityOptions.map((dataItem, index) => (
                  <option key={index} value={dataItem}>
                    {dataItem}
                  </option>
                ))}
              </select>
              <div>
                <p>Selected Value: {selectedActivity}</p>
              </div>
            </section>
          ) : (
            ""
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
