import { useEffect, useState } from "react";
import io from "socket.io-client";

import { useAuth } from "../context/AuthContext";
import Chat from "./Chat";

const socket = io.connect(process.env.REACT_APP_BASE_URL);

function Home() {
  const [roomname, setRoomname] = useState("");
  const [roomPassphrase, setRoomPassphrase] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState(false);

  const { user } = useAuth();

  const joinRoom = async (type) => {
    if (user.id && roomPassphrase !== "" && roomname !== "") {
      socket.emit("join_room", { roomPassphrase, roomname, id: user.id, type });
      setShowChat(true);
    }
  };

  useEffect(() => {
    socket.on("err_joining", (data) => {
      setError(data);
    });

    return () => {
      // Clean up the subscription when the component unmounts\
      socket.off("err_connection");
    };
  }, []);

  return (
    <div className="Home">
      {!showChat || error? (
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
          <div style={{color: 'red'}}>{error}</div>
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
  );
}

export default Home;
