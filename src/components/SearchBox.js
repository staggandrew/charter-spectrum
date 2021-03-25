import '../App.css';

const SearchBox = ({ searchFilter }) => {
  return (
    <div>
      <span>Search: </span>
      <input type="text" placeholder="Search..." onChange={(e) => searchFilter(e)} />
    </div>
  )
};

export default SearchBox;