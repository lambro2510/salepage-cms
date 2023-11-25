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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartDataInfo } from '../../interfaces/models/chart';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { useState } from 'react';
import { Card, Col, Progress, Row, Select } from 'antd';
import { StatisticCard } from '@ant-design/pro-components';
import { roundedNumber } from '../../utils';

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
const ChartData = ({ data, loading, selectedChartType }: { data: ChartDataInfo, loading: boolean, selectedChartType: string }) => {
    return (
        <Row className='flex'>
            <Col span={24}>
                <Row>

                    <Col
                        xl={24}
                        lg={24}
                        md={24}
                        sm={24}
                        xs={24}
                        style={{ marginBottom: 24 }}
                    >
                        <Card bordered className="w-full h-full cursor-default">
                            <StatisticCard.Group className='flex justify-between' direction="row">
                                <StatisticCard
                                    statistic={{
                                        title: 'Tổng tiền',
                                        value: loading ? 0 : data.totalPurchase,
                                    }}
                                />

                            </StatisticCard.Group>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Line
                        data={{
                            labels: data.labels,
                            datasets: data.datasets.map((value) => {
                                return {
                                    ...value,
                                    fill: false, 
                                    pointStyle: [],
                                    pointRadius: 1,
                                    data: value.data.map((k) => {
                                        for (let [key, value] of Object.entries(k)) {
                                            if (key === selectedChartType) {
                                                return value;
                                            }
                                        }
                                    })
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
                                    min: 0

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
                </Row>
            </Col>

        </Row>

    );
};

export default ChartData;
