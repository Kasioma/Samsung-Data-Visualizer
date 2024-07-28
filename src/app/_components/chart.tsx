"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, type ChartProps } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  return <Bar data={structure} />;
}
