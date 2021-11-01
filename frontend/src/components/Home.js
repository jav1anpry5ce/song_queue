import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Container } from "@mui/material";
import {
  Card,
  Typography,
  Modal,
  Input,
  Form,
  Button,
  BackTop,
  Spin,
} from "antd";
import QueueItem from "./QueueItem";
import GetTime from "../functions/GetTime";
import { GrAdd } from "react-icons/gr";
import { openNotification } from "../functions/Notification";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumArt, clearState } from "../store/songSlice";
import image from "../images/cover1.jpg";
import { LoadingOutlined } from "@ant-design/icons";
import RandomColor from "../functions/RandomColor";

const socket = io("https://javaughnpryce.live:9091");
const { Title } = Typography;

export default function Home() {
  const songData = useSelector((state) => state.song);
  const dispatch = useDispatch();
  const [queue, setQueue] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [song, setSong] = useState();
  const [artiste, setArtiste] = useState();
  const [form] = Form.useForm();
  const [mobile, setMobile] = useState(false);
  const list = useRef();

  useEffect(() => {
    window.addEventListener("resize", resize);
    if (window.innerHeight <= 736 || window.innerWidth <= 560) {
      setMobile(true);
    } else {
      setMobile(false);
    }
    socket.emit("getQueue");
    socket.on("sending queue", (data) => {
      setQueue(data.queue);
    });
    socket.on("Queue updated", () => {
      socket.emit("getQueue");
    });
    return () => {
      socket.off("Queue updated");
      socket.off("error");
      socket.off("success");
      socket.off("request");
    };
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

  useEffect(() => {
    if (songData.success) {
      submitSong();
      dispatch(clearState());
    }
    // eslint-disable-next-line
  }, [songData.success]);

  const onSubmit = () => {
    if (name && song && artiste) {
      dispatch(getAlbumArt({ title: song, artiste }));
    } else {
      openNotification("error", "Error", "All fields must be filled!");
    }
  };

  const resize = () => {
    if (window.innerHeight <= 736 || window.innerWidth <= 560) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  };

  const submitSong = () => {
    if (songData.cover) {
      const data = {
        id: localStorage.getItem("user_key"),
        name,
        song,
        artiste,
        time: GetTime(),
        cover: songData.cover,
      };
      socket.emit("request", data);
    } else {
      const data = {
        id: localStorage.getItem("user_key"),
        name,
        song,
        artiste,
        time: GetTime(),
      };
      socket.emit("request", data);
    }
  };

  return (
    <Container
      maxWidth="md"
      style={{
        marginTop: mobile ? 25 : 50,
        marginBottom: 5,
      }}
    >
      <Button
        style={{ position: "fixed", bottom: 10, right: 16, zIndex: 20 }}
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
          <Button
            key="back"
            onClick={() => setShow(false)}
            disabled={songData.loading}
          >
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onSubmit}
            loading={songData.loading}
          >
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
            <Input onChange={(e) => setName(e.target.value.trim())} />
          </Form.Item>
          <Form.Item
            name="song"
            label="Song"
            style={{ marginBottom: 2 }}
            required
          >
            <Input onChange={(e) => setSong(e.target.value.trim())} />
          </Form.Item>
          <Form.Item
            name="artiste"
            label="Artiste"
            style={{ marginBottom: 2 }}
            required
          >
            <Input onChange={(e) => setArtiste(e.target.value.trim())} />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        bordered={false}
        style={{ borderRadius: 5, position: "relative" }}
        headStyle={{ backgroundColor: "#7e3033" }}
        title={
          <Title align="center" style={{ color: "white" }}>
            Song Queue
          </Title>
        }
      >
        <Title level={5}>Songs in Queue: {queue.length}</Title>
        <div
          ref={list}
          style={{ height: mobile ? 400 : 570, overflow: "auto", padding: 5 }}
        >
          {queue.map((item, index) => (
            <QueueItem
              key={index}
              cover={item.cover ? item.cover : image}
              name={item.name}
              song={item.song}
              id={item.id}
              artiste={item.artiste}
              socket={socket}
              mobile={mobile}
            />
          ))}
        </div>
        <BackTop
          style={{ position: "absolute", bottom: 0, right: 0 }}
          target={() => list.current}
          visibilityHeight={80}
        />
        {queue.length === 0 && (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 65,
                  color: `${RandomColor()}`,
                  alignSelf: "center",
                  position: "absolute",
                  left: "45%",
                  bottom: "45%",
                }}
              />
            }
            size="large"
          />
        )}
      </Card>
    </Container>
  );
}
