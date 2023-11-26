import {React, useState} from 'react'

const PriceRange = ({filters, handleFilterChange}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
        <div className='priceRange'>
        <h2 style={{color: 'white', cursor: "pointer", fontSize: '1.2rem'}}onClick={() => setIsOpen(!isOpen)}>Price Range</h2>
        { isOpen && (
        <>
        <input
        type="range"
        min="0"
        max="500"
        value={filters.priceRange1}
        onChange={(e) => handleFilterChange('priceRange1', e.target.value)}
        />
        <input
        type="range"
        min="0"
        max="500"
        value={filters.priceRange2}
        onChange={(e) => handleFilterChange('priceRange2', e.target.value)}
        />
        <span>${filters.priceRange1}</span> - <span>${filters.priceRange2}</span>
        </>
        )}
    </div>
  )
}

export default PriceRange