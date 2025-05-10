import BackNavBar from "@/components/BackNavBar"
import ImgUploader from "@/components/ImgUploader"
import api from "@/services/api";
import { useModel, history } from "@umijs/max";
import { Form, Input, Button } from "antd-mobile"

export default () => {
    const [form] = Form.useForm();

    const { user, refreshUser } = useModel('global');

    return (
        <BackNavBar title="编辑资料" >
            <Form form={form}
                initialValues={user}
                onFinish={async (values) => {
                    await api.user.putUserProfile(values);
                    await refreshUser();
                    history.back();
                }}
                footer={<Button color="primary" block type="submit">提交</Button>}
            >
                <Form.Item label="头像" name="avatarUrl">
                    <ImgUploader single />
                </Form.Item>
                <Form.Item label="昵称" name="username">
                    <Input placeholder="请输入昵称" />
                </Form.Item>
            </Form>
        </BackNavBar>
    )
}
