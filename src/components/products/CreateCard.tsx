import React, { useEffect, useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea, ProFormCheckbox, ProFormDigit, ProFormSelect, ProFormMoney, ProFormSwitch } from '@ant-design/pro-form';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { showNotification } from '../../utils';
import { NotificationType } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { handleErrorResponse } from '../../utils';
import { debounce } from 'lodash';
import { Store } from 'antd/es/form/interface';
import { Category } from '../../interfaces/models/category';
import { BreadcrumbProps, Button, Form } from 'antd';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';

enum SIZE {
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

    const handleFinish = async (values: ProductProps) => {
        setLoading(true);
        http
            .post(apiRoutes.products, { ...values })
            .then((response) => {
                setLoading(false);
                navigate(-1);
                showNotification(response?.data?.message, NotificationType.SUCCESS);
            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    };

    return (
        <BasePageContainer breadcrumb={breadcrumb}>

            <ProForm
                onFinish={(values: ProductProps) => handleFinish(values)}
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
                    name='storeId'
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
                <ProForm.Item>
                    <ProForm.Group >
                        <ProFormMoney name="productPrice" placeholder="Giá sản phẩm" />
                        <ProFormText name="origin" placeholder="Xuất xứ" />
                    </ProForm.Group >
                </ProForm.Item>
                <ProForm.Item >
                    <ProForm.Group>
                        <ProForm.Group grid>
                            <ProFormDigit name="size" placeholder={'Kích thước'} />
                            <ProFormSelect valueEnum={SIZE} initialValue={SIZE.CENTIMES} name="sizeType" />
                        </ProForm.Group>

                        <ProForm.Group grid>
                            <ProFormDigit name="weight" placeholder="Trọng lượng" />
                            <ProFormSelect valueEnum={WEIGHT} initialValue={WEIGHT.GRAM} name="weightType" />
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

export default CreateProduct;
