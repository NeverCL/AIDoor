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
    single?: boolean;
}

// 改为支持表单的组件
const ImgUploader: FC<ImgUploaderProps> = ({
    accept = "image/*",
    value = [],
    onChange,
    maxCount = 3,
    single = false
}) => {

    if (single) {
        maxCount = 1;
    }

    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

    useEffect(() => {
        if (!value) {
            return;
        }

        if (single) {
            onChange?.(value);
            setFileList([{
                url: getImageUrl(value, true),
                extra: {
                    fileName: value
                }
            }])
            return;
        }

        if (Array.isArray(value)) {
            if (value.length === fileList.length)
                return;
            setFileList(value.map((item) => ({
                url: getImageUrl(item, true),
                extra: item
            })));
        } else {
            onChange?.([value]);
        }

    }, [value]);

    console.log(fileList);

    return (
        <ImageUploader
            value={fileList}
            onChange={(fileList) => {
                setFileList(fileList);
                if (single) {
                    if (fileList.length > 0) {
                        onChange?.(fileList[0]?.extra?.fileName);
                    } else {
                        onChange?.(null);
                    }
                } else {
                    onChange?.(fileList.map(item => item.extra.fileName));
                }
            }}
            accept={accept}
            upload={upload}
            maxCount={maxCount}
            showUpload={fileList.length < maxCount}
        />
    );
};

export default ImgUploader;

