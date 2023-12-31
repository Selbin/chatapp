import { useEffect, useState } from "react";
import io from "socket.io-client";

import { useAuth } from "../context/AuthContext";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

const socket = io.connect(process.env.REACT_APP_BASE_URL);

function Home() {
  const [roomname, setRoomname] = useState("");
  const [roomPassphrase, setRoomPassphrase] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState(false);

  const { user } = useAuth();

  const joinRoom = async (type) => {
    setError(false);
    if (user.id && roomPassphrase !== "" && roomname !== "") {
      socket.emit("join_room", { roomPassphrase, roomname, id: user.id, type });
      setTimeout(() => setShowChat(true), 1000)
    }
  };

  useEffect(() => {
    socket.on("err_joining", (data) => {
      setError(data);
      setShowChat(false)
    });

    return () => {
      // Clean up the subscription when the component unmounts\
      socket.off("err_connection");
    };
  }, []);

  return (
    <div className="homeContainer">
      <Sidebar />
      <div className="home">
        {!showChat || error ? (
          <div className="inputContainer">
            <h3>Create / Join Room</h3>
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
            <div>
              <button onClick={() => joinRoom("join")}>Join Room</button>
              <button onClick={() => joinRoom("create")}>Create Room</button>
            </div>
            <div style={{ color: "red" }}>{error}</div>
          </div>
        ) : (
          <Chat
            socket={socket}
            username={user.userName}
            id={user.id}
            room={roomname}
            roomPassphrase={roomPassphrase}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
