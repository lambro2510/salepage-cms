import {
    ActionType,
    ProTable,
    ProColumns,
    RequestData,
    TableDropdown,
    ProDescriptions,
} from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps, Modal, Button, Dropdown, Menu, Tag } from 'antd';
import { EllipsisOutlined, SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import {
    handleErrorResponse,
    NotificationType,
    showNotification,
} from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import { Order, OrderFilter } from '../../interfaces/models/order';
import { Product } from '../../interfaces/models/product';
import { ProductTransactionState } from '../../interfaces/enum/ProdTransactionState';
const breadcrumb: BreadcrumbProps = {
    items: [
        {
            key: webRoutes.orders,
            title: <Link to={webRoutes.orders}>Đơn hàng</Link>,
        },
    ],
};

const Orders = () => {
    const actionRef = useRef<ActionType>();
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, modalContextHolder] = Modal.useModal();
    const [products, setProducts] = useState<any>([]);

    const getOrders = (params: any, sort: any) => {
        let order : any;
        if (typeof sort === 'object' && sort !== null) {
            for (const [key, value] of Object.entries(sort)) {
                order = key;
                if(value == 'ascend'){
                    order += ',asc';
                }else{
                    order += ',desc';
                }
            }
        }

        return http
            .get(apiRoutes.orderHistories, {
                params: {
                    params : params,
                    productName: params.productName,
                    buyerName: params.buyerName,
                    sellerStoreName: params.storeName,
                    gte: params.createdAt ? params.createdAt[0] : null,
                    lte: params.createdAt ? params.createdAt[1] : null,
                    page: params.current - 1,
                    size: params.pageSize,
                    sort: order
                },
            })
            .then((response) => {
                const orders: [Order] = response.data.data.data;

                return {
                    data: orders,
                    success: true,
                    total: response.data.data.metadata.total,
                } as RequestData<Order>;
            })
            .catch((error) => {
                handleErrorResponse(error);

                return {
                    data: [],
                    success: false,
                } as RequestData<Order>;
            });
    };

    const productFilter = (
        <Menu>
            {products?.length === 0 ? null :
                products?.map((product: Product) => (
                    <Menu.Item key={product?.productId}>
                        {product?.productName}
                    </Menu.Item>
                ))
            }
        </Menu>
    )

    const loadProduct = () => {
        return http.get(apiRoutes.products)
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

    const loadStore = () => {

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


    const columns: ProColumns<Order>[] = [
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'productImage',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Order) =>
                row.productImageUrl ? (
                    <Avatar
                        shape="circle"
                        size="small"
                        src={
                            <LazyImage
                                src={row.productImageUrl}
                                placeholder={<div className="bg-gray-100 h-full w-full" />}
                            />
                        }
                    />
                ) : (
                    <Avatar shape="circle" size="small">
                        {row.buyerName.charAt(0).toUpperCase()}
                    </Avatar>
                ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            align: 'center',
            sorter: false,
            filterMode: 'menu',
            filtered: false,
            filterDropdown(props) {
                return (
                    productFilter
                )
            },
            filterDropdownOpen: false,
            render: (_, row: Order) => row.productName,

        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            align: 'center',
            sorter: true,
            search: false,
            render: (_, row: Order) => row.quantity
        },
        {
            title: 'Tổng tiền thanh toán',
            dataIndex: 'total_price',
            align: 'center',
            sorter: true,
            search: false,
            valueType: 'money',
            render: (_, row: Order) => row.total_price
        },
        {
            title: 'Người mua',
            dataIndex: 'buyerName',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row.buyerName
        },
        {
            title: 'Cửa hàng',
            dataIndex: 'storeName',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row.storeName
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'address',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Order) => row.address
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Order) => row.note
        },
        {
            title: 'Sử dụng mã giảm giá',
            dataIndex: 'isUseVoucher',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Order) => row.isUseVoucher
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'productTransactionState',
            align: 'center',
            sorter: false,
            search: false,
            filters: true,
            onFilter: true,
            valueEnum: ProductTransactionState,
            
        },
        {
            title: 'Thời gian tạo đơn hàng',
            dataIndex: 'created_at',
            align: 'center',
            sorter: true,
            valueType: 'dateRange',
            render: (_, row: Order) => row.created_at
        }
    ]

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
                                </Link>
                            ]
                        } else {
                            return [
                                <Link to={'#'} onClick={() => { console.log(props) }}>
                                    Thu nhỏ
                                    <UpOutlined />
                                </Link>
                            ]
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
    )
}

export default Orders;