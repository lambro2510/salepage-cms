import { Store } from "antd/es/form/interface";

export interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  categoryName?: string;
  description: string;
  productTypes: string[];
  productRate: {
    totalPoint: number;
    totalRate: number;
    avgPoint: number;
  };
  sellerUsername: string;
  storeName?: string;
  sellingAddress: string;
  imageUrl: string;
  storeId: string;
  categoryId: string;
  isHot: boolean;
}

export interface ProductDetail {
  productId?: string;
  productName?: string | 123;
  productPrice?: number;
  categoryName?: string;
  description?: string;
  productTypes?: string[];
  productRate?: {
    totalPoint?: number;
    totalRate?: number;
    avgPoint?: number;
  };
  sellerUsername?: string;
  storeName?: string;
  sellingAddress?: string;
  imageUrl?: string;
  stores: SellerStoreResponse[];
  categoryId?: string;
  isHot?: boolean;
}




