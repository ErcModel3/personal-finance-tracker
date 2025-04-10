import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, placeholder, name, value, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || '');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    
    // Create a synthetic event object to simulate input onChange
    const syntheticEvent = {
      target: {
        name: name,
        value: option
      }
    };
    
    if (onChange) {
      onChange(syntheticEvent);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`custom-dropdown-container ${isOpen ? 'open' : ''}`}
    >
      <div 
        className="custom-dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`selected-option ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption || placeholder || 'Select an option'}
        </span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <div className="dropdown-options-container">
          <div className="dropdown-options">
            {options.map((option, index) => (
              <div 
                key={index} 
                className={`dropdown-option ${option === selectedOption ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={selectedOption} 
        required={required}
      />
    </div>
  );
};

export default CustomDropdown;