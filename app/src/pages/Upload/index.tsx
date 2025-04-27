import BackNavBar from "@/components/BackNavBar"
import ImgUploader from "@/components/ImgUploader";
import { useEffect, useRef } from "react";
import { Form, ImageUploaderRef, Input, TextArea, Button, Toast } from "antd-mobile";

export default () => {

    const input = useRef<ImageUploaderRef>(null);

    useEffect(() => {
        const nativeInput = input.current?.nativeElement
        if (nativeInput) {
            nativeInput.click()
        }
    }, []);

    const onFinish = (values: any) => {
        Toast.show({
            content: '发布成功' + JSON.stringify(values),
            icon: 'success',
        });
        console.log(values);
    };

    return (
        <BackNavBar title="发布">
            <Form
                onFinish={onFinish}
                footer={
                    <Button block color="primary" type="submit" >
                        发布
                    </Button>
                }
            >
                <Form.Item name="title" label="标题">
                    <Input placeholder="请输入标题" />
                </Form.Item>

                <Form.Item name="image" label="图片">
                    <ImgUploader accept="image/*,video/*" />
                </Form.Item>

                <Form.Item name="content" label="正文">
                    <TextArea placeholder="请输入正文" />
                </Form.Item>
            </Form>
        </BackNavBar>
    )
}