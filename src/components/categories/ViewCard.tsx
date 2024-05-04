import { Link, NavLink, useNavigate } from 'react-router-dom';
import BasePageContainer from '../layout/PageContainer';
import { useEffect, useRef, useState } from 'react';
import {
  ActionType,
  ParamsType,
  ProColumns,
  ProDescriptions,
  ProTable,
  RequestData,
  TableDropdown,
} from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps, Button, Modal, Space } from 'antd';
import { Store } from 'antd/es/form/interface';
import { CategoryType } from '../../interfaces/enum/CategoryType';
import {
  NotificationType,
  handleErrorResponse,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { Product } from '../../interfaces/models/product';
import { webRoutes } from '../../routes/web';
import Icon, {
  EllipsisOutlined,
  WarningOutlined,
  DownOutlined,
  UpOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import LazyImage from '../lazy-image';
import { ProductTransactionState } from '../../interfaces/enum/ProductTransactionState';
import { CiCircleMore } from 'react-icons/ci';
import { BiPlus, BiUpload } from 'react-icons/bi';
import { MdUpdate } from 'react-icons/md';
import {
  ProductCategoryResponse,
  ProductTypeResponse,
} from '../../interfaces/interface';

enum ActionKey {
  DELETE = 'delete',
  UPDATE = 'update',
  UPLOAD = 'upload',
}

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.products,
      title: <Link to={webRoutes.products}>Loại sản phẩm</Link>,
    },
  ],
};

const ViewCard = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [productType, setProductTypes] = useState<ProductTypeResponse[]>([]);

  const loadCategories = async (params: ParamsType) => {
    const response = await http.get(apiRoutes.categories, {
      params: {},
    });

    return {
      data: response.data?.data,
      success: true,
      total: response.data?.data?.length,
    } as RequestData<ProductCategoryResponse>;
  };

  const handleActionOnSelect = (
    key: string,
    category: ProductCategoryResponse
  ) => {
    if (key === ActionKey.DELETE) {
      showDeleteConfirmation(category);
    } else if (key === ActionKey.UPDATE) {
      navigate(`${webRoutes.categories}/${category.id}`);
    }
  };

  const showDeleteConfirmation = (category: ProductCategoryResponse) => {
    modal.confirm({
      title: 'Bạn có chắc chắn mua xóa sản phẩm này?',
      icon: <WarningOutlined />,
      type: 'warn',
      content: (
        <ProDescriptions column={1} title=" ">
          <ProDescriptions.Item valueType="text" label="Tên mặt hàng">
            {category.categoryType}
          </ProDescriptions.Item>
          <ProDescriptions.Item valueType="text" label="Mô tả">
            {category.description}
          </ProDescriptions.Item>
        </ProDescriptions>
      ),
      okButtonProps: {
        className: 'bg-primary',
      },
      onOk: () => {
        return http
          .delete(`${apiRoutes.categories}/${category.id}`)
          .then(() => {
            showNotification(
              'Thành công',
              NotificationType.SUCCESS,
              `${category?.categoryName} đã được xóa`
            );

            actionRef.current?.reloadAndRest?.();
          })
          .catch((error) => {
            handleErrorResponse(error);
          });
      },
    });
  };

  const columns: ProColumns<ProductCategoryResponse>[] = [
    {
      key: 'categoryName',
      title: 'Tên mặt hàng',
      dataIndex: 'categoryName',
      align: 'center',
      sorter: false,
      filterMode: 'menu',
      filtered: false,
      filterDropdownOpen: false,
      render: (_, row: ProductCategoryResponse) => row?.categoryName,
    },
    {
      key: 'categoryType',
      title: 'Kích cỡ mặt hàng',
      dataIndex: 'categoryType',
      align: 'center',
      sorter: false,
      search: false,
      render: (_, row: ProductCategoryResponse) => row.categoryType,
    },
    {
      key: 'productTypeName',
      title: 'Loại mặt hàng',
      dataIndex: 'productTypeName',
      align: 'center',
      sorter: false,
      search: false,
      render: (_, row: ProductCategoryResponse) => row.productTypeName,
    },
    {
      key: 'description',
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      sorter: false,
      search: false,
      render: (_, row: ProductCategoryResponse) => row.description,
    },
    {
      title: 'Chức năng',
      align: 'center',
      key: 'option',
      fixed: 'right',
      search: false,
      render: (_, row: ProductCategoryResponse) => [
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => handleActionOnSelect(key, row)}
          menus={[
            {
              key: ActionKey.UPDATE,
              name: (
                <Space>
                  <MdUpdate />
                  Cập nhật loại sản phẩm
                </Space>
              ),
            },
            {
              key: ActionKey.DELETE,
              name: (
                <Space>
                  <DeleteOutlined />
                  Xóa
                </Space>
              ),
            },
          ]}
        >
          <Icon component={CiCircleMore} className="text-primary text-xl" />
        </TableDropdown>,
      ],
    },
  ];

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
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
        request={(params) => {
          return loadCategories(params);
        }}
        dateFormatter="number"
        search={{
          labelWidth: 'auto',
          filterType: 'query',
          showHiddenNum: true,
          searchText: 'Tìm kiếm',
          resetText: 'Xóa bộ lọc',
          collapseRender(collapsed, props, intl, hiddenNum) {
            if (collapsed) {
              return [
                <Link key="expand-link" to={'#'}>
                  Mở rộng({props.hiddenNum})
                  <DownOutlined />
                </Link>,
              ];
            } else {
              return [
                <Link key="collapse-link" to={'#'}>
                  Thu nhỏ
                  <UpOutlined />
                </Link>,
              ];
            }
          },
        }}
        toolBarRender={() => [
          <Button
            icon={<BiPlus />}
            type="primary"
            onClick={() => navigate(`${webRoutes.categories}/create`)}
          >
            Tạo mới
          </Button>,
        ]}
      />
      {modalContextHolder}
    </BasePageContainer>
  );
};

export default ViewCard;
