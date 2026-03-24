"use client";
// Bar chart: Academic vs Sports vs Society; Line chart: GPA per semester

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface ScoreChartProps {
  academic: number;
  sports: number;
  society: number;
}

export function ScoreChart({ academic, sports, society }: ScoreChartProps) {
  const data = [
    { name: "Academic", value: academic, fill: "var(--primary)" },
    { name: "Sports", value: sports, fill: "#22c55e" },
    { name: "Society", value: society, fill: "#8b5cf6" },
  ];
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" name="Score" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GPALineChartProps {
  data: { semesterNo: number; gpa: number }[];
}

export function GPALineChart({ data }: GPALineChartProps) {
  const chartData = data.map((d) => ({ name: "Sem " + d.semesterNo, gpa: d.gpa }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 4]} />
          <Tooltip />
          <Line type="monotone" dataKey="gpa" name="GPA" stroke="var(--primary)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
