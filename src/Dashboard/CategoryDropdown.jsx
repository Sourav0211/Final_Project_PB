import React from 'react';

const CategoryDropdown = ({ selectedCategory, onChange }) => {
  return (
    <div>
      {/* <label>Month</label> */}
      <select value={selectedCategory} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Groceries">Groceries</option>
        <option value="Car">Car</option>
        <option value="Rent">Rent</option>
        <option value="Utilities">Utilities</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Education">Education</option>
        <option value="Clothing">Clothing</option>
        <option value="Travel">Travel</option>
        <option value="Electronics">Electronics</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Miscellaneous">Miscellaneous</option>
        {/* Add more months as needed */}
      </select>
    </div>
  );
};

export default CategoryDropdown;
