import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pagination } from "../components";
import "../styles/notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Fetch notifications from the server
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/notifications/?page=${page}&limit=${limit}`
        );

        setNotifications(response.data.notifications);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  const foundTotal = notifications.length;
  const paginatedNotifications = notifications.slice(
    (page - 1) * limit,
    page * limit
  );

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
          {paginatedNotifications.map((notification) => (
            <li key={notification._id} className="notice success">
              {notification.message}
            </li>
          ))}
        </ul>
      )}
      <div>
        <Pagination
          page={page}
          limit={limit}
          total={foundTotal}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default Notifications;
