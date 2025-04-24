import VerificationCodeButton from "@/components/VerificationCodeButton"
import { NavLink, useRequest, history } from "@umijs/max"
import { Button, Form, Input, Toast } from "antd-mobile"
import { MailOutline, PhoneFill, UserOutline } from "antd-mobile-icons"
import { postUserRegister, postUserSendCode } from "@/services/api/user"

export default () => {
    const [form] = Form.useForm();

    const { run: getSmsCode } = useRequest(postUserSendCode, { manual: true });

    const { run: register, loading } = useRequest(postUserRegister, { manual: true });

    return (
        <div className="grid items-center h-full">
            <h1>注册账号</h1>

            <div>
                <Form
                    form={form}
                    footer={
                        <Button block loading={loading} type='submit' color='primary' size='large'>
                            注册
                        </Button>
                    }
                    onFinish={async (values) => {
                        await register(values);
                        history.replace('/');
                    }}
                >
                    <Form.Item
                        name='name'
                        label={<UserOutline className="text-lg" />}
                        rules={[{ required: true }]}
                    >
                        <Input onChange={console.log} placeholder='请输入昵称' clearable />
                    </Form.Item>

                    <Form.Item
                        name='phone'
                        label={<PhoneFill className="text-lg" />}
                        rules={[{ required: true }]}
                    >
                        <Input type='number' onChange={console.log} placeholder='请输入手机号' clearable />
                    </Form.Item>

                    <Form.Item
                        name='password'
                        label={<UserOutline className="text-lg" />}
                        rules={[{ required: true }]}
                    >
                        <Input type='password' placeholder='请输入密码' clearable />
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
                                return getSmsCode({ phoneNumber: form.getFieldValue('phone') });
                            }} />
                        }
                    >
                        <Input placeholder='请输入验证码' clearable />
                    </Form.Item>

                </Form>
            </div>

            <NavLink to='/account/login' replace className='justify-self-center text-lg'>
                登录
            </NavLink>
        </div>
    )
}