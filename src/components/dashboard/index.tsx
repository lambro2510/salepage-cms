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
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import Icon from '@ant-design/icons';
import { BiCommentDetail, BiPhotoAlbum } from 'react-icons/bi';
import { MdOutlineArticle, MdOutlinePhoto } from 'react-icons/md';
import { StatisticCard } from '@ant-design/pro-components';
import LazyImage from '../lazy-image';
import { User } from '../../interfaces/models/user';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse, roundedNumber } from '../../utils';
import { Review } from '../../interfaces/models/review';
import Chart from '../layout/Chart';
import { ChartDataInfo } from '../../interfaces/models/chart';
import dayjs, { Dayjs } from 'dayjs';
import TabPane from 'antd/es/tabs/TabPane';
import RangeDate from '../layout/RangeDate';

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

  const getProductStatistic = async () => {
    const response = await http.get(`${apiRoutes.statistic}`, {
      params: {
        gte: rangeDate[0]?.valueOf(),
        lte: rangeDate[1]?.valueOf(),
      }
    })
    setChartDatas(response.data.data);
  };

  useEffect(() => {
    setLoading(true);
    try {
      getProductStatistic()
    } catch (err) {
      handleErrorResponse(err);
    }
    setLoading(false)
  }, [rangeDate])

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

  const renderTabPanel = (data: ChartDataInfo) => {

    const maxProductNameLength = 20;

    const truncatedProductName =
      data.productName.length > maxProductNameLength
        ? data.productName.substring(0, maxProductNameLength - 3) + '...'
        : data.productName;

    return (
      <Tooltip title={data.productName}>
        <Row>
          <Col span={24}>
            
              <p>{truncatedProductName}</p>
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
            <RangeDate rangeDate={rangeDate} setRangeDate={setRangeDate} />
          </Card>
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
