import { Button, Form, Input } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { apiRoutes } from '../../routes/api';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/adminSlice';
import { RootState } from '../../store';
import { useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { handleErrorResponse, setPageTitle } from '../../utils';
import { Admin } from '../../interfaces/models/admin';
import { defaultHttp } from '../../utils/http';

interface FormValues {
  username: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || webRoutes.dashboard;
  const admin = useSelector((state: RootState) => state.admin);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setPageTitle('Đăng nhập');
  }, []);

  useEffect(() => {
    if (admin) {
      navigate(from, { replace: true });
    }
  }, [admin]);

  const onSubmit = (values: FormValues) => {
    setLoading(true);

    defaultHttp
      .post(apiRoutes.login, {
        username: values.username,
        password: values.password,
      })
      .then((response) => {
        if(!response?.data?.error){
          const admin: Admin = {
            token: response?.data?.data?.token,
          };
          dispatch(login(admin));
        }else{
          throw Error(response.data.message)
        }
        
        
        
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
        Admin Login
      </h1>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="login"
        onFinish={onSubmit}
        layout={'vertical'}
        requiredMark={false}
      >
        <div>
          <Form.Item
            name="username"
            label={
              <p className="block text-sm font-medium text-gray-900">Tên đăng nhập</p>
            }
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tài khoản',
              }
            ]}
          >
            <Input
              placeholder="lambro25102001"
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="password"
            label={
              <p className="block text-sm font-medium text-gray-900">
                Password
              </p>
            }
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khấu',
              },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              visibilityToggle={false}
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>

        <div className="text-center">
          <Button
            className="mt-4 bg-primary"
            block
            loading={loading}
            type="primary"
            size="large"
            htmlType={'submit'}
          >
            Login
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default Login;
