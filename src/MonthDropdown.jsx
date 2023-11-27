import React from 'react';

const MonthDropdown = ({ selectedMonth, onChange }) => {
  return (
    <div>
      <label>Month</label>
      <select value={selectedMonth} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select Month</option>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="Jun">Jun</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="=December">December</option>
        {/* Add more months as needed */}
      </select>
    </div>
  );
};

export default MonthDropdown;
