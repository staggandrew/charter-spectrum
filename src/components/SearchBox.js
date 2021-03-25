import '../App.css';
import { useEffect, useState } from 'react';

const SearchBox = (props) => {


    return (
        <div>
            <span>Search: </span>
            <input type="text" placeholder="Search..." onChange={(e) => props.searchFilter(e)} />
        </div>
    )


}

export default SearchBox;