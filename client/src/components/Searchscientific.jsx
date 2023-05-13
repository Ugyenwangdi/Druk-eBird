import React from "react";

const Searchscientific = ({ setSearchscientific }) => {
  return (
    <input
      type="text"
      placeholder="Enter scientific name"
      onChange={({ currentTarget: input }) => setSearchscientific(input.value)}
    />
  );
};

export default Searchscientific;
