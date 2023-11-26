import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: '',
    },
    layout: {
      padding: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30
      }
    }   
  },
};

const LineChart = ({ datas, title }: { title: string, datas: { lb: any[], value: any[] } }) => {
  const data = {
    labels: datas.lb,
    datasets: [
      {
        fill: true,
        label: title,
        data: datas.value,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
export default LineChart;
