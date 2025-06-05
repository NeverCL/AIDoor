import { Form, Input, Button, Radio, TextArea, Toast } from 'antd-mobile';
import { useRef } from 'react';
import BackNavBar from '@/components/BackNavBar';
import { useRequest, history, useModel } from '@umijs/max';
import api from '@/services/api';
import ImgUploader from '@/components/ImgUploader';
import { FormInstance } from 'antd-mobile/es/components/form';

export default () => {
    const formRef = useRef<FormInstance>(null);

    const { user, switchUserMode } = useModel('global');

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

        // 创建开发者请求
        const createPublisherRequest = {
            name: values.username,
            avatarUrl: avatarUrl,
            description: values.description,
            summary: values.summary,
            type: Number(values.type), // 转换为数字类型
            website: values.website,
            appLink: values.appLink
        };

        // 提交开发者信息
        await postPublisher(createPublisherRequest);

        const result = await switchUserMode();

        if (result.success) {
            // 跳转到我的页面
            setTimeout(() => {
                history.replace('/');
            }, 1500);
        }
    };

    return (
        <BackNavBar title="注册开发者">
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
                        name="username"
                        label="项目名称"
                        rules={[{ required: true, message: '请输入项目名称' }]}
                    >
                        <Input placeholder="请输入项目名称" />
                    </Form.Item>

                    <Form.Item
                        name="avatarUrl"
                        label="项目logo/产品图"
                        rules={[{ required: true, message: '请上传项目logo/产品图' }]}
                    >
                        <ImgUploader accept="image/*" maxCount={1} />
                    </Form.Item>

                    <Form.Item
                        name="summary"
                        label="项目简介"
                        rules={[{ required: true, message: '请输入项目简介' }]}
                    >
                        <TextArea placeholder="请输入项目简介" rows={3} />
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

                    <div className="bg-yellow-50 p-4 rounded-lg mt-4 mb-6">
                        <p className="text-sm text-yellow-700">官网链接和应用链接提交后，将会进入审核流程。审核通过后，官网链接和应用链接将对所有用户可见。</p>
                    </div>
                </Form>
            </div>
        </BackNavBar>
    );
};
