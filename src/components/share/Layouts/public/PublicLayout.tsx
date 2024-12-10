import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { Layout } from "antd";
import styles from "./style.module.css";
import { LogoImage } from "../../logo";
import { AppFooter } from "../../footer";

const { Content, Header } = Layout;
const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Gets the current location (current path)

  useEffect(() => {
    if (location.pathname === "/") {
      // If the current path is the root ("/"), we redirect to "/home"
      navigate("/home", { replace: true });
    }
  }, [location, navigate]); //  location as a dependency to detect route changes

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <NavLink to="/home" className={styles.navlink}>
          <LogoImage width="100%" />
        </NavLink>
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default PublicLayout;
