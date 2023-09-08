import React from 'react';
import { Result } from 'antd';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Result
        status="404"
        title="404"
        subTitle="Trang này không tồn tại."
      />
    </div>
  );
};

export default NotFoundPage;
