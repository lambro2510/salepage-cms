import { AutoComplete, BreadcrumbProps, Button, Form } from "antd";
import { webRoutes } from "../../routes/web";
import { Link, useParams } from "react-router-dom";
import BasePageContainer from "../layout/PageContainer";
import { useEffect, useState } from "react";
import { ProForm, ProFormText, ProFormTextArea, ProFormSwitch } from "@ant-design/pro-components";
import { debounce } from "lodash";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { NotificationType, handleErrorResponse, showNotification } from "../../utils";

interface StoreInfo {
    storeName: string;
    address: string;
    description: string;
    status: boolean;
    location: string;
}

const breadcrumb: BreadcrumbProps = {
    items: [
        {
            key: webRoutes.stores,
            title: <Link to={webRoutes.stores}>Cửa hàng</Link>,
        },
        {
            key: `${webRoutes.stores}/create`,
            title: 'Tạo mới'
        },
    ],
};

const CreateStore = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<string[]>([]);
    const [store, setStore] = useState<SellerStoreResponse>();
    const getAddressOptions = debounce((value: string) => {
        if (value) {
            http.get(apiRoutes.maps, {
                params: {
                    address: value,
                },
            })
                .then((response) => {
                    setOptions(response?.data?.data || []);
                })
                .catch((error) => {
                    handleErrorResponse(error);
                });
        }
    }, 300);

    const handleFinish = async (values: StoreInfo) => {
        setLoading(true);
        http.put(`${apiRoutes.stores}/${id}`, {
            ...values,
            status: values.status == true ? 'ACTIVE' : 'INACTIVE'
        })
            .then((response) => {
                setLoading(false);
                showNotification(response?.data?.message, NotificationType.SUCCESS);
            })
            .catch((error) => {
                setLoading(false);
                handleErrorResponse(error);
            });
    };

    const loadStore = async () => {
        try {
            let response = await http.get(`${apiRoutes.stores}/${id}`);
            let store = response?.data?.data as SellerStoreResponse;
            setStore(store);
        } catch (error) {
            handleErrorResponse(error);
            return [];
        }
    };

    useEffect(() => {
        loadStore();
    })
    return (
        <BasePageContainer breadcrumb={breadcrumb} loading={loading}>
            <ProForm
                initialValues={store}
                onFinish={(values: StoreInfo) => handleFinish(values)}
                form={form}
                submitter={false}
            >

                <ProFormText
                    name='storeName'
                    label='Tên cửa hàng'
                />

                <ProFormText
                    name='address'
                    label='Địa chỉ'
                    fieldProps={{
                        onChange: (value: any) => {
                            getAddressOptions(value);
                        }
                    }}
                >
                    <AutoComplete
                        style={{ width: '100%' }}
                        options={options.map((option) => ({ value: option }))}
                        placeholder='Địa chỉ'
                    />
                </ProFormText>

                <ProFormTextArea
                    name='description'
                    label='Mô tả'
                />

                <ProFormSwitch
                    name='status'
                    label='Trạng thái'
                />

                <Button
                    className="mt-4 bg-primary"
                    block
                    loading={loading}
                    type="primary"
                    size="large"
                    htmlType={'submit'}>Tạo mới</Button>
            </ProForm>
        </BasePageContainer>
    );
}

export default CreateStore;
