import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BreadcrumbProps, Button, Card, Col, Divider, Pagination, Row, Tag, Typography } from "antd"; // Import Pagination component
import { convertUTCToVietnamTime, handleErrorResponse } from "../../utils";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { VoucherCodeResponse, VoucherCodeStatus, VoucherStoreResponse } from "../../interfaces/interface";
import { webRoutes } from "../../routes/web";
import BasePageContainer from "../layout/PageContainer";
import { BiPlus } from "react-icons/bi";
import CreateVoucherDetailModal from "./modal/createVoucherDetailModal";

const DetailCard = () => {
    const { storeId, storeName } = useParams();
    const [current, setCurrent] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    const [total, setTotal] = useState<number>(0);
    const [voucherDetails, setVoucherDetails] = useState<VoucherCodeResponse[]>([]);
    const [voucher, setVoucher] = useState<VoucherStoreResponse>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const getVoucher = async () => {
        try {
            const response = await http.get(`${apiRoutes.voucher}/voucher-store/${storeId}`)
            setVoucher(response.data.data);
        } catch (error) {
            handleErrorResponse(error)
        }
    }
    const getVoucherDetail = async (page: number) => {
        try {
            const response = await http.get(`${apiRoutes.voucher}/voucher-code`, {
                params: {
                    voucherStoreId: storeId,
                    page: page - 1,
                    size: 20,
                },
            });

            setVoucherDetails(response.data.data.data);
            setTotal(response.data.data.metadata.total);
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    useEffect(() => {
        getVoucherDetail(current);
        setShowModal(false)
    }, [current, storeId]);

    useEffect(() => {
        getVoucher();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrent(page);
    };

    const breadcrumb: BreadcrumbProps = {
        items: [
            {
                key: webRoutes.stores,
                title: <Link to={webRoutes.stores}>Mã giảm giá</Link>,
            },
            {
                key: `${webRoutes.stores}/:${storeId}`,
                title: <Link to={`${webRoutes.stores}/:${storeId}`}>{voucher?.voucherStoreName}</Link>,
            },
        ],
    };

    const checkStatus = (status : VoucherCodeStatus) => {
        if (status === 'NEW'){
            return <Tag color="green">Chưa sử dụng</Tag>;
        }else if (status === 'EXPIRE') {  
            return <Tag color="red">Hết hạn</Tag>;
        }else if (status === 'OWNER') {  
            return <Tag color="blue">Đã nhận</Tag>;
        }else if (status === 'USED') {  
            return <Tag color="cyan">Đã sử dụng</Tag>;
        }
    }
    const renderVoucherInfo = (voucher: VoucherCodeResponse) => {
        return (
            <Card key={voucher.voucherCode} style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={5} >
                        <Typography.Text>{voucher.voucherCode}</Typography.Text>
                    </Col>
                    <Col span={4} >
                        <Typography.Text>{checkStatus(voucher.voucherCodeStatus)}</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text>{voucher.usedBy == null ? 'Chưa có ai' : voucher.usedBy}</Typography.Text>
                    </Col>
                    <Col span={5} className="flex justify-center">
                        <Typography.Text>{voucher.usedAt}</Typography.Text>
                    </Col>
                    <Col span={5} className="flex justify-center">
                        <Typography.Text>{convertUTCToVietnamTime(voucher.expireTime)}</Typography.Text>
                    </Col>
                </Row>
            </Card>
        );
    };



    return (
        <BasePageContainer breadcrumb={breadcrumb}>
            <Row className="w-full">
                <Col span={24} className="flex justify-between items-center">
                    <div>
                        <Typography.Text strong>Tên: </Typography.Text>
                        <Typography.Text> {voucher?.voucherStoreName}</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text strong>Tổng số: </Typography.Text>
                        <Typography.Text> {voucher?.totalQuantity}</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text strong>Đã dùng: </Typography.Text>
                        <Typography.Text> {voucher?.totalUsed}</Typography.Text>
                    </div>
                    <Button className="flex justify-center items-center" onClick={() => setShowModal(true)}>
                        <BiPlus />
                        <Typography.Text>Tạo thêm mã</Typography.Text>
                    </Button>
                </Col>
                <Divider />
                <Row gutter={[16, 16]} className="w-full">
                    <Col span={24}>
                        <Card style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={5}>
                                    <Typography.Text strong>Mã voucher </Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text strong>Trạng thái </Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text strong>Sở hữu </Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text strong className="flex justify-center">Thời gian sử dụng </Typography.Text>
                                </Col>
                                <Col span={5} className="flex justify-center">
                                    <Typography.Text strong>Ngày hết hạn </Typography.Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={24}>
                        {voucherDetails.map((voucher) => {
                            return renderVoucherInfo(voucher);
                        })}
                    </Col>
                </Row>
                <Col span={24} className="flex justify-center">
                    <Pagination
                        current={current}
                        total={total}
                        pageSize={20}
                        onChange={handlePageChange}
                    />
                </Col>
            </Row>
            <CreateVoucherDetailModal storeId={storeId} open={showModal} onClose={() => setShowModal(false)} done={() => setCurrent(0)} />
        </BasePageContainer>
    );
};

export default DetailCard;
