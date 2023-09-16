import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [error, setError] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL

  const navigate = useNavigate();
  const endChat = async () => {
    const confirmation = window.confirm("Do you want to save chat?");
    if (confirmation) {
      console.log("here", confirmation);
      await socket.emit("end_chat", { room });
    } else {
      await axios.delete(`${baseUrl}delete?room=${room}`, { room });
    }
    navigate("/login");
  };
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("alert_end_chat", async () => {
      const confirmation = window.confirm("Do you want to save chat?");
      if (!confirmation) {
        await axios.delete(`${baseUrl}delete?room=${room}`);
      }
      navigate("/login");
    });

    socket.on("err_connection", (data) => {
      setError(data);
    });

    return () => {
      // Clean up the subscription when the component unmounts
      socket.off("receive_message");
      socket.off("err_connection");
      socket.off("alert_end_chat");
    };
  }, [navigate, room, socket]);

  return error ? (
    <div>{error}</div>
  ) : (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, i) => {
            return (
              <div
                key={i}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="chat-footer"
      >
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <button onClick={endChat}>End Chat</button>
    </div>
  );
}

export default Chat;
