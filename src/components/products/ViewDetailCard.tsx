import {
  BreadcrumbProps,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import BasePageContainer from '../layout/PageContainer';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import {
  ActionType,
  EditableProTable,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormDigitRange,
  ProFormList,
  ProFormText,
  ProTable,
  RequestData,
} from '@ant-design/pro-components';
import { handleErrorResponse, showNotification } from '../../utils';
import {
  ProductDetailInfoResponse,
  SellerProductResponse,
} from '../../interfaces/interface';

const { Title, Text } = Typography;

const DetailCard = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();
  const [form] = ProForm.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [product, setProduct] = useState<SellerProductResponse>();
  const [details, setDetails] = useState<ProductDetailInfoResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.products,
        title: <Link to={webRoutes.products}>Sản phẩm</Link>,
      },
    ],
  };

  const deleteDetail = async (productDetailId: string) => {
    try {
      const response = await http.delete(
        `${apiRoutes.product_detail}/${productDetailId}`
      );
      showNotification(response.data.message);
      actionRef.current?.reloadAndRest?.();
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const updateDetail = async (
    value: ProductDetailInfoResponse,
    productDetailId: any
  ) => {
    try {
      console.log(value);

      let response;
      const hexColor = hsvToHexAlt(
        value.type.color.metaColor.originalInput.h,
        value.type.color.metaColor.originalInput.s,
        value.type.color.metaColor.originalInput.v,
        value.type.color.metaColor.originalInput.a
      );
      if (productDetailId != ' ') {
        response = await http.put(
          `${apiRoutes.product_detail}/${productDetailId}`,
          {
            ...value,
            type: {
              type: value.type.type,
              color: hexColor,
            },
          }
        );
        showNotification(response.data.message);
      } else {
        response = await http.post(`${apiRoutes.product_detail}`, {
          ...value,
          type: {
            type: value.type.type,
            color: hexColor,
          },
        });
        showNotification(response.data.message);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      actionRef.current?.reloadAndRest?.();
    }
  };

  function hsvToHexAlt(h: number, s: number, v: number, a: number) {
    h = (h + 360) % 360; // Ensure h is in the range [0, 360)
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r, g, b;
    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');

    const hexColor = `#${hexR}${hexG}${hexB}`;
    return hexColor.toUpperCase();
  }

  const getProductDetail = async () => {
    try {
      const response = await http.get(`${apiRoutes.product_detail}/${id}`);
      const details = response.data.data as ProductDetailInfoResponse[];
      return {
        data: details,
        total: details.length,
        success: true,
      } as RequestData<ProductDetailInfoResponse>;
    } catch (err) {
      handleErrorResponse(err);
      return {
        data: [],
        total: 0,
        success: false,
      } as RequestData<ProductDetailInfoResponse>;
    }
  };

  const getProduct = async () => {
    const response = await http.get(`${apiRoutes.products}/${id}`);
    const product = response.data.data as SellerProductResponse;
    setProduct(product);
  };

  const columns: ProColumns<ProductDetailInfoResponse>[] = [
    {
      hideInTable: true,
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      align: 'center',
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: ['type', 'type'],
      valueType: 'text',
      align: 'center',
    },
    {
      title: 'Màu hiển thị',
      dataIndex: ['type', 'color'],
      valueType: 'color',
      align: 'center',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      valueType: 'digit',
      align: 'center',
    },
    {
      title: 'Giá gốc (VND)',
      dataIndex: 'originPrice',
      valueType: 'digit',
      align: 'center',
    },
    {
      title: 'Phần trăm giảm giá (%)',
      dataIndex: 'discountPercent',
      valueType: 'digit',
      align: 'center',
    },
    {
      title: 'Giá bán (VND)',
      dataIndex: 'sellPrice',
      valueType: 'digit',
      align: 'center',
      editable: false,
    },
    {
      title: 'Hành động',
      valueType: 'option',
      align: 'center',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Chỉnh sửa
        </a>,
        <a
          key="delete"
          onClick={() => {
            deleteDetail(record.id);
          }}
        >
          Xoá
        </a>,
      ],
    },
  ];

  useEffect(() => {
    getProductDetail();
    getProduct();
  }, []);

  return (
    <BasePageContainer loading={loading} breadcrumb={breadcrumb}>
      <ProForm form={form} submitter={false}>
        <div className="text-center">
          <Title level={3}>{product?.productName}</Title>
        </div>
        <div className="p-4 bg-white border rounded shadow-md">
          <div>
            {product?.productInfos?.map((productInfo, index) => (
              <div key={index} className="p-2 border rounded">
                <Text strong>{productInfo.label}: </Text>
                <Text>{productInfo.value}</Text>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <Title level={5}>Chi tiết các loại sản phẩm</Title>
        </div>

        <EditableProTable<ProductDetailInfoResponse>
          request={async () => getProductDetail()}
          columns={columns}
          actionRef={actionRef}
          recordCreatorProps={{
            position: 'bottom',
            record: (index, dataSource) =>
              ({
                id: ' ',
                productId: id,
                type: {
                  type: '',
                  color: '',
                },
                quantity: 0,
                originPrice: 0,
                sellPrice: 0,
                discountPercent: 0,
              } as ProductDetailInfoResponse),
            creatorButtonText: 'Thêm mới',
          }}
          dataSource={details}
          rowKey="id"
          options={false}
          pagination={false}
          editable={{
            cancelText: 'Huỷ bỏ',
            saveText: 'Lưu',
            deleteText: 'Xoá',
            type: 'multiple',
            editableKeys,
            deletePopconfirmMessage: 'Xác nhận xoá',
            onlyOneLineEditorAlertMessage: 'Vui lòng hoàn thành chỉnh sửa',
            onlyAddOneLineAlertMessage: 'Vui lòng hoàn thành thêm mới',
            onSave: async (rowKey, data, row) => {
              updateDetail(data, rowKey);
            },
            onChange: setEditableRowKeys,
          }}
        />
      </ProForm>
    </BasePageContainer>
  );
};

export default DetailCard;
