import { getImageUrl } from '@/utils/imageUtils';
import { ProFormUploadButton } from '@ant-design/pro-components';
import React from 'react';

interface ImgUploaderProps {
    name: string;
    single?: boolean;
    label?: string;
}

const isDev = process.env.NODE_ENV === 'development';

const action = isDev ? '/api/file/upload' : 'https://adminapi.thedoorofai.com/api/file/upload';

const ImgUploader: React.FC<ImgUploaderProps> = ({
    name,
    single = true,
    label = "封面图"
}) => {
    return (
        <ProFormUploadButton
            name={name}
            label={label}
            width="md"
            max={single ? 1 : 99}
            fieldProps={{
                listType: 'picture-card',
                accept: 'image/*',
                withCredentials: true
            }}
            action={action}
            rules={[{ required: true, message: '请上传图片' }]}
            transform={(value) => {
                // 如果是数组且有response，说明是新上传的图片
                if (Array.isArray(value) && value[0]?.response) {
                    return value[0].response.fileName;
                }

                // 如果是字符串，说明是已有的图片URL，直接返回
                if (typeof value === 'string') {
                    return value;
                }

                return '';
            }}
            convertValue={(value) => {
                // 如果value为空，返回空数组
                if (!value) return [];

                // 如果是字符串（编辑态下的图片URL）
                if (typeof value === 'string') {
                    return [{
                        uid: '-1',
                        name: value.split('/').pop() || '当前图片',
                        status: 'done',
                        url: getImageUrl(value),
                        response: { fileName: value }
                    }];
                }

                // 如果已经是数组格式，说明可能是上传组件内部状态变化，保持原样
                if (Array.isArray(value)) {
                    return value;
                }

                return [];
            }}
        />
    );
};

export default ImgUploader; 