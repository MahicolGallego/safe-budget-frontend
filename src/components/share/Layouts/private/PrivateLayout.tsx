import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { useAuthStore } from "../../../../store/auth.store";
import { LoginOutlined } from "@ant-design/icons";
import styles from "./style.module.css";
import { Button, Layout } from "antd";
import { AppFooter } from "../../footer";
import { LogoImage } from "../../logo";

const { Content, Sider } = Layout;

type navlinks = "budgets" | "charts";

const PrivateLayout = () => {
  const [activePage, setActivePage] = useState<navlinks>("budgets");
  const { user, logout } = useAuthStore();
  return (
    <Layout className={styles.layout}>
      <Layout>
        <Sider className={styles.sliderContainer}>
          <div className={styles.slider}>
            <NavLink to="/app/butgets" className={styles.navlinkLogo}>
              <LogoImage width="70%" />
            </NavLink>

            <h3>{user?.name}</h3>

            <ul className={styles.menu}>
              <li>
                <NavLink
                  to="/app/budgets"
                  className={styles.menuNavlink}
                  onClick={() => setActivePage("budgets")}
                  style={
                    activePage === "budgets" ? { color: "black" } : undefined
                  }
                >
                  Budgets
                </NavLink>
              </li>
            </ul>

            <Button
              className={styles.logoutButton}
              type="primary"
              icon={<LoginOutlined />}
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </Sider>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
      <AppFooter />
    </Layout>
  );
};

export default PrivateLayout;
