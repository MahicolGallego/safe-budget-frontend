import { Image } from "antd";
import safeBudgetLogo from "../../assets/imgs/safe_budget.png";

interface LogoImageProps {
  width?: string | number;
  height?: string | number;
}
export const LogoImage = ({
  width = "20%",
  height = "100%",
}: LogoImageProps) => {
  return (
    <Image
      preview={false}
      src={safeBudgetLogo}
      width={width}
      height={height}
      style={{
        display: "block",
        margin: "0 auto",
        objectFit: "contain",
      }}
    />
  );
};
