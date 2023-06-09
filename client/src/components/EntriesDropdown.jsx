const EntriesDropdown = ({
  options,
  option = "",
  setOption,
  title,
  class_name,
}) => {
  console.log("selected: ", option);
  const onChange = ({ currentTarget: select }) => {
    const state = select.value;
    setOption(state);
  };

  return (
    <select className={class_name} value={option} onChange={onChange}>
      <option value="">{title}</option>
      {options.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default EntriesDropdown;
