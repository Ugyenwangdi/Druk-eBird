import React, { useState } from "react";

const SearchBar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="Search-bar">
      <div className="Search-bar-input">
        <input type="text" placeholder="Search..." />
        <div className="Search-bar-icon" onClick={toggleDropdown}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {dropdownVisible && (
          <div className="dropdown-menu">
            <select>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
              <option value="Option 3">Option 3</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
