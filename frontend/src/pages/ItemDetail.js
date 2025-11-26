import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import '../styles.css';
import ErrorState from "../components/ErrorState";

function ItemDetail() {
    const {id} = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchItem = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3001/api/item/${id}`);

            if (!response.ok) {
                if (response.status === 404) throw new Error('Item not found');
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItem(data);
        } catch (e) {
            setError(e.message);
            console.error('Error fetching item');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchItem();
    }, [id]);

    if (loading) {
        return (<div className='item-detail-page'>
            <div className='item-detail-div-outer'/>
            <div className='item-detail-div-inner'/>
        </div>);
    }

    if (error) {
        return (<div className='item-detail-page'>
            <ErrorState
                error={error}
                onRetry={fetchItem}
                title={error.includes('not found') ? 'Item not found' : 'Failed to load item'}
                description={error
                    .includes('not found') ? "The item you're looking for doesn't exist or may have been removed" : "We couldn't load the item details. Please try again."}
            />
        </div>);
    }

    if (!item) return null;

    return (<div className='item-detail-page'>
        <nav className='breadcrumb' aria-label='Breadcrumb'>
            <Link to='/' className='breadcrumb-link'>
                ← Back to Items
            </Link>
        </nav>

        <article className='item-detail-card'>
            <header className='item-detail-header'>
                <h1 className='item-detail-title'>
                    {item.name}
                </h1>
                <div className='item-detail-meta'>
                      <span className='item-detail-price'>
                          ${item.price.toLocaleString()}
                      </span>
                    <span className='item-detail-category'>
                          ${item.category}
                      </span>
                </div>
            </header>

            {/* Item Details */}
            <div className='item-detail-info'>
                <div className='item-info-section'>
                    <h3 className='item-info-title'>
                        Item Information
                    </h3>

                    <dl className='item-info-list'>
                        <dt>ID:</dt>
                        <dd className='mono'>{item.id}</dd>

                        <dt>Name:</dt>
                        <dd>{item.name}</dd>

                        <dt>Category:</dt>
                        <dd>{item.category}</dd>

                        <dt>Price:</dt>
                        <dd>{item.price.toLocaleString()}</dd>
                    </dl>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='item-actions'>
                <button
                    onClick={() => navigate('/')}
                    className='btn btn-primary'>
                    Browse more items
                </button>
                <button
                    onClick={() => window.history.back()}
                    className='btn btn-secondary'>
                    Go Back
                </button>
            </div>

        </article>
    </div>);
}

export default ItemDetail;