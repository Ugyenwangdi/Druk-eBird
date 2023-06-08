const Dropdown = ({ options, option = "", setOption, title }) => {
  console.log("selected: ", option);
  const onChange = ({ currentTarget: select }) => {
    const state = select.value;
    setOption(state);
  };

  return (
    <select
      className="species-filter-dropdown"
      value={option}
      onChange={onChange}
    >
      <option value="">{title}</option>
      {options.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
