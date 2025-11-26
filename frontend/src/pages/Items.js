import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import '../styles.css';
import {useData} from "../state/DataContext";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import SearchInput from "../components/SearchInput";
import Pagination from "../components/Pagination";

const SimpleList = ({items}) => {
    // Validate the data before rendering on the window.
    if (!items || !Array.isArray(items) || items.length === 0) return (<div className='empty-list-message'>No items to
        Display</div>);

// Validate each item.
    const validItems = items.filter(item => item && typeof item === 'object' && item.hasOwnProperty('id') && item.hasOwnProperty('name'));

    if (validItems.length === 0) return (<div className='empty-list-message'>No valid items to display</div>);

    return (<div className='simple-items-list' role='list' aria-label='Items list'>
        {validItems.map((item, index) => (
            <SimpleItemRow key={item.id || index} item={item} />
        ))}
    </div>);
};

const SimpleItemRow = ({item}) => {
    if (!item || typeof item !== 'object') {
        return (<div className='item-row' role='listitem'>
            <div className='loading-placeholder'>Loading</div>
        </div>);
    }
    return (<div className='item-row' role='listitem'>
        <Link to={`/items/${item.id || ''}`}
              className='item-link'
              aria-label={`View details for ${item.name || 'Unknown item'}`}
        >
            {item.name || 'Unknown item'}
        </Link>
        <div className='item-meta'>
              <span className='item-price'>
                  ${(item.price || 0).toLocaleString()}
              </span>
            <span className='item-category'>
                          {item.category || 'None'}
                </span>
        </div>
    </div>);
};

function Items() {
    const {
        items, loading, error, pagination, fetchItems, searchItems, loadPage
    } = useData();

    const [hasInitialLoad, setHasInitialLoad] = useState(false);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        // Run initial fetch
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        // Initial load
        fetchItems(null)
            .then(() => setHasInitialLoad(true))
            .catch(error => {
                console.error('Fetch error:', error);
                hasFetchedRef.current = false;
            });
    }, [fetchItems]);

    const handleSearch = useCallback((query) => {
        searchItems(query);
    }, [searchItems]);

    const handlePageChange = useCallback((page) => {
        loadPage(page);
    }, [loadPage]);

    const handleRetry = () => {
        const abortController = new AbortController();
        fetchItems(abortController.signal);
    };

    // Loading state
    if (loading && !hasInitialLoad) {
        return (<div className='items-page'>
            <div style={{
            marginBottom: '20px',
                height: '48px',
                backgroundColor: '#f7fafc',
                borderRadius: '8px'
            }} />
            <LoadingSkeleton count={6}/>
        </div>);
    }

    // Error state
    if (error && !loading) {
        return (<div className='items-page'>
            <ErrorState
                error={error}
                onRetry={handleRetry}
                title='Failed to load items'
                description="We couldn't load the items list. Please try again."/>
        </div>);
    }

    // Empty state
    if (!loading && (!items || items.length === 0)) {
        return (<div className='items-page'>
            <SearchInput
                onSearch={handleSearch}
                placeholder='Search items by name, category, or price...'
                disabled={loading}
            />
            <div className='empty-state'>
                <div className='empty-icon'>
                    <h3 className='empty-title'>No items found</h3>
                    <p className='empty-message'>Try adjusting your search criteria or check back later.</p>
                </div>
            </div>
        </div>);
    }

    // Items list
    return (<div className='items-page'>
        <header>
            <h1>Items Catalog</h1>
            <p>Browse and search through our collection of items</p>
        </header>
        <SearchInput
            onSearch={handleSearch}
            placeholder='Search items by name, category, or price...'
            disabled={loading}
        />

        {/*Loading for next search*/}
        {loading && hasInitialLoad && (<div className='loading-indicator'>
            <div className='loading-spinner animate-spin'/>
            Loading...
        </div>)}

        <div className='item-list-container'>
            {hasInitialLoad && items && Array.isArray(items) && items.length > 0 ? (<SimpleList items={items}/>) : (
                <div className='empty-list-message'>
                    {loading ? 'Loading items...' : (hasInitialLoad ? 'No items to display' : 'Initializing...')}
                </div>)}
        </div>

        {/* Pagination */}
        {hasInitialLoad && items && items.length > 0 && (<Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            disabled={loading}
        />)}
    </div>);
}

export default Items;
