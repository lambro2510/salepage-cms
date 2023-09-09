export interface Order {
    transactionId?: string,
    productId?: string,
    productName?: string,
    productImageUrl?: string,
    total_price?: number,
    sellerName?: string,
    buyerName: string,
    storeName?: string,
    address?: string,
    note?: string,
    quantity?: number,
    isUseVoucher?: boolean,
    productTransactionState: string,
    voucherInfo?: any,
    created_at?: string
}

export interface OrderFilter {
    productId?: string,
    productName?: string,
    totalPrice?: number,
    buyerName?: string,
    storeName?: string,
    address?: string,
    quantity?: number,
    isUseVoucher?: boolean,
    productTransactionState?: string,
    voucherInfo?: any,
    createdAt?: string
}