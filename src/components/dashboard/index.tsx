import { useEffect, useState } from 'react';
import BasePageContainer from '../layout/PageContainer';
import {
  Avatar,
  BreadcrumbProps,
  Card,
  Col,
  List,
  Progress,
  Rate,
  Row,
  Table,
  Tag,
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
import { handleErrorResponse } from '../../utils';
import { Review } from '../../interfaces/models/review';
import Chart from '../layout/Chart';
import ChartData from '../layout/Chart';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <Row gutter={24}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={AiOutlineTeam} />}
            title="Users"
            number={12}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlineArticle} />}
            title="Posts"
            number={100}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiPhotoAlbum} />}
            title="Albums"
            number={100}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlinePhoto} />}
            title="Photos"
            number={500}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiCommentDetail} />}
            title="Comments"
            number={500}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={AiOutlineStar} />}
            title="Reviews"
            number={100}
          />
        </Col>
        <Col
          xl={12}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
            <StatisticCard.Group direction="row">
              <StatisticCard
                statistic={{
                  title: 'XYZ',
                  value: loading ? 0 : 123,
                }}
              />
              <StatisticCard
                statistic={{
                  title: 'Progress',
                  value: 'ABC',
                }}
                chart={
                  <Progress
                    className="text-primary"
                    percent={loading ? 0 : 75}
                    type="circle"
                    size={'small'}
                    strokeColor={CONFIG.theme.accentColor}
                  />
                }
                chartPlacement="left"
              />
            </StatisticCard.Group>
          </Card>
        </Col>
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={users}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="circle"
                        size="small"
                        src={
                          <LazyImage
                            src={user.avatar}
                            placeholder={
                              <div className="bg-gray-100 h-full w-full" />
                            }
                          />
                        }
                      />
                    }
                    title={`${user.first_name} ${user.last_name}`}
                    description={user.email}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
            <Table
              loading={loading}
              pagination={false}
              showHeader={false}
              dataSource={reviews}
              columns={[
                {
                  title: 'Title',
                  dataIndex: 'title',
                  key: 'title',
                  align: 'left',
                },
                {
                  title: 'Year',
                  dataIndex: 'year',
                  key: 'year',
                  align: 'center',
                  render: (_, row: Review) => (
                    <Tag color={row.color}>{row.year}</Tag>
                  ),
                },
                {
                  title: 'Star',
                  dataIndex: 'star',
                  key: 'star',
                  align: 'center',
                  render: (_, row: Review) => (
                    <Rate disabled defaultValue={row.star} />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col
          xl={24}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
           <ChartData />
          </Card>
        </Col>
      </Row>
    </BasePageContainer>
  );
};

export default Dashboard;
