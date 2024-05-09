import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, Typography, Button, TextField } from "@mui/material";
import { ChatEventEnum } from "../constants";

function Chat() {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit(ChatEventEnum.MESSAGE_RECEIVED_EVENT, {message});
    setMessage("");
    setRoom("");
  };

  useEffect(() => {
    socket.on(ChatEventEnum.CONNECTED_EVENT, () => {
      setSocketId(socket.id);
      console.log("connected successfully", socket.id);
    });

    socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (data) => {
      console.log("the message received successfully msg:",data);
      setReceivedMessages(prev => [...prev, data.message]);
      console.log(receivedMessages);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h3"
        component="div"
        gutterBottom
      >
        Socket id: {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField value={message}
        onChange={(e)=> setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" />
        <br />
        <TextField value={room}
        onChange={(e)=> setRoom(e.target.value)} id="outlined-basic" label="Room No" variant="outlined" />
        <Button type="submit" variant="contained" color="primary" >
          Send
        </Button>
      </form>
      {receivedMessages.map(msg => <p>{msg}</p>)}
    </Container>
  );
}

export default Chat;
