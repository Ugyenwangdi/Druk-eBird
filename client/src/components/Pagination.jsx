import React from "react";
import "../styles/pagination.css";

const Pagination = ({ page, total, limit, setPage }) => {
  const totalPages = Math.ceil(total / limit);

  const onClick = (newPage) => {
    setPage(newPage + 1);
  };

  return (
    <div className="pagination_container">
      {totalPages > 0 &&
        [...Array(totalPages)].map((val, index) => (
          <button
            onClick={() => onClick(index)}
            className={
              page === index + 1
                ? `pagination_page_btn active`
                : "pagination_page_btn"
            }
            key={index}
          >
            {index + 1}
          </button>
        ))}
    </div>
  );
};

export default Pagination;
