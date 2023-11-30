// Table.jsx
import React from 'react';
import { useState } from 'react';
// import { utils as XLSXUtils, writeFile } from 'xlsx';
import {utils as XLSXUtils, writeFileXLSX} from 'xlsx';

const Table = ({ tableData, selectedMonth }) => {
  const [showTable, setShowTable] = useState(false);
    const handleDownloadExcel = () => {

        var wb = XLSXUtils.book_new(),
         ws = XLSXUtils.json_to_sheet(tableData);
        XLSXUtils.book_append_sheet(wb, ws, `My_Accounts_${selectedMonth}`);
        writeFileXLSX(wb, `UsersData_${selectedMonth}.xlsx`);
      };
    
         
  
    return (  
      <div className='Table-container' >
    <div className='Table-content'>

      {selectedMonth === "" ? (
        <div>Please Select a Month to Display</div>
      ) : (
        <div>
          <h3> Account for Month {selectedMonth} </h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Expense</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  {/* <td>{item.month}</td> */}
                  <td>{item.category}</td>
                  <td>{item.value}</td>
                  <td>{item.value2}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDownloadExcel}>Download as Excel</button>
        </div>
      )}
    </div>
    </div>  
    
    
  );
};

export default Table;
