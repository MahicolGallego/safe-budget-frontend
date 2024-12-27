import { Pie } from "@ant-design/plots";
import { BalanceChartProps } from "../../../common/interfaces/for-components/chart-interfaces";

const BalanceDonutChart = (chartData: BalanceChartProps) => {
  const data = [
    {
      type: "Total Available",
      value: chartData.totalAvailable,
    },
    {
      type: "Total Expenses",
      value: chartData.totalExpenses,
    },
  ];
  const config = {
    data,
    title: "Expenses Balance Chart",
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    legend: {
      color: {
        title: true,
        position: "top",
        rowPadding: 5,
      },
    },
    scale: {
      color: {
        range: ["#4CAF50", "#D32F2F"], // Verde Esmeralda y Rojo Carmín
      },
    },
  };
  return <Pie {...config} />;
};

export default BalanceDonutChart;
