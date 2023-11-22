import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2';
import { ChartDataInfo } from '../../interfaces/models/chart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartData = ({data} : {data : ChartDataInfo}) => {
    return (
        <Line
            data={{
                labels: data.labels,
                datasets: data.datasets
            }}
            options={{
                maintainAspectRatio: false, // Add this line to prevent maintaining aspect ratio
                responsive: true, // Add this line for responsiveness
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: "World population per region (in millions)"
                    },
                    legend: {
                        display: true,
                        position: "bottom"
                    }
                },
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50
                    }
                }
            }}
            height={600}
            width={'100%'}
        />
    );
};

export default ChartData;
