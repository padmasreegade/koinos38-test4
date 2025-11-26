import React, {createContext, useCallback, useContext, useState} from 'react';

const DataContext = createContext();

export function DataProvider({children}) {
    const defaultPagination = {
        currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false, totalItems: 0, itemsPerPage: 10
    };
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = useCallback(async (signal, options = {}) => {
        const {page = 1, limit = 10, q = ''} = options;
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: String(page), limit: String(limit),
            });
            if (q) params.append('q', q);
            const fetchOptions = signal ? {signal} : {};
            const res = await fetch(`http://localhost:3001/api/items?${params}`, fetchOptions);

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const json = await res.json();
            setItems(json.items || []);
            setPagination(json.pagination || defaultPagination);
            setSearchQuery(json.searchQuery || '');

            return json;

        } catch (error) {
            if (error.name !== 'AbortError') {
                setError(error.message);
                console.error('Fetch Error', error);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchItems = useCallback((query) => {
        return fetchItems(null, {q: query, page: 1});
    }, [fetchItems]);

    const loadPage = useCallback((page) => {
        return fetchItems(null, {page, q: searchQuery});
    }, [fetchItems, searchQuery]);

    return (<DataContext.Provider
        value={{
            items, pagination, searchQuery, loading, error, fetchItems, searchItems, loadPage
        }}
    >
        {children}
    </DataContext.Provider>);
}

export const useData = () => useContext(DataContext);
