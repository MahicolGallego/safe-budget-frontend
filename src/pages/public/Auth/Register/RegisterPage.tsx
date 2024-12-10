import {
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import Password from "antd/es/input/Password";
import { NavLink } from "react-router";
import { useRegister } from "../../../../hooks/auth/useRegister";
import styles from "./style.module.css";
const { Item } = Form;
const { Title, Text } = Typography;

const Register = () => {
  const { isRequesting, hiddenBadResults, handleRegister } = useRegister();
  return (
    <div className={styles.formContainer}>
      <Title level={3}>Welcome To Register</Title>
      <Form
        className={styles.formRegister}
        name="form-register"
        layout="vertical"
        onFinish={handleRegister}
      >
        <Item
          className={styles.input}
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
            {
              min: 3,
              message: "Name should be at least 3 characters long!",
            },
            {
              max: 100,
              message: "Name should not exceed 100 characters!",
            },
          ]}
        >
          <Input placeholder="your name..." addonBefore={<UserOutlined />} />
        </Item>
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
            className={styles.registerButton}
            type="primary"
            htmlType="submit"
            icon={<UserAddOutlined />}
            disabled={isRequesting}
          >
            Register
          </Button>
        </Item>
      </Form>

      <Text hidden={hiddenBadResults} style={{ color: "red", fontSize: 10 }}>
        <ul>
          <li>
            ✘ **Connection error**: If you're unable to register, it could be
            due to a network issue. Please check your internet connection.
          </li>
          <li>
            ✘ **Invalid credentials**: Make sure your password is correct and
            your email is valid.
          </li>
          <li>
            ✘ **Email already registered**: If you're getting an error about the
            email already in use, please try logging in instead.
          </li>
          <li>
            ✘ **Server error**: Sometimes the server might be down. Please try
            again later.
          </li>
        </ul>
      </Text>
      <Text style={{ fontSize: 12 }}>
        Already have an account?
        <NavLink to="/login" style={{ marginLeft: 5 }}>
          Login
        </NavLink>
      </Text>
    </div>
  );
};

export default Register;
