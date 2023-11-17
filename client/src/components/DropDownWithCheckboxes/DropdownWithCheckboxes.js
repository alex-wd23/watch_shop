import React from 'react';
import './DropdownWithCheckboxes.css';
import { useState } from 'react';

const DropdownWithCheckboxes = ({ title, options, selectedFilter, handleFilterChange,filters, value }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toCamelCase = (string) => {
      return string
        .toLowerCase()
        .split(' ')
        .map((word, index) => index === 0 ? word : word[0].toUpperCase() + word.slice(1))
        .join('');
    }
  
    const handleCheckboxChange = (option) => {
      const newSelections = selectedFilter.includes(option)
        ? selectedFilter.filter((selectedOption) => selectedOption !== option)
        : [...selectedFilter, option];
     

    //debug
    //console.log('Checkbox clicked:',option, ",",  'New Selections:', newSelections);

    handleFilterChange(toCamelCase(title), newSelections);
      
    };
    return (
      <div className="filter-group">
        <h2 onClick={() => setIsOpen(!isOpen)}>{title}</h2>
        {isOpen && (
          <div className="dropdown-content">
            {options.map((option) => (
              <label key={option} className="container">{option}
                <input type="checkbox" checked={selectedFilter.includes(option)} onChange={() => handleCheckboxChange(option)}/>
                <span className="checkmark"></span>
              </label>
            ))}
          </div>
      
        )}
      </div>
    );
  };

export default DropdownWithCheckboxes



