import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2'; // Import only the Bar element
import { ChartDataInfo } from '../../interfaces/models/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables);

const BarChart = ({
  datas,
  title,
}: {
  title: string;
  datas: { lb: any[]; values: any[] };
}) => {
  const data = {
    labels: datas.lb,
    datasets: [
      {
        label: title,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: datas.values,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    layout: {
      padding: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30,
      },
    },
  };

  return (
    <div>
      <Bar height={'50vh'} width={'100%'} data={data} options={options} />
    </div>
  );
};

export default BarChart;
