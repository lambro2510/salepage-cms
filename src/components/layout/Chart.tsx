import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale, // Add this line to import TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartDataInfo } from '../../interfaces/models/chart';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale'; 
import { useState } from 'react';

// Register the TimeScale module
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale, 
);

const ChartData = ({data} : {data : ChartDataInfo}) => {
    const [datasets, setData] = useState<any[]>();


    return (
        <Line
            data={{
                //data.labels = ["2023-11-10", "2023-11-11"]
                labels: data.labels,
                datasets: data.datasets.map((value) => {
                    console.log({
                        ...value,
                    });
                    
                    return {
                        ...value,
                        data : value.data.map((k) => k.totalBuy)
                    }
                })
            }}
            options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'yyyy-MM-dd',
                            },
                        },
                        adapters: { 
                            date: {
                              locale: enUS, 
                            },
                          }, 
                        position: 'bottom',
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                    },
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
