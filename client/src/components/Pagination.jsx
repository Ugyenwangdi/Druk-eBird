// import React from "react";
// import "../styles/pagination.css";

// const Pagination = ({ page, total, limit, setPage }) => {
//   const totalPages = Math.ceil(total / limit);

//   const onClick = (newPage) => {
//     setPage(newPage + 1);
//   };
  
//   return (
//     <div className="pagination_container">
//       {totalPages > 0 &&
//         [...Array(totalPages)].map((val, index) => (
//           <button
//             onClick={() => onClick(index)}
//             className={
//               page === index + 1
//                 ? `pagination_page_btn active`
//                 : "pagination_page_btn"
//             }
//             key={index}
//           >
//             {index + 1}
//           </button>
//         ))}
//     </div>
//   );
// };

// export default Pagination;

import React from "react";
import "../styles/pagination.css";

const Pagination = ({ page, total, limit, setPage }) => {
  const totalPages = Math.ceil(total / limit);

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleNextClick = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const renderPageButtons = () => {
    const maxDisplayedPages = Math.min(totalPages, 5);
    const pageButtons = [];
  
    let startPage = Math.max(1, page - 2); // Adjust the starting page based on the current page
    let endPage = startPage + maxDisplayedPages - 1;
  
    // If the end page exceeds the total pages, adjust the range accordingly
    if (endPage > totalPages) {
      startPage = Math.max(1, totalPages - maxDisplayedPages + 1);
      endPage = totalPages;
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={page === i ? "pagination_page_btn active" : "pagination_page_btn"}
        >
          {i}
        </button>
      );
    }
  
    return pageButtons;
  };
  

  return (
    <div className="pagination_container">
      {page > 1 && (
        <button onClick={handlePrevClick} className="pagination_page_btn" style={{backgroundColor: '#136d66', color:'white', width:'4rem'}}>
          Prev
        </button>
      )}
      {renderPageButtons()}
      {page < totalPages && (
        <button onClick={handleNextClick} className="pagination_page_btn" style={{backgroundColor: '#136d66', color:'white', width:'4rem'}}>
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;

