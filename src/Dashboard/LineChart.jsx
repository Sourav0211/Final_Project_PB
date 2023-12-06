import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';

const LineChart = ({ userUID ,lineChartData }) => {
  // const [NlineChartData, setNlineChartData] = useState({});
  // const [NchartOptionsLine, setNChartOptionsLine] = useState({});

  // useEffect(() => {
    // const fetchNLineChartData = async () => {
    //   try {
    //     const response = await fetch(`http://localhost:3001/api/linechart/${userUID}`);
    //     const NlineChartData = await response.json();

    //     if (response.ok) {
    //       const { data, options } = prepareNLineChartData(NlineChartData.data);
    //       setNlineChartData(data);
    //       setNChartOptionsLine(options);
    //     } else {
    //       console.error("Error fetching linechart data");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching linechart data:", error);
    //   }
    // };

  
    // fetchNLineChartData();
  // }, [userUID]);
  const [NlineChartData, setNlineChartData] = useState({});
  const [NchartOptionsLine, setNChartOptionsLine] = useState({});
  
    const prepareNLineChartData = (NlineChartData) => {
        const mIndex = {
          January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
          July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
        };
    
        const uniqueMonths = [...new Set(NlineChartData.map((entry) => entry.month))]
          .sort((a, b) => mIndex[a] - mIndex[b]);
    
        const data = {
          labels: uniqueMonths.map(month => month.toString()),
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
     
        NlineChartData.forEach((entry) => {
          const monthIndex = uniqueMonths.indexOf(entry.month);
          if (monthIndex !== -1) {
            data.datasets[0].data[monthIndex] += entry.value;
            data.datasets[1].data[monthIndex] += entry.value2;
          }
        });
    
        const options = {
          scales: {
            x: {
              type: 'category',
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
  
      useEffect(() => {
        if (lineChartData && lineChartData.data) {
          const { data, options } = prepareNLineChartData(lineChartData.data);
          setNlineChartData(data);
          setNChartOptionsLine(options);
        }
      }, [lineChartData]);


  return (
    <div>
    <div className='line-chart' >
      {NlineChartData.datasets && NlineChartData.datasets.length > 0 && (
        <Line data={NlineChartData} options={NchartOptionsLine} />
      )}
      </div>
      <div className="Expense-Months">
      <p>
        {NlineChartData.labels &&
          NlineChartData.labels.map((month, index) => {
            const totalBudget = NlineChartData.datasets[0].data[index];
            const totalExpense = NlineChartData.datasets[1].data[index];

            // Check if total expense is greater than total budget
            if (totalExpense > totalBudget) {
              return (
                <div key={month}> You are spending ${totalExpense - totalBudget} more than the total budget for {month}</div>);
            }

            return null;})}
      </p>
    
    </div>
    </div>
  );
};

export default LineChart;
