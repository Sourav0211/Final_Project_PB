
import React, { useState, useEffect } from "react";
import { Bar , Line } from 'react-chartjs-2'; // Import Bar from react-chartjs-2
import './Dashboard.css';
import Menu from "../Menu/Menu.jsx";
import Popup from "./Popup";
import Chart from 'chart.js/auto';
import MonthDropdown from "./MonthDropdown";
import Table from "./Table.jsx";
import DoughnutChart from "./Doughnut-Chart.jsx";
import LineChart from "./LineChart.jsx";
import CategoryDropdown from "./CategoryDropdown.jsx";

const Dashboard = ({ authUser , userSignOut}) => {

  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [budgetData, setBudgetData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [timeoutPopup, setTimeoutPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [newExpense, setNewExpense] = useState("");
  const [month, setMonth] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableData , setTableData] =useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const timeoutDuration = 5 * 50 * 1000;
  const userUID = authUser.uid;

  const apiUrl = "http://localhost:3001/api/budget";


//Fecthing data for bar chart
  useEffect(() => {
    const fetchDataAndSetChart = async () => {
      try {
        const response = await fetch(`${apiUrl}/${userUID}`);
        const data = await response.json();
  
        if (response.ok) {
    
          setBudgetData(data.data);
  
          if (selectedMonth) {
            
            const filteredData = data.data.filter(item => item.month === selectedMonth);
            setChartData(prepareChartData(filteredData));
            setTableData(filteredData);
          } else {
            
            setChartData(prepareChartData(data.data));
            setTableData(data.data);
          }
        } else {
          console.error("Error fetching budget data");
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };
  
    fetchDataAndSetChart();
  }, [userUID, selectedMonth]);
  




  
  
  
  







  const createBudget = async () => {
    try {
      // Validate that required fields are not empty
      if (!month || !newCategory || !newBudget || !newExpense) {
        console.error("Please fill in all required fields");
        return;
      }
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userUID,
          month,
          category: newCategory,
          value: Number(newBudget),
          value2: Number(newExpense),
        }),
      });
  
      if (response.ok) {
        setNewCategory("");
        setNewBudget("");
        setNewExpense("");
        setTimeoutPopup(false);

      } else {
        console.error("Error adding budget");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };
  


  //Creating Bar Chart to Display Input Data 
  const prepareChartData = (data) => {
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return { labels: [], datasets: [] };
    }
  
    const filteredData = data.filter((item) => item.month === selectedMonth);
  
    return {
      labels: filteredData.map((item) => item.category),
      datasets: [
        {
          label: 'Budget Amount',
          backgroundColor: '#4bc0c066',
          borderColor: '#4bc0c0',
          borderWidth: 1,
          hoverBackgroundColor: '#4bc0c099',
          hoverBorderColor: '#4bc0c0',
          data: filteredData.map((item) => item.value),
        },
        {
          label: 'Expense Amount',
          backgroundColor: '#ff638466',
          borderColor: '#ff6384',
          borderWidth: 1,
          hoverBackgroundColor: '#ff638499',
          hoverBorderColor: '#ff6384',
          data: filteredData.map((item) => item.value2),
        },
      ],
    };
  };




  const handleDeleteBudgetItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/budget/${userUID}/${itemId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const updatedTableData = tableData.filter(item => item.id !== itemId);
        setTableData(updatedTableData);
        // If the delete request is successful, update the state or refetch data
        // For example, refetch the data to update the table and chart
        // fetchDataAndSetChart();
        if (setChartData) {
          const filteredChartData = updatedTableData.filter(item => item.month === selectedMonth);
          const newChartData = prepareChartData(filteredChartData);
          setChartData(newChartData);
        }
        
      } else {
        console.error('Error deleting budget item');
      }
    } catch (error) {
      console.error('Error deleting budget item:', error);
    }
  };



  useEffect(() => {
    setChartData(prepareChartData(budgetData));
  }, [budgetData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Show the popup before the session times out
      setTimeoutPopup(true);
    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [budgetData]);


  const handleReloadSession = () => {
    // Reload the session or perform any other necessary actions
    window.location.reload();
  };

// for table
  const toggleTable = () => {
    setShowTable(!showTable);
    // Fetch and set the table data when showing the table
    // if (!showTable) {
    //   createBudget();
    // }
  };  

// for Insights
  const toggleInsights = () => {
    setShowInsights(!showInsights);
  };




  return (
    <div className='Dashboard-Display'>
      <div>
        <Menu userSignOut={userSignOut} showInsights={toggleInsights} />
      </div>
      <div className="Logo">
      <h2>Welcome to your Dashboard! {authUser.email} </h2>
      </div>
      <div>
        {timeoutPopup && <Popup onReloadSession={handleReloadSession} />}
      </div>
  
      <div className="Col-View">
        
        
        
        <div className='Put-Budget'>
        <label>Month</label>

        {/* <input placeholder="Put Month eg.January,February" value={month} onChange={(e) => setMonth(e.target.value)}></input> */}
        <MonthDropdown selectedMonth={month} onChange={setMonth} />
        <label>Category</label>

        {/* <input placeholder="put your category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}></input> */}
        <CategoryDropdown selectedCategory= {newCategory} onChange = {setNewCategory}/>
        <label>Budget</label>

        <input type="number" placeholder="put your budget amount" value={newBudget} onChange={(e) => setNewBudget(e.target.value)}></input>
        <label>Expense</label>

        <input type="number" placeholder="put your Expense amount" value={newExpense} onChange={(e) => setNewExpense(e.target.value)}></input>
        <button onClick={createBudget}>Enter</button>

        </div>




        <div className='doughnut-chart'>
          <DoughnutChart userUID={userUID} />
        </div>
      </div>
  
      {!showInsights ? (
        <div className='insights-section'>
          <div >
            <LineChart userUID={userUID} />
          </div>
        </div>
      ) : (
        <div className='insights-section'>
          <div className='bar-chart'>
            <MonthDropdown selectedMonth={selectedMonth} onChange={setSelectedMonth}></MonthDropdown>
            {Object.keys(chartData).length > 0 && <Bar data={chartData} options={{}} />}
            <button onClick={toggleTable}>{showTable ? 'Hide Table' : 'Show Table'}</button>
          </div>
          <div> {showTable && <Table tableData={tableData} selectedMonth={selectedMonth} userUID={userUID} setTableData={setTableData} />} </div>
        </div>
      )}

      <div id="about" className='About-Section'>
        {/* Content for the About section goes here */}
        <div>
        <p>The Personal Budget Tracker app is a comprehensive financial management tool designed to help users monitor and analyze their budget and expenses. The app offers four key visualizations to provide users with insightful data:</p>
        <p>-Doughnut Chart: Displays a summary of total budget and expenses per category.</p>
        <p>-Line Chart: Illustrates variations in budget and expenses over different months.</p>
        <p>-Bar Chart:  Highlights variations in budget and expenses for a selected month.</p>
        <p>-Table: Presents a detailed list of categories, including budget and expense data, for the selected month.Enables users to delete specific categories, offering flexibility in budget adjustments.Includes an option to download the entire category list for the month as an Excel file, enhancing data accessibility and record-keeping.</p>
        </div>
      </div>

      {/* Footer */}
      <div className='Footer'>
        <p>&copy; 2023 Personal Budget Tracker. All rights reserved. Sourav Shrikant Shetye</p>
      </div>
    </div>
  );
  
};

export default Dashboard;
