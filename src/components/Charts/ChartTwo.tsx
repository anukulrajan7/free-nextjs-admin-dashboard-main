"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PropertyType {
  count: number;
  property_type: string; // Could be a union type if you have predefined property types
  percentage: number;
}

const options: ApexOptions = {
  chart: {
    type: "pie", // Change to 'pie' for a full pie chart
    background: "transparent",
  },
  colors: ["#3C50E0", "#80CAEE", "#FF9800", "#4CAF50", "#E91E63"], // Custom colors
  labels: [], // Will populate this dynamically
  legend: {
    position: "bottom",
    fontSize: "14px",
    fontWeight: 500,
    labels: {
      colors: "#64748B", // Tailwind slate-500
      useSeriesColors: false, // Keeps legend colors uniform (instead of matching pie segments)
    },
    markers: {
      width: 12,
      height: 12,
      strokeWidth: 0,
      strokeColor: "#fff",
      radius: 12,
    },
    itemMargin: {
      horizontal: 8,
      vertical: 8,
    },
    formatter: function (seriesName: string, opts?: any) {
      return seriesName.toUpperCase(); // Uppercase legend text
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "14px",
      fontFamily: "Satoshi, sans-serif",
      fontWeight: 500,

      colors: ["#00FF00"], // Light green labels
    },
    dropShadow: {
      enabled: false,
    },
  },
  plotOptions: {
    pie: {
      expandOnClick: true, // Optional: allows the pie segments to expand when clicked
    },
  },
  states: {
    hover: {
      filter: {
        type: "darken",
        value: 0.9,
      },
    },
  },
  stroke: {
    width: 2,
    colors: ["#fff"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "14px",
      fontFamily: "Satoshi, sans-serif",
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

interface ChartTwoProps {
  propertyTypes: PropertyType[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ propertyTypes }) => {
  const series = propertyTypes.map((pt) => pt.count);
  const labels = propertyTypes.map((pt) => pt.property_type);

  const updatedOptions = {
    ...options,
    labels,
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4
            className="text-gray-900 font-i font-italic text-center text-xl font-semibold dark:text-white
"
          >
            Property Type Distribution
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9">
          <ReactApexChart
            options={updatedOptions}
            series={series}
            type="donut"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
