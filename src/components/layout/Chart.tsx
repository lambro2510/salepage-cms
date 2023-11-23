import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
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
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
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
                        text: `Sản phẩm ${data.productName}`
                    },
                    legend: {
                        display: true,
                        position: "bottom"
                    }
                },
                layout: {
                    padding: {
                        left: 30,
                        right: 30,
                        top: 30,
                        bottom: 30
                    }
                }
            }}
            height={400}
            width={'80%'}
            
        />
    );
};

export default ChartData;
