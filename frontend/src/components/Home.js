import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Container } from "@mui/material";
import { Card, Typography, Modal, Input, Form, Button } from "antd";
import QueueItem from "./QueueItem";
import GetTime from "../functions/GetTime";
import { GrAdd } from "react-icons/gr";
import { openNotification } from "../functions/Notification";

const socket = io("javaughnpryce.live:9091");
const { Title } = Typography;

export default function Home() {
  const [queue, setQueue] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [song, setSong] = useState();
  const [artiste, setArtiste] = useState();
  const [form] = Form.useForm();
  useEffect(() => {
    socket.emit("getQueue");
    socket.on("sending queue", (data) => {
      setQueue(data.queue);
      console.log(data);
    });
    socket.on("Queue updated", () => {
      socket.emit("getQueue");
    });
  }, []);

  useEffect(() => {
    socket.on("error", (data) => {
      alert(data.message);
    });
    socket.on("success", () => {
      openNotification(
        "success",
        "Success",
        "Get to pratice! Your song was successfully submitted."
      );
      setShow(false);
      form.setFieldsValue({
        name: "",
        song: "",
        artiste: "",
      });
      setName("");
      setSong("");
      setArtiste("");
    });
  }, [form]);

  const onSubmit = () => {
    const data = {
      id: localStorage.getItem("user_key"),
      name,
      song,
      artiste,
      time: GetTime(),
    };
    if (name && song && artiste) {
      socket.emit("request", data);
    } else {
      openNotification("error", "Error", "All fields must be filled!");
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: 25,
        marginBottom: 7,
      }}
    >
      <Button
        style={{ position: "fixed", bottom: 30, right: 25, zIndex: 20 }}
        // type="ghost"
        shape="circle"
        size="large"
        block
        icon={<GrAdd style={{ fontSize: 28, color: "white" }} />}
        onClick={() => setShow(true)}
      />
      <Modal
        visible={show}
        destroyOnClose
        onCancel={() => setShow(false)}
        footer={[
          <Button key="back" onClick={() => setShow(false)}>
            Return
          </Button>,
          <Button key="submit" type="primary" onClick={onSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Name"
            style={{ marginBottom: 2 }}
            required
          >
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="song"
            label="Song"
            style={{ marginBottom: 2 }}
            required
          >
            <Input onChange={(e) => setSong(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="artiste"
            label="Artiste"
            style={{ marginBottom: 2 }}
            required
          >
            <Input onChange={(e) => setArtiste(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        bordered={false}
        style={{ borderRadius: 5 }}
        headStyle={{ backgroundColor: "#7e3033" }}
        title={
          <Title align="center" style={{ color: "white" }}>
            Song Queue
          </Title>
        }
      >
        <Title level={5}>Songs in Queue: {queue.length}</Title>
        <div style={{ height: 470, overflow: "auto", padding: 5 }}>
          {queue.map((item, index) => (
            <QueueItem
              key={index}
              name={item.name}
              song={item.song}
              id={item.id}
              artiste={item.artiste}
            />
          ))}
        </div>
      </Card>
    </Container>
  );
}
