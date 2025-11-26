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
        <button
            onClick={handleSearch}
            disabled={disabled}
            aria-label='Search'
            className='search-button'
            type='button'
        >
            <svg className='search-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
        </button>
        {/*Clear Button*/}
        {searchTerm && (<button
            onClick={handleClear}
            aria-label='Clear Search'
            className='search-clear'
        >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>)}
        </div>
    </div>);
};

export default SearchInput;