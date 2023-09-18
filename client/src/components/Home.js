import io from "socket.io-client";
import { useState } from "react";

import { useAuth } from '../context/AuthContext';
import Chat from "./Chat";

const socket = io.connect(process.env.REACT_APP_BASE_URL);

function Home() {
  const [roomname, setRoomname] = useState("");
  const [roomPassphrase, setRoomPassphrase] = useState("");
  const [showChat, setShowChat] = useState(false);
  const {user} = useAuth()

  const joinRoom = async (type) => {
    if (user.id && roomPassphrase !== "" && roomname !== "") {
      socket.emit("join_room", { roomPassphrase, roomname, username: user.userName, type });
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
          username={user.userName}
          room={roomname}
          roomPassphrase={roomPassphrase}
        />
      )}
    </div>
  );
}

export default Home;
