import { Link, NavLink, useNavigate } from "react-router-dom";
import BasePageContainer from "../layout/PageContainer";
import { useEffect, useRef, useState } from "react";
import { ActionType, ProColumns, ProDescriptions, ProTable, RequestData, TableDropdown } from "@ant-design/pro-components";
import { Avatar, BreadcrumbProps, Button, Modal, Space, Tag } from "antd";
import { Store } from "antd/es/form/interface";
import { CategoryType } from "../../interfaces/enum/CategoryType";
import { NotificationType, handleErrorResponse, showNotification } from "../../utils";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { Product } from "../../interfaces/models/product";
import { webRoutes } from "../../routes/web";
import Icon, { EllipsisOutlined, WarningOutlined, DownOutlined, UpOutlined, DeleteOutlined } from '@ant-design/icons';
import LazyImage from "../lazy-image";
import { ProductTransactionState } from "../../interfaces/enum/ProdTransactionState";
import { CiCircleMore } from "react-icons/ci";
import { BiPlus, BiUpload } from "react-icons/bi";
import { MdUpdate } from "react-icons/md";

enum ActionKey {
    DELETE = 'delete',
    UPDATE = 'update',
    UPLOAD = 'upload',
}

const breadcrumb: BreadcrumbProps = {
    items: [
        {
            key: webRoutes.products,
            title: <Link to={webRoutes.products}>Sản phẩm</Link>,
        },

    ],
};

const ViewCard = () => {

    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, modalContextHolder] = Modal.useModal();
    const [stores, setStores] = useState<SellerStoreResponse[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);

    useEffect(() => {
        Promise.all([loadCategories()])
            .then(() => {

            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    }, []);

    const loadStores = async (params: any) => {


        let response = await http.get(apiRoutes.stores, {
            params: {
                page: params.current - 1,
                size: params.pageSize
            }
        });
        const stores: [SellerStoreResponse] = response.data.data.data;
        return {
            data: stores,
            success: true,
            total: response.data.data.metadata.total,
        } as RequestData<SellerStoreResponse>;

    }

    const loadCategories = () => {
        return http.get(apiRoutes.categories)
            .then((response => {
                setCategories(response.data.data)
            }))
            .catch((error) => {
                handleErrorResponse(error);
            })
    }


    const handleActionOnSelect = (key: string, store: SellerStoreResponse) => {
        if (key === ActionKey.DELETE) {
            showDeleteConfirmation(store);
        } else if (key === ActionKey.UPDATE) {
            navigate(`${webRoutes.stores}/${store.id}`);
        } else if (key === ActionKey.UPLOAD) {
            navigate(`${webRoutes.stores}/${store.id}/upload`);
        }
    };

    const showDeleteConfirmation = (store: SellerStoreResponse) => {
        modal.confirm({
            title: 'Bạn có chắc chắn mua cửa hàng này?',
            icon: <WarningOutlined />,
            type: 'warn',
            content: (
                <ProDescriptions column={1} title=" ">
                    <ProDescriptions.Item valueType="avatar" label="Ảnh">
                        {store.imageUrl}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" label="Tên cửa hàng">
                        {store.storeName}
                    </ProDescriptions.Item>
                </ProDescriptions>
            ),
            okButtonProps: {
                className: 'bg-primary',
            },
            onOk: () => {
                return http
                    .delete(`${apiRoutes.stores}/${store.id}`)
                    .then(() => {
                        showNotification(
                            'Thành công',
                            NotificationType.SUCCESS,
                            `${store.storeName} đã được xóa`
                        );

                        actionRef.current?.reloadAndRest?.();
                    })
                    .catch((error) => {
                        handleErrorResponse(error);
                    });
            },
        });
    };


    const columns: ProColumns<SellerStoreResponse>[] = [
        {
            title: 'Ảnh cửa hàng',
            dataIndex: 'imageUrl',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: SellerStoreResponse) =>
                row.imageUrl ? (
                    <Avatar
                        shape="circle"
                        size="small"
                        src={
                            <LazyImage
                                src={row.imageUrl}
                                placeholder={<div className="bg-gray-100 h-full w-full" />}
                            />
                        }
                    />
                ) : (
                    <Avatar shape="circle" size="small">
                        {row.imageUrl?.charAt(0)?.toUpperCase()}
                    </Avatar>
                ),
        },
        {
            title: 'Tên cửa hàng',
            dataIndex: 'storeName',
            align: 'center',
            sorter: false,
            filterMode: 'menu',
            filtered: false,
            filterDropdownOpen: false,
            render: (_, row: SellerStoreResponse) => row.storeName,

        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            align: 'center',
            sorter: true,
            search: false,
            valueType: 'money',
            render: (_, row: SellerStoreResponse) => row.description
        },
        {
            title: 'Trạng thái cửa hàng',
            dataIndex: 'status',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: SellerStoreResponse) => (
                row.status === "ACTIVE" ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>
              )
        },
        {
            title: 'Địa chỉ cửa hàng',
            dataIndex: 'address',
            align: 'center',
            sorter: false,
            render: (_, row: SellerStoreResponse) => row.address
        },
        {
            title: 'Chức năng',
            align: 'center',
            key: 'option',
            fixed: 'right',
            render: (_, row: SellerStoreResponse) => [
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key) => handleActionOnSelect(key, row)}
                    menus={[
                        {
                            key: ActionKey.UPLOAD,
                            name: (
                                <Space>
                                    <BiUpload />
                                    Tải ảnh cho cửa hàng
                                </Space>
                            ),
                        },

                        {
                            key: ActionKey.UPDATE,
                            name: (
                                <Space>
                                    <MdUpdate />
                                    Cập nhật cửa hàng
                                </Space>
                            ),
                        },
                        {
                            key: ActionKey.DELETE,
                            name: (
                                <Space>
                                    <DeleteOutlined />
                                    Xóa cửa hàng
                                </Space>
                            ),
                        },
                    ]}
                >
                    <Icon component={CiCircleMore} className="text-primary text-xl" />
                </TableDropdown>,
            ],
        },
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
                    return loadStores(params);
                }}
                dateFormatter="number"
                search={false}
                toolBarRender={() => [
                    <Button icon={<BiPlus />} type="primary" onClick={() => navigate(`${webRoutes.stores}/create`)}>
                        Tạo mới
                    </Button>
                ]}
            />
            {modalContextHolder}
        </BasePageContainer>
    )
}

export default ViewCard;