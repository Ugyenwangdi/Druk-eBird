import React from "react";

const Searchspecies = ({ setSearchspecies }) => {
  return (
    <input
      type="text"
      placeholder="Enter species name"
      onChange={({ currentTarget: input }) => setSearchspecies(input.value)}
    />
  );
};

export default Searchspecies;
