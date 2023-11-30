
import React, { useState, useEffect } from "react";
import { Bar , Line ,Doughnut} from 'react-chartjs-2'; // Import Bar from react-chartjs-2
import './Dashboard.css';
import Menu from "../Menu/Menu.jsx";
import Popup from "./Popup";
import Chart from 'chart.js/auto';
import MonthDropdown from "./MonthDropdown";
import Table from "./Table.jsx";
const Dashboard = ({ authUser , userSignOut}) => {

  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [budgetData, setBudgetData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [timeoutPopup, setTimeoutPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [newExpense, setNewExpense] = useState([]);
  const [lineChartData, setlineChartData] = useState({});
 const [chartOptionsLine, setChartOptionsLine] = useState({});
  const [month, setMonth] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableData , setTableData] =useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [doughnutChartData, setDoughnutChartData] = useState({});
  const [chartOptionsDoughnut, setChartOptionsDoughnut] = useState({});

  const timeoutDuration = 5 * 50 * 1000;
  const userUID = authUser.uid;

  const apiUrl = "http://localhost:3001/api/budget";


// fecthig data for doughnut chart
  useEffect(() => {
    const fetchDoughnutChartData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/linechart/${userUID}`);
        const doughnutChartData = await response.json();

        if (response.ok) {
          console.log('Doughnut chart data fetched:', doughnutChartData);
          const { data, options } = prepareDoughnutChartData(doughnutChartData.data);
          console.log('Processed Doughnut chart data:', { data, options });
          setDoughnutChartData(data);
          setChartOptionsDoughnut(options);
        } else {
          console.error("Error fetching doughnut chart data");
        }
      } catch (error) {
        console.error("Error fetching doughnut chart data:", error);
      }
    };

    fetchDoughnutChartData();
  }, [userUID]);

// Fecthing Data for linechart
useEffect(() => {
  const fetchLineChartData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/linechart/${userUID}`);
      const lineChartData = await response.json();

      if (response.ok) {
        console.log('Linechart data fetched:', lineChartData);
        const { data, options } = prepareLineChartData(lineChartData.data);
        console.log('Processed Linechart data:', { data, options });
        setlineChartData(data);
        setChartOptionsLine(options);
      } else {
        console.error("Error fetching linechart data");
      }
    } catch (error) {
      console.error("Error fetching linechart data:", error);
    }
  };

  fetchLineChartData();
}, [userUID]);



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
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userUID,
          month: month,
          category: newCategory,
          value: Number(newBudget),
          value2: Number(newExpense)

        }),
      });

      if (response.ok) {
        setNewCategory("");
        setNewBudget(0);
        setNewExpense(0)
        setTimeoutPopup(false);
      } else {
        console.error("Error adding budget");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
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



  // To display line chart
  const prepareLineChartData = (lineChartData) => {
    // Extract unique months from lineChartData and sort them in chronological order
    const mIndex = {
      January: 0,February: 1,March: 2,April: 3, May: 4,June: 5, July: 6,August: 7,September: 8, October: 9,November: 10, December: 11,
    };
    const uniqueMonths = [...new Set(lineChartData.map((entry) => entry.month))]
      .sort((a, b) => mIndex[a] - mIndex[b]);
  
    // Initialize data structure for each month
    const data = {
      labels: uniqueMonths.map(month => month.toString()), // Convert months to strings
      datasets: [
        {
          label: 'Budget',
          data: Array(uniqueMonths.length).fill(0),
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
        {
          label: 'Expense',
          data: Array(uniqueMonths.length).fill(0),
          borderColor: 'rgba(255,99,132,1)',
          fill: false,
        },
      ],
    };
  
    // Process lineChartData to calculate the sum for each month
    lineChartData.forEach((entry) => {
      const monthIndex = uniqueMonths.indexOf(entry.month);
      if (monthIndex !== -1) {
        data.datasets[0].data[monthIndex] += entry.value;
        data.datasets[1].data[monthIndex] += entry.value2;
      }
    });
  
    // Set options for the chart (you can customize this based on your needs)
    const options = {
  
      scales: {
        x: {
          type: 'category', // Use 'category' for string-based x-axis labels
          position: 'bottom',
          title: {
            display: true,
            text: 'Months',
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            // text: 'Amount',
          },
        },
      },
    };
  
  
    return { data, options };
  };
  
  // for Doughnut chart

  const prepareDoughnutChartData = (doughnutChartData) => {
    // Extract unique categories from doughnutChartData
    const uniqueCategories = [...new Set(doughnutChartData.map((entry) => entry.category))];
  
    // Initialize data structure for Doughnut chart
    const data = {
      labels: uniqueCategories,
      datasets: [
        {
          label: 'Budget',
          data: uniqueCategories.map((category) => {
            const budgetValue = doughnutChartData
              .filter((entry) => entry.category === category)
              .reduce((sum, entry) => sum + entry.value, 0);
            return budgetValue;
          }),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            // Add more colors as needed
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            // Add more colors as needed
          ],
        },
        {
          label: 'Expense',
          data: uniqueCategories.map((category) => {
            const expenseValue = doughnutChartData
              .filter((entry) => entry.category === category)
              .reduce((sum, entry) => sum + entry.value2, 0);
            return expenseValue;
          }),
          backgroundColor: [
            'rgba(255,99,132,0.5)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 0.5)',
            // Add more colors as needed
          ],
          hoverBackgroundColor: [
            'rgba(255,99,132,0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            // Add more colors as needed
          ],
        },
      ],
    };
  
    // Set options for the Doughnut chart
    const options = {
      maintainAspectRatio: false, // Set this to false to allow manual adjustment of width and height
    responsive: true, // Enable responsiveness
    width: 400, // Set your desired width
    height: 200, // Set your desired height

    };
  
    return { data, options };
  };
  

  const handleReloadSession = () => {
    // Reload the session or perform any other necessary actions
    window.location.reload();
  };

// for table
  const toggleTable = () => {
    setShowTable(!showTable);
    // Fetch and set the table data when showing the table
    if (!showTable) {
      createBudget();
    }
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
      <h2>Welcome to your Dashboard! {authUser.email} </h2>

      <div>
        {timeoutPopup && <Popup onReloadSession={handleReloadSession} />}
      </div>
      
      <div className="Col-View">
      <div className='Put-Budget'>
        <label>Month</label>
        <input placeholder="Put Month eg.January,February" value={month} onChange={ (e) => { setMonth(e.target.value)}}></input>
        <label>Category</label>
        <input placeholder="put your category" value={newCategory} onChange={(e) => { setNewCategory(e.target.value) }}></input>
        <label>Budget</label>
        <input type="number" placeholder="put your budget amount" onChange={(e) => { setNewBudget(e.target.value) }}></input>
        <label>Expense</label>
        <input type="number" placeholder="put your Expense amount" onChange={(e) => { setNewExpense(e.target.value) }}></input>
        <button onClick={createBudget}>Enter</button>
        </div>
        <div className='doughnut-chart'>
        {doughnutChartData.datasets && doughnutChartData.datasets.length > 0 && (<Doughnut data={doughnutChartData} options={chartOptionsDoughnut} />)}
        </div>
      
      </div>

      {!showInsights ? (
  <div className='insights-section'>
    <div className='line-chart'>
      {lineChartData.datasets && lineChartData.datasets.length > 0 && (
        <Line data={lineChartData} options={chartOptionsLine} />
      )}
    </div>
    <div className="Expense-Months">
      <p>
        {lineChartData.labels &&
          lineChartData.labels.map((month, index) => {
            const totalBudget = lineChartData.datasets[0].data[index];
            const totalExpense = lineChartData.datasets[1].data[index];

            // Check if total expense is greater than total budget
            if (totalExpense > totalBudget) {
              return (
                <div key={month}> You are spending ${totalExpense - totalBudget} more than the total budget for {month}</div>);
            }

            return null;})}
      </p>
    </div>
  </div>
) : (
  <div className='insights-section'>
    <div className='bar-chart'>
      <MonthDropdown selectedMonth={selectedMonth} onChange={setSelectedMonth}></MonthDropdown>
      {Object.keys(chartData).length > 0 && <Bar data={chartData} options={{}} />}
      <div> <button onClick={toggleTable}>{showTable ? 'Hide Table' : 'Show Table'}</button> </div>
    </div>
    <div> {showTable && <Table tableData={tableData} selectedMonth={selectedMonth} />} </div>
  </div>
)}

    
    
    
    </div>
  );
};

export default Dashboard;
