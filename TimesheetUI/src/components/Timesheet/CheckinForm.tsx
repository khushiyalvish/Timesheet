

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/checkinform.css";


const CheckInForm: React.FC = () => {
  const currentUserId = 1;

  const [form, setForm] = useState({
    userId: currentUserId,
    deviceId: "WEB-123",
    location: "Sunteck Andheri", // fixed office name
    latitude: 0,
    longitude: 0,
    createdBy: currentUserId,
  });

  // get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // toast.success("Location captured!");
        },
        (error) => {
          toast.error("Location access denied.");
          console.error(error);
        }
      );
    } else {
      toast.error("⚠️ Geolocation not supported.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:7034/api/Timesheet/checkin",
        form
      );

      const message = response.data.message || response.data;

      if (message.toLowerCase().includes("success")) {
        toast.success(message);
        console.log("API Success:", message);
        setForm({
          userId: currentUserId,
          deviceId: "WEB-123",
          location: "Sunteck Andheri", // keep fixed
          latitude: 0,
          longitude: 0,
          createdBy: currentUserId,
        });
      } else {
        toast.error(message);
        console.warn("API Error Response:", message);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(` API Error: ${error.response.data}`);
        console.error("API Error:", error.response.data);
      } else {
        toast.error("⚠️ Unexpected error while checking in");
        console.error(error.message);
      }
    }
  };

  return (
    <div className="checkin-container">
      <h2 className="title">Employee Check-In</h2>
      <form className="checkin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="location"
          value={form.location}
          readOnly
        />
        <input
          type="number"
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          readOnly
        />
        <input
          type="number"
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          readOnly
        />

        <button
          type="button"
          className="btn btn-location"
          onClick={getCurrentLocation}
        >
          📍 Use My Location
        </button>
        <button type="submit" className="btn btn-checkin">
          ✅ Check In
        </button>
      </form>
      
    </div>
    
  );
};

export default CheckInForm;




