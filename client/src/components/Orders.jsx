const Orders = ({ orders, filterOrder = "", setFilterOrder }) => {
  const onChange = ({ currentTarget: select }) => {
    const state = select.value;
    setFilterOrder(state);
  };

  return (
    <select
      className="species-filter-dropdown"
      value={filterOrder}
      onChange={onChange}
    >
      <option value="">Order</option>
      {orders.map((order, index) => (
        <option key={index} value={order}>
          {order}
        </option>
      ))}
    </select>
  );
};

export default Orders;
