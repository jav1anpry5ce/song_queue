import React, { useState, useEffect } from "react";
import { Container, Card, Text, TextContainer } from "./Elements";
import { AiOutlineMore } from "react-icons/ai";
import { Popover, Button } from "antd";
import { Image, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { RandomColor } from "../functions";
import image from "../images/cover1.jpg";

const Content = ({ id, token, socket }) => {
  const onRemove = () => {
    socket.emit("remove", token, id);
  };
  return <Button onClick={onRemove}>Remove</Button>;
};

export default function QueueItem({
  name,
  song,
  artiste,
  cover,
  id,
  socket,
  mobile,
}) {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState();
  const [backup, setBackup] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("is_auth") === "true") {
      setIsAuth(true);
      setToken(sessionStorage.getItem("token"));
    }
    setBackup(cover);
    // eslint-disable-next-line
  }, []);

  const onClick = () => {
    const url = `https://www.youtube.com/results?search_query=${song}+${artiste}+karaoke`;
    if (!mobile) window.open(url, "_blank");
  };

  return (
    <Card>
      <Container>
        {isAuth && (
          <Popover
            placement="left"
            content={() => <Content id={id} token={token} socket={socket} />}
          >
            <AiOutlineMore
              style={{
                fontSize: 20,
                position: "absolute",
                left: -5,
                top: "40%",
                rotate: "90deg",
              }}
            />
          </Popover>
        )}
        <TextContainer>
          <Text
            mobile={mobile ? mobile : null}
            onClick={onClick}
            hover={!mobile}
          >
            Song Title: {song.toLocaleLowerCase()}
          </Text>
          <Text mobile={mobile ? mobile : null}>
            Artiste: {artiste.toLocaleLowerCase()}
          </Text>
          <Text mobile={mobile ? mobile : null}>
            Requested By: {name.toLocaleLowerCase()}
          </Text>
        </TextContainer>
        {cover && !mobile && (
          <Image
            style={{
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}
            placeholder={
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 36,
                        color: `${RandomColor()}`,
                      }}
                    />
                  }
                  size="large"
                />
              </div>
            }
            width={105}
            height={101}
            src={backup}
            alt="album cover"
            onError={() => setBackup(image)}
          />
        )}
      </Container>
    </Card>
  );
}
