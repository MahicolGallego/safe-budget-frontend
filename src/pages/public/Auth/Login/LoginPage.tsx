import { LockOutlined, LoginOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import Password from "antd/es/input/Password";
import { NavLink } from "react-router";
import styles from "./style.module.css";
import { useLogin } from "../../../../hooks/auth/useLogin";
const { Item } = Form;
const { Title, Text } = Typography;

const Login = () => {
  const { isRequesting, hiddenBadResults, handleLogin } = useLogin();
  return (
    <div className={styles.formContainer}>
      <Title level={3}>Login</Title>
      <Form
        className={styles.formLogin}
        name="form-login"
        layout="vertical"
        onFinish={handleLogin}
      >
        <Item
          className={styles.input}
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              min: 3,
              message: "Name should be at least 3 characters long!",
            },
            {
              max: 150,
              message: "Name should not exceed 150 characters!",
            },
            {
              type: "email",
              message: "The input is not a valid email!",
            },
          ]}
        >
          <Input placeholder="your email..." addonBefore={<MailOutlined />} />
        </Item>
        <Item
          className={styles.input}
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 6,
              message: "The name must be at least 6 characters long",
            },
          ]}
        >
          <Password
            placeholder="your password..."
            addonBefore={<LockOutlined />}
          />
        </Item>
        <Item>
          <Button
            className={styles.loginButton}
            type="primary"
            htmlType="submit"
            icon={<LoginOutlined />}
            disabled={isRequesting}
          >
            Login
          </Button>
        </Item>
      </Form>

      <Text hidden={hiddenBadResults} style={{ color: "red", fontSize: 10 }}>
        <ul>
          <li>
            ✘ **Invalid credentials**: Make sure your password and email are
            correct.
          </li>
          <li>
            ✘ **Connection error**: If you're unable to register, it could be
            due to a network issue. Please check your internet connection.
          </li>
          <li>
            ✘ **Server error**: Sometimes the server might be down. Please try
            again later.
          </li>
        </ul>
      </Text>
      <Text style={{ fontSize: 12 }}>
        Do not have an account?
        <NavLink to="/register" style={{ marginLeft: 5 }}>
          Sign up
        </NavLink>
      </Text>
    </div>
  );
};

export default Login;
