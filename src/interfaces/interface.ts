/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2023-10-04 21:14:21.

interface CartDto {
    productDetailId: string;
    quantity: number;
    storeId: string;
    voucherId: string;
}

interface ConfigDto {
    key: string;
    value: string;
}

interface CreatePaymentDto {
    bankAccountId: string;
    amount: number;
}

interface UserFavoriteDto {
    refId: string;
    favoriteType: FavoriteType;
    isLike: boolean;
}

interface CheckInDto {
    longitude: string;
    latitude: string;
    username: string;
}

interface LoginDto {
    username: string;
    password: string;
}

interface LogoutDto {
    refreshToken: string;
}

interface SignUpDto {
    username: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    userRole: UserRole;
}

interface BankAccountInfoRequest {
    bin: string;
    accountNumber: string;
}

interface BankDto {
    error: number;
    data: TransactionData[];
}

interface GenQrCodeDto {
    accountNo: string;
    accountName: string;
    acqId: string;
    amount: number;
    addInfo: string;
    format: string;
    template: string;
}

interface Oath2CassoDto {
    scope: string;
    state: string;
    client_id: string;
    redirect_uri: string;
    response_type: string;
}

interface TransactionData {
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

interface ComboDto {
    comboName: string;
    type: DiscountType;
    state: ActiveState;
    value: number;
    quantityToUse: number;
    maxDiscount: number;
}

interface CreateProductCategoryTypeDto {
    categoryName: string;
    categoryType: CategoryType;
    description: string;
    rangeAge: string;
    productType: string;
}

interface CreateProductInfoDto {
    productName: string;
    description: string;
    categoryId: string;
    storeIds: string[];
}

interface ProductDetailDto {
    productId: string;
    type: string;
    color: string;
    quantity: number;
    originPrice: number;
    discountPercent: number;
}

interface ProductDto {
    productName: string;
    description: string;
    categoryId: string;
    sellerUsername: string;
    sellerStoreIds: string[];
    productInfos: ProductInfo[];
}

interface ProductInfoDto extends CreateProductInfoDto {
    imageUrl: string;
}

interface ProductTypeDetailDto {
    productId: string;
    typeName: string;
    typeDetailName: string;
    note: string;
}

interface ProductTypeDto {
    productType: string;
    typeName: string;
    description: string;
    status: ProductTypeStatus;
}

interface UpdateProductCategoryTypeDto extends CreateProductCategoryTypeDto {
    id: string;
}

interface UpdateTypeDetailStatusDto {
    id: string;
    status: ProductTypeDetailStatus;
}

interface ListTransactionDto {
    transactionId: string;
    note: string;
    quantity: number;
    address: string;
    voucherCode: string;
}

interface ProductTransactionDto extends ProductTransactionInfoDto {
    productDetailId: string;
    storeId: string;
    voucherCode: string;
}

interface ProductTransactionInfoDto {
    quantity: number;
    note: string;
    address: string;
}

interface SellerStoreDto {
    storeName: string;
    address: string;
    description: string;
    location: string;
    status: StoreStatus;
}

interface UpdateSellerStoreDto extends SellerStoreDto {
    storeId: string;
}

interface UserInfoDto {
    displayName: string;
    phoneNumber: string;
    imageUrl: string;
}

interface CreateVoucherStoreDto extends UpdateVoucherStoreDto {
    refId: string;
}

interface UpdateVoucherStoreDto {
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

interface BankAccountData {
    accountName: string;
}

interface BankAccountResponse {
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

interface BankListData {
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

interface BankPaymentResponse {
    bin: string;
    bankName: string;
    bankShortName: string;
    bankAccount: string;
}

interface MbBankTransaction {
    success: boolean;
    message: string;
    data: Transaction[];
}

interface QrData {
    qrCode: string;
    qrDataURL: string;
}

interface VietQrResponse<T> {
    code: string;
    desc: string;
    data: T;
}

interface BaseResponse<T> {
    errorCode: number;
    error: boolean;
    message: string;
    data: T;
}

interface CartByStoreResponse {
    storeId: string;
    storeName: string;
    cartResponses: CartResponse[];
}

interface CartResponse {
    cartId: string;
    canPayment: boolean;
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
    productNote: string;
    voucherNote: string;
    voucherInfo: VoucherInfo;
    totalPrice: number;
}

interface FavoriteResponse {
    type: FavoriteType;
    refId: string;
    name: string;
}

interface InfoResponse {
    code: number;
    message: string;
}

interface JwtResponse {
    username: string;
    token: string;
    role: UserRole;
}

interface Metadata {
    total: number;
    totalPages: number;
}

interface PageResponse<T> {
    data: T[];
    metadata: Metadata;
}

interface PaymentResponse {
    paymentId: string;
    bankName: string;
    bankAccountName: string;
    amount: string;
    createdAt: Date;
}

interface ProductCategoryResponse {
    id: string;
    categoryName: string;
    description: string;
    categoryType: CategoryType;
    productType: string;
    rangeAge: string;
}

interface ProductDataResponse {
    productId: string;
    productName: string;
    productPrice: number;
    categoryName: string;
    description: string;
    productTypes: string[];
    productRate: Rate;
    sellerUsername: string;
    discountPercent: number;
    sellPrice: number;
    totalSell: number;
    totalView: number;
    imageUrl: string;
    stores: SellerStoreResponse[];
    categoryId: string;
    createdAt: number;
    isHot: boolean;
}

interface ProductDetailInfoResponse {
    productDetailId: string;
    productId: string;
    type: string;
    color: string;
    quantity: number;
    originPrice: number;
    sellPrice: number;
    discountPercent: number;
}

interface ProductDetailResponse {
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
    productDetails: ProductDetailResponse[];
    isLike: boolean;
    is_hot: boolean;
}

interface ProductTypeResponse {
    value: string;
    label: string;
}

interface TotalProductStatisticResponse {
    productId: string;
    productName: string;
    totalUser: number;
    totalPurchase: number;
    totalView: number;
    totalBuy: number;
    totalShipCod: number;
    dailies: Daily[];
}

interface UploadImageData {
    uid: string;
    name: string;
    status: string;
    url: string;
    thumbUrl: string;
}

interface UserResponse {
}

interface NotificationDetailResponse extends NotificationResponse {
    content: string;
}

interface NotificationResponse {
    id: string;
    title: string;
    created: Date;
    status: NotificationStatus;
}

interface SellerStoreResponse {
    id: string;
    storeName: string;
    address: string;
    description: string;
    location: string;
    status: StoreStatus;
    imageUrl: string;
}

interface DistinctProductResponse {
    productId: string;
}

interface PaymentTransactionResponse {
    paymentId: string;
    status: PaymentStatus;
    bankName: string;
    bankAccountNo: string;
    bankAccountName: string;
    amount: number;
    type: PaymentType;
    created: Date;
}

interface ProductTransactionResponse {
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

interface TotalStatisticResponse {
    totalPrice: number;
    quantity: number;
}

interface ListVoucherCodeResponse {
    voucherCodes: VoucherCodeResponse[];
    voucherStoreId: string;
    voucherStoreName: string;
    voucherStoreStatus: VoucherStoreStatus;
}

interface UserVoucherResponse {
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

interface VoucherCodeResponse {
    voucherCode: string;
    voucherCodeStatus: VoucherCodeStatus;
    usedBy: string;
    usedAt: Date;
    expireTime: Date;
}

interface VoucherStoreResponse {
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

interface ProductInfo {
    value: string;
    description: string;
}

interface Transaction {
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

interface VoucherInfo {
    voucherCode: string;
    voucherStoreType: VoucherStoreType;
    discountType: DiscountType;
    totalDiscount: number;
    priceBefore: number;
    priceAfter: number;
    value: number;
    voucherName: string;
}

interface Rate {
    totalPoint: number;
    totalRate: number;
    avgPoint: number;
}

interface Daily {
    daily: Date;
    totalUser: number;
    totalPurchase: number;
    totalView: number;
    totalBuy: number;
    totalShipCod: number;
}

type FavoriteType = "PRODUCT" | "STORE" | "SELLER" | "SHIPPER";

type UserRole = "ADMIN" | "OPERATOR" | "SHIPPER" | "USER" | "SELLER";

type DiscountType = "PERCENT" | "TOTAL" | "PER_PRODUCT";

type ActiveState = "ACTIVE" | "INACTIVE";

type CategoryType = "VERY_SMALL" | "SMALL" | "BIG" | "LARGE" | "SUPPER_LARGE";

type ProductTypeStatus = "ACTIVE" | "INACTIVE";

type ProductTypeDetailStatus = "ACTIVE" | "WAITING" | "DENY" | "INACTIVE";

type StoreStatus = "ACTIVE" | "INACTIVE";

type VoucherStoreType = "PRODUCT" | "STORE";

type VoucherStoreStatus = "ACTIVE" | "INACTIVE";

type BankStatus = "ACTIVE" | "INACTIVE" | "DISCONNECT";

type NotificationStatus = "SEEN" | "NOT_SEEN";

type PaymentStatus = "WAITING" | "RESOLVE" | "PENDING" | "CANCEL";

type PaymentType = "IN" | "OUT";

type ProductTransactionState = "IN_CART" | "WAITING_STORE" | "ACCEPT_STORE" | "WAITING_SHIPPER" | "SHIPPER_PROCESSING" | "SHIPPER_COMPLETE" | "ALL_COMPLETE" | "CANCEL";

type VoucherCodeStatus = "NEW" | "OWNER" | "USED" | "EXPIRE";
