import React, { useState, useEffect } from "react";
import { Container, Card, Text, TextContainer } from "./Elements";
import { AiOutlineMore } from "react-icons/ai";
import { Popover, Button } from "antd";

const Content = ({ id, token, socket }) => {
  const onRemove = () => {
    socket.emit("remove", token, id);
  };
  return <Button onClick={onRemove}>Remove</Button>;
};

export default function QueueItem({ name, song, artiste, id, socket }) {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    if (sessionStorage.getItem("is_auth") === "true") {
      setIsAuth(true);
      setToken(sessionStorage.getItem("token"));
    }
  }, []);

  return (
    <Card>
      <Container>
        <TextContainer>
          <Text>Song Title: {song}</Text>
          <Text>Artiste: {artiste}</Text>
          <Text>Requested By: {name}</Text>
        </TextContainer>
        {isAuth && (
          <Popover
            content={() => <Content id={id} token={token} socket={socket} />}
          >
            <AiOutlineMore style={{ fontSize: 28 }} />
          </Popover>
        )}
      </Container>
    </Card>
  );
}
