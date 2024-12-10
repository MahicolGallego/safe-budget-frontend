import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
export const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 48,
            }}
            spin
            allowFullScreen
          />
        }
      />
    </div>
  );
};
