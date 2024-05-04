import {
  BreadcrumbProps,
  Button,
  Col,
  ColorPicker,
  Modal,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { webRoutes } from '../../../routes/web';
import BasePageContainer from '../../layout/PageContainer';
import http from '../../../utils/http';
import { apiRoutes } from '../../../routes/api';
import {
  ActionType,
  EditableProTable,
  ProCard,
  ProColumns,
  ProDescriptions,
  ProForm,
  ProFormDigit,
  ProFormDigitRange,
  ProFormList,
  ProFormText,
  ProTable,
  RequestData,
} from '@ant-design/pro-components';
import { handleErrorResponse, showNotification } from '../../../utils';
import {
  ProductComboResponse,
  SellerStoreResponse,
} from '../../../interfaces/interface';
import { ActiveState, DiscountType } from '../../../interfaces/enum/Type';
import ProductSelect from '../../basic/ProductSelect';
import { ProductInComboResponse } from '../../../interfaces/models/combo';

const { Title, Text } = Typography;

const ViewCard = () => {
  const { storeId } = useParams();

  const actionRef = useRef<ActionType>();
  const [store, setStore] = useState<SellerStoreResponse>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [combos, setCombos] = useState<ProductComboResponse[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [current, setCurrent] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [productInCombo, setProductInCombo] = useState<
    ProductInComboResponse[]
  >([]);
  const [selectComboId, setSelectComboId] = useState<string>('');
  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.stores,
        title: <Link to={webRoutes.stores}>Cửa hàng</Link>,
      },
      {
        key: `${webRoutes.stores}/:${storeId}`,
        title: (
          <Link to={`${webRoutes.stores}/:${storeId}`}>{store?.storeName}</Link>
        ),
      },
    ],
  };

  const getSellStore = async () => {
    try {
      const response = await http.get(`${apiRoutes.stores}/${storeId}`);
      setStore(response.data.data);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  useEffect(() => {
    getSellStore();
  }, []);

  useEffect(() => {
    if (selectComboId) {
      getProductInCombo(selectComboId, current);
    }
  }, [selectComboId, current]);

  const removeProductInCombo = async (productId: string) => {
    try {
      const response = await http.delete(
        `${apiRoutes.combos}/product/${selectComboId}`,
        {
          params: {
            productId: productId,
          },
        }
      );
      await getProductInCombo(selectComboId, current);
      showNotification('Sản phẩm đã được loại khỏi khuyến mãi');
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const addProductInCombo = async (productId: string) => {
    try {
      const response = await http.put(
        `${apiRoutes.combos}/product/${selectComboId}`,
        {},
        {
          params: {
            productId: productId,
          },
        }
      );
      await getProductInCombo(selectComboId, current);
      showNotification('Sản phẩm đã được thêm vào khuyến mãi');
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const deleteCombo = async (comboId: string) => {
    try {
      const response = await http.delete(`${apiRoutes.combos}/${comboId}`);
      showNotification(response.data.message);
      actionRef.current?.reloadAndRest?.();
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const getProductInCombo = async (comboId: string, page: number) => {
    console.log('comboId: ', comboId);
    try {
      if (!comboId) {
        return;
      }
      const response = await http.get(
        `${apiRoutes.combos}/product/${comboId}`,
        {
          params: {
            page: page - 1,
            size: 6,
          },
        }
      );
      setCurrent(page);
      setTotal(response.data.data.metadata.total);
      setProductInCombo(response.data.data.data);
    } catch (err) {
      handleErrorResponse(err);
      return [];
    }
  };

  const updateCombo = async (value: ProductComboResponse, comboId: any) => {
    try {
      let response;
      if (comboId != ' ') {
        response = await http.put(`${apiRoutes.combos}/${comboId}`, value);
        showNotification(response.data.message);
      } else {
        response = await http.post(`${apiRoutes.combos}`, {
          ...value,
          storeId: storeId,
        });
        showNotification(response.data.message);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      actionRef.current?.reloadAndRest?.();
    }
  };
  const getProductCombo = async () => {
    try {
      const response = await http.get(`${apiRoutes.combos}/${storeId}`);
      const combos = response.data.data as ProductComboResponse[];
      setCombos(combos);
      return {
        data: combos,
        total: combos.length,
        success: true,
      } as RequestData<ProductComboResponse>;
    } catch (err) {
      handleErrorResponse(err);
      return {
        data: [],
        total: 0,
        success: false,
      } as RequestData<ProductComboResponse>;
    }
  };

  const columns: ProColumns<ProductComboResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      align: 'center',
      hideInTable: true,
      editable: false,
    },
    {
      title: 'Tên combo',
      dataIndex: 'comboName',
      valueType: 'text',
      align: 'center',
    },
    {
      title: 'Giảm giá theo',
      dataIndex: 'type',
      valueEnum: DiscountType,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      valueEnum: ActiveState,
      align: 'center',
    },
    {
      title: 'Giá trị giảm giá',
      dataIndex: 'value',
      valueType: 'digit',
      align: 'center',
    },
    {
      title: 'Số lượng yêu cầu để áp dụng',
      dataIndex: 'quantityToUse',
      valueType: 'digit',
      align: 'center',
    },
    {
      title: 'Giảm giá tối đa (VND)',
      dataIndex: 'maxDiscount',
      valueType: 'digit',
      align: 'center',
    },
    {
      title: 'Chức năng',
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
            deleteCombo(record.id);
          }}
        >
          Xoá
        </a>,
        <a
          key="detail"
          onClick={async () => {
            setSelectComboId(record.id);
            setCurrent(0);
            setShowDetailModal(true);
          }}
        >
          <Tooltip title={'Sản phẩm áp dụng khuyến mãi'}>Chi tiết</Tooltip>
        </a>,
      ],
    },
  ];

  useEffect(() => {
    getProductCombo();
  }, []);

  return (
    <BasePageContainer loading={loading} breadcrumb={breadcrumb}>
      <EditableProTable<ProductComboResponse>
        request={async (params, sort) => getProductCombo()}
        columns={columns}
        actionRef={actionRef}
        recordCreatorProps={{
          position: 'bottom',
          record: (index, dataSource) =>
            ({
              id: ' ',
              comboName: '',
              type: 'PERCENT',
              state: 'ACTIVE',
              value: 0,
              quantityToUse: 2,
              maxDiscount: 0,
            } as ProductComboResponse),
          creatorButtonText: 'Thêm mới',
        }}
        dataSource={combos}
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
            updateCombo(data, rowKey);
          },
          onChange: setEditableRowKeys,
        }}
      />
      {modalContextHolder}
      <Modal
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        onOk={() => setShowDetailModal(false)}
      >
        <ProductSelect
          page={current}
          products={productInCombo}
          title=""
          size={6}
          setPage={setCurrent}
          total={total}
          removeProduct={(id: string) => removeProductInCombo(id)}
          selectProduct={(id: string) => addProductInCombo(id)}
        />
      </Modal>
    </BasePageContainer>
  );
};

export default ViewCard;
