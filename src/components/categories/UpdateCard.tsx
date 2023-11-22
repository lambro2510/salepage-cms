import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ProForm,
    ProFormDigit,
    ProFormMoney,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea, // Import ProForm components you need
} from '@ant-design/pro-components';
import { AutoComplete, BreadcrumbProps, Button, Form, Skeleton, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import {
    handleErrorResponse,
    NotificationType,
    showNotification,
} from '../../utils';
import { ProductDetail } from '../../interfaces/models/product';
import { Category } from '../../interfaces/models/category';
import { Store } from '../../interfaces/models/store';
import { SizeType, WeightType } from '../../interfaces/enum/ProductType';
import { CategoryType } from '../../interfaces/enum/CategoryType';
import { CreateProductCategoryTypeDto, ProductCategoryResponse, ProductTypeResponse } from '../../interfaces/interface';

const UpdateCard = () => {
    const navigate = useNavigate();
    const { id, } = useParams();
    const [form] = Form.useForm();
    const [product, setProduct] = useState<ProductDetail>();
    const [stores, setStores] = useState<Store[]>([]);
    const [category, setCategory] = useState<ProductCategoryResponse>({} as ProductCategoryResponse);
    const [loading, setLoading] = useState<boolean>(true);
    const [productTypes, setProductTypes] = useState<ProductTypeResponse[]>([]);

    const loadProductType = async (name : string | undefined) => {
        try{
            const response = await http.get(`${apiRoutes.productTypes}`, {
                params : {
                    productTypeName : name
                }
            })
            let productType = response.data.data as ProductTypeResponse[];
            setProductTypes(productType)
        }catch(ex){
            handleErrorResponse(ex);
        }
    }

    const loadCategories = async () => {
        try{
            const response = await http.get(`${apiRoutes.categories}/${id}`)
            console.log(response.data?.data);
            
            setCategory(response.data?.data)
        }catch(ex){
            handleErrorResponse(ex);
        }
    };

    useEffect(() => {
        Promise.all([ loadCategories(), loadProductType(undefined)])
            .then(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 100)
            })
            .catch((error) => {
                handleErrorResponse(error);
                setLoading(false)
            });
    }, [])

    const handleFinish = async (values: CreateProductCategoryTypeDto) => {
        try {
            setLoading(true)
            const response = await http.put(`${apiRoutes.categories}/${id}`, {
                ...values
            });

            showNotification(response?.data?.message, NotificationType.SUCCESS);
            navigate(-1);
        } catch (ex) {
            handleErrorResponse(ex)
        } finally {
            setLoading(false);
        }

    };
    const breadcrumb: BreadcrumbProps = {
        items: [
            {
                key: webRoutes.products,
                title: <Link to={webRoutes.products}>Sản phẩm</Link>,
            },
            {
                key: `${webRoutes.products}/${id}`,
                title: <Link to={`${webRoutes.products}/${id}`}>{product?.productName}</Link>,
            },
        ],
    };

    return (
        <BasePageContainer breadcrumb={breadcrumb} loading={loading} >
            <ProForm
                initialValues={category}
                onFinish={(values: CreateProductCategoryTypeDto) => handleFinish(values)}
                submitter={false}
                form={form}
                
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
                    label="Độ tuổi người sử dụng"
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
};

export default UpdateCard;
