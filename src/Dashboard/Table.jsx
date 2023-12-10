// Table.jsx
import { reload } from 'firebase/auth';
import React from 'react';
import { useState } from 'react';
// import { utils as XLSXUtils, writeFile } from 'xlsx';
import {utils as XLSXUtils, writeFileXLSX} from 'xlsx';




const Table = ({ tableData, selectedMonth ,userUID , setTableData }) => {
  const [showTable, setShowTable] = useState(false);

    const handleDownloadExcel = () => {

        var wb = XLSXUtils.book_new(),
         ws = XLSXUtils.json_to_sheet(tableData);
        XLSXUtils.book_append_sheet(wb, ws, `My_Accounts_${selectedMonth}`);
        writeFileXLSX(wb, `UsersData_${selectedMonth}.xlsx`);
      };
    
      const handleDeleteBudgetItem = async (itemId) => {
        try {
          const response = await fetch(`http://167.99.56.233/api/budget/${userUID}/${itemId}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            const updatedTableData = tableData.filter(item => item.id !== itemId);
            setTableData(updatedTableData);
            // fetchDataAndSetChart()
            
          } else {
            console.error('Error deleting budget item');
          }
        } catch (error) {
          console.error('Error deleting budget item:', error);
        }
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
                  <td>
                  <button onClick={() => handleDeleteBudgetItem(item.id)}>Delete</button>
                 </td>
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
