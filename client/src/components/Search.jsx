import React from "react";

const Search = ({ setSearch, placeholder }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={({ currentTarget: input }) => setSearch(input.value)}
      style={{ "::placeholder": { color: "black" } }}
    />
  );
};

export default Search;
