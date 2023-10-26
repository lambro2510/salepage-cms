import React, { useEffect, useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea, ProFormCheckbox, ProFormDigit, ProFormSelect, ProFormMoney, ProFormSwitch, ProFormList } from '@ant-design/pro-form';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { showNotification } from '../../utils';
import { NotificationType } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { handleErrorResponse } from '../../utils';
import { Store } from 'antd/es/form/interface';
import { Category } from '../../interfaces/models/category';
import { BreadcrumbProps, Button, Form } from 'antd';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import { SizeType, WeightType } from '../../interfaces/enum/ProductType';
import { ProCard } from '@ant-design/pro-components';
import { ComboDto, ProductCategoryResponse, ProductComboDetailResponse, ProductDto, SellerStoreResponse } from '../../interfaces/Interface';
import { DiscountType } from '../../interfaces/enum/Type';
import { ComboDtoInterface } from '../../interfaces/models/combo';


const breadcrumb: BreadcrumbProps = {
    items: [
        {
            key: webRoutes.products,
            title: <Link to={webRoutes.products}>Sản phẩm</Link>,
        },
        {
            key: `${webRoutes.products}`,
            title: 'Tạo mới'
        },
    ],
};

const CreateCombo = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false)

    const handleFinish = async (values: ComboDtoInterface) => {
        setLoading(true);
        http
            .post(apiRoutes.combos, {
                ...values,
                state: values.active == true ? "ACTIVE" : "INACTIVE"
            })
            .then((response) => {
                setLoading(false);
                navigate(-1);
                showNotification(response?.data?.message, NotificationType.SUCCESS);
            })
            .catch((error) => {
                setLoading(false);
                handleErrorResponse(error);
            });
    };

    return (
        <BasePageContainer breadcrumb={breadcrumb}>
            <ProForm
                onFinish={(values: ComboDtoInterface) => handleFinish(values)}
                form={form}
                submitter={false}
            >
                <ProFormText
                    name="comboName"
                    label="Tên khuyến mãi"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên sản phẩm',
                        },
                    ]}
                />
                <ProFormSelect
                    name='type'
                    label="Loại khuyến mãi"
                    valueEnum={DiscountType}
                />
                <ProFormDigit
                    name="value"
                    label="Giá trị giảm giá"
                />
                <ProFormDigit
                    name="quantityToUse"
                    label="Số lượng yêu cầu để áp dụng mã"
                />
                <ProFormMoney
                    customSymbol='vnd'
                    name="maxDiscount"
                    label="Giảm giá tối đa"
                />
                <ProFormSwitch
                    name="active"
                    label="Trạng thái"
                    valuePropName="checked" 
                    initialValue={"ACTIVE"} 
                    fieldProps={{
                        checkedChildren: "Kích hoạt",
                        unCheckedChildren: "Không kích hoạt",
                    }}
                />


                <Button
                    className="mt-4 bg-primary"
                    block
                    loading={loading}
                    type="primary"
                    size="large"
                    htmlType={'submit'}>Xác nhận
                </Button>
            </ProForm>
        </BasePageContainer>
    );
};

export default CreateCombo;
