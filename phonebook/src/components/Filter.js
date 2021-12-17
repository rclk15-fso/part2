const Filter = ({searchedName, handleSearchChange}) => {
  return (
    <label>
      {`Filter shown with: `}
      <input value={searchedName} onChange={handleSearchChange} />
    </label>
  );
};

export default Filter;