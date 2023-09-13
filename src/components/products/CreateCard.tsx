import React, { useEffect, useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea, ProFormCheckbox, ProFormDigit, ProFormSelect, ProFormMoney } from '@ant-design/pro-form';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { showNotification } from '../../utils';
import { NotificationType } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { handleErrorResponse } from '../../utils';
import { debounce } from 'lodash';
import { Store } from 'antd/es/form/interface';
import { Category } from '../../interfaces/models/category';
import { BreadcrumbProps } from 'antd';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';

enum Size {
    CENTIMES = 'centimes',
    MES = 'met'
}

enum WEIGHT {
    KILOGRAM = 'kilogram',
    GRAM = 'gram'
}
interface ProductProps {
    productName: string;
    description: string;
    categoryId: string;
    productPrice: number;
    storeIds: string[];
    origin: string;
    isForeign: boolean;
    size: number;
    sizeType: string;
    weight: number;
    weightType: string;
    colors: string[];
    isGuarantee: boolean;
    quantity: number;
}

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

    const handleFinish = async (values: ProductProps) => {
        http
            .post(apiRoutes.products, { ...values })
            .then((response) => {
                showNotification(response?.data?.message, NotificationType.SUCCESS);
                navigate(-1);
            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    };

    return (
        <BasePageContainer breadcrumb={breadcrumb} loading={loading}>

            <ProForm onFinish={(values: ProductProps) => handleFinish(values)}>
                <ProFormText name="productName" label="Tên sản phẩm" />
                <ProFormTextArea name="description" label="Mô tả" />
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
                <ProFormMoney name="productPrice" label="Giá sản phẩm" />
                <ProFormSelect
                    name='storeId'
                    label="Cửa hàng bán sản phẩm"
                    mode='multiple'
                    options={stores.map(((store) => {
                        return {
                            label: store.storeName,
                            value: store.storeId
                        }
                    }))}
                />
                <ProFormText name="origin" label="Xuất xứ" />
                <ProFormCheckbox name="isForeign" label="Sản phẩm nhập khẩu" />
                <ProFormDigit  name="size" label="Kích thước" />
                <ProFormSelect valueEnum={Size} name="sizeType" label="Đơn vị kích thước" />
                <ProFormDigit name="weight" label="Trọng lượng" />
                <ProFormSelect valueEnum={WEIGHT} name="weightType" label="Đơn vị trọng lượng" />
                <ProFormSelect
                    name="colors"
                    label="Màu sắc"
                    mode="multiple"
                    options={[
                        { label: 'Đen', value: 'đen' },
                        { label: 'Trắng', value: 'trắng' },
                        { label: 'Xanh', value: 'xanh' },
                    ]}
                />
                <ProFormCheckbox name="isGuarantee" label="Bảo hành" />
                <ProFormDigit name="quantity" label="Số lượng" />
            </ProForm>
        </BasePageContainer>
    );
};

export default CreateProduct;
