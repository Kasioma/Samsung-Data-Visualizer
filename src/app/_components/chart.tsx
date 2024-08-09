"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type Datasets = {
  label: string;
  data: number[];
}[];

type Label = {
  label: string;
  data: string[];
};

type Structure = {
  labels: Label;
  datasets: Datasets;
};

type Props = {
  type: string;
  structure: Structure;
};

export default function Chart({ type, structure }: Props) {
  const commonOptions = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#d6f5e6",
        },
      },
      title: {
        display: true,
        text: "Mock-up Chart",
        color: "#d6f5e6",
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#d6f5e6",
        },
        border: {
          display: true,
          color: "#d6f5e6",
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#d6f5e6",
        },
        border: {
          display: true,
          color: "#d6f5e6",
        },
      },
    },
  };
  const getChartComponent = () => {
    const input = {
      labels: structure.labels.data,
      datasets: structure.datasets.map((dataset) => ({
        ...dataset,
      })),
    };
    switch (type) {
      case "bar":
        return <Bar data={input} options={commonOptions} />;
      case "line":
        return <Line data={input} options={commonOptions} />;
      case "area":
        return (
          <Line
            data={{
              ...input,
              datasets: input.datasets.map((dataset) => ({
                ...dataset,
                fill: true,
                tension: 0.1,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
              })),
            }}
            options={commonOptions}
          />
        );
      case "pie":
        return <Pie data={input} options={commonOptions} />;
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div
      key={type}
      className="flex h-[100%] w-full items-center justify-center p-2"
    >
      {getChartComponent()}
    </div>
  );
}
