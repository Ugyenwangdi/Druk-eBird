import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../styles/notifications.css";
import { Pagination } from "../components";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [notificationTotal, setNotificationTotal] = useState(0);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Fetch notifications from the server
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/notifications?page=${page}&limit=${limit}`
        );
        setLimit(response.data.limit);
        setNotificationTotal(response.data.notificationsTotal);
        setNotifications(response.data.notifications);
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [limit, page]);

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
      <Pagination
        page={page}
        limit={limit ? limit : 0}
        total={notificationTotal ? notificationTotal : 0}
        setPage={(page) => setPage(page)}
        style={{ padding: "3rem" }}
      />
    </div>
  );
}

export default Notifications;
