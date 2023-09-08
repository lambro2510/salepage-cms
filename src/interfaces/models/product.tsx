export interface Product {
    productId: string;
    productName: string;
    productPrice: number;
    categoryName: string | null;
    description: string;
    productTypes: string[]; 
    productRate: {
      totalPoint: number;
      totalRate: number;
      avgPoint: number;
    };
    sellerUsername: string;
    storeName: string | null;
    sellingAddress: string;
    imageUrl: string;
    storeId: string;
    categoryId: string;
    isHot: boolean;
  }

  
  
  
  
  
  