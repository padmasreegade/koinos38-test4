# Take‑Home Assessment Solution

## Overview

This solution addresses all the requirements mentioned in the README.

### 🔧 Backend (Node.js)

1. **Refactor blocking I/O**
    - Converted to `fs.promises.readFile()` with proper async/await patterns.
    - Updated all three route handlers to async functions.
    - Replaced `fs.writeFileSync()` with `fs.promises.writeFile`.
    - Modified all other component and pages to accommodate these changes
    - This improves server responsiveness under load and provides better error handling but the error handling logic itself becomes complex.

2. **Performance**
    - Implemented in-memory-caching with automatic cache refresh.
    - Consumed `fs.watchFile()` to invalidate cache when data in the file changes.
    - Cache expires after 1min as a fallback safety mechanism.
    - Instant improvement in response tme, automatic update on change and significant CPU and I/O operation reduction are the benefits.
    - Additional memory used for cache storage, added complexity of file watching are the problems.

3. **Testing**
    - Added tests covering all three routes and one integration test as well.
    - CRUD operation, search functionality test, pagination, error handling and data validation scenarios are covered.

### 💻 Frontend (React)

1. **Memory Leak**
    - `fetchItems()` continued even after component unmount causing setState on unmounted component.
    - Implemented AbortController for request cancellation and added proper cleanup in `useEffect()`.
    - Enhanced error handling to handle `AbortError`.
    - Eliminates memory leaks with better user experience while adds complexity to component lifecycle management.

2. **Pagination & Search**
    - Enhanced backend API to handle page, limit, q parameters.
    - Added pagination metadata in response and improved search to work across name, category and price.
    - Created reusable SearchInput, Pagination components to handle this effectively.
    - Updated `DataContext` to handle search and paginations states.

3. **Performance**
    - Integrated `react-window` for efficient list handling, custom `ItemRow` component for virtualized items and fixed item height for optimal performance.
    - Handles large number of items smoothly, without performance degradation using consistent memory. However, adding a dependency slightly increases the complexity.

4. **UI/UX Polish**
    - Skeleton animations and loading indicators.
    - Better Error Handling.
    - Improved Search Experience.
    - Responsive Design - mobile-optimized using CSS media queries.
    - Styling and Accessibility