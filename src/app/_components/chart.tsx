"use client";

import React, { useEffect, useState } from "react";
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
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import { Bar, Line, Pie, Chart as BasicChart } from "react-chartjs-2";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";

import "chartjs-adapter-date-fns";

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
  TimeScale,
  TimeSeriesScale,
  CandlestickController,
  CandlestickElement,
);

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

type Structure = {
  labels: Label;
  datasets: Datasets;
  sticks: Stick;
};

type Props = {
  type: string;
  structure: Structure;
};

const colorPairs: string[] = [
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 0.2);rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 0.2);rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 0.2);rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 0.2);rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 0.2);rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 0.2);rgba(255, 206, 86, 1)",
];

export default function Chart({ type, structure }: Props) {
  const [chartWidth, setChartWidth] = useState<number>(1100);

  const labelWidth = 50;

  useEffect(() => {
    let newWidth = structure.labels.data.length * labelWidth;
    if (newWidth > 7000) newWidth = 7000;
    if (type === "candlestick") {
      newWidth = structure.sticks.length * labelWidth;
      if (newWidth < 1100) newWidth = 1100;
      setChartWidth(newWidth);
    } else if (structure.labels.data.length < 10 || newWidth < 1100)
      setChartWidth(1100);
    else setChartWidth(newWidth);
  }, [structure.labels.data.length, type, structure.sticks.length]);

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
        text: "Chart",
        color: "#d6f5e6",
      },
    },
    maintainAspectRatio: false,
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

  const commonOptionsCandle = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#d6f5e6",
        },
      },
      title: {
        display: true,
        text: "Chart",
        color: "#d6f5e6",
      },
    },
    barPercentage: 0.1,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#d6f5e6",
          autoSkip: false,
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
      datasets: structure.datasets.map((dataset, index) => {
        const colorPair = colorPairs[index % colorPairs.length];
        const [backgroundColor, borderColor] = colorPair?.split(";") as [
          string,
          string,
        ];
        return {
          ...dataset,
          backgroundColor,
          borderColor,
        };
      }),
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
              })),
            }}
            options={commonOptions}
          />
        );
      case "pie":
        return <Pie data={input} options={commonOptions} />;
      case "candlestick":
        const candlestickInput = {
          datasets: [
            {
              label: "Candlestick Dataset",
              data: structure.sticks.map((d) => ({
                x: d.t,
                o: d.o,
                h: d.h,
                l: d.l,
                c: d.c,
              })),
              color: {
                up: "rgba(0, 255, 0, 1)",
                down: "rgba(255, 0, 0, 1)",
                unchanged: "rgba(128, 128, 128, 1)",
              },
            },
          ],
        };
        return (
          <BasicChart
            type="candlestick"
            data={candlestickInput}
            options={commonOptionsCandle}
          />
        );
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <div className="chart-container">
      <div
        key={type === "candlestick" ? `candlestick-${Date.now()}` : type}
        className="flex h-[600px] items-center justify-center p-2"
        style={{ width: chartWidth }}
      >
        {getChartComponent()}
      </div>
    </div>
  );
}
