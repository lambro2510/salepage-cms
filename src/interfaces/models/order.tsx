export interface ProductDetail {
  createdAt: number;
  updatedAt: number;
  id: string;
  productId: string;
  type: {
    type: string;
    color: string;
  };
  quantity: number;
  imageUrl: string | null;
  originPrice: number;
  sellPrice: number;
  discountPercent: number;
  username: string | null;
}

export interface ProductInfo {
  label: string;
  value: string;
}

export interface Rate {
  totalPoint: number;
  totalRate: number;
  avgPoint: number;
}

export interface Product {
  createdAt: number;
  updatedAt: number;
  id: string;
  productName: string;
  description: string | null;
  productInfos: ProductInfo[];
  imageUrls: string[];
  defaultImageUrl: string;
  categoryId: string;
  rate: Rate;
  createdBy: string;
  sellerStoreIds: string[];
  isHot: boolean;
  sellerUsername: string | null;
}

export interface Store {
  createdAt: number;
  updatedAt: number;
  id: string;
  storeName: string;
  ownerStoreName: string;
  address: string;
  description: string;
  location: any; // Replace 'any' with the actual type if available
  status: string;
  imageUrl: string | null;
  rate: Rate;
}

export interface VoucherInfo {
  code: string | null;
  voucherStoreType: string | null;
  discountType: string | null;
  totalDiscount: number;
  priceBefore: number;
  priceAfter: number;
  value: number;
  voucherName: string | null;
  isUse: boolean;
}

export interface ProductTransaction {
  id: string;
  productDetailId: string;
  productDetail: ProductDetail;
  productId: string;
  product: Product;
  transactionId: string;
  storeId: string;
  store: Store;
  state: string;
  quantity: number;
  totalPrice: number;
  note: string;
  voucherInfo: VoucherInfo;
  shipCod: number;
  address: string;
  username: string;
  createdAt: number;
}

export interface OrderFilter {
  productId?: string;
  productName?: string;
  totalPrice?: number;
  buyerName?: string;
  storeName?: string;
  address?: string;
  quantity?: number;
  isUseVoucher?: boolean;
  productTransactionState?: string;
  voucherInfo?: any;
  createdAt?: string;
}
