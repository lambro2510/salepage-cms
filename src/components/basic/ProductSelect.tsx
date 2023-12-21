import { Avatar, Button, Col, Row, Typography, Pagination } from "antd";
import { ProductInComboResponse } from "../../interfaces/models/combo";
import { useEffect } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

interface ProductSelectProps {
    products: ProductInComboResponse[];
    page: number;
    size: number;
    total: number;
    setPage: (page: number) => void;
    selectProduct: (productId: string) => void;
    removeProduct: (productId: string) => void;
    title: string;
}

const ProductSelect = ({
    title,
    products,
    page,
    size,
    total,
    setPage,
    selectProduct,
    removeProduct,
}: ProductSelectProps) => {
    const onSelectProduct = (productId: string) => {
        selectProduct(productId);
    };

    const onRemoveProduct = (productId: string) => {
        removeProduct(productId);
    };

    const renderProductCol = (product: ProductInComboResponse) => {
        return (
            <Col span={24} key={product.productId}>
                <Row>
                    <Col span={4} className="flex items-center justify-start">
                        <Avatar src={product.imageUrl} />
                    </Col>
                    <Col span={16} className="flex items-center justify-start">
                        {product.productName}
                    </Col>
                    <Col span={4} className="flex items-center justify-center">
                        {!product.isInCombo ? (
                            <Button icon={<BiPlus />} onClick={() => onSelectProduct(product.productId)} />
                        ) : (
                            <Button icon={<BiMinus />} onClick={() => onRemoveProduct(product.productId)} />
                        )}
                    </Col>
                </Row>
            </Col>
        );
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Typography.Text>{title}</Typography.Text>
            </Col>
            {products?.map((product: ProductInComboResponse) =>
                renderProductCol(product)
            )}
            <Col span={24}>
                <Pagination
                    current={page}
                    pageSize={size}
                    total={total}
                    onChange={handlePageChange}
                />
            </Col>
        </Row>
    );
};

export default ProductSelect;
