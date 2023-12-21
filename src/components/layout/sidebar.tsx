import { webRoutes } from '../../routes/web';
import { BiCategory, BiHomeAlt2 } from 'react-icons/bi';
import { UserOutlined, InfoCircleOutlined, ShoppingOutlined, BarcodeOutlined, ShopOutlined, OrderedListOutlined } from '@ant-design/icons';
import { MdDiscount } from 'react-icons/md';

export const sidebar = [
  {
    path: webRoutes.dashboard,
    key: webRoutes.dashboard,
    name: 'Thống kê',
    icon: <BiHomeAlt2 />,
  },
  {
    path: webRoutes.orders,
    key: webRoutes.orders,
    name: 'Lịch sử đơn hàng',
    icon: <OrderedListOutlined />,
  },
  {
    path: webRoutes.products,
    key: webRoutes.products,
    name: 'Sản phẩm đang bán',
    icon: <ShoppingOutlined />,
  },
  {
    path: webRoutes.vouchers,
    key: webRoutes.vouchers,
    name: 'Kho mã giảm giá',
    icon: <MdDiscount />,
  },
  {
    path: webRoutes.stores,
    key: webRoutes.stores,
    name: 'Cửa hàng',
    icon: <ShopOutlined />,
  },
  {
    path: webRoutes.categories,
    key: webRoutes.categories,
    name: 'Danh sách loại sản phẩm',
    icon: <BiCategory />,
  },
  {
    path: webRoutes.about,
    key: webRoutes.about,
    name: 'Giới thiệu',
    icon: <InfoCircleOutlined />,
  },
];
