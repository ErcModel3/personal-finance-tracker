import { useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto';

// TO DO split file into having two different functions, one that returns a bar chart with the SpendingCategoryData
// TO DO and another that returns a pie chart from the same SpendingCategoryData

const SpendingCategoryPieChart = ({ SpendingCategoryData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Removes any existing chart instances
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current) {
            // Create the chart context because that's something that needs to happen
            const ctx = chartRef.current.getContext('2d');

            //TO DO - add processing / splitting code here

            // Creating the actual pie chart
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Spent', 'Remaining'],
                    datasets: [
                        {
                            data: [SpendingCategoryData],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(153, 102, 255, 1)',
                            ],
                            borderWidth: 1,
                            // backgroundColor: ['#27AE60', '#2B5D9F'],
                            // hoverBackgroundColor: ['#27AE60C0', '#2B5D9FC0'],
                            // // Same values but hover uses last 2 digits to make it C0% of the standard colour
                            // borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: £${value}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Clean up the chart
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [SpendingCategoryData]); // Re-run when SpendingCategoryData changes

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default SpendingCategoryPieChart;