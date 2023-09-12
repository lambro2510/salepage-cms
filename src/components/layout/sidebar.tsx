import { webRoutes } from '../../routes/web';
import { BiHomeAlt2 } from 'react-icons/bi';
import { UserOutlined, InfoCircleOutlined, ShoppingOutlined, BarcodeOutlined, ShopOutlined, OrderedListOutlined } from '@ant-design/icons';

export const sidebar = [
  {
    path: webRoutes.orders,
    key: webRoutes.orders,
    name: 'Sản phẩm cho hôm này',
    icon: <OrderedListOutlined />,
  },
  {
    path: webRoutes.products,
    key: webRoutes.products,
    name: 'Sản phẩm yêu thích',
    icon: <ShoppingOutlined />,
  },
  {
    path: webRoutes.vouchers,
    key: webRoutes.vouchers,
    name: 'Livetream sản phẩm',
    icon: <BarcodeOutlined />,
  },
  {
    path: webRoutes.stores,
    key: webRoutes.stores,
    name: 'Blog bình luận',
    icon: <ShopOutlined />,
  }
];
