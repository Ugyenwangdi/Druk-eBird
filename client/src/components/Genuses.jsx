const Genuses = ({ genuses, filterGenus = "", setFilterGenus }) => {
    const onChange = ({ currentTarget: select }) => {
        const state = select.value;
        setFilterGenus(state);
    };

    return (
        <select className="species-filter-dropdown"
            value={filterGenus}
            onChange={onChange}
        >
            <option value="">Genus</option>
            {genuses.map((genus, index) => (
                <option key={index} value={genus}>
                    {genus}
                </option>
            ))}
        </select>
    );
};

export default Genuses;