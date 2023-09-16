import io from "socket.io-client";
import { useState } from "react";

import Chat from "./Chat";

const socket = io.connect(process.env.REACT_APP_BASE_URL);

function Home() {
  const [username, setUsername] = useState("");
  const [roomname, setRoomname] = useState("");
  const [roomPassphrase, setRoomPassphrase] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = async (type) => {
    if (username !== "" && roomPassphrase !== "" && roomname !== "") {
      socket.emit("join_room", { roomPassphrase, roomname, username, type });
      setShowChat(true);
    }
  };

  return (
    <div className="Home">
      {!showChat ? (
        <div className="inputContainer">
          <h3>Join Room</h3>
          <input
            type="text"
            placeholder="User name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room name"
            onChange={(event) => {
              setRoomname(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room passphrase"
            onChange={(event) => {
              setRoomPassphrase(event.target.value);
            }}
          />
          <button onClick={() => joinRoom("join")}>Join Room</button>

          <h3>Create Room</h3>
          <input
            type="text"
            placeholder="User name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room name"
            onChange={(event) => {
              setRoomname(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room passphrase"
            onChange={(event) => {
              setRoomPassphrase(event.target.value);
            }}
          />
          <button onClick={() => joinRoom("create")}>Create Room</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={roomname}
          roomPassphrase={roomPassphrase}
        />
      )}
    </div>
  );
}

export default Home;
