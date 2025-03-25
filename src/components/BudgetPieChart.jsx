import React from 'react';
import { Pie } from 'react-chartjs-2';

const BudgetPieChart = ({ budgetData }) => {
    // Calculate remaining budget
    const remainingBudget = budgetData.budgetSet - budgetData.amountSpent;

    // Prepare data for the pie chart
    const pieChartData = {
        labels: ['Tax', 'Amount Spent', 'Remaining'],
        datasets: [
            {
                label: 'Budget Breakdown',
                data: [budgetData.tax, budgetData.amountSpent, remainingBudget],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Budget Breakdown',
                font: {
                    size: 18
                }
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
    };

    return <Pie data={pieChartData} options={options} />;
};

export default BudgetPieChart;