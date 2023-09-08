import {
    ActionType,
    ProTable,
    ProColumns,
    RequestData,
    TableDropdown,
    ProDescriptions,
} from '@ant-design/pro-components';
import {Avatar, BreadcrumbProps, Modal, Input} from 'antd';
import { useRef, useState } from 'react';
import {Link} from 'react-router-dom';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import Order from '../../interfaces/models/order';
import {ProductTransactionState} from '../../interfaces/enum/prodTransactionState';
import './index.module.css';
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
    const [tranState, setTranState] = useState();
    const [modal, modalContextHolder] = Modal.useModal();

    const getState = (state) => {
        switch (state) {
            case ProductTransactionState.NEW:
                setTranState('green');
                return 'Đơn mới';
            case ProductTransactionState.WAITING_STORE:
                setTranState('blue');
                return 'Chờ xác nhận';
            case ProductTransactionState.WAITING_SHIPPER:
                return 'Chờ người giao hàng';
            case ProductTransactionState.SHIPPER_PROCESSING:
                return 'Đơn hàng đang vận chuyển';
            case ProductTransactionState.SHIPPER_COMPLETE:
                return 'Đã giao hàng thành công';
            case ProductTransactionState.ALL_COMPLETE:
                return 'Hoàn tất đơn hàng';
            case ProductTransactionState.CANCEL:
                return 'Hủy đơn hàng';
            default:
                return 'Đơn hàng không xác định'; // You can return a default icon for unknown states
        }
    };

    const columns: ProColumns[] = [
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'productImage',
            align: 'center',
            sorter: false,
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
            dataIndex : 'productName',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row?.productName
        },
        {
            title: 'Số lượng',
            dataIndex : 'quantity',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row?.quantity
        },
        {
            title: 'Tổng tiền thanh toán',
            dataIndex : 'totalPrice',
            align: 'center',
            sorter: true,
            render: (_, row: Order) => row?.totalPrice
        },
        {
            title: 'Người mua',
            dataIndex : 'buyerName',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row?.buyerName
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex : 'address',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row?.address
        },
        {
            title: 'Ghi chú',
            dataIndex : 'note',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row?.note
        },
        {
            title: 'Sử dụng mã giảm giá',
            dataIndex : 'isUseVoucher',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => row?.isUseVoucher
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex : 'productTransactionState',
            align: 'center',
            sorter: false,
            render: (_, row: Order) => {
                let color = tranState;
                return <span style={{color : color}} >{getState(row?.productTransactionState)}</span>
            }
        },
        {
            title: 'Thời gian tạo đơn hàng',
            dataIndex : 'createdAt',
            align: 'center',
            sorter: true,
            render: (_, row: Order) => row?.createdAt
        }
    ]

    return (
        <BasePageContainer breadcrumb={breadcrumb}>
            <ProTable
                columns={columns}
                cardBordered={false}
                cardProps={{
                    tooltip: {
                        className: 'opacity-60',
                        title: 'Danh sách đơn hàng của bạn',
                    },
                    title: 'Đơn hàng',
                }}
                bordered={true}
                showSorterTooltip={false}
                scroll={{ x: true }}
                tableLayout={'fixed'}
                rowSelection={false}
                pagination={{
                    showQuickJumper: true,
                    pageSize: 10,
                }}
                actionRef={actionRef}
                request={(params) => {
                    return http
                        .get(apiRoutes.orderHistories, {
                            params: {
                                param: params,
                                page: params.current - 1,
                                size: params.pageSize
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
                }}
                dateFormatter="string"
                search={false}
                rowKey="id"
                options={{
                    search: true,
                }}/>
        </BasePageContainer>
    )
}

export default Orders;