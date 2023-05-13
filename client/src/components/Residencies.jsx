const Residencies = ({ residencies, filterResidency = "", setFilterResidency }) => {
    const onChange = ({ currentTarget: select }) => {
        const state = select.value;
        setFilterResidency(state);
    };

    return (
        <select className="species-filter-dropdown"
            value={filterResidency}
            onChange={onChange}
        >
            <option value="">Residency</option>
            {residencies.map((residency, index) => (
                <option key={index} value={residency}>
                    {residency}
                </option>
            ))}
        </select>
    );
};

export default Residencies;