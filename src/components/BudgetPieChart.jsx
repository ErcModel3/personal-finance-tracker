import React, { useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto';

const BudgetPieChart = ({ budgetData }) => {
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

            // Doing the maths for spent vs budgeted values
            const netIncome = budgetData.monthlySalary - budgetData.tax + budgetData.bonus;
            const remaining = netIncome - budgetData.amountSpent;

            // Creating the actual pie chart
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Spent', 'Remaining'],
                    datasets: [
                        {
                            data: [budgetData.amountSpent, remaining],
                            backgroundColor: ['#27AE60', '#2B5D9F'],
                            hoverBackgroundColor: ['#27AE60C0', '#2B5D9FC0'],
                            // Same values but hover uses last 2 digits to make it C0% of the standard colour
                            borderWidth: 1
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
    }, [budgetData]); // Re-run when budgetData changes

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default BudgetPieChart;