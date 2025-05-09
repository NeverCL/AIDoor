import { Form, Input, Button, Radio, TextArea } from 'antd-mobile';
import { useRef } from 'react';
import BackNavBar from '@/components/BackNavBar';
import { useRequest, history } from '@umijs/max';
import api from '@/services/api';
import ImgUploader from '@/components/ImgUploader';
import { FormInstance } from 'antd-mobile/es/components/form';

export default () => {
    const formRef = useRef<FormInstance>(null);

    useRequest(api.publisher.getPublisherMy, {
        onSuccess: (res) => {
            formRef.current?.setFieldsValue(res);
        }
    });

    const { run: postPublisher, loading } = useRequest(api.publisher.postPublisher, {
        manual: true,
    });

    const onFinish = async (values: any) => {
        // 将图片数组转换为单个URL（只取第一张图片作为头像）
        const avatarUrl = values.avatarUrl?.[0] || '';

        // 创建发布者请求
        const createPublisherRequest = {
            name: values.name,
            avatarUrl: avatarUrl,
            description: values.description,
            summary: values.summary,
            type: Number(values.type), // 转换为数字类型
            website: values.website,
            appLink: values.appLink
        };

        // 提交发布者信息
        await postPublisher(createPublisherRequest);

        // 跳转到我的页面
        setTimeout(() => {
            history.push('/my');
        }, 1500);
    };

    return (
        <BackNavBar title="注册发布者">
            <div className="pb-16 overflow-y-auto">
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    ref={formRef}
                    footer={
                        <div className="rounded-3xl">
                            <Button
                                block
                                color="primary"
                                type="submit"
                                className="mt-8"
                                loading={loading}
                                disabled={loading}
                            >
                                提交
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        name="name"
                        label="发布者名称"
                        rules={[{ required: true, message: '请输入发布者名称' }]}
                    >
                        <Input placeholder="请输入发布者名称" />
                    </Form.Item>

                    <Form.Item
                        name="avatarUrl"
                        label="发布者头像"
                        rules={[{ required: true, message: '请上传头像' }]}
                    // getValueFromEvent={(value) => {
                    //     return value.map((file: any) => file.extra.fileName);
                    // }}
                    >
                        <ImgUploader accept="image/*" maxCount={1} />
                    </Form.Item>

                    <Form.Item
                        name="summary"
                        label="发布者简介"
                        rules={[{ required: true, message: '请输入发布者简介' }]}
                    >
                        <TextArea placeholder="请输入发布者简介" rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="发布者描述"
                        rules={[{ required: true, message: '请输入发布者描述' }]}
                    >
                        <TextArea placeholder="请输入发布者描述" rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="website"
                        label="官网链接"
                    >
                        <Input placeholder="请输入官网链接（选填）" />
                    </Form.Item>

                    <Form.Item
                        name="appLink"
                        label="应用链接"
                    >
                        <Input placeholder="请输入应用链接（选填）" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="发布者类型"
                        rules={[{ required: true, message: '请选择发布者类型' }]}
                        initialValue={0} // 默认选择个人
                    >
                        <Radio.Group>
                            <div className="flex flex-col *:my-1">
                                <Radio value={0}>个人</Radio>
                                <Radio value={1}>企业</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>

                    <div className="bg-yellow-50 p-4 rounded-lg mt-4 mb-6">
                        <p className="text-sm text-yellow-700">提交后，您的发布者信息将会进入审核流程。审核通过后，您的发布者页面将对所有用户可见。</p>
                    </div>
                </Form>
            </div>
        </BackNavBar>
    );
};
