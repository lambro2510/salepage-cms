import { Avatar, Button, Col, Modal, Pagination, Row, Typography } from "antd";
import { ProductDataResponse, ProductDetailResponse, ProductInfoResponse, SellerStoreResponse } from "../../../interfaces/interface"
import { useEffect, useState } from "react";
import http from "../../../utils/http";
import { apiRoutes } from "../../../routes/api";
import { handleErrorResponse } from "../../../utils";

export interface SelectVoucherTypeModalProps {
    type: string,
    show: boolean,
    cancel: () => void;
    done: (data: RefData) => void;
}

interface RefData {
    refId: string;
    name: string;
    imageUrl: string;
}

const SelectVoucherTypeModal = ({ type, show, cancel, done }: SelectVoucherTypeModalProps) => {
    const [products, setProducts] = useState<ProductInfoResponse[]>([]);
    const [stores, setStores] = useState<SellerStoreResponse[]>([]);
    const [currentProduct, setCurrentProduct] = useState<number>(1)
    const [currentStore, setCurrentStore] = useState<number>(1)
    const [totalProduct, setTotalProduct] = useState<number>(1)
    const [totalStore, setTotalStore] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getStore()
    }, [currentStore])

    useEffect(() => {
        getProduct()
    }, [currentProduct])

    const handleProductPageChange = (page: number) => {
        setCurrentProduct(page);
    };

    const handleStorePageChange = (page: number) => {
        setCurrentStore(page);
    };

    const getProduct = async () => {
        try {
            const response = await http.get(`${apiRoutes.products}`, {
                params: {
                    page: currentProduct - 1,
                    size: 6
                }
            })
            setProducts(response.data.data.data)
            setTotalProduct(response.data.data.metadata.total)
        } catch (error) {
            handleErrorResponse(error)
        }
    }

    const getStore = async () => {
        try {
            const response = await http.get(`${apiRoutes.stores}`, {
                params: {
                    page: currentStore - 1,
                    size: 6
                }
            })
            setStores(response.data.data.data)
            setTotalStore(response.data.data.metadata.total)
        } catch (error) {
            handleErrorResponse(error)
        }
    }


    const renderProductSelect = () => {
        return (
            <>
                {products.map((product: ProductInfoResponse) => {
                    return (
                        <Row className="pt-3 pb-3 m-3 bg-base">
                            <Col xs={4} lg={4}>
                                <Avatar src={product.defaultImageUrl} />
                            </Col>
                            <Col xs={14} lg={16}>
                                <Typography.Text>{product.productName}</Typography.Text>
                            </Col>
                            <Col xs={6} lg={4}>
                            <Button onClick={() => done({
                                    refId : product.id,
                                    name : product.productName,
                                    imageUrl : product.defaultImageUrl
                                })}>Chọn</Button>
                            </Col>
                        </Row>
                    )
                })}
                <Pagination current={currentProduct} total={totalProduct} pageSize={6} onChange={handleProductPageChange} />
            </>
        )
    }

    const renderStoreSelect = () => {
        return (
            <>
                {stores.map((store: SellerStoreResponse) => {
                    return (
                        <Row className="pt-3 pb-3 m-3 bg-base">
                            <Col xs={4} lg={4}>
                                <Avatar src={store.imageUrl} />
                            </Col>
                            <Col xs={14} lg={16}>
                                <Typography.Text>{store.storeName}</Typography.Text>
                            </Col>
                            <Col xs={6} lg={4}>
                                <Button onClick={() => done({
                                    refId : store.id,
                                    name : store.storeName,
                                    imageUrl : store.imageUrl
                                })}>Chọn</Button>
                            </Col>
                        </Row>
                    )
                })}
                <Pagination current={currentStore} total={totalStore} pageSize={6} onChange={handleStorePageChange} />
            </>
        )
    }

    return (
        <Modal open={show} title={type == 'PRODUCT' ? 'Chọn sản phẩm' : 'Chọn cửa hàng'} onCancel={cancel} footer={null}>
            {type == 'PRODUCT' ? renderProductSelect() : renderStoreSelect()}
        </Modal>
    )
}

export default SelectVoucherTypeModal;