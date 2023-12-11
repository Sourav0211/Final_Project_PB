import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ userUID , doughnutChartData}) => {


  const [NdoughnutChartData, setNDoughnutChartData] = useState({});
  const [chartOptionsDoughnut, setChartOptionsDoughnut] = useState({});




  useEffect(()=>{
    if(doughnutChartData && doughnutChartData.data){
    const {data, options} = prepareNDoughnutChartData(doughnutChartData.data);
    setNDoughnutChartData(data);
    setChartOptionsDoughnut(options);
    
  }
  },[doughnutChartData])  
 
  
 

  
  const prepareNDoughnutChartData = (NdoughnutChartData) => {

    const uniqueCategories = [...new Set(NdoughnutChartData.map((entry) => entry.category))];
  
    const data = {
      labels: uniqueCategories,
      datasets: [
        {
          label: 'Budget',
          data: uniqueCategories.map((category) => {
            const budgetValue = NdoughnutChartData
              .filter((entry) => entry.category === category)
              .reduce((sum, entry) => sum + entry.value, 0);
            return budgetValue;
          }),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
         
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
          
          ],
        },
        {
          label: 'Expense',
          data: uniqueCategories.map((category) => {
            const expenseValue = NdoughnutChartData
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
  
    const options = {
      maintainAspectRatio: false, 
    responsive: true, 
    width: 400, 
    height: 200, 

    };
  
    return { data, options };
  };
  
 
  return (
      NdoughnutChartData.datasets && NdoughnutChartData.datasets.length > 0 && (
        <Doughnut data={NdoughnutChartData} options={chartOptionsDoughnut} />
      )
   
  );
};

export default DoughnutChart;
