import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { Dropdown } from 'antd';
import { ProLayout, ProLayoutProps } from '@ant-design/pro-components';
import Icon, { LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { memo } from 'react';
import { sidebar } from './sidebar';
import { apiRoutes } from '../../routes/api';
import http from '../../utils/http';
import { handleErrorResponse } from '../../utils';
import { RiShieldUserFill } from 'react-icons/ri';
import { RootState } from '../../store';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const renderNotLoginMenu = (dom : any) => {
    return(
      <div>
        Đăng nhập | Đăng ký
      </div>
    )
  };

  const renderDropDownMenu = (dom: any) => {
    return (
      <Dropdown menu={{
        items: [
          {
            key: 'profile',
            icon: <LogoutOutlined />,
            label: 'Thông tin tài khoản',
            onClick: () => {
              logoutAdmin();
            },
          },
          {
            key: 'order',
            icon: <LogoutOutlined />,
            label: 'Hóa đơn',
            onClick: () => {
              logoutAdmin();
            },
          },
          {
            key: 'payment',
            icon: <LogoutOutlined />,
            label: 'Nạp tiền vào tài khoản',
            onClick: () => {
              logoutAdmin();
            },
          },
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: () => {
              logoutAdmin();
            },
          },
        ],
      }}>
        {dom}
      </Dropdown>
    )
  };

  const defaultProps: ProLayoutProps = {
    title: CONFIG.appName,
    logo: '/icon.png',
    fixedHeader: true,
    fixSiderbar: true,
    layout: CONFIG.theme.sidebarLayout,
    route: {
      routes: sidebar,
    },
  };

  const logoutAdmin = () => {
    dispatch(logout());
    navigate(webRoutes.login, {
      replace: true,
    });

    http.post(apiRoutes.logout).catch((error) => {
      handleErrorResponse(error);
    });
  };

  return (
    <div className="h-screen">
      <ProLayout
        {...defaultProps}
        token={{
          sider: {
            colorMenuBackground: 'white',
          },
        }}
        location={location}
        onMenuHeaderClick={() => navigate(webRoutes.home)}
        menuItemRender={(item, dom) => (
          <a
            onClick={(e) => {
              e.preventDefault();
              item.path && navigate(item.path);
            }}
            href={item.path}
          >
            {dom}
          </a>
        )}
        avatarProps={{
          icon: <Icon component={RiShieldUserFill} />,
          className: 'bg-primary bg-opacity-20 text-primary text-opacity-90',
          size: 'small',
          shape: 'square',
          title: auth?.username,
          render: (_, dom) => {
            return (
              auth ? renderDropDownMenu(dom) : renderNotLoginMenu(dom)
            );
          },
        }}
      >
        <Outlet />
      </ProLayout>
    </div>
  );
};

export default memo(Layout);
