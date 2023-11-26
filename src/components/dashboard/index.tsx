import { useEffect, useState } from 'react';
import BasePageContainer from '../layout/PageContainer';
import {
  Avatar,
  BreadcrumbProps,
  Card,
  Col,
  DatePicker,
  List,
  Progress,
  Rate,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import RcResizeObserver from 'rc-resize-observer';
import { ProCard, ProList, StatisticCard } from '@ant-design/pro-components';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse, roundedNumber } from '../../utils';
import { Review } from '../../interfaces/models/review';
import Chart from '../basic/Chart';
import { ChartDataInfo } from '../../interfaces/models/chart';
import dayjs, { Dayjs } from 'dayjs';
import TabPane from 'antd/es/tabs/TabPane';
import RangeDate from '../layout/RangeDate';
import CirleChart from '../basic/DoughnutChart';
import DoughnutChart from '../basic/DoughnutChart';
import { AiOutlineUp, AiOutlineUpSquare } from 'react-icons/ai';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import LineChart from '../basic/LineChart';
import BarChart from '../basic/BarChart';
import React from 'react';

const { Statistic } = StatisticCard;

interface ListProductPurchase {
  index: number;
  isTop: boolean;
  productName: string;
  productId: string;
  value: number;
}
const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
  ],
};

const type = [
  {
    name: "totalBuy",
    value: "Số sản phẩm đã bán"
  },
  {
    name: "totalUser",
    value: "Số người mua"
  },
  {
    name: "totalProduct",
    value: "Số đơn hàng"
  },
  {
    name: "totalView",
    value: "Số lượt xem"
  },
  {
    name: "totalPurchase",
    value: "Số tiền"
  },
  {
    name: "totalShipperCod",
    value: "Số phí vận chuyển"
  },
]

