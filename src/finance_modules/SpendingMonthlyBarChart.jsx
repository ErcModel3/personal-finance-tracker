import { useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto';

const SpendingMonthlyBarChart = ({ MoneySpentMonthly }) => {
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

            // Creating the bar chart
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: [],
                        data: MoneySpentMonthly,
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
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,
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
    }, [MoneySpentMonthly]); // Re-run when the MoneySpentMonthly values change

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default SpendingMonthlyBarChart;