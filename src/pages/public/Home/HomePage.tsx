import { Image, Layout, Typography } from "antd";
import bannerHomeImg from "../../../assets/imgs/banner_home.svg";
import { NavLink } from "react-router";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import styles from "./style.module.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Layout>
      <Content className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            preview={false}
            src={bannerHomeImg}
            width={"90%"}
            height={"90%"}
            style={{
              display: "block",
              margin: "0 auto",
              objectFit: "contain",
            }}
          />
        </div>
        <div className={styles.textContainer}>
          <Title level={2}>Welcome to Safe Budget</Title>
          <Paragraph>
            Safe Budget is a budgeting app that helps you keep track of your
            spending. It offers a simple and intuitive interface, resulting in a
            friendly experience while tracking your finances. Start by creating
            a new account or logging in with your existing credentials.
          </Paragraph>
          <div className={styles.containerButtons}>
            <NavLink to="/register" className={styles.navLinkButton}>
              Register
              <UserAddOutlined />
            </NavLink>
            <NavLink to="/login" className={styles.navLinkButton}>
              Login
              <LoginOutlined />
            </NavLink>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
