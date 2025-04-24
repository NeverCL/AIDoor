import VerificationCodeButton from "@/components/VerificationCodeButton"
import { NavLink, useRequest, history } from "@umijs/max"
import { Button, Form, Input, Toast } from "antd-mobile"
import { MailOutline, PhoneFill } from "antd-mobile-icons"
import { postUserLogin, postUserSendCode } from "@/services/api/user"

export default () => {
    const [form] = Form.useForm();

    const { run: getSmsCode } = useRequest(postUserSendCode, { manual: true });

    const { run: login, loading } = useRequest(postUserLogin, {
        manual: true,
        onSuccess: () => {
            history.replace('/');
        },
    });

    return (
        <div className="grid items-center h-full">
            <h1 >登录账号</h1>

            <div>
                <Form
                    form={form}
                    footer={
                        <Button block loading={loading} type='submit' color='primary' size='large'>
                            登录
                        </Button>
                    }
                    onFinish={async (values) => {
                        await login(values);
                    }}
                >
                    <Form.Item
                        name='phone'
                        label={<PhoneFill className="text-lg" />}
                        rules={[{ required: true }]}
                    >
                        <Input type='number' placeholder='请输入手机号' clearable />
                    </Form.Item>

                    <Form.Item
                        name='code'
                        label={<MailOutline className="text-lg" />}
                        rules={[{ required: true }]}
                        extra={
                            <VerificationCodeButton onSend={() => {
                                if (!form.getFieldValue('phone')) {
                                    Toast.show('请输入手机号');
                                    return Promise.resolve(false);
                                }
                                return getSmsCode({ phone: form.getFieldValue('phone') });
                            }} />
                        }
                    >
                        <Input placeholder='请输入验证码' clearable type="number" />
                    </Form.Item>

                </Form>
            </div>

            <NavLink to='/account/register' replace className='justify-self-center text-lg'>
                注册
            </NavLink>
        </div>
    )
}