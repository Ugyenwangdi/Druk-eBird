import React from "react";

const Search = ({ setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Enter bird name"
      onChange={({ currentTarget: input }) => setSearch(input.value)}
    />
  );
};

export default Search;
