import React, { useEffect, useState } from "react";
import axios from "axios";
function Sidebar() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}rooms`
        );

        setRooms(response.data.rooms);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);
  
  return (
    <div className="sidebar">
      <h3 style={{ color: "#43a047", padding: "10px", margin: "5px" }}>
        Active Rooms:
      </h3>
      <hr style={{ borderColor: "#43a047" }} />
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>{room.roomName}</li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
