import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ProForm,
    ProFormDigit,
    ProFormMoney,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
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

interface ProductProps {
    productName: string;
    description: string;
    categoryId: string;
    productPrice: number;
    storeIds: any[];
    origin: string;
    isForeign: boolean;
    size: number;
    sizeType: string;
    weight: number;
    weightType: string;
    colors: string[];
    isGuarantee: boolean;
    quantity: number;
    discountPercent: number;
}

const UpdateProduct = () => {
    const navigate = useNavigate();
    const { id, } = useParams();
    const [product, setProduct] = useState<ProductDetail>();
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadProduct = async () => {
        await http.get(`${apiRoutes.products}/${id}`)
            .then((response) => {
                let res = response?.data?.data as ProductDetail;
                console.log(res);

                setProduct(res);
                return (res)
            })
            .catch((error) => {
                handleErrorResponse(error);
            })
    };

    const loadStores = async () => {
        await http.get(apiRoutes.stores, {
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

    const loadCategories = async () => {
        await http.get(apiRoutes.categories, {
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
        Promise.all([loadStores(), loadCategories(), loadProduct()])
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

    const handleFinish = (values: ProductProps) => {
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
        <BasePageContainer breadcrumb={breadcrumb} loading={loading} >
            <ProForm
                initialValues={{
                    ...product, 
                    storeIds : product?.stores?.map((store) => store.storeId)
                }}
                onFinish={async (values: ProductProps) => handleFinish(values)}
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
                />
                <ProForm.Item>
                    <ProForm.Group >
                        <ProFormMoney name="productPrice" placeholder="Giá sản phẩm" />
                        <ProFormDigit name="discountPercent" placeholder={'% giảm giá sản phẩm'} />
                        <ProFormText name="origin" placeholder="Xuất xứ" />
                    </ProForm.Group >
                </ProForm.Item>
                <ProForm.Item >
                    <ProForm.Group>
                        <ProForm.Group grid>
                            <ProFormDigit name="size" placeholder={'Kích thước'} />
                            <ProFormSelect valueEnum={SizeType} name="sizeType" />
                        </ProForm.Group>

                        <ProForm.Group grid>
                            <ProFormDigit name="weight" placeholder="Trọng lượng" />
                            <ProFormSelect valueEnum={WeightType} name="weightType" />
                        </ProForm.Group>
                        <ProFormSelect
                            name="colors"
                            placeholder="Màu sắc"
                            mode="multiple"
                            options={[
                                { label: 'Đen', value: 'đen' },
                                { label: 'Trắng', value: 'trắng' },
                                { label: 'Xanh', value: 'xanh' },
                            ]}
                        />
                    </ProForm.Group>
                </ProForm.Item>
                <ProFormDigit name="quantity" placeholder="Số lượng sản phẩm bán" />
                <ProFormSwitch label='Được bảo hành' name="isGuarantee" />
                <ProFormSwitch name="isForeign" label="Sản phẩm cần nhập khẩu" />
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

export default UpdateProduct;
