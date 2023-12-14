import { useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { handleErrorResponse } from "../../utils";
import { Spin, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface UploadImageProductProps {
    id: string;
}
const UploadImageProduct = ({ id }: UploadImageProductProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [fileList, setFileList] = useState<any[]>([]);
    const admin = useSelector((state: RootState) => state.admin);

    const loadImages = async () => {
        await http.get(`${apiRoutes.products}/images/${id}`)
            .then((res) => {
                setFileList(res?.data?.data);
            })
            .catch((error) => {
                handleErrorResponse(error);
            })
    }

    useEffect(() => {
        Promise.all([loadImages()])
            .then(() => {
                setLoading(false)
            })
            .catch((error) => {
                handleErrorResponse(error)
            })
    }, [])

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const filteredFileList = newFileList.filter(
            (file: any) => !['error', 'removed'].includes(file.status)
        );
        setFileList(filteredFileList);
    };


    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleUploadImage = async (file: any) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            setLoading(true);
            const response = await http.post(`${apiRoutes.products}/upload/${id}`, formData);

            const newImage = {
                uid: response.data.uid,
                name: file.name,
                status: 'done',
                url: response.data.url,
            };

            const filteredFileList = fileList.filter(
                (file: any) => !['uploading'].includes(file.status)
            );
            setLoading(false);
            setFileList([...filteredFileList, newImage]);
        } catch (error) {
            handleErrorResponse(error);
        } finally {

        }
    };


    return (
        <Spin spinning={loading}>
            <ImgCrop >

                <Upload
                    headers={{ Authorization: 'Bearer ' + admin }}
                    action={`${apiRoutes.products}/upload/${id}`}
                    method="post"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={onPreview}
                    customRequest={({ file }) => handleUploadImage(file)}
                >
                    {fileList.length < 5 && '+ Upload'}
                </Upload>

            </ImgCrop>
        </Spin>

    )
}

export default UploadImageProduct;