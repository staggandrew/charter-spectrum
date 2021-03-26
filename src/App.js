import { useEffect, useState } from 'react';
import './App.css';
import SearchBox from './components/SearchBox';
import DropDown from './components/DropDown';
import PageSelector from './components/PageSelector';

const App = () => {
  const [originalData, setOriginalData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');

  const [pageNumber, setPageNumber] = useState(0);

  const [currentPageSize] = useState(10);

  const [states, setStates] = useState([]);
  const [genres, setGenres] = useState([]);

  const [stateFilter, setStateFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const [checked, setChecked] = useState(true);

  const [isAcending, setIsAcending] = useState(true);

  const loadData = async () => {
    const res = await fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: "Api-Key q3MNxtfep8Gt",
      }
    });

    const data = await res.json();

    setOriginalData(data);
  };

  // Init.
  useEffect(() => {
    loadData();
  }, []);

  // Process data for filters and sorting.
  useEffect(() => {
    let sortedResturants = originalData.sort((a, b) => a.name.localeCompare(b.name));

    let mappedGenres = originalData.map((r) => r.genre).sort((a, b) => a.localeCompare(b));
    let mappedStates = originalData.map((r) => r.state).sort((a, b) => a.localeCompare(b))

    mappedGenres.unshift('All');
    mappedStates.unshift('All');

    setGenres(getUniqueStringArray(mappedGenres));
    setStates(getUniqueStringArray(mappedStates));

    let pagedData = generatePages(sortedResturants);

    setDataToRender(pagedData);
  }, [originalData]);

  // Create the correct page size for rendering the table.
  const generatePages = (data) => {
    let i, j, pagedData = [], pageSize = currentPageSize;
    for (i = 0, j = data.length; i < j; i += pageSize) {
      pagedData.push(data.slice(i, i + pageSize));
    }

    if (pagedData.length === 1) {
      setPageNumber(0);
    }

    return pagedData;
  };

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
      });
    }
  };

  return (
    <div className="App">
      <h1 id="title">Resturants</h1>
      <div className="controlls">
        <SearchBox searchFilter={searchFilter} />
        <div>
          <input onClick={onFilterCheckboxChange} checked={checked} type="checkbox" />
          <span>Use Filters</span>
        </div>
        <DropDown name={"state"} data={states} currerntValue={stateFilter} onChange={onStateFilterChange} />
        <DropDown name={"genre"} data={genres} currerntValue={genreFilter} onChange={onGenreFilterChange} />
      </div>

      {dataToRender.length !== 0 ? (
        <table id="resturants">
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

      <PageSelector
        onPageLeftClick={onPageLeftClick}
        onPageRightClick={onPageRightClick}
        pageNumber={pageNumber}
        pageCount={dataToRender.length}
      />
    </div>
  );
}

export default App;
