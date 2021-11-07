import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUpdatedArt, clearState } from "../store/songSlice";
import { openNotification } from "../functions/";

export default function UpdateItem({
  socket,
  artiste,
  song,
  showUpdate,
  setShowUpdate,
}) {
  const songData = useSelector((state) => state.song);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [newSong, setNewSong] = useState();
  const [newArtiste, setNewArtiste] = useState();

  useEffect(() => {
    if (songData.uSuccess) {
      submitUpdatedSong();
      dispatch(clearState());
    }
    // eslint-disable-next-line
  }, [songData.uSuccess]);

  const onSubmit = () => {
    if (newSong && newArtiste) {
      dispatch(getUpdatedArt({ title: newSong, artiste: newArtiste }));
    } else {
      openNotification("error", "Error", "All fields must be filled!");
    }
  };

  const submitUpdatedSong = () => {
    if (songData.cover) {
      const data = {
        id: localStorage.getItem("user_key"),
        newSong: newSong,
        newArtiste: newArtiste,
        newCover: songData.cover,
      };
      socket.emit("updateSong", data);
    } else {
      const data = {
        id: localStorage.getItem("user_key"),
        newSong: newSong,
        newArtiste: newArtiste,
      };
      socket.emit("updateSong", data);
    }
  };
  return (
    <div>
      <Modal
        visible={showUpdate}
        destroyOnClose
        onCancel={() => setShowUpdate(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setShowUpdate(false)}
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
            name="song"
            label="Song"
            style={{ marginBottom: 2 }}
            required
          >
            <Input
              onChange={(e) =>
                setNewSong(e.target.value.trim().toLocaleLowerCase())
              }
              defaultValue={song}
            />
          </Form.Item>
          <Form.Item
            name="artiste"
            label="Artiste"
            style={{ marginBottom: 2 }}
            required
          >
            <Input
              onChange={(e) =>
                setNewArtiste(e.target.value.trim().toLocaleLowerCase())
              }
              defaultValue={artiste}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