const Dashboard = () => {
  const [rangeDate, setRangeDate] = useState<Dayjs[]>([dayjs().subtract(7, 'days'), dayjs()]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartDatas, setChartDatas] = useState<ChartDataInfo[]>([])
  const [selectedChartType, setSelectedChartType] = useState<string>(type[0].name);
  const [comparePrice, setComparePrice] = useState<number[]>([0, 0])
  const [compareQuantity, setCompareQuantity] = useState<number[]>([0, 0])
  const getProductStatistic = async () => {
    const response = await http.get(`${apiRoutes.statistic}`, {
      params: {
        gte: rangeDate[0]?.valueOf(),
        lte: rangeDate[1]?.valueOf(),
      }
    })
    setChartDatas(response.data.data);
    return response.data.data;
  };

  const fetchData = async () => {
    try {
      const data = await getProductStatistic();
      compare(data);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [rangeDate]);


  const getMaxViewProduct = () => {
    let name = chartDatas[0]?.productName;
    let maxView = 0;
    for (let data of chartDatas) {
      if (data.totalView > maxView) {
        name = data.productName;
        maxView = data.totalView;
      }
    }
    return {
      name: name,
      view: maxView
    }
  };

  const compare = (chart: ChartDataInfo[]) => {
    setComparePrice([0, 0]);
    setCompareQuantity([0, 0]);
    let totalPurchaseToday = 0;
    let totalPurchaseYesterday = 0;
    let totalQuantityToday = 0;
    let totalQuantityYesterday = 0;
    chart.map((data) => {
      data.datasets.map((dataSet) => {
        totalPurchaseToday += dataSet.data[dataSet.data.length - 1]?.totalPurchase | 0;
        totalPurchaseYesterday += dataSet.data[dataSet.data.length - 2]?.totalPurchase | 0;
        totalQuantityToday += dataSet.data[dataSet.data.length - 1]?.totalBuy | 0;
        totalQuantityYesterday += dataSet.data[dataSet.data.length - 2]?.totalBuy | 0;
      })
    })

    console.log('[totalPurchaseToday, totalPurchaseYesterday]: ', [totalPurchaseToday, totalPurchaseYesterday]);
    console.log('[totalQuantityToday, totalQuantityYesterday]: ', [totalQuantityToday, totalQuantityYesterday]);
    setComparePrice([totalPurchaseToday, totalPurchaseYesterday]);
    setCompareQuantity([totalQuantityToday, totalQuantityYesterday]);
  }

  const renderTabPanel = (data: ChartDataInfo) => {

    return (
      <Tooltip title={data.productName}>
        <Row>
          <Col span={24}>
            <p>{data.productName.substring(0, 30)}</p>
          </Col>
          <Col >
            <StatisticCard
              className='bg-inherit p-0 m-0'
              statistic={{
                title: 'Tỉ lệ mua hàng',
                value: loading ? 0 : (data.totalView === 0 ? 100 : roundedNumber(data.totalProduct * 100 / data.totalView)) + "%"
              }}
              chart={
                <Progress
                  className="text-primary"
                  percent={loading ? 0 : (data.totalView === 0 ? 100 : roundedNumber(data.totalProduct * 100 / data.totalView))}
                  type="circle"
                  status='normal'
                  size={'small'}
                  strokeColor={CONFIG.theme.accentColor}
                  showInfo={false}
                  strokeWidth={10}
                />
              }

              chartPlacement="right"
            />
          </Col>
        </Row>
      </Tooltip>
    )
  }


  const renderDoughnutChart = (chart: ChartDataInfo[]) => {

    const getPurchaseDaily = (chart: ChartDataInfo[]) => {
      let lb: any[] = [];
      let value: number[] = [];

      chart.forEach((data) => {
        lb = data.labels;
        data.datasets.forEach((dataSet) => {
          for (let i = 0; i < lb.length; i++) {
            let total = value[i] | 0;
            value[i] = total + dataSet.data[i]?.totalPurchase | 0;
            let label = dataSet.label[i];
          }
        });
      });

      return { lb, value };
    };

    const getSellProductDaily = (chart: ChartDataInfo[]) => {
      let lb: any[] = [];
      let value: number[] = [];

      chart.forEach((data) => {
        lb = data.labels;
        data.datasets.forEach((dataSet) => {
          for (let i = 0; i < lb.length; i++) {
            let total = value[i] | 0;
            value[i] = total + dataSet.data[i]?.totalBuy | 0
          }
        });
      });

      return { lb, value };
    };

    const getSortListByProduct = () => {
      let sortData = [] as {}[]
    }
    return (
      <RcResizeObserver
        key="resize-observer"
      >
        <ProCard
          title="Tỉ lệ lợi nhuận"
          extra={<RangeDate rangeDate={rangeDate} setRangeDate={setRangeDate} />}
          headerBordered
          bordered
        >
          <Row>
            <Col
              xl={16}
              lg={12}
              md={24}
              sm={24}
              xs={24}
              style={{ marginBottom: 5 }}>
              <ProCard split="horizontal">
                <ProCard split="vertical" title="So sánh với ngày gần nhất">
                  <StatisticCard
                    statistic={{
                      title: "Lợi nhuận",
                      value: Math.abs(comparePrice[0]),
                      suffix: (comparePrice[0] - comparePrice[1]) > 0 ? <FaLongArrowAltUp size={'15px'} color='green' /> : <FaLongArrowAltDown size={'15px'} color='red' />,
                      description: (
                        <Statistic
                          layout='vertical'
                          title={(comparePrice[0] - comparePrice[1]) > 0 ? `Tăng ${comparePrice[0] - comparePrice[1]}` : `Giảm ${Math.abs(comparePrice[1] - comparePrice[0])}`}
                          value={(comparePrice[0] !== comparePrice[1] && comparePrice[1] !== 0) ? (Math.abs(comparePrice[1] - comparePrice[0]) * 100 / comparePrice[1]).toFixed(2) : 0}
                          precision={2}
                          valueStyle={(comparePrice[0] - comparePrice[1]) > 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
                          prefix={(comparePrice[0] - comparePrice[1]) > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                          suffix="%"
                        />
                      ),
                    }}
                  />
                  <StatisticCard
                    statistic={{
                      title: "Sản phẩm bán",
                      value: Math.abs(compareQuantity[0]),
                      suffix: (compareQuantity[0] - compareQuantity[1]) > 0 ? <FaLongArrowAltUp size={'15px'} color='green' /> : <FaLongArrowAltDown size={'15px'} color='red' />,
                      description: (
                        <Statistic
                          layout='vertical'
                          title={(compareQuantity[0] - compareQuantity[1]) > 0 ? `Tăng ${compareQuantity[0] - compareQuantity[1]}` : `Giảm ${Math.abs(compareQuantity[1] - compareQuantity[0])}`}
                          value={(compareQuantity[0] !== compareQuantity[1] && compareQuantity[1] !== 0) ? (Math.abs(compareQuantity[1] - compareQuantity[0]) * 100 / compareQuantity[1]).toFixed(2) : 0}
                          precision={2}
                          valueStyle={(compareQuantity[0] - compareQuantity[1]) > 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
                          prefix={(compareQuantity[0] - compareQuantity[1]) > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                          suffix="%"
                        />
                      ),
                    }}
                  />
                </ProCard>
                <ProCard split="horizontal" title="Lịch sử thay đổi">
                  <Row>
                    <Col span={12}>
                      <div className='flex'>
                        <LineChart title='Lợi nhuận' datas={getPurchaseDaily(chartDatas)} />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className='flex'>
                        <LineChart title='Sản phẩm' datas={getSellProductDaily(chartDatas)} />
                      </div>
                    </Col>
                  </Row>
                </ProCard>
              </ProCard>
              <StatisticCard
              />
            </Col>
            <Col
              xl={8}
              lg={12}
              md={24}
              sm={24}
              xs={24}
              style={{ marginBottom: 5 }}>
              <DoughnutChart data={chartDatas} />
            </Col>
          </Row>
        </ProCard>
      </RcResizeObserver>
    )
  };

  const renderBarChart = (data: ChartDataInfo[]) => {

    const getPurchaseDaily = (chart: ChartDataInfo[]) => {
      let lb: any[] = [];
      let value: number[] = [];

      chart.forEach((data) => {
        lb = data.labels;
        data.datasets.forEach((dataSet) => {
          for (let i = 0; i < lb.length; i++) {
            let total = value[i] | 0;
            value[i] = total + dataSet.data[i]?.totalPurchase | 0
          }
        });
      });

      return { lb, value };
    };

    const getSortListByProduct = (chart: ChartDataInfo[]) => {
      const sortData = chart.map((data) => {
        const totalPrice = data.datasets.reduce((acc, dataSet) => {
          return acc + (dataSet.data.reduce((sum, item) => sum + (item?.totalPurchase || 0), 0) || 0);
        }, 0);

        return {
          productId: data.productId,
          productName: data.productName,
          value: totalPrice,
        };
      });

      sortData.sort((a, b) => b.value - a.value);

      let i = 1;

      return sortData.map((data) => {
        return {
          ...data,
          index: i++,
          isTop: i <= 4,
        } as ListProductPurchase;
      });
    };

    return (
      <ProCard title='Biểu đồ lợi nhuận'>
        <Row gutter={16}>
          <Col span={16}>
            <ProCard>
              <BarChart datas={getPurchaseDaily(data)} title='Thu nhập' />
            </ProCard>
          </Col>
          <Col span={8}>
            <div className='flex justify-center'>
              <ProCard className='flex justify-center' title='Top lợi nhuận' bordered>
                <List
                  dataSource={getSortListByProduct(data).slice(0, 8)} // Display only the top 8 products
                  rowKey="productId"
                  renderItem={(item) => (
                    <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p className={`text-xs ${item.isTop ? 'font-bold' : ''}`}>{item.index}</p>
                      <p className={`text-xs `}>{item.productName}</p>
                      <p className={`text-xs`}>{item.value}</p>
                    </List.Item>
                  )}
                />
              </ProCard>
            </div>
          </Col>
        </Row>
      </ProCard>
    );
  }

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <Row gutter={24}>
        <Col
          xl={24}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          style={{ marginBottom: 5 }}
        >
          <Card className='w-full flex justify-between'>
            <Select
              className='mr-10 '
              defaultValue={type[0].name}
              onChange={(value: string) => setSelectedChartType(value)}
            >
              {type.map((t) => (
                <Select.Option key={t.name} value={t.name}>
                  {t.value}
                </Select.Option>
              ))}
            </Select>
          </Card>
        </Col>

        <Col span={24} className='mb-2'>
          {renderBarChart(chartDatas)}
        </Col>

        <Col span={24} className='mb-2'>
          {renderDoughnutChart(chartDatas)}
        </Col>
        <Col span={24} className='mb-2'>
          <Card bordered={false} className="w-full h-full cursor-default">
            <StatisticCard.Group direction="row">
              <StatisticCard
                statistic={{
                  title: 'Tổng tiền',
                  value: loading ? 0 : chartDatas.reduce((acc, data) => acc + data.totalPurchase, 0),
                }}
              />
              <StatisticCard
                statistic={{
                  title: `Sản phẩm xem nhiều nhất ${getMaxViewProduct().name}`,
                  value: loading ? 0 : getMaxViewProduct().view,
                }}
              />
              <StatisticCard
                statistic={{
                  title: 'Tỉ lệ mua hàng',
                  value: `${chartDatas.reduce((acc, data) => acc + data.totalProduct, 0)} / ${chartDatas.reduce((acc, data) => acc + data.totalView, 0)}`,
                }}
                chart={
                  <Progress
                    className="text-primary"
                    percent={loading ? 0 : chartDatas.reduce((acc, data) => acc + data.totalProduct, 0) * 100 / chartDatas.reduce((acc, data) => acc + data.totalView, 0)}
                    type="circle"
                    status='normal'
                    size={'small'}
                    strokeColor={CONFIG.theme.accentColor}
                  />
                }
                chartPlacement="left"
              />
            </StatisticCard.Group>
          </Card>
        </Col>
        <Col>
          <Card>
            <Tabs defaultActiveKey="1" tabPosition="top" >
              {chartDatas.map((data, index) => (
                <TabPane tab={renderTabPanel(data)} key={data.productId} >
                  <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                      <Chart data={data} loading={loading} selectedChartType={selectedChartType} />
                    </Col>
                  </Row>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </Col>
      </Row>
    </BasePageContainer>
  );
};

export default Dashboard;
