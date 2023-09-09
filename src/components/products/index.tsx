import {
    ActionType,
    ProTable,
    ProColumns,
    RequestData,
    TableDropdown,
    ProDescriptions,
    ProForm,
    ProFormInstance,
    ProFormDateRangePicker,
    ProFormDigit,
    ProFormRadio,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProFormMoney,
} from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps, Modal, Button, Dropdown, Menu, Space, FormInstance, Form } from 'antd';
import Icon, { EllipsisOutlined, WarningOutlined, DownOutlined, UpOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CiCircleMore } from 'react-icons/ci';
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

import { Product } from '../../interfaces/models/product';
import { ProductTransactionState } from '../../interfaces/enum/ProdTransactionState';
import { Store } from '../../interfaces/models/store';
import { Category } from '../../interfaces/models/category';

enum ActionKey {
    DELETE = 'delete',
    UPDATE = 'update'
}

interface CreateProduct {
    productName: string,
    description: string,
    categoryId: string,
    productPrice: number,
    sellingAddress: string,
    storeId: string,
    imageUrl: string,
    productId: string
}

const breadcrumb: BreadcrumbProps = {
    items: [
        {
            key: webRoutes.products,
            title: <Link to={webRoutes.products}>Sản phẩm</Link>,
        },
    ],
};

const Products = () => {
    const actionRef = useRef<ActionType>();
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, modalContextHolder] = Modal.useModal();
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        Promise.all([loadStores(), loadCategories()])
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    }, []);

    const loadStores = () => {
        return http.get(apiRoutes.stores, {
            params: {
                page: 0,
                size: 20
            }
        })
            .then((response => {
                setStores(response.data.data.data)
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
            showUpdateConfirmation(product);
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

    const showUpdateConfirmation = (product: Product) => {
        modal.confirm({
            title: 'Cập nhật sản phẩm?',
            icon: <ExclamationCircleOutlined />,
            type: 'warning',
            okText: 'Cập nhật',
            cancelText: 'Hủy bỏ',
            content: (
                <ProForm<{
                    productName: string;
                    categoryId?: string;
                    storeId?: string;
                    sellingAddress?: string;
                    productPrice?: number;
                }>
                    layout={'horizontal'}
                    labelAlign={'right'}
                >
                    <ProFormText
                        name="productName"
                        label="Tên sản phẩm"
                        placeholder="Nhập tên sản phẩm"
                        initialValue={product.productName}
                    />
                    <ProFormSelect
                        name="categoryId"
                        label="Loại sản phẩm"
                        options={categories.map(category => ({
                            value: category.categoryId,
                            label: category.categoryName
                        }))}
                        initialValue={product.categoryId}

                    />
                    <ProFormSelect
                        name="storeId"
                        label="Cửa hàng bán"
                        options={stores.map(store => ({
                            value: store.storeId,
                            label: store.storeName
                        }))}
                        initialValue={product.storeId}

                    />
                    <ProFormMoney
                        name="productPrice"
                        label="Giá tiền"
                        initialValue={product.productPrice}
                    />

                    <ProFormText
                        colProps={{ span: 24 }}
                        name="sellingAddress"
                        label="Địa chỉ bán hàng"
                        initialValue={product.description}
                    />
                    <ProFormTextArea
                        colProps={{ span: 24 }}
                        name="description"
                        label="Mô tả sản phẩm"
                        initialValue={product.description}
                    />
                </ProForm>
            ),
            okButtonProps: {
                className: 'bg-primary',
            },
            onOk: () => {

                return http
                    .put(`${apiRoutes.products}/${product.productId}`, {})
                    .then(() => {
                        showNotification(
                            'Thành công',
                            NotificationType.SUCCESS,
                            `${product} đã được cập nhật`
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
            title: 'Action',
            align: 'center',
            key: 'option',
            fixed: 'right',
            render: (_, row: Product) => [
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key) => handleActionOnSelect(key, row)}
                    menus={[
                        {
                            key: ActionKey.DELETE,
                            name: (
                                <Space>
                                    <DeleteOutlined />
                                    Xóa
                                </Space>
                            ),
                        },
                        {
                            key: ActionKey.UPDATE,
                            name: (
                                <Space>
                                    <DeleteOutlined />
                                    Cập nhật
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
                                <Link to={'#'} onClick={() => { console.log(props) }}>
                                    Thu nhỏ
                                    <UpOutlined />
                                </Link>
                            ]
                        }
                    },
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
            {modalContextHolder}
        </BasePageContainer>
    )
}

export default Products;