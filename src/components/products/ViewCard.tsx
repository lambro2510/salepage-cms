import { Link, NavLink, useNavigate } from "react-router-dom";
import BasePageContainer from "../layout/PageContainer";
import { useEffect, useRef, useState } from "react";
import { ActionType, ProColumns, ProDescriptions, ProTable, RequestData, TableDropdown } from "@ant-design/pro-components";
import { Avatar, BreadcrumbProps, Button, Modal, Space } from "antd";
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
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);

    useEffect(() => {
        Promise.all([loadStores(), loadCategories()])
            .then(() => {
                
            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    }, []);

    const loadStores = () => {
        return http.get(apiRoutes.stores, {
            params: {
                page: 0,
                size: 100
            }
        })
            .then((response => {
                setStores(response?.data?.data?.data)
            }))
            .catch((error) => {
                handleErrorResponse(error);
            })
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



    const loadProduct = (params: any) => {
        return http
            .get(apiRoutes.products, {
                params: {
                    storeName: params.storeName,
                },
            })
            .then((response) => {
                const products: [Product] = response.data.data.data;

                return {
                    data: products,
                    success: true,
                    total: response.data.data.metadata.total,
                } as RequestData<Product>;
            })
            .catch((error) => {
                handleErrorResponse(error);

                return {
                    data: [],
                    success: false,
                } as RequestData<Product>;
            });
    };


    const handleActionOnSelect = (key: string, product: Product) => {
        if (key === ActionKey.DELETE) {
            showDeleteConfirmation(product);
        } else if (key === ActionKey.UPDATE) {
            navigate(`${webRoutes.products}/${product.productId}`);
        }else if (key === ActionKey.UPLOAD) {
            navigate(`${webRoutes.products}/${product.productId}/upload`);
        }
    };

    const showDeleteConfirmation = (product: Product) => {
        modal.confirm({
            title: 'Bạn có chắc chắn mua xóa sản phẩm này?',
            icon: <WarningOutlined />,
            type: 'warn',
            content: (
                <ProDescriptions column={1} title=" ">
                    <ProDescriptions.Item valueType="avatar" label="Ảnh">
                        {product.imageUrl}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" label="Tên sản phẩm">
                        {product.productName}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" label="Tên cửa hàng">
                        {product.storeName}
                    </ProDescriptions.Item>
                </ProDescriptions>
            ),
            okButtonProps: {
                className: 'bg-primary',
            },
            onOk: () => {
                return http
                    .delete(`${apiRoutes.products}/${product.productId}`)
                    .then(() => {
                        showNotification(
                            'Thành công',
                            NotificationType.SUCCESS,
                            `${product} đã được xóa`
                        );

                        actionRef.current?.reloadAndRest?.();
                    })
                    .catch((error) => {
                        handleErrorResponse(error);
                    });
            },
        });
    };


    const columns: ProColumns<Product>[] = [
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'productImage',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Product) =>
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
                        {row.productName.charAt(0).toUpperCase()}
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
            filterDropdownOpen: false,
            render: (_, row: Product) => row.productName,

        },
        {
            title: 'Giá tiền',
            dataIndex: 'productPrice',
            align: 'center',
            sorter: true,
            search: false,
            valueType: 'money',
            render: (_, row: Product) => row.productPrice
        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'categoryName',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Product) => row.categoryName
        },
        {
            title: 'Cửa hàng',
            dataIndex: 'storeName',
            align: 'center',
            sorter: false,
            render: (_, row: Product) => row.storeName
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Product) => row.description
        },
        {
            title: 'Đia chỉ bán hàng',
            dataIndex: 'sellingAddress',
            align: 'center',
            sorter: false,
            search: false,
            render: (_, row: Product) => row.sellingAddress
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
            title: 'Chức năng',
            align: 'center',
            key: 'option',
            fixed: 'right',
            render: (_, row: Product) => [
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key) => handleActionOnSelect(key, row)}
                    menus={[
                        {
                            key: ActionKey.UPLOAD,
                            name: (
                                <Space>
                                    <BiUpload />
                                    Tải ảnh cho sản phẩm
                                </Space>
                            ),
                        },

                        {
                            key: ActionKey.UPDATE,
                            name: (
                                <Space>
                                    <MdUpdate />
                                    Cập nhật sản phẩm
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
    ]

    return(
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
                    return loadProduct(params);
                }}
                dateFormatter="number"
                search={{
                    labelWidth: 'auto',
                    filterType: 'query',
                    showHiddenNum: true,
                    searchText: 'Tìm kiếm',
                    resetText: 'Xóa bộ lọc',
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
                                <Link to={'#'}>
                                    Thu nhỏ
                                    <UpOutlined />
                                </Link>
                            ]
                        }
                    },
                }}
                toolBarRender={() => [
                    <Button icon={<BiPlus/>} type="primary">
                        <Link to={'create'} >Tạo mới</Link>
                    </Button>
                ]}
            />
            {modalContextHolder}
        </BasePageContainer>
    )
}

export default ViewCard;