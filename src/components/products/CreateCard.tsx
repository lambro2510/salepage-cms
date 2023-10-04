import React, { useEffect, useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea, ProFormCheckbox, ProFormDigit, ProFormSelect, ProFormMoney, ProFormSwitch } from '@ant-design/pro-form';
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

const CreateProduct = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [options, setOptions] = useState([])

    const loadStores = () => {
        http.get(apiRoutes.stores, {
            params: {
                page: 0,
                size: 100
            }
        })
            .then((response) => {
                setStores(response?.data?.data?.data);
            })
            .catch((error) => {
                handleErrorResponse(error);
            })
    };

    const loadCategories = () => {
        http.get(apiRoutes.categories, {
            params: {
                page: 0,
                size: 100
            }
        })
            .then((response) => {
                setCategories(response?.data?.data);
            })
            .catch((error) => {
                handleErrorResponse(error);
            })
    };

    useEffect(() => {
        Promise.all([loadStores(), loadCategories()])
            .then(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000)
            })
            .catch((error) => {
                handleErrorResponse(error);
                setLoading(false)
            });
    }, [])

    const handleFinish = async (values: ProductDto) => {
        setLoading(true);
        http
            .post(apiRoutes.products, { ...values })
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
                onFinish={(values: ProductDto) => handleFinish(values)}
                form={form}
                submitter={false}
            >
                <ProFormText
                    name="productName"
                    label="Tên sản phẩm"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên sản phẩm',
                        },
                    ]}
                />

                <ProFormTextArea name="description" label="Mô tả" />
                <ProFormSelect
                    name='storeIds'
                    label="Cửa hàng bán sản phẩm"
                    mode='multiple'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn cửa hàng',
                        },
                    ]}
                    options={stores.map(((store) => {
                        return {
                            label: store.storeName,
                            value: store.storeId
                        }
                    }))}
                />
                <ProFormSelect
                    name="categoryId"
                    label="Loại sản phẩm"
                    options={categories.map((category) => {
                        return {
                            label: category.categoryName,
                            value: category.categoryId,
                        };
                    })}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn loại sản phẩm',
                        },
                    ]}
                    initialValue={categories.length > 0 ? categories[0].categoryId : undefined}
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

export default CreateProduct;
