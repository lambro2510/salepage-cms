import { Link, NavLink, useNavigate } from "react-router-dom";
import BasePageContainer from "../layout/PageContainer";
import { useEffect, useRef, useState } from "react";
import { ActionType, ProColumns, ProDescriptions, ProTable, RequestData, TableDropdown } from "@ant-design/pro-components";
import { Avatar, BreadcrumbProps, Button, Dropdown, Menu, Modal, Space, Switch } from "antd";
import { Store } from "antd/es/form/interface";
import { CategoryType } from "../../interfaces/enum/CategoryType";
import { NotificationType, handleErrorResponse, showNotification } from "../../utils";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { webRoutes } from "../../routes/web";
import Icon, { EllipsisOutlined, WarningOutlined, DownOutlined, UpOutlined, DeleteOutlined } from '@ant-design/icons';
import LazyImage from "../lazy-image";
import { CiCircleMore } from "react-icons/ci";
import { BiPlus, BiUpload } from "react-icons/bi";
import { MdUpdate, MdViewAgenda } from "react-icons/md";
import { ComboDto, ProductComboDetailResponse, SellerProductResponse, SellerStoreResponse } from "../../interfaces/Interface";

enum ActionKey {
    DELETE = 'delete',
    DETAIL = 'detail',
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
    const [productCombos, setProductCombos] = useState<ProductComboDetailResponse[]>([]);
    const [modal, modalContextHolder] = Modal.useModal();
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);

    const loadProductCombos = async (params : any) => {
        try {
            const productCombo = await http.get(`${apiRoutes.combos}`);
            const data = productCombo.data.data as ProductComboDetailResponse[];
            setProductCombos(productCombo.data.data);
            return {
                data : data,
                success: true,
                total : data.length
            } as RequestData<ProductComboDetailResponse>
        } catch (error) {
            handleErrorResponse(error);
            setProductCombos([]);
            return {
                data : [],
                success: false,
                total : 0
            } as RequestData<ProductComboDetailResponse>
        }

    };

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




    const handleActionOnSelect = (key: string, combo: ProductComboDetailResponse) => {
        if (key === ActionKey.DELETE) {
            showDeleteConfirmation(combo);
        } else if (key === ActionKey.UPDATE) {
            navigate(`${webRoutes.product_combo}/${combo.id}`);
        } else if (key === ActionKey.UPLOAD) {
            navigate(`${webRoutes.product_combo}/${combo.id}/upload`);
        } else if (key === ActionKey.DETAIL) {
            navigate(`${webRoutes.product_combo}/detail/${combo.id}`);
        }
    };

    const showDeleteConfirmation = (combo: ProductComboDetailResponse) => {
        modal.confirm({
            title: 'Bạn có chắc chắn mua xóa sản phẩm này?',
            icon: <WarningOutlined />,
            type: 'warn',
            content: (
                <ProDescriptions column={1} title=" ">
                    <ProDescriptions.Item valueType="avatar" label="Ảnh">
                        {combo.id}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" label="Tên sản phẩm">
                        {combo.comboName}
                    </ProDescriptions.Item>
                </ProDescriptions>
            ),
            okButtonProps: {
                className: 'bg-primary',
            },
            onOk: () => {
                return http
                    .delete(`${apiRoutes.products}/${combo.id}`)
                    .then(() => {
                        showNotification(
                            'Thành công',
                            NotificationType.SUCCESS,
                            `${combo.comboName} đã được xóa`
                        );

                        actionRef.current?.reloadAndRest?.();
                    })
                    .catch((error) => {
                        handleErrorResponse(error);
                    });
            },
        });
    };


    const columns: ProColumns<ProductComboDetailResponse>[] = [
        {
            title: 'Trạng thái',
            dataIndex: 'state',
            align: 'center',
            sorter: false,
            search: false,
            render: (_: any, row: ProductComboDetailResponse) =>
                <Switch checked={row.state == 'ACTIVE'} />

        },
        {
            title: 'Tên khuyến mãi',
            dataIndex: 'comboName',
            align: 'center',
            sorter: false,
            filterMode: 'menu',
            filtered: false,
            search: false,
            filterDropdownOpen: false,
            render: (_: any, row: ProductComboDetailResponse) => row.comboName,
        },
        {
            title: 'Số tiền giảm giá tối đa',
            dataIndex: 'maxDiscount',
            align: 'center',
            sorter: false,
            search: false,
            render: (_: any, row: ProductComboDetailResponse) => row.maxDiscount
        },
        {
            title: 'Giá trị giảm',
            dataIndex: 'type',
            align: 'center',
            sorter: false,
            search: false,
            render: (_: any, row: ProductComboDetailResponse) => row.type == "PERCENT" ? row.value + " % " : row.value
        },
        {
            title: 'Số lượng sản phẩm yêu cầu trên 1 lần thanh toán',
            dataIndex: 'quantityToUse',
            align: 'center',
            sorter: false,
            search: false,
            render: (_: any, row: ProductComboDetailResponse) => row.quantityToUse
        },
        {
            title: 'Chức năng',
            align: 'center',
            key: 'option',
            search: false,
            fixed: 'right',
            render: (_, row: ProductComboDetailResponse) => [
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
                            key: ActionKey.DETAIL,
                            name: (
                                <Space>
                                    <MdViewAgenda />
                                    Chi tiết sản phẩm
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
        }

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
                    return loadProductCombos(params);
                }}
                dateFormatter="number"
                search={false}
                toolBarRender={() => [
                    <Button icon={<BiPlus />} type="primary" onClick={() => navigate(`${webRoutes.product_combo}/create`)}>
                        Tạo mới
                    </Button>
                ]}
            />
            {modalContextHolder}
        </BasePageContainer>
    )
}

export default ViewCard;