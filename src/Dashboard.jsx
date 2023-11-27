
import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2'; // Import Bar from react-chartjs-2
import './Dashboard.css';
import Menu from "./Menu";
import Popup from "./Popup";
import Chart from 'chart.js/auto';

const Dashboard = ({ authUser, userSignOut }) => {

  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState(0);
  const [budgetData, setBudgetData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [timeoutPopup, setTimeoutPopup] = useState(false);
  const timeoutDuration = 5 * 50 * 1000;
  const userUID = authUser.uid;

  const apiUrl = "http://localhost:3001/api/budget";

  useEffect(() => {
    const checkAndCreateCollection = async () => {
      try {
        const response = await fetch(`${apiUrl}/${userUID}`);
        const data = await response.json();

        if (response.ok) {
          setBudgetData(data.data);
          setChartData(prepareChartData(data.data));
        } else {
          console.error("Error fetching budget data");
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };
    checkAndCreateCollection();
  }, [userUID]);

  const createBudget = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userUID,
          category: newCategory,
          value: Number(newBudget),
        }),
      });

      if (response.ok) {
        setNewCategory("");
        setNewBudget("");
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

  const prepareChartData = (data) => {
    return {
      labels: data.map(item => item.category),
      datasets: [
        {
          label: 'Budget Amount',
          backgroundColor: '#4bc0c066',
          borderColor: '#4bc0c0',
          borderWidth: 1,
          hoverBackgroundColor: '#4bc0c099',
          hoverBorderColor: '#4bc0c0',
          data: data.map(item => item.value),
        },
      ],
    };
  };
  

  const handleReloadSession = () => {
    // Reload the session or perform any other necessary actions
    window.location.reload();
  };

  return (
    <div className='Dashboard-Display'>
      <Menu userSignOut={userSignOut} />
      <h2>Welcome to your Dashboard! {authUser.email} </h2>

      <div>
        {timeoutPopup && <Popup onReloadSession={handleReloadSession} />}
      </div>

      <div className='Put-Budget'>
        <label>Category</label>
        <input placeholder="put your category" value={newCategory} onChange={(e) => { setNewCategory(e.target.value) }}></input>
        <label>Budget</label>
        <input type="number" placeholder="put your budget amount" onChange={(e) => { setNewBudget(e.target.value) }}></input>
        <button onClick={createBudget}>Enter</button>
      </div>

      <div className='bar-chart'>
  {Object.keys(chartData).length > 0 && (
    <Bar data={chartData} options={{}} />
  )}
</div>
    </div>
  );
};

export default Dashboard;
