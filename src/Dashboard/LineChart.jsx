import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';

const LineChart = ({ userUID }) => {
  const [lineChartData, setlineChartData] = useState({});
  const [chartOptionsLine, setChartOptionsLine] = useState({});

  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/linechart/${userUID}`);
        const lineChartData = await response.json();

        if (response.ok) {
          const { data, options } = prepareLineChartData(lineChartData.data);
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

  
    const prepareLineChartData = (lineChartData) => {
        const mIndex = {
          January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
          July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
        };
    
        const uniqueMonths = [...new Set(lineChartData.map((entry) => entry.month))]
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
    
        lineChartData.forEach((entry) => {
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
    
 

  return (
    <div>
    <div className='line-chart' >
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
  );
};

export default LineChart;
