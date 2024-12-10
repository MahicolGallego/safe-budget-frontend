import { Layout, Typography } from "antd";

const { Text } = Typography;
const { Footer } = Layout;

export const AppFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "black",
        textAlign: "center",
        padding: "20px 0",
        fontSize: 16,
      }}
    >
      <Text style={{ color: "white" }}>
        &copy; {new Date().getFullYear()} Safe Budget. All rights reserved.
      </Text>
    </Footer>
  );
};
