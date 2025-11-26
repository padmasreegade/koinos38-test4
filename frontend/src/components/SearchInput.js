import React, {useState} from "react";
import '../styles.css';

const SearchInput = ({onSearch, placeholder = "Search items...", disabled = false}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = () => {
        onSearch(searchTerm);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (<div className='search-container'>
        <div className='search-wrapper'>
            <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                aria-label='Search items'
                className='search-input'
            />
        </div>
        <button
            onClick={handleSearch}
            disabled={disabled}
            aria-label='Search'
            className='search-button'
            type='button'
        >
            <svg className='search-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}/>
            </svg>
        </button>
        {/*Clear Button*/}
        {searchTerm && (<button
            onClick={handleClear}
            aria-label='Clear Search'
            className='search-clear'
        >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}/>
            </svg>
        </button>)}
    </div>);
};

export default SearchInput;