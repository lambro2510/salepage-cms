import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Form, Button, Spin } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormList,
  ProCard,
} from '@ant-design/pro-components';
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
import { ProductDto, SellerStoreResponse } from '../../interfaces/interface';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [stores, setStores] = useState<SellerStoreResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProduct = async () => {
    try {
      const response = await http.get(`${apiRoutes.products}/${id}`);
      const res = response?.data?.data as ProductDetail;
      setProduct(res);
      return {
        ...res,
        stores: res.stores.map((store) => {
          return {
            label: store.storeName,
            value: store.id,
          };
        }),
      };
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const loadStores = async () => {
    try {
      const response = await http.get(apiRoutes.stores, {
        params: {
          page: 0,
          size: 100,
        },
      });
      setStores(response?.data?.data?.data);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await http.get(apiRoutes.categories, {
        params: {
          page: 0,
          size: 100,
        },
      });
      setCategories(response?.data?.data);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  useEffect(() => {
    Promise.all([loadStores(), loadCategories(), loadProduct()])
      .then(() => setLoading(false))
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  }, []);

  const handleFinish = async (values: any): Promise<boolean> => {
    setLoading(true);
    try {
      console.log(values);

      const response = await http.put(`${apiRoutes.products}/${id}`, {
        ...values,
        sellerStoreIds: values.stores,
      } as ProductDto);
      setLoading(false);
      showNotification(response?.data?.message, NotificationType.SUCCESS);
      navigate(-1);
      return true;
    } catch (error) {
      setLoading(false);
      handleErrorResponse(error);
      return false;
    }
  };

  return (
    <BasePageContainer
      breadcrumb={{
        items: [
          {
            key: webRoutes.products,
            title: <Link to={webRoutes.products}>Sản phẩm</Link>,
          },
          {
            key: `${webRoutes.products}/${id}`,
            title: (
              <Link to={`${webRoutes.products}/${id}`}>
                {product?.productName}
              </Link>
            ),
          },
        ],
      }}
      loading={loading}
    >
      <ProForm
        request={() => loadProduct()}
        onFinish={(values) => handleFinish(values)}
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

        <ProFormSelect
          name="categoryId"
          label="Loại sản phẩm"
          options={categories.map((category) => {
            return {
              label: category.categoryName,
              value: category.id,
            };
          })}
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn loại sản phẩm',
            },
          ]}
        />

        <ProFormSelect
          name="stores"
          label="Cửa hàng bán sản phẩm"
          mode="multiple"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn cửa hàng',
            },
          ]}
          options={stores.map((store) => {
            return {
              label: store.storeName,
              value: store.id,
            };
          })}
        />

        <ProFormList
          name="productInfos"
          label="Thông tin sản phẩm"
          creatorButtonProps={{
            creatorButtonText: 'Thêm thông tin',
          }}
          copyIconProps={false}
          itemRender={({ listDom, action }, { index }) => (
            <ProCard
              bordered
              title={`Thông tin sản phẩm ${index + 1}`}
              style={{ marginBottom: 8 }}
              extra={action}
              bodyStyle={{ paddingBottom: 0 }}
            >
              <ProFormText name={'label'} placeholder="Thông tin sản phẩm" />
              <ProFormText name={'value'} placeholder="Chi tiết thông tin" />
            </ProCard>
          )}
        />
        <Button
          className="mt-4 bg-primary"
          block
          loading={loading}
          type="primary"
          size="large"
          htmlType="submit"
        >
          Xác nhận
        </Button>
      </ProForm>
    </BasePageContainer>
  );
};

export default UpdateProduct;
