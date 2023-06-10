import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Fetch notifications from the server
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/notifications`
        );

        setNotifications(response.data.notifications);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <div className="notification-header">
        <span
          className="material-icons back-arrow"
          id="notification"
          onClick={goBack}
        >
          arrow_back_ios
        </span>
        <h1>Activity Logs</h1>
      </div>
      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li key={notification._id} className="notice success">
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
