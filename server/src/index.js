const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Server } = require("socket.io");

const dbConnect = require("./database/db");
const Room = require("./model/room");
const User = require("./model/user");
const Message = require("./model/message");

dbConnect();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (data) => {
    try {
      if (data.type == "join") {
        const room = await Room.findOne({ roomName: data.roomname });
        if (!room) {
          return socket.emit("err_connection", "Passphrase does not match");
        }
        
        const verifyPassphrase = await bcrypt.compare(
          data.roomPassphrase,
          room.passPhrase
        );
        if (!verifyPassphrase) {
          return socket.emit("err_connection", "Passphrase does not match");
        }

        room.users.push(data.username);
        await room.save();
        socket.join(data.roomname);
      } else if ((data.type = "create_room")) {
        const hashedpassPhrase = await bcrypt.hash(data.roomPassphrase, 10);
        await Room.create({
          roomName: data.roomname,
          passPhrase: hashedpassPhrase,
          users: [data.username],
        });
        socket.join(data.roomname);
      }
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    } catch (error) {
      console.log(error);
      socket.emit("err_connection", "Room is full");
    }
  });

  socket.on("send_message", async (data) => {
    try {
      await Message.create(data);
      socket.to(data.room).emit("receive_message", data);
    } catch (error) {
      socket.to(data.room).emit("err_connection", "Something went wrong");
    }
  });

  socket.on("end_chat", async ({ room }) => {
    socket.to(room).emit("alert_end_chat");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.post("/register", async (req, res) => {
  try {
    const { userName, passPhrase } = req.body;
    const hashedpassPhrase = await bcrypt.hash(passPhrase, 10);
    await User.create({
      userName,
      passPhrase: hashedpassPhrase,
    });

    return res.status(200).send({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userName, passPhrase } = req.body;
    const user = await User.findOne({ userName }).select("passPhrase userName");
    if (!user) {
      return res.status(404).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(passPhrase, user.passPhrase);
    if (!passwordMatch) {
      return res.status(404).json({ message: "Invalid username or password" });
    }

    return res.status(200).send({ id: user._id, userName: user.userName });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await Message.deleteMany({ room: req.query.room });
    return res.status(200).send({ message: "history deleted" });
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});