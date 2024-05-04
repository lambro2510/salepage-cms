import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import {
  Avatar,
  BreadcrumbProps,
  Modal,
  Button,
  Dropdown,
  Menu,
  Tag,
  Space,
} from 'antd';
import Icon, {
  EllipsisOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { CiCircleMore } from 'react-icons/ci';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import {
  convertUTCToVietnamTime,
  handleErrorResponse,
  NotificationType,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import { OrderFilter, ProductTransaction } from '../../interfaces/models/order';
import { Product } from '../../interfaces/models/product';
import { ProductTransactionState } from '../../interfaces/enum/ProductTransactionState';
import { BiAccessibility } from 'react-icons/bi';
import { MdUpdate, MdViewAgenda } from 'react-icons/md';
import {
  ProductDataResponse,
  ProductInfoResponse,
} from '../../interfaces/interface';
import { FilterDropdownProps } from 'antd/es/table/interface';
const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.orders,
      title: <Link to={webRoutes.orders}>Đơn hàng</Link>,
    },
  ],
};

enum ActionKey {
  DELETE = 'delete',
  DETAIL = 'detail',
  UPDATE = 'update',
  UPLOAD = 'upload',
}

const Orders = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [products, setProducts] = useState<any>([]);

  const getOrders = (params: any, sort: any) => {
    let order: any;
    if (typeof sort === 'object' && sort !== null) {
      for (const [key, value] of Object.entries(sort)) {
        order = key;
        if (value == 'ascend') {
          order += ',asc';
        } else {
          order += ',desc';
        }
      }
    }

    return http
      .get(apiRoutes.orderHistories, {
        params: {
          ...params,
          productName: params.productName,
          buyerName: params.buyerName,
          sellerStoreName: params.storeName,
          gte: params.createdAt ? params.createdAt[0] : null,
          lte: params.createdAt ? params.createdAt[1] : null,
          page: params.current - 1,
          size: params.pageSize,
          sort: order,
        },
      })
      .then((response) => {
        const orders: [ProductTransaction] = response.data.data.data;

        return {
          data: orders,
          success: true,
          total: response.data.data.metadata.total,
        } as RequestData<ProductTransaction>;
      })
      .catch((error) => {
        handleErrorResponse(error);

        return {
          data: [],
          success: false,
        } as RequestData<ProductTransaction>;
      });
  };

  const productFilter = (
    props: FilterDropdownProps,
    products: ProductInfoResponse[]
  ) => {
    return (
      <Menu>
        {products?.map((product: ProductInfoResponse) => (
          <Menu.Item key={product?.id} onClick={() => props.filters}>
            {product?.productName}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const loadProduct = () => {
    return http
      .get(apiRoutes.products)
      .then((response) => {
        const products: [Product] = response.data.data.data;
        console.log(products);
        setProducts(products);
      })
      .catch((error) => {
        handleErrorResponse(error);
        return [];
      });
  };

  const loadStore = () => {};

  const handleActionOnSelect = (key: string, product: ProductTransaction) => {
    if (key === ActionKey.DELETE) {
    } else if (key === ActionKey.UPDATE) {
    } else if (key === ActionKey.UPLOAD) {
    } else if (key === ActionKey.DETAIL) {
    }
  };

  useEffect(() => {
    Promise.all([loadProduct(), loadStore()])
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  }, []);

  const columns: ProColumns<ProductTransaction>[] = [
    {
      key: '1',
      title: 'Ảnh sản phẩm',
      dataIndex: ['product', 'defaultImageUrl'],
      align: 'center',
      sorter: false,
      search: false,
      render: (_, row: ProductTransaction) =>
        row.product.defaultImageUrl ? (
          <Avatar
            shape="circle"
            size="small"
            src={
              <LazyImage
                src={row.product.defaultImageUrl}
                placeholder={<div className="bg-gray-100 h-full w-full" />}
              />
            }
          />
        ) : (
          <Avatar shape="circle" size="small">
            {row.username.charAt(0).toUpperCase()}
          </Avatar>
        ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      align: 'center',
      sorter: false,
      filterMode: 'menu',
      filtered: true,
      filterDropdown(props) {
        return productFilter(props, products);
      },
      onFilter(value, record) {
        console.log(value);
        console.log(record);
        return true;
      },
      render: (_, row: ProductTransaction) => row.product.productName,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
      sorter: true,
      search: false,
      render: (_, row: ProductTransaction) => row.quantity,
    },
    {
      title: 'Tổng tiền thanh toán',
      dataIndex: 'totalPrice',
      align: 'center',
      sorter: true,
      search: false,
      valueType: 'money',
      render: (_, row: ProductTransaction) => row.totalPrice,
    },
    {
      title: 'Người mua',
      dataIndex: 'username',
      align: 'center',
      sorter: false,
      render: (_, row: ProductTransaction) => row.username,
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'storeName',
      align: 'center',
      sorter: false,
      render: (_, row: ProductTransaction) => row.store.storeName,
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'address',
      align: 'center',
      sorter: false,
      search: false,
      render: (_, row: ProductTransaction) => row.address,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'center',
      sorter: false,
      search: false,
      render: (_, row: ProductTransaction) => row.note,
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'productTransactionState',
      align: 'center',
      sorter: false,
      search: false,
      filters: true,
      onFilter: true,
      render: (_, row: ProductTransaction) =>
        ProductTransactionState[row.state].text,
    },
    {
      title: 'Thời gian tạo đơn hàng',
      dataIndex: 'createdAt',
      align: 'center',
      sorter: true,
      valueType: 'date',
      render: (_, row: ProductTransaction) =>
        convertUTCToVietnamTime(row.createdAt),
    },
    {
      title: 'Chức năng',
      align: 'center',
      key: 'option',
      fixed: 'right',
      filtered: false,
      search: false,
      render: (_, row: ProductTransaction) => [
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => handleActionOnSelect(key, row)}
          menus={[
            {
              key: ActionKey.UPLOAD,
              name: (
                <Space>
                  <BiAccessibility />
                  Thực hiện đơn hàng
                </Space>
              ),
            },
            {
              key: ActionKey.UPDATE,
              name: (
                <Space>
                  <MdUpdate />
                  Chi tiết đơn hàng
                </Space>
              ),
            },
            {
              key: ActionKey.DETAIL,
              name: (
                <Space>
                  <MdViewAgenda />
                  Từ chối
                </Space>
              ),
            },
            {
              key: ActionKey.DELETE,
              name: (
                <Space>
                  <DeleteOutlined />
                  Xóa
                </Space>
              ),
            },
          ]}
        >
          <Icon component={CiCircleMore} className="text-primary text-xl" />
        </TableDropdown>,
      ],
    },
  ];

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <ProTable
        columns={columns}
        cardBordered={false}
        bordered={true}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={'fixed'}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 20,
        }}
        actionRef={actionRef}
        request={(params, sort) => {
          return getOrders(params, sort);
        }}
        dateFormatter="number"
        search={{
          labelWidth: 'auto',
          filterType: 'query',
          showHiddenNum: true,
          collapseRender(collapsed, props, intl, hiddenNum) {
            if (collapsed) {
              return [
                <Link to={'#'}>
                  Mở rộng({props.hiddenNum})
                  <DownOutlined />
                </Link>,
              ];
            } else {
              return [
                <Link
                  to={'#'}
                  onClick={() => {
                    console.log(props);
                  }}
                >
                  Thu nhỏ
                  <UpOutlined />
                </Link>,
              ];
            }
          },
          searchText: 'Tìm kiếm',
          resetText: 'Xóa bộ lọc',
          // optionRender(searchConfig, props, dom) {
          //     return [
          //         <Button
          //             key="customSearch"
          //             className='bg-primary'
          //             icon={<SearchOutlined />}
          //             onClick={() => {
          //                 searchConfig?.form?.submit();
          //             }}
          //         >
          //             Tìm kiếm
          //         </Button>,
          //         <Button
          //             key="customReset"
          //             onClick={() => {
          //                 searchConfig?.form?.resetFields();
          //             }}
          //         >
          //             Xóa bộ lọc
          //         </Button>,
          //     ];
          // },
        }}
        toolBarRender={() => [
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: '1st item',
                  key: '1',
                },
                {
                  label: '2nd item',
                  key: '1',
                },
                {
                  label: '3rd item',
                  key: '1',
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </BasePageContainer>
  );
};

export default Orders;
