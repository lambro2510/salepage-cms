import { Tag, Avatar, Space, BreadcrumbProps, Modal, Button } from 'antd';
import {
  ActionType,
  ProColumns,
  ProTable,
  RequestData,
  TableDropdown,
} from '@ant-design/pro-components';
import {
  MdDelete,
  MdDetails,
  MdDiscount,
  MdUpdate,
  MdUpload,
} from 'react-icons/md';
import { CiCircleMore } from 'react-icons/ci';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { ActionKey } from '../../interfaces/enum/Type';
import { webRoutes } from '../../routes/web';
import { VoucherStoreResponse } from '../../interfaces/interface';
import BasePageContainer from '../layout/PageContainer';
import { BiPlus } from 'react-icons/bi';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse, showNotification } from '../../utils';
import CreateVoucherModal from './modal/createVoucher';

const ViewCard = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleActionOnSelect = (key: any, row: VoucherStoreResponse) => {
    if (key == ActionKey.DELETE) {
      deleteVoucher(row.voucherStoreId);
    } else if (key == ActionKey.DETAIL) {
      navigate(
        `${webRoutes.vouchers}/${row.voucherStoreId}/${row.voucherStoreName}`
      );
    }
  };

  const deleteVoucher = async (voucherStoreId: string) => {
    try {
      const response = await http.delete(`${apiRoutes.voucher}/voucher-store`, {
        params: {
          voucherStoreId: voucherStoreId,
        },
      });
      showNotification('Xoá kho mã giảm giá thành công');
      actionRef.current?.reloadAndRest?.();
    } catch (error) {
      handleErrorResponse(error);
    }
  };
  const getVoucher = async (param: any) => {
    try {
      const response = await http.get(`${apiRoutes.voucher}/voucher-store`);
      return {
        data: response.data.data.data,
        success: true,
        total: response.data.data.metadata.total,
      } as RequestData<VoucherStoreResponse>;
    } catch (err) {
      handleErrorResponse(err);
      return {
        data: [],
        success: false,
        total: 0,
      } as RequestData<VoucherStoreResponse>;
    }
  };
  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.stores,
        title: <Link to={webRoutes.stores}>Mã giảm giá</Link>,
      },
      {
        key: `${webRoutes.stores}/:${storeId}`,
        title: <Link to={`${webRoutes.stores}/:${storeId}`}></Link>,
      },
    ],
  };

  const columns: ProColumns<VoucherStoreResponse>[] = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      align: 'center',
      sorter: false,
      search: false,
      render: (_, row: VoucherStoreResponse) => 123,
    },
    {
      title: 'Tên voucher',
      dataIndex: 'voucherStoreName',
      align: 'center',
      sorter: false,
      filterMode: 'menu',
      filtered: false,
      filterDropdownOpen: false,
      render: (_, row: VoucherStoreResponse) => row.voucherStoreName,
    },
    {
      title: 'Tổng số',
      dataIndex: 'voucherStoreName',
      align: 'center',
      sorter: false,
      filterMode: 'menu',
      filtered: false,
      filterDropdownOpen: false,
      render: (_, row: VoucherStoreResponse) => row.voucherStoreName,
    },
    {
      title: 'Đã sử dụng',
      dataIndex: 'voucherStoreName',
      align: 'center',
      sorter: false,
      filterMode: 'menu',
      filtered: false,
      filterDropdownOpen: false,
      render: (_, row: VoucherStoreResponse) => row.voucherStoreName,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'voucherStoreStatus',
      align: 'center',
      sorter: false,
      filterMode: 'menu',
      filtered: false,
      filterDropdownOpen: false,
      render: (_, row: VoucherStoreResponse) =>
        row.voucherStoreStatus == 'ACTIVE' ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Ngừng hoạt động</Tag>
        ),
    },
    {
      title: 'Áp dụng cho',
      dataIndex: 'name',
      align: 'center',
      sorter: false,
      filterMode: 'menu',
      filtered: false,
      filterDropdownOpen: false,
      render: (_, row: VoucherStoreResponse) =>
        row.voucherStoreType == 'PRODUCT'
          ? `${row.name} (Sản phẩm)`
          : `${row.name} (Cửa hàng)`,
    },
    {
      title: 'Chức năng',
      align: 'center',
      key: 'option',
      fixed: 'right',
      render: (_, row: VoucherStoreResponse) => [
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => handleActionOnSelect(key, row)}
          menus={[
            {
              key: ActionKey.DETAIL,
              name: (
                <Space>
                  <MdDetails />
                  Chi tiết kho voucher
                </Space>
              ),
            },
            {
              key: ActionKey.UPLOAD,
              name: (
                <Space>
                  <MdUpload />
                  Tải ảnh mã giảm giá
                </Space>
              ),
            },
            {
              key: ActionKey.UPDATE,
              name: (
                <Space>
                  <MdUpdate />
                  Chỉnh sửa
                </Space>
              ),
            },
            {
              key: ActionKey.DELETE,
              name: (
                <Space>
                  <MdDelete />
                  Xóa
                </Space>
              ),
            },
          ]}
        >
          <CiCircleMore className="text-primary text-xl" />
        </TableDropdown>,
      ],
    },
  ];

  return (
    <BasePageContainer loading={loading} breadcrumb={breadcrumb}>
      <ProTable
        columns={columns}
        cardBordered={false}
        bordered={true}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={'fixed'}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 20,
        }}
        actionRef={actionRef}
        request={(params, sort) => {
          return getVoucher(params);
        }}
        dateFormatter="number"
        search={undefined}
        toolBarRender={() => [
          <Button
            icon={<BiPlus />}
            type="primary"
            onClick={() => setShowModal(!showModal)}
          >
            Tạo mới
          </Button>,
        ]}
      />
      {modalContextHolder}
      <CreateVoucherModal
        open={showModal}
        callBack={() => {
          actionRef.current?.reloadAndRest?.();
          setShowModal(false);
        }}
      />
    </BasePageContainer>
  );
};

export default ViewCard;
