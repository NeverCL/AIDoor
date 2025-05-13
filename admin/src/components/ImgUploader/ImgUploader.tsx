import { UploadOutlined } from '@ant-design/icons';
import { getImageUrl } from '@/utils/imageUtils';
import { Upload, Button, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { FC, useEffect, useState } from 'react';
import { postFileUpload } from '@/services/api/file';

interface ImgUploaderProps {
    accept?: string;
    value?: string | string[];
    onChange?: (fileList: string | string[]) => void;
    maxCount?: number;
    single?: boolean;
    disabled?: boolean;
}

/**
 * ImgUploader 组件 - Ant Design Pro 版本
 * 支持单张或多张图片上传，支持表单使用
 */
const ImgUploader: FC<ImgUploaderProps> = ({
    accept = "image/*",
    value,
    onChange,
    maxCount = 3,
    single = false,
    disabled = false
}) => {
    // 如果是单张模式，最大数量为1
    if (single) {
        maxCount = 1;
    }

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // 处理外部传入的 value 变化
    useEffect(() => {
        if (!value) {
            setFileList([]);
            return;
        }

        if (single && typeof value === 'string') {
            // 单图模式，value 是字符串
            setFileList([{
                uid: '-1',
                name: value,
                status: 'done',
                url: getImageUrl(value, true),
            }]);
        } else if (Array.isArray(value)) {
            // 多图模式，value 是字符串数组
            const newFileList = value.map((item, index) => ({
                uid: `-${index}`,
                name: item,
                status: 'done' as const,
                url: getImageUrl(item, true),
            }));

            if (JSON.stringify(newFileList) !== JSON.stringify(fileList)) {
                setFileList(newFileList);
            }
        }
    }, [value, single]);

    // 文件上传前的处理
    const beforeUpload = (file: File) => {
        const isAccepted = file.type.startsWith('image/') ||
            (accept.includes('video/') && file.type.startsWith('video/'));

        if (!isAccepted) {
            message.error(`仅支持上传${accept}类型的文件`);
            return false;
        }

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('文件大小不能超过10MB');
            return false;
        }

        return true;
    };

    // 自定义上传处理
    const customUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;

        try {
            // 调用文件上传接口
            const result = await postFileUpload({ file });

            onSuccess({ fileName: result.fileName }, file);
        } catch (error) {
            message.error('文件上传失败');
            onError(error);
        }
    };

    // 处理文件状态变化
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        // 处理onChange回调，根据single模式返回不同格式的数据
        if (single) {
            const successFile = newFileList.find(file => file.status === 'done');
            if (successFile) {
                // 提取成功上传文件的fileName
                const fileName = successFile.response?.fileName || successFile.name;
                onChange?.(fileName);
            } else {
                onChange?.(undefined as any);
            }
        } else {
            // 多图模式返回文件名数组
            const fileNames = newFileList
                .filter(file => file.status === 'done')
                .map(file => file.response?.fileName || file.name);

            onChange?.(fileNames);
        }
    };

    return (
        <Upload
            accept={accept}
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            customRequest={customUpload}
            maxCount={maxCount}
            disabled={disabled}
            onRemove={(file) => {
                // 处理移除文件逻辑
                if (single) {
                    onChange?.(undefined as any);
                } else {
                    const newFileList = fileList
                        .filter(item => item.uid !== file.uid)
                        .filter(file => file.status === 'done')
                        .map(file => file.response?.fileName || file.name);

                    onChange?.(newFileList);
                }
                return true;
            }}
        >
            {fileList.length < maxCount && !disabled && (
                <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
            )}
        </Upload>
    );
};

export default ImgUploader; 