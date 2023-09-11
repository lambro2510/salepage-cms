import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, // Import ProForm components you need
} from '@ant-design/pro-components';
import { BreadcrumbProps } from 'antd';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse } from '../../utils';
import { ProductDetail } from '../../interfaces/models/product';

const CreateProduct = () => {
    const { id, name } = useParams();
    const [product, setProduct] = useState<ProductDetail>();

    const loadProductDetail = () => {
        return http.get(`${apiRoutes.products}/detail/${id}`)
            .then((response) => {
                setProduct(response?.data?.data);
            }).catch((error) => {
                handleErrorResponse(error);
            })
    }
    useEffect(() => {
        Promise.all([loadProductDetail()])
            .then(() => {

            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    }, [])
    const breadcrumb: BreadcrumbProps = {
        items: [
            {
                key: webRoutes.products,
                title: <Link to={webRoutes.products}>Sản phẩm</Link>,
            },
            {
                key: `${webRoutes.products}/${id}/${name}`,
                title: <Link to={`${webRoutes.products}/${id}/${name}`}>{name}</Link>,
            },
        ],
    };

    return (
        <BasePageContainer breadcrumb={breadcrumb}>
            <ProForm
                syncToUrl={async (values, type) => {
                    if (type === 'get') {
                        http.get(`${apiRoutes.products}/detail/${id}`)
                            .then((response) => {
                                // console.log(response?.data?.data);
                                setProduct(response?.data?.data)
                                return response?.data?.data;
                            }).catch((error) => {
                                handleErrorResponse(error);
                            })
                    }
                    console.log('values');
                    console.log(values);
                    console.log('product');
                    console.log(product);
                }}
                params={loadProductDetail()}
                syncToInitialValues={true}
                initialValues={{
                    productName : product?.productName,
                }}
                submitter={
                    {
                        searchConfig:
                        {
                            submitText: 'Cập nhật',
                            resetText: 'Hủy bỏ',

                        }
                    }
                }

            >
                <ProFormText
                    name="productName"
                    label="Tên sản phẩm"
                    placeholder="Nhập tên sản phẩm"
                    rules={[
                        {
                            required: true,
                            message: 'Tên sản phẩm không được bỏ trống',
                        },
                    ]}
                />
                <ProFormSelect
                    label="Loại sản phẩm"
                    options={[]}
                />
                <ProFormSelect
                    label="Cửa hàng bán sản phẩm"
                    options={[]}
                />
                <ProFormTextArea
                    name="productDescription"
                    label="Mô tả"
                    placeholder="Nhập mô tả sản phẩm"
                />
                {/* Add more ProForm.Item components for other product fields */}

            </ProForm>
        </BasePageContainer>
    );
};

export default CreateProduct;
