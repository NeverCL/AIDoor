import { getImageUrl } from '@/utils/imageUtils';
import { ProFormUploadButton } from '@ant-design/pro-components';

export default ({ name, single }) => {
    return (
        <ProFormUploadButton
            name={name}
            label="封面图"
            width="md"
            max={1}
            fieldProps={{
                listType: 'picture-card',
                accept: 'image/*',
            }}
            action='/api/file/upload'
            convertValue={(value) => {
                if (!value) return [];
                // 将字符串值转换为预览所需的文件列表对象
                return [{
                    uid: '-1',
                    name: '当前图片',
                    status: 'done',
                    url: getImageUrl(value),
                    response: { fileName: value }
                }];
            }}
            rules={[{ required: true, message: '请上传封面图' }]}
            transform={(value) => {
                if (value && value[0] && value[0].response) {
                    return value[0].response.fileName;
                }
                return '';
            }}
        />
    );
}; 