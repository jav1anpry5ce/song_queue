import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { Card, Form, Input, Button, Typography, Alert } from "antd";
import { io } from "socket.io-client";
import { useHistory } from "react-router";

const socket = io("javaughnpryce.live:9091", { autoConnect: false });
const { Title } = Typography;

export default function Login() {
  const history = useHistory();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    socket.connect();
    if (sessionStorage.getItem("is_auth") === "true") {
      history.push("/");
    }
    socket.on("auth", (data) => {
      if (data.message === "Success") {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("is_auth", true);
        history.push("/");
      } else {
        setMessage(data.message);
      }
    });
    return () => {
      socket.off("auth");
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const onSubmit = () => {
    setMessage("");
    const data = {
      username,
      password,
    };
    socket.emit("login", data);
  };

  return (
    <Container maxWidth="sm">
      <Card
        headStyle={{ backgroundColor: "#7e3033" }}
        title={
          <Title style={{ color: "white" }} align="center">
            Login
          </Title>
        }
        style={{ marginTop: 65, borderRadius: 7 }}
        bordered={false}
      >
        {message && <Alert message={message} type="error" />}
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            required
            label="Username"
            name="username"
            style={{ marginBottom: 2 }}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </Form.Item>
          <Form.Item
            required
            label="Password"
            name="password"
            style={{ marginBottom: 13 }}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 2 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}
