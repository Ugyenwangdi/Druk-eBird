const Iucnstatuses = ({ iucnstatuses, filterIucnstatus = "", setFilterIucnstatus }) => {
    const onChange = ({ currentTarget: select }) => {
        const state = select.value;
        setFilterIucnstatus(state);
    };

    return (
        <select className="species-filter-dropdown"
            value={filterIucnstatus}
            onChange={onChange}
        >
            <option value="">IUCN Status</option>
            {iucnstatuses.map((iucnstatus, index) => (
                <option key={index} value={iucnstatus}>
                    {iucnstatus}
                </option>
            ))}
        </select>
    );
};

export default Iucnstatuses;