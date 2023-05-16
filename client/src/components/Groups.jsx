const Groups = ({ groups, filterGroup = "", setFilterGroup }) => {
    const onChange = ({ currentTarget: select }) => {
        const state = select.value;
        setFilterGroup(state);
    };

    return (
        <select className="species-filter-dropdown"
            value={filterGroup}
            onChange={onChange}
        >
            <option value="">Group</option>
            {groups.map((group, index) => (
                <option key={index} value={group}>
                    {group}
                </option>
            ))}
        </select>
    );
};

export default Groups;