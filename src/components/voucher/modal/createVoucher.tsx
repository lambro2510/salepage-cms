import { Modal, Form, Input, Select, Button, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { CreateVoucherStoreDto } from '../../../interfaces/interface';
import { handleErrorResponse } from '../../../utils';
import http from '../../../utils/http';
import { apiRoutes } from '../../../routes/api';
import SelectVoucherTypeModal from './selectVoucherTypeModal';

const { Option } = Select;

interface CreateVoucherModalProps {
  open: boolean;
  callBack: () => void;
}

interface RefData {
  refId: string;
  name: string;
  imageUrl: string;
}
const CreateVoucherModal = ({ open, callBack }: CreateVoucherModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refData, setrefData] = useState<RefData>();
  const [selectedVoucherType, setSelectedVoucherType] =
    useState<string>('PRODUCT');
  const [selectedDiscountType, setSelectedDiscountType] =
    useState<string>('PERCENT');
  const [showSelectRefModal, setShowSelectRefModal] = useState<boolean>(false);
  useEffect(() => {
    setShowModal(open);
  }, [open]);

  const onFinish = (formData: CreateVoucherStoreDto) => {
    try {
      http.post(`${apiRoutes.voucher}/voucher-store`, {
        ...formData,
        refId: refData?.refId,
        discountType: selectedDiscountType,
      });
      setShowModal(false);
      callBack();
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      open={showModal}
      onCancel={() => {
        setShowModal(false);
        callBack();
      }}
      footer={null}
      title="Tạo voucher mới"
    >
      <Form
        name="createVoucherForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...formItemLayout}
      >
        <Form.Item
          label="Tên voucher"
          name="voucherStoreName"
          rules={[{ required: true, message: 'Vui lòng chọn tên voucher!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại voucher"
          name="voucherStoreType"
          rules={[{ required: true, message: 'Vui lòng chọn loại voucher!' }]}
          initialValue={'PRODUCT'}
        >
          <Select
            defaultValue={'PRODUCT'}
            onChange={(value: string, options) => setSelectedVoucherType(value)}
          >
            <Option value="PRODUCT">Cho sản phẩm</Option>
            <Option value="STORE">Cho cửa hàng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Loại giảm giá"
          name="discountType"
          rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
          initialValue={'PERCENT'}
        >
          <Select
            defaultValue={'PERCENT'}
            onChange={(value: string, options) =>
              setSelectedDiscountType(value)
            }
          >
            <Option value="PERCENT">Phần trăm tổng sản phẩm</Option>
            <Option value="PER_PRODUCT ">
              Giá trị cố định trên mỗi sản phẩm
            </Option>
            <Option value="TOTAL">Giá trị cố định</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Áp dụng cho " name="refId">
          {refData ? (
            <Button
              color="blue"
              className="w-full overflow-hidden"
              onClick={() => setShowSelectRefModal(true)}
            >
              {refData.name}
            </Button>
          ) : (
            <Button onClick={() => setShowSelectRefModal(true)}> Chọn </Button>
          )}
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="voucherStoreStatus"
          initialValue={'ACTIVE'}
        >
          <Select defaultValue={'ACTIVE'}>
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE  ">Không hoạt động</Option>
          </Select>
        </Form.Item>

        {selectedDiscountType == 'PERCENT' ? (
          <Form.Item label="Phần trăm giảm giá" name="valuePercent">
            <Input suffix="%" type="number" />
          </Form.Item>
        ) : (
          <Form.Item label="Số tiền giảm giá" name="value">
            <Input suffix="VND" type="number" />
          </Form.Item>
        )}

        <Form.Item label="Áp dụng cho các sản phẩm từ" name="minAblePrice">
          <Input suffix="VND" type="number" />
        </Form.Item>

        <Form.Item label="Áp dụng cho các sản phẩm đến" name="maxAblePrice">
          <Input suffix="VND" type="number" />
        </Form.Item>
        <Form.Item
          label="Số mã tối đa người dùng có thể nhận được"
          name="maxVoucherPerUser"
        >
          <Input suffix="lần" type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo voucher
          </Button>
        </Form.Item>
      </Form>
      <SelectVoucherTypeModal
        show={showSelectRefModal}
        type={selectedVoucherType}
        cancel={() => setShowSelectRefModal(false)}
        done={(data: RefData) => {
          setrefData(data);
          setShowSelectRefModal(false);
        }}
      />
    </Modal>
  );
};

export default CreateVoucherModal;
