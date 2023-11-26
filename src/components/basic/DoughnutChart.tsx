import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement,
  ChartOptions
} from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { ChartDataInfo } from '../../interfaces/models/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement,
  ChartDataLabels
);

const colors = [
  '#4BC0C0', '#FF9F40', '#9966CC', '#FFD700', '#2E8B57',
  '#FF6347', '#4682B4', '#8A2BE2', '#FF4500', '#ADFF2F',
  '#20B2AA', '#FF00FF', '#DC143C', '#7B68EE', '#00FF7F',
  '#FF8C00', '#9932CC', '#008080', '#FF1493', '#00FA9A'
];

const DoughnutChart = ({ data }: { data: ChartDataInfo[] }) => {

  const renderChartData = () => {
    return {
      labels: data && data?.map((k) => k.productName),
      datasets: [
        {
          data: data && data?.map((k) => k.totalPurchase),
          backgroundColor: colors,
        }
      ]
    }
  }


  return (
    <div className='m-auto'>
      <Doughnut 
      width={'100%'}
      height={'40vh'}
      data={renderChartData()} 
      options={{
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            align: 'center',
            color: '#f6f6f6',
            formatter: (value, context) => {
              const total = context.dataset.data.reduce((acc: number, data) => acc + Number(data), 0);
              const percentage = ((value / total) * 100).toFixed(2) + '%';
              return Number(context?.dataset?.data[context.dataIndex]) > 0 ? percentage : null;
            },
          }
        },
        elements: {
          arc: {
            borderColor: '#f6f6f6',
            borderWidth: 1,
          },
        },

      }} />
    </div>
  );
};

export default DoughnutChart;
