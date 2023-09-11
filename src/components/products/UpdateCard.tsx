import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ProForm,
    ProFormMoney,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, // Import ProForm components you need
} from '@ant-design/pro-components';
import { AutoComplete, BreadcrumbProps, Skeleton, Spin } from 'antd';
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

const CreateProduct = () => {
    const navigate = useNavigate();
    const { id, } = useParams();
    const [product, setProduct] = useState<ProductDetail>();
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [options, setOptions] = useState([])
    const loadProduct = () => {
        http.get(`${apiRoutes.products}/detail/${id}`)
            .then((response) => {
                setProduct(response?.data?.data);
            })
            .catch((error) => {
                handleErrorResponse(error);
            })
    }
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
                setCategories(response?.data?.data?.map((data: string) => {
                    return {
                        value: data
                    }
                }));
            })
            .catch((error) => {
                handleErrorResponse(error);
            })
    };

    const getAddressOptions = debounce((value : any) => {
        console.log('debonce');
        
        if (value) {
          // Gọi lên server ở đây, bạn có thể sử dụng fetch hoặc axios hoặc thư viện gọi API khác
          http.get(apiRoutes.maps, {
            params: {
              address: value,
            },
          })
          .then((response) => {
            setProduct({ ...product, sellingAddress: value });
            setOptions(response?.data?.data.map((data: string) => ({ value: data })));
          })
          .catch((error) => {
            handleErrorResponse(error);
          });
        }
      }, 800);

    useEffect(() => {
        Promise.all([loadStores(), loadCategories(), loadProduct()])
            .then(() => {

                console.log(product);

                setTimeout(() => {
                    setLoading(false);
                }, 1000)
            })
            .catch((error) => {
                handleErrorResponse(error);
                setLoading(false)
            });
    }, [])

    const handleFinish = (values: any) => {
        setLoading(true)
        http.put(`${apiRoutes.products}/${id}`, {
            ...values
        })
            .then((response) => {
                setLoading(false)
                showNotification(response?.data?.message, NotificationType.SUCCESS);
                navigate(-1);
            }).catch((error) => {
                setLoading(false)
                handleErrorResponse(error);
            })

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
        <BasePageContainer breadcrumb={breadcrumb} loading={loading}>
            <ProForm
                onFinish={async (values) => handleFinish(values)}
                onReset={() => navigate(-1)}
                initialValues={product}
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
                    name="categoryId"
                    label="Loại sản phẩm"
                    options={categories.map((category) => {
                        return {
                            label: category.categoryName,
                            value: category.categoryId
                        }
                    })}
                />
                <ProFormSelect
                    name='storeId'
                    label="Cửa hàng bán sản phẩm"
                    options={stores.map(((store) => {
                        return {
                            label: store.storeName,
                            value: store.storeId
                        }
                    }))}
                />
                <ProFormMoney
                    name='productPrice'
                    label='Giá tiền'
                    customSymbol="đ"
                />
                <ProFormText
                    name='sellingAddress'
                    label='Địa chỉ bản hàng'
                    fieldProps={{
                        onChange: (value) => {
                            getAddressOptions(value)
                        }
                    }}

                    children={
                    <AutoComplete
                        style={{ width: '100%' }}
                        options={options}
                        placeholder='Địa chỉ bán hàng'
                        disabled={false}
                        loading={true}
                    />
                }
                />
                <ProFormTextArea
                    name="description"
                    label="Mô tả"
                    placeholder="Nhập mô tả sản phẩm"
                />

            </ProForm>
        </BasePageContainer>
    );
};

export default CreateProduct;
