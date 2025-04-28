import BackNavBar from "@/components/BackNavBar"
import ImgUploader from "@/components/ImgUploader";
import { useEffect, useRef } from "react";
import { Form, ImageUploaderRef, Input, TextArea, Button, Toast } from "antd-mobile";
import { useRequest, history } from "@umijs/max";
import api from "@/services/api";

export default () => {
    const input = useRef<ImageUploaderRef>(null);

    useEffect(() => {
        const nativeInput = input.current?.nativeElement
        if (nativeInput) {
            nativeInput.click()
        }
    }, []);

    // 创建内容请求
    const { loading, run: createContent } = useRequest(api.userContent.postUserContent, {
        manual: true,
        onSuccess: (response) => {
            Toast.show({
                content: '发布成功',
                icon: 'success',
                afterClose: () => {
                    // 发布成功后返回上一页
                    history.back();
                }
            });
        },
        onError: (error) => {
            Toast.show({
                content: error.message || '发布失败，请重试',
                icon: 'fail',
            });
        }
    });

    const onFinish = async (values: any) => {
        try {
            // 提交数据
            await createContent({
                title: values.title,
                content: values.content,
                images: values.image
            });
        } catch (error) {
            console.error('发布失败:', error);
        }
    };

    return (
        <BackNavBar title="发布">
            <Form
                onFinish={onFinish}
                footer={
                    <Button block color="primary" type="submit" loading={loading}>
                        发布
                    </Button>
                }
            >
                <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input placeholder="请输入标题" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="图片"
                    rules={[{ required: true, message: '请上传图片或视频' }]}
                    getValueFromEvent={(value) => {
                        return (value || []).map((file: any) => file.extra.fileName);
                    }}
                >
                    <ImgUploader accept="image/*,video/*" />
                </Form.Item>

                <Form.Item name="content" label="正文">
                    <TextArea placeholder="请输入正文" rows={5} />
                </Form.Item>
            </Form>
        </BackNavBar>
    )
}