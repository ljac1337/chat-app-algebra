import "./App.css";
import React, { useState, useEffect } from "react";
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
  const adjectives = ["autumn", "hidden", "bitter", "misty", "silent"];
  const nouns = ["waterfall", "river", "breeze", "moon", "rain"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

const channelId = "1L6QptYTlD4p0aW1";

function App() {
  const [messages, setMessages] = useState([]);
  const [member, setMember] = useState({
    username: randomName(),
    color: randomColor(),
  });
  const [drone, setDrone] = useState();

  useEffect(() => {
    const drone = new window.Scaledrone(channelId, {
      data: member,
    });
    setMember((prevMember) => ({
      ...prevMember,
      id: drone.id,
    }));
    setDrone(drone);
    const room = drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: data,
          member: member.clientData,
        },
      ]);
    });
  }, []);

  const onSendMessage = (message) => {
    drone.publish({
      room: "observable-room",
      message,
    });
  };
  console.log(messages);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Chat App</h1>
        </header>
        <Messages messages={messages} currentMember={member} />
        <Input onSendMessage={onSendMessage}></Input>
      </div>
    </>
  );
}

export default App;
