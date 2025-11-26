import React from "react";
import '../styles.css';

const SkeletonItem = () => (<div className='skeleton-item animate-pulse'>
    <div className='skeleton-text title'/>
    <div className='skeleton-meta'>
        <div className='skeleton-text price'/>
        <div className='skeleton-text category'/>
    </div>
</div>);
const LoadingSkeleton = ({count = 6}) => {
    return (<div className='skeleton-container'>
        {Array.from({length: count}, (_, index) => (<SkeletonItem key={index}/>))}
    </div>);
};

export default LoadingSkeleton;