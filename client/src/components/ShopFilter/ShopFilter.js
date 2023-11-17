import React, { useState } from 'react';
import './ShopFilter.css';
import DropdownWithCheckboxes from '../DropDownWithCheckboxes/DropdownWithCheckboxes.js';
import PriceRange from './PriceRange.js';
import axios from 'axios';

const ShopFilter = ({setDisplayedProducts}) => {
  const [filters, setFilters] = useState({
    beltMaterial: [],
    dialSize: [],
    mechanism: [],
    waterproof: [],
    specialFunctions: [],
    dialColor: [],
    braceletColor: [],
    priceRange1:[],
    priceRange2:[] 
  });

  const defaultFilters = {
    beltMaterial: [],
    dialSize: [],
    mechanism: [],
    waterproof: [],
    specialFunctions: [],
    dialColor: [],
    braceletColor: [],
    priceRange1: [],
    priceRange2: [] 
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
    
  };
  
      
  const applyFilters = async () => {
    try {
      const response = await axios.get("http://localhost:3001/filter", {
        params: filters
      });
      setDisplayedProducts(response.data);
      console.log(response.data)
      
    } catch (error) {
      console.error('Failed to fetch filtered products:', error);
    }
  }

  const resetFilters = async() => {
    setFilters(defaultFilters);
    try {
      const response = await axios.get("http://localhost:3001/products");
      setDisplayedProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  return (
    <div className="filter-sidebar">
      {/* Belt Material */}
      <DropdownWithCheckboxes
        title="Belt Material"
        options={['Natural skin', 'Stainless steel', 'Nylon']}
        selectedFilter={filters.beltMaterial}
        handleFilterChange={handleFilterChange}
      />

      {/* Dial Size */}
      <DropdownWithCheckboxes
        title="Dial Size"
        options={['36mm', '40mm', '42mm']}
        selectedFilter={filters.dialSize}
        handleFilterChange={handleFilterChange}
      />

      {/* Mechanism */}
      <DropdownWithCheckboxes
        title="Mechanism"
        options={['Mechanic', 'Quartz', 'Automatic']}
        selectedFilter={filters.mechanism}
        handleFilterChange={handleFilterChange}
      />

      {/* Waterproof */}
      <DropdownWithCheckboxes
        title="Waterproof"
        options={['30m', '50m', '100m']}
        selectedFilter={filters.waterproof}
        handleFilterChange={handleFilterChange}
      />

      {/* Special Functions */}
      <DropdownWithCheckboxes
        title="Special Functions"
        options={['Stopwatch', 'Date', 'Moon phase']}
        selectedFilter={filters.specialFunctions}
        handleFilterChange={handleFilterChange}
      />

      {/* Dial Color */}
      <DropdownWithCheckboxes
        title="Dial Color"
        options={['White', 'Black', 'Blue']}
        selectedFilter={filters.dialColor}
        handleFilterChange={handleFilterChange}
      />

      {/* Bracelet Color */}
      <DropdownWithCheckboxes
        title="Bracelet Color"
        options={['Silver', 'Gold', 'Black']}
        selectedFilter={filters.braceletColor}
        handleFilterChange={handleFilterChange}
      />
      {/* Price Range */}
      <PriceRange filters={filters} handleFilterChange={handleFilterChange}/>
      
      {/* Apply Filters Button */}
      <button className="button-87" onClick={() => applyFilters()}>Apply Filters</button>
      <button className="button-87" onClick={() => resetFilters()}>Reset Filters</button>
    </div>
  );
};

export default ShopFilter;