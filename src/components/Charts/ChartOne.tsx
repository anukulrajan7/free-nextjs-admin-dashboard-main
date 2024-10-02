"use client";

import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
  },
};

interface ChartOneProps {
  dailyData: Array<{
    total_amount: number;
    total_transactions: number;
    date: string;
  }>;
  weeklyData: Array<{
    total_amount: number;
    total_transactions: number;
    week: string;
  }>;
  monthlyData: Array<{
    total_amount: number;
    total_transactions: number;
    month: string;
  }>;
}

const ChartOne: React.FC<ChartOneProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
}) => {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  const getChartData = () => {
    const data =
      view === "daily"
        ? dailyData
        : view === "weekly"
          ? weeklyData
          : monthlyData;
    return [
      {
        name: "Transaction Amount",
        data: data.map((item) => item.total_amount),
      },
      {
        name: "Transaction Count",
        data: data.map((item) => item.total_transactions),
      },
    ];
  };

  const getCategories = () => {
    const data =
      view === "daily"
        ? dailyData.map((item) => item.date)
        : view === "weekly"
          ? weeklyData.map((item) => item.week)
          : monthlyData.map((item) => item.month);
    return data.map((item) => {
      if (view === "daily") {
        return new Date(item).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } else if (view === "weekly") {
        return `Week ${item}`;
      } else {
        return new Date(item + "-01").toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
    });
  };

  const updatedOptions: ApexOptions = {
    ...options,
    xaxis: {
      ...options.xaxis,
      categories: getCategories(),
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Transaction Amount</p>
              <p className="text-sm font-medium">
                Total amount of transactions
              </p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Transaction Count</p>
              <p className="text-sm font-medium">Number of transactions</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            {["daily", "weekly", "monthly"].map((viewOption) => (
              <button
                key={viewOption}
                className={`rounded px-3 py-1 text-xs font-medium ${
                  view === viewOption
                    ? "bg-white text-black shadow-card dark:bg-boxdark dark:text-white"
                    : "text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
                }`}
                onClick={() =>
                  setView(viewOption as "daily" | "weekly" | "monthly")
                }
              >
                {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={updatedOptions}
            series={getChartData()}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
