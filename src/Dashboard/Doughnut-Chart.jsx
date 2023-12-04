import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ userUID }) => {


  const [doughnutChartData, setDoughnutChartData] = useState({});
  const [chartOptionsDoughnut, setChartOptionsDoughnut] = useState({});

  useEffect(() => {
    const fetchDoughnutChartData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/linechart/${userUID}`);
        const doughnutChartData = await response.json();

        if (response.ok) {
          const { data, options } = prepareDoughnutChartData(doughnutChartData.data);

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
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(0, 128, 0, 1)',
            'rgba(255, 69, 0, 0.5)',
            'rgba(128, 0, 128, 1)',
            'rgba(255, 215, 0, 0.5)',
           
          ],
          hoverBackgroundColor: [
            'rgba(255,99,132,0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64,0.8)',
            'rgba(0, 128, 0, 0.8)',
            'rgba(255, 69, 0, 0.8)',
            'rgba(128, 0, 128, 0.8)',
            'rgba(255, 215, 0, 0.8)',
          ],
        },
      ],
    };
  
    // Set options for the Doughnut chart
    const options = {
      maintainAspectRatio: false, 
    responsive: true, 
    width: 400, 
    height: 200, 

    };
  
    return { data, options };
  };
  

  return (
    // <div className='doughnut-chart'>
      doughnutChartData.datasets && doughnutChartData.datasets.length > 0 && (
        <Doughnut data={doughnutChartData} options={chartOptionsDoughnut} />
      )
    // </div>
  );
};

export default DoughnutChart;
