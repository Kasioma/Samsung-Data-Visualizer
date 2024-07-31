"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

type Data = {
  labels: string[];
  datasets: { label: string; data: number[] }[];
};

type Props = {
  type: string;
  structure: Data;
};

export default function Chart({ type, structure }: Props) {
  switch (type) {
    case "bar":
      return <Bar data={structure} />;
    case "line":
      return <Line data={structure} />;
    case "scatter":
      return <Scatter data={structure} />;
    default:
      return <p>Unsupported chart type</p>;
  }
}
