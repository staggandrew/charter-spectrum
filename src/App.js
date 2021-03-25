import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [originalData, setOriginalData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');

  const [pageNumber, setPageNumber] = useState(0);

  const [states, setStates] = useState([]);
  const [genres, setGenres] = useState([]);

  const [stateFilter, setStateFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const [checked, setChecked] = useState(true);

  const loadData = async () => {
    const res = await fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: "Api-Key q3MNxtfep8Gt",
      }
    });

    const data = await res.json();

    let sortedResturants = data.sort((a, b) => a.name.localeCompare(b.name));

    let mappedGenres = data.map((r) => r.genre).sort((a, b) => a.localeCompare(b));
    let mappedStates = data.map((r) => r.state).sort((a, b) => a.localeCompare(b))

    mappedGenres.unshift('All');
    mappedStates.unshift('All');

    setGenres(getUniqueStringArray(mappedGenres));
    setStates(getUniqueStringArray(mappedStates));

    let pagedData = generatePages(sortedResturants);

    setOriginalData(data);
    setDataToRender(pagedData);
  }

  // Init.
  useEffect(() => {
    loadData();
  }, []);

  // Create the correct page size for rendering the table.
  const generatePages = (data) => {
    let i, j, pagedData = [], pageSize = 4;
    for (i = 0, j = data.length; i < j; i += pageSize) {
      pagedData.push(data.slice(i, i + pageSize));
    }

    if (pagedData.length === 1) {
      setPageNumber(0);
    }

    return pagedData;
  }

  // All filters being processed here.
  useEffect(() => {
    let newData = originalData;

    if (checked) {
      newData = newData.filter(item => {
        if (!stateFilter || stateFilter === 'All') return true
        if (item.state === stateFilter) {
          return true
        }
      });

      newData = newData.filter(item => {
        if (!genreFilter || genreFilter === 'All') return true
        if (item.genre === genreFilter) {
          return true
        }
      });
    }

    // Filter for the search box.
    newData = newData.filter(item => {
      if (!searchPhrase) return true
      if (item.name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
        item.city.toLowerCase().includes(searchPhrase.toLowerCase()) ||
        item.genre.toLowerCase().includes(searchPhrase.toLowerCase())
      ) {
        return item
      }
    });

    let pagedData = generatePages(newData);

    setDataToRender(pagedData);
  }, [stateFilter, genreFilter, checked, searchPhrase]);

  // Ensure unique data in string array.
  const getUniqueStringArray = (d) => {
    let uniqueChars = [...new Set(d)];
    return uniqueChars;
  };

  const onStateFilterChange = (e) => {
    setStateFilter(e.currentTarget.value);
  };

  const onGenreFilterChange = (e) => {
    setGenreFilter(e.currentTarget.value);
  };

  const onFilterCheckboxChange = () => {
    setChecked(!checked);
  };

  const onPageRightClick = () => {
    let newPageNumber = pageNumber + 1;
    if (pageNumber < dataToRender.length - 1) {
      setPageNumber(newPageNumber);
    }
  };

  const onPageLeftClick = () => {
    let newPageNumber = pageNumber - 1;
    if (pageNumber > 0) {
      setPageNumber(newPageNumber);
    }
  };

  const searchFilter = (e) => {
    let keyword = e.target.value;
    setSearchPhrase(keyword);
  };

  // Render the table row with the resturant data.
  const renderData = (data, index) => {
    if (data[index]) {
      return data[index].map((r) => {
        return (
          <tr key={r.id}>
            <td>{r.name}</td>
            <td>{r.city}</td>
            <td>{r.state}</td>
            <td>{r.telephone}</td>
            <td>{r.genre}</td>
          </tr>
        )
      })
    }
  };

  return (
    <div className="App">
      <h1 id='title'>Resturants</h1>
      <div className="controlls">
        <div>
          <span>Search: </span>
          <input type="text" placeholder="Search..." onChange={(e) => searchFilter(e)} />
        </div>
        <div>
          <input onClick={onFilterCheckboxChange} checked={checked} type="checkbox" />
          <span>Use Filters</span>
        </div>
        <div>
          <span>State: </span>
          <select value={stateFilter} name="state" onChange={onStateFilterChange}>
            {
              states.map((state) => {
                return (
                  <option value={state}>{state}</option>
                )
              })
            }
          </select>
        </div>
        <div>
          <span>Genre: </span>
          <select value={genreFilter} name="genre" onChange={onGenreFilterChange}>
            {
              genres.map((genre) => {
                return (
                  <option value={genre}>{genre}</option>
                )
              })
            }
          </select>
        </div>

      </div>

      {dataToRender.length !== 0 ? (
        <table id='resturants'>
          <tbody>
            <tr>
              <th>name</th>
              <th>city</th>
              <th>state</th>
              <th>telephone</th>
              <th>genre</th>
            </tr>
            {renderData(dataToRender, pageNumber)}
          </tbody>
        </table>
      ) : <h1>Nothing to render.</h1>}

      <div className="pagination">
        <span className="left" onClick={onPageLeftClick} >&laquo;</span>
        <span className="right" onClick={onPageRightClick} >&raquo;</span>
      </div>
      <span>Page {pageNumber + 1} of {dataToRender.length}</span>
    </div>
  );
}

export default App;
