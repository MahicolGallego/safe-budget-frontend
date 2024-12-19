import { InputNumberProps } from "antd";

export const formatInputCurrencyString: InputNumberProps["formatter"] = (
  value
) => {
  const valueString = `${value}`;
  const [integer, decimal] = valueString.split(".");

  // Make sure that if the number is decimal it has at
  // least 2 decimal places
  const formattedDecimal = decimal ? decimal.padEnd(2, "0") : "00";

  const formattedValue = `${integer}.${formattedDecimal}`;
  return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
