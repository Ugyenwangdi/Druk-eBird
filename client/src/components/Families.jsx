const Families = ({ families, filterFamily = "", setFilterFamily }) => {
    const onChange = ({ currentTarget: select }) => {
        const state = select.value;
        setFilterFamily(state);
    };

    return (
        <select className="species-filter-dropdown"
            value={filterFamily}
            onChange={onChange}
        >
            <option value="">Family</option>
            {families.map((family, index) => (
                <option key={index} value={family}>
                    {family}
                </option>
            ))}
        </select>
    );
};

export default Families;
