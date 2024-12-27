import { Bar } from "@ant-design/charts";
import { DetailedExpenseChartProps } from "../../../common/interfaces/for-components/chart-interfaces";
import { formatCurrencyString } from "../../../common/helpers/formatter-currency-string.helper";

const DetailedExpenseBarChart = ({
  data,
}: {
  data: DetailedExpenseChartProps[];
}) => {
  const totalExpenses = data.reduce((acc, currentItem) => {
    return acc + currentItem.expenses;
  }, 0);
  const config = {
    data,
    xField: "date",
    yField: "expenses",
    paddingRight: 60,
    style: {
      maxWidth: 20,
      fill: "#D32F2F",
    },
    title: "Detailed Expense Chart By Date",
    legend: {
      color: {
        title: true,
      },
    },
    markBackground: {
      label: {
        text: ({ originData }: { originData: DetailedExpenseChartProps }) => {
          return `${parseFloat(
            String((originData.expenses * 100) / totalExpenses)
          ).toFixed(2)}% | ${formatCurrencyString(
            parseFloat(parseFloat(String(originData.expenses)).toFixed(2))
          )}`;
        },
        position: "right",
        dx: 80,
        style: {
          fill: "#aaa",
          fillOpacity: 1,
          fontSize: 14,
        },
      },
      style: {
        fill: "#eee",
      },
    },
    scale: {
      y: {
        domain: [0, totalExpenses],
      },
    },
    axis: {
      x: {
        tick: false,
        title: false,
      },
      y: {
        grid: false,
        tick: false,
        label: false,
        title: false,
      },
    },
    interaction: {
      elementHighlight: false,
    },
  };
  return <Bar {...config} />;
};
export default DetailedExpenseBarChart;
