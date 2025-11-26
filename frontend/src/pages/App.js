import React from 'react';
import {Link, Route, Routes} from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import {DataProvider} from '../state/DataContext';
import ErrorBoundary from "../components/ErrorBoundary";
import '../styles.css'

function App() {
    return (<ErrorBoundary>
        <DataProvider>
            <nav className="nav">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        Koinos Items
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">
                            Items
                        </Link>
                    </div>
                </div>
            </nav>
            <main role="main">
                <Routes>
                    <Route path="/" element={<Items />}/>
                    <Route path="/items/:id" element={<ItemDetail />}/>
                </Routes>
            </main>
            <footer className="footer">
                <div className="footer-content">
                Koinos Items Catalog.
                </div>
            </footer>
        </DataProvider>
    </ErrorBoundary>);
}

export default App;