import { BreadcrumbProps, Button, Col, ColorPicker, Modal, Row, Typography } from "antd";
import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom";
import { webRoutes } from "../../routes/web";
import BasePageContainer from "../layout/PageContainer";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { ActionType, EditableProTable, ProCard, ProColumns, ProDescriptions, ProForm, ProFormDigit, ProFormDigitRange, ProFormList, ProFormText, ProTable, RequestData } from "@ant-design/pro-components";
import { handleErrorResponse, showNotification } from "../../utils";
import { ProductComboResponse } from "../../interfaces/interface";
import { ActiveState, DiscountType } from "../../interfaces/enum/Type";
import { FaInfo } from "react-icons/fa";

const { Title, Text } = Typography;

const ViewCard = () => {
    const actionRef = useRef<ActionType>();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [combos, setCombos] = useState<ProductComboResponse[]>();
    const [loading, setLoading] = useState<boolean>(false)
    const [modal, modalContextHolder] = Modal.useModal();

    const breadcrumb: BreadcrumbProps = {
        items: [
            {
                key: webRoutes.products,
                title: <Link to={webRoutes.products}>Sản phẩm</Link>,
            },

        ],
    };

    const deleteCombo = async (comboId: string) => {
        try {
            let response = await http.delete(`${apiRoutes.combos}/${comboId}`);
            showNotification(response.data.message)
            actionRef.current?.reloadAndRest?.();
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    const showComboDetail = (comboId: string) => {
        modal.confirm({
            title: 'Bạn có chắc chắn mua xóa sản phẩm này?',
            icon: <FaInfo />,
            type: 'warn',
            content: (
                <ProDescriptions column={1} title=" ">
                    <ProDescriptions.Item valueType="avatar" label="Ảnh">
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" label="Tên sản phẩm">
                    </ProDescriptions.Item>
                </ProDescriptions>
            ),
            okButtonProps: {
                className: 'bg-primary',
            },
            onOk: () => {
                
            },
        });
    };
    const updateCombo = async (value: ProductComboResponse, comboId: any) => {
        try {
            let response;
            if (comboId != ' ') {
                response = await http.put(`${apiRoutes.combos}/${comboId}`, value);
                showNotification(response.data.message)
            } else {
                response = await http.post(`${apiRoutes.combos}`, value);
                showNotification(response.data.message)
            }
        } catch (error) {
            handleErrorResponse(error)
        } finally {
            actionRef.current?.reloadAndRest?.();
        }
    }
    const getProductCombo = async () => {
        try {
            const response = await http.get(`${apiRoutes.combos}`)
            const combos = response.data.data as ProductComboResponse[];
            setCombos(combos)
            return {
                data: combos,
                total: combos.length,
                success: true,
            } as RequestData<ProductComboResponse>
        } catch (err) {
            handleErrorResponse(err)
            return {
                data: [],
                total: 0,
                success: false,
            } as RequestData<ProductComboResponse>
        }
    };

    const columns: ProColumns<ProductComboResponse>[] = [
        {
            title: "ID",
            dataIndex: "id",
            valueType: "text",
            align: "center",
            editable: false,
        },
        {
            title: "Tên combo",
            dataIndex: "comboName",
            valueType: "text",
            align: "center",
        },
        {
            title: "Giảm giá theo",
            dataIndex: "type",
            valueEnum: DiscountType,
            align: "center",
        },
        {
            title: "Trạng thái",
            dataIndex: "state",
            valueEnum: ActiveState,
            align: "center",
        },
        {
            title: "Giá trị giảm giá",
            dataIndex: "value",
            valueType: "digit",
            align: "center",
        },
        {
            title: "Số lượng yêu cầu để áp dụng",
            dataIndex: "quantityToUse",
            valueType: "digit",
            align: "center",
        },
        {
            title: "Giảm giá tối đa (VND)",
            dataIndex: "maxDiscount",
            valueType: "digit",
            align: "center",
        },
        {
            title: "Hành động",
            valueType: "option",
            align: "center",
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    Chỉnh sửa
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        deleteCombo(record.id);
                    }}
                >
                    Xoá
                </a>,
                <a
                    key="detail"
                    onClick={() => {
                        showComboDetail(record.id);
                    }}
                >
                    Chi tiết
                </a>,
            ],
        },
    ];

    useEffect(() => {
        getProductCombo();
    }, [])

    return (
        <BasePageContainer loading={loading} breadcrumb={breadcrumb}>
            <EditableProTable<ProductComboResponse>
                request={async (params, sort) => getProductCombo()}
                columns={columns}
                actionRef={actionRef}

                recordCreatorProps={{
                    position: 'bottom',
                    record: (index, dataSource) => ({
                        id: " ",
                        comboName: "",
                        type: "PERCENT",
                        state: "ACTIVE",
                        value: 0,
                        quantityToUse: 2,
                        maxDiscount: 0
                    } as ProductComboResponse),
                    creatorButtonText: "Thêm mới",
                }}
                dataSource={combos}
                rowKey="id"
                options={false}
                pagination={false}

                editable={{
                    cancelText: "Huỷ bỏ",
                    saveText: "Lưu",
                    deleteText: 'Xoá',
                    type: 'multiple',
                    editableKeys,
                    deletePopconfirmMessage: 'Xác nhận xoá',
                    onlyOneLineEditorAlertMessage: 'Vui lòng hoàn thành chỉnh sửa',
                    onlyAddOneLineAlertMessage: 'Vui lòng hoàn thành thêm mới',
                    onSave: async (rowKey, data, row) => {
                        updateCombo(data, rowKey);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
            {modalContextHolder}
        </BasePageContainer>
    )
}

export default ViewCard;