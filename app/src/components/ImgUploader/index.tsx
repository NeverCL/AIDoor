import api from "@/services/api";
import { getImageUrl } from "@/utils";
import { ImageUploader, ImageUploadItem } from "antd-mobile";
import { FC, useEffect, useState } from "react";

// 上传文件方法
const upload = async (file: File) => {
    const res = await api.file.postFileUpload({}, file);
    return {
        url: URL.createObjectURL(file),
        extra: {
            fileName: res.fileName
        }
    };
};

interface ImgUploaderProps {
    accept?: string;
    value?: ImageUploadItem[];
    onChange?: (fileList: ImageUploadItem[]) => void;
    maxCount?: number;
}

// 改为支持表单的组件
const ImgUploader: FC<ImgUploaderProps> = ({
    accept = "image/*",
    value = [],
    onChange,
    maxCount = 3
}) => {
    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

    useEffect(() => {
        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            setFileList(value.map((item) => ({
                url: getImageUrl(item),
                extra: item
            })));
        } else {
            onChange?.([value]);
        }

    }, [value]);

    return (
        <ImageUploader
            value={fileList}
            onChange={(fileList) => {
                setFileList(fileList);
                onChange?.(fileList.map(item => item.extra.fileName));
            }}
            accept={accept}
            upload={upload}
            maxCount={maxCount}
            showUpload={fileList.length < maxCount}
        />
    );
};

export default ImgUploader;

