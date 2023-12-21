/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2023-10-24 20:01:05.

export interface CartDto {
    productDetailId: string;
    quantity: number;
    storeId: string;
    voucherId: string;
}

export interface CartPaymentDto {
    comboId: string;
    note: string;
    transaction: ProductTransactionDto[];
}

export interface ConfigDto {
    key: string;
    value: string;
}

export interface CreatePaymentDto {
    bankAccountId: string;
    amount: number;
}

export interface UserFavoriteDto {
    refId: string;
    favoriteType: FavoriteType;
    isLike: boolean;
}

export interface CheckInDto {
    longitude: string;
    latitude: string;
    username: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface LogoutDto {
    refreshToken: string;
}

export interface SignUpDto {
    username: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    userRole: UserRole;
}

export interface BankAccountInfoRequest {
    bin: string;
    accountNumber: string;
}

export interface BankDto {
    error: number;
    data: TransactionData[];
}

export interface GenQrCodeDto {
    accountNo: string;
    accountName: string;
    acqId: string;
    amount: number;
    addInfo: string;
    format: string;
    template: string;
}

export interface Oath2CassoDto {
    scope: string;
    state: string;
    client_id: string;
    redirect_uri: string;
    response_type: string;
}

export interface TransactionData {
    postingDate: Date;
    transactionDate: Date;
    accountNo: string;
    creditAmount: number;
    debitAmount: number;
    currency: string;
    description: string;
    availableBalance: number;
    beneficiaryAccount: string;
    refNo: string;
    benAccountName: string;
    bankName: string;
    benAccountNo: string;
}

export interface ComboDto {
    comboName: string;
    type: DiscountType;
    state: ActiveState;
    value: number;
    quantityToUse: number;
    maxDiscount: number;
}

export interface CreateProductCategoryTypeDto {
    categoryName: string;
    categoryType: CategoryType;
    description: string;
    rangeAge: string;
    productType: string;
}

export interface CreateProductInfoDto {
    productName: string;
    description: string;
    categoryId: string;
    storeIds: string[];
}

export interface ProductDetailDto {
    productId: string;
    type: ProductDetailType;
    quantity: number;
    originPrice: number;
    discountPercent: number;
}

export interface ProductDto {
    productName: string;
    description: string;
    categoryId: string;
    sellerStoreIds: string[];
    productInfos: ProductInfo[];
}

export interface ProductInfoDto extends CreateProductInfoDto {
    imageUrl: string;
}

export interface ProductTypeDetailDto {
    productId: string;
    typeName: string;
    typeDetailName: string;
    note: string;
}

export interface ProductTypeDto {
    productType: string;
    typeName: string;
    description: string;
    status: ProductTypeStatus;
}

export interface UpdateProductCategoryTypeDto extends CreateProductCategoryTypeDto {
    id: string;
}

export interface UpdateTypeDetailStatusDto {
    id: string;
    status: ProductTypeDetailStatus;
}

export interface ListTransactionDto {
    transactionId: string;
    note: string;
    quantity: number;
    address: string;
    voucherCode: string;
}

export interface ProductTransactionDto {
    productDetailId: string;
    storeId: string;
    voucherCodeId: string;
    note: string;
    address: string;
}

export interface ProductTransactionInfoDto {
    quantity: number;
    note: string;
    address: string;
}

export interface SellerStoreDto {
    storeName: string;
    address: string;
    description: string;
    location: string;
    status: StoreStatus;
}

export interface UpdateSellerStoreDto extends SellerStoreDto {
    storeId: string;
}

export interface UserInfoDto {
    displayName: string;
    phoneNumber: string;
    imageUrl: string;
}

export interface CreateVoucherStoreDto extends UpdateVoucherStoreDto {
    refId: string;
}

export interface UpdateVoucherStoreDto {
    voucherStoreName: string;
    voucherStoreType: VoucherStoreType;
    discountType: DiscountType;
    voucherStoreStatus: VoucherStoreStatus;
    value: number;
    valuePercent: number;
    maxAblePrice: number;
    minAblePrice: number;
    maxVoucherPerUser: number;
}

export interface BankAccountData {
    accountName: string;
}

export interface BankAccountResponse {
    bankAccountId: string;
    username: string;
    accountNo: string;
    bankId: number;
    bin: string;
    bankName: string;
    bankLogoUrl: string;
    bankFullName: string;
    bankAccountName: string;
    status: BankStatus;
    moneyIn: number;
    moneyOut: number;
}

export interface BankListData {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
    support: number;
    isTransfer: number;
    /**
     * Bank short name
     */
    short_name: string;
    swift_code: string;
}

export interface BankPaymentResponse {
    bin: string;
    bankName: string;
    bankShortName: string;
    bankAccount: string;
}

export interface MbBankTransaction {
    success: boolean;
    message: string;
    data: Transaction[];
}

export interface QrData {
    qrCode: string;
    qrDataURL: string;
}

export interface VietQrResponse<T> {
    code: string;
    desc: string;
    data: T;
}

export interface BaseResponse<T> {
    errorCode: number;
    error: boolean;
    message: string;
    data: T;
}

export interface CartByStoreResponse {
    storeId: string;
    storeName: string;
    cartResponses: CartResponse[];
    combos: ProductComboDetailResponse[];
    bestCombo: ProductComboDetailResponse;
}

export interface CartResponse {
    cartId: string;
    canPayment: boolean;
    productDetailId: string;
    productId: string;
    storeId: string;
    storeName: string;
    categoryId: string;
    categoryName: string;
    price: number;
    sellPrice: number;
    discountPercent: number;
    imageUrl: string;
    productName: string;
    quantity: number;
    limit: number;
    productNote: string;
    voucherNote: string;
    voucherInfo: VoucherInfo;
    totalPrice: number;
}

export interface FavoriteResponse {
    type: FavoriteType;
    refId: string;
    name: string;
}

export interface InfoResponse {
    code: number;
    message: string;
}

export interface JwtResponse {
    username: string;
    token: string;
    role: UserRole;
}

export interface Metadata {
    total: number;
    totalPages: number;
}

export interface PageResponse<T> {
    data: T[];
    metadata: Metadata;
}

export interface PaymentResponse {
    paymentId: string;
    bankName: string;
    bankAccountName: string;
    amount: string;
    createdAt: Date;
}

export interface ProductCategoryResponse {
    id: string;
    categoryName: string;
    description: string;
    categoryType: CategoryType;
    productTypeId: string;
    productType: string;
    productTypeName: string;
    rangeAge: string;
}

export interface ProductDataResponse {
    productId: string;
    productName: string;
    productRate: Rate;
    sellerUsername: string;
    minSellPrice: number;
    maxSellPrice: number;
    minOriginPrice: number;
    maxOriginPrice: number;
    totalSell: number;
    totalView: number;
    imageUrl: string;
    categoryId: string;
    createdAt: number;
    isHot: boolean;
}

export interface ProductDetailInfoResponse {
    id: string;
    productId: string;
    type: ProductDetailType;
    quantity: number;
    originPrice: number;
    sellPrice: number;
    discountPercent: number;
}

export interface ProductDetailResponse {
    productId: string;
    productName: string;
    productPrice: number;
    sellProductPrice: number;
    discountPercent: number;
    imageUrls: UploadImageData[];
    description: string;
    rate: Rate;
    yourRate: number;
    stores: SellerStoreResponse[];
    categoryId: string;
    categoryName: string;
    totalSell: number;
    totalView: number;
    productInfos: ProductInfo[];
    productDetails: ProductDetailInfoResponse[];
    isLike: boolean;
    is_hot: boolean;
}

export interface ProductInfoResponse {
    id: string;
    productName: string;
    defaultImageUrl: string;
}

export interface ProductTypeResponse {
    value: string;
    label: string;
}

export interface SellerProductDetailResponse {
    id: string;
    productName: string;
    defaultImageUrl: string;
    rate: Rate;
    productInfos: ProductInfo[];
    categoryId: string;
    productCategory: ProductCategoryResponse;
    sellerStoreIds: string[];
    stores: SellerStoreResponse[];
    typeDetails: TypeDetailResponse[];
    isHot: boolean;
}

export interface SellerProductResponse {
    id: string;
    productName: string;
    defaultImageUrl: string;
    rate: Rate;
    productInfos: ProductInfo[];
    categoryId: string;
    productCategory: ProductCategoryResponse;
    sellerStoreIds: string[];
    stores: SellerStoreResponse[];
    isHot: boolean;
}

export interface TypeDetailResponse {
    typeName: string;
}

export interface TotalProductStatisticResponse {
    productId: string;
    productName: string;
    totalUser: number;
    totalPurchase: number;
    totalView: number;
    totalBuy: number;
    totalShipCod: number;
    productDetails: ProductDetailStatistic[];
}

export interface UploadImageData {
    uid: string;
    name: string;
    status: string;
    url: string;
    thumbUrl: string;
}

export interface UserResponse {
}

export interface NotificationDetailResponse extends NotificationResponse {
    content: string;
}

export interface NotificationResponse {
    id: string;
    title: string;
    created: Date;
    status: NotificationStatus;
}

export interface SellerStoreResponse {
    id: string;
    storeName: string;
    address: string;
    description: string;
    location: string;
    status: StoreStatus;
    imageUrl: string;
}

export interface DistinctProductResponse {
    productId: string;
}

export interface PaymentTransactionResponse {
    paymentId: string;
    status: PaymentStatus;
    bankName: string;
    bankAccountNo: string;
    bankAccountName: string;
    amount: number;
    type: PaymentType;
    created: Date;
}

export interface ProductTransactionResponse {
    transactionId: string;
    productId: string;
    productName: string;
    productImageUrl: string;
    sellerName: string;
    buyerName: string;
    storeId: string;
    storeName: string;
    address: string;
    note: string;
    quantity: number;
    isUseVoucher: boolean;
    productTransactionState: ProductTransactionState;
    voucherInfo: VoucherInfo;
    total_price: number;
    price: number;
    created_at: Date;
}

export interface TotalStatisticResponse {
    totalPrice: number;
    quantity: number;
}

export interface ListVoucherCodeResponse {
    voucherCodes: VoucherCodeResponse[];
    voucherStoreId: string;
    voucherStoreName: string;
    voucherStoreStatus: VoucherStoreStatus;
}

export interface UserVoucherResponse {
    voucherStoreName: string;
    voucherCodeId: string;
    voucherCode: string;
    minPrice: number;
    maxPrice: number;
    value: number;
    discountType: DiscountType;
    storeType: VoucherStoreType;
    dayToExpireTime: number;
}

export interface VoucherCodeResponse {
    voucherCode: string;
    voucherCodeStatus: VoucherCodeStatus;
    usedBy: string;
    usedAt: Date;
    expireTime: Date;
}

export interface VoucherStoreResponse {
    voucherStoreId: string;
    voucherStoreName: string;
    totalQuantity: number;
    totalUsed: number;
    voucherStoreStatus: VoucherStoreStatus;
    voucherStoreType: VoucherStoreType;
    discountType: DiscountType;
    refId: string;
    value: number;
}

export interface ProductDetailType {
    type: string;
    color: any;
}

export interface ProductInfo {
    label: string;
    value: string;
}

export interface Transaction {
    postingDate: string;
    transactionDate: string;
    dueDate: Date;
    accountNo: string;
    creditAmount: number;
    debitAmount: number;
    currency: string;
    description: string;
    availableBalance: number;
    beneficiaryAccount: string;
    refNo: string;
    benAccountName: string;
    bankName: string;
    benAccountNo: string;
    transactionType: string;
    docId: string;
}


export interface ProductComboResponse {
    id: string;
    comboName: string;
    type: DiscountType;
    state: ActiveState;
    value: number;
    quantityToUse: number;
    maxDiscount: number;
    storeId : string;
}

export interface ProductComboDetailResponse {
    id: string;
    canUse: boolean;
    totalPrice: number;
    comboName: string;
    type: DiscountType;
    products: ProductInfoResponse[];
    value: number;
    quantityToUse: number;
    maxDiscount: number;
}

export interface VoucherInfo {
    code: string;
    voucherStoreType: VoucherStoreType;
    discountType: DiscountType;
    totalDiscount: number;
    priceBefore: number;
    priceAfter: number;
    value: number;
    voucherName: string;
    isUse: boolean;
}

export interface Rate {
    totalPoint: number;
    totalRate: number;
    avgPoint: number;
}

export interface ProductDetailStatistic {
    productDetailId: string;
    daily: Date;
    totalUser: number;
    totalPurchase: number;
    totalView: number;
    totalBuy: number;
    totalShipCod: number;
    dailies: Daily[];
}

export interface Daily {
    daily: Date;
    totalUser: number;
    totalPurchase: number;
    totalView: number;
    totalBuy: number;
    totalShipCod: number;
}

export type FavoriteType = "PRODUCT" | "STORE" | "SELLER" | "SHIPPER";

export type UserRole = "ADMIN" | "OPERATOR" | "SHIPPER" | "USER" | "SELLER";

export type DiscountType = "PERCENT" | "TOTAL" | "PER_PRODUCT";

export type ActiveState = "ACTIVE" | "INACTIVE";

export type CategoryType = "VERY_SMALL" | "SMALL" | "BIG" | "LARGE" | "SUPPER_LARGE";

export type ProductTypeStatus = "ACTIVE" | "INACTIVE";

export type ProductTypeDetailStatus = "ACTIVE" | "WAITING" | "DENY" | "INACTIVE";

export type StoreStatus = "ACTIVE" | "INACTIVE";

export type VoucherStoreType = "PRODUCT" | "STORE";

export type VoucherStoreStatus = "ACTIVE" | "INACTIVE";

export type BankStatus = "ACTIVE" | "INACTIVE" | "DISCONNECT";

export type NotificationStatus = "SEEN" | "NOT_SEEN";

export type PaymentStatus = "WAITING" | "RESOLVE" | "PENDING" | "CANCEL";

export type PaymentType = "IN" | "OUT";

export type ProductTransactionState = "IN_CART" | "WAITING_STORE" | "ACCEPT_STORE" | "WAITING_SHIPPER" | "SHIPPER_PROCESSING" | "SHIPPER_COMPLETE" | "ALL_COMPLETE" | "CANCEL";

export type VoucherCodeStatus = "NEW" | "OWNER" | "USED" | "EXPIRE";
