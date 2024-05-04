import { useState } from 'react';
import { apiRoutes } from '../../../routes/api';
import {
  NotificationType,
  handleErrorResponse,
  showNotification,
} from '../../../utils';
import http from '../../../utils/http';
import { Form, Input, Modal, Button, DatePicker } from 'antd';

interface CreateVoucherDetailModalProps {
  storeId: string | undefined;
  open: boolean;
  onClose: () => void;
  done: () => void;
}

interface CreateVoucherCode {
  voucherStoreId: string;
  numberVoucher: number;
  expireTime: number | null;
}

const CreateVoucherDetailModal = ({
  storeId,
  open,
  onClose,
  done,
}: CreateVoucherDetailModalProps) => {
  const [form] = Form.useForm();

  const [voucherCode, setVoucherCode] = useState<CreateVoucherCode>({
    voucherStoreId: '',
    numberVoucher: 0,
    expireTime: null,
  });

  const onFinish = async () => {
    try {
      await form.validateFields();
      const response = await http.post(
        `${apiRoutes.voucher}/voucher-code`,
        {},
        {
          params: {
            ...voucherCode,
            voucherStoreId: storeId,
            expireTime: voucherCode.expireTime,
          },
        }
      );
      showNotification('Tạo thành công', NotificationType.SUCCESS);
      done();
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Create Voucher"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="finish" type="primary" onClick={onFinish}>
          Finish
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Số lượng"
          name="numberVoucher"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng voucher' },
          ]}
        >
          <Input
            type="number"
            onChange={(e) =>
              setVoucherCode({
                ...voucherCode,
                numberVoucher: Number(e.target.value),
              })
            }
          />
        </Form.Item>
        <Form.Item
          label="Thời gian hết hạn"
          name="expireTime"
          rules={[
            { required: true, message: 'Vui lòng chọn thời gian hết hạn' },
          ]}
        >
          <DatePicker
            onChange={(value) =>
              setVoucherCode({
                ...voucherCode,
                expireTime: value ? value.valueOf() : null,
              })
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVoucherDetailModal;
