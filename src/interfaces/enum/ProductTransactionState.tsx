export const ProductTransactionState: Record<
  string,
  { value: string; text: string }
> = {
  NEW: { value: 'NEW', text: 'Tạo mới' },
  WAITING_STORE: { value: 'WAITING_STORE', text: 'Đang chờ xác nhận' },
  ACCEPT_STORE: { value: 'ACCEPT_STORE', text: 'Đã xác nhận' },
  WAITING_SHIPPER: {
    value: 'WAITING_SHIPPER',
    text: 'Đang chờ người giao hàng',
  },
  SHIPPER_PROCESSING: { value: 'SHIPPER_PROCESSING', text: 'Đang giao hàng' },
  SHIPPER_COMPLETE: { value: 'SHIPPER_COMPLETE', text: 'Đã giao hàng đến nơi' },
  ALL_COMPLETE: { value: 'ALL_COMPLETE', text: 'Hoàn thành' },
  CANCEL: { value: 'CANCEL', text: 'Đơn hàng bị huỷ' },
};
