import { useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto';

const SpendingCategoryPieChart = ({ SpendingCategoryData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Removes any existing chart instances
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current) {
            // Create the chart context
            const ctx = chartRef.current.getContext('2d');

            // Process data from the object format to arrays for the chart
            const labels = Object.keys(SpendingCategoryData);
            const data = Object.values(SpendingCategoryData).map(value => parseFloat(value));

            // Creating the actual pie chart
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(201, 203, 207, 1)'
                            ],
                            borderWidth: 1,
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

export const SpendingCategoryBarChart = ({ SpendingCategoryData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Process data from the object format to arrays for the chart
            const labels = Object.keys(SpendingCategoryData);
            const data = Object.values(SpendingCategoryData).map(value => parseFloat(value));

            // Creating the bar chart
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Spending by Category',
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(201, 203, 207, 1)'
                            ],
                            borderWidth: 1,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '£' + value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: £${value}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [SpendingCategoryData]);

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default SpendingCategoryPieChart;