import { AutoComplete, BreadcrumbProps, Button, Form } from "antd";
import { webRoutes } from "../../routes/web";
import { Link, useNavigate } from "react-router-dom";
import BasePageContainer from "../layout/PageContainer";
import { useEffect, useState } from "react";
import { ProForm, ProFormText, ProFormTextArea, ProFormSwitch, ProFormSelect } from "@ant-design/pro-components";
import { debounce } from "lodash";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { NotificationType, handleErrorResponse, showNotification } from "../../utils";
import { CategoryType } from "../../interfaces/enum/CategoryType";

interface CategoryInfo {
    categoryName: string,
    categoryType: CategoryType,
    description: string,
    productTypeId: string,
    rangeAge: string
}

const breadcrumb: BreadcrumbProps = {
    items: [
        {
            key: webRoutes.categories,
            title: <Link to={webRoutes.categories}>Loại hàng hóa</Link>,
        },
        {
            key: `${webRoutes.categories}/create`,
            title: 'Tạo mới'
        },
    ],
};

const CreateCategory = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(true);
    const [productTypes, setProductTypes] = useState<ProductTypeResponse[]>([]);

    const loadProductType = async (name : string | undefined) => {
        const response = await http.get(`${apiRoutes.productTypes}`, {
            params : {
                productTypeName : name
            }
        })
        setLoading(false)
        let productType = response.data.data as ProductTypeResponse[];
        setProductTypes(productType)
    };

    useEffect(() => {
        loadProductType(undefined);
    }, [])

    const handleFinish = async (values: CategoryInfo) => {
        setLoading(true);
        http.post(apiRoutes.categories, {
            ...values
        })
            .then((response) => {
                setLoading(false);
                showNotification(response?.data?.message, NotificationType.SUCCESS);
                navigate(-1);
            })
            .catch((error) => {
                setLoading(false);
                handleErrorResponse(error);
            });
    };

    return (
        <BasePageContainer breadcrumb={breadcrumb} loading={loading}>
            <ProForm
                onFinish={(values: CategoryInfo) => handleFinish(values)}
                form={form}
                submitter={false}
            >

                <ProFormText
                    name='categoryName'
                    label='Tên hàng hóa'
                />
                <ProFormSelect
                    name='productTypeId'
                    label='Loại mặt hàng'
                    options={productTypes}
                />
                <ProFormSelect
                    name='categoryType'
                    label='Kích cỡ loại hàng hóa'
                    valueEnum={CategoryType}
                />
                <ProFormText
                    name='rangeAge'
                    label='Độ tuổi người sử dụng'
                />
                <ProFormTextArea
                    name='description'
                    label='Mô tả'
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
}

export default CreateCategory;
