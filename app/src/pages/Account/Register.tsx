import VerificationCodeButton from "@/components/VerificationCodeButton"
import { NavLink, useRequest, history, useModel } from "@umijs/max"
import { Button, Form, Input, Toast } from "antd-mobile"
import { MailOutline, PhoneFill, UserOutline } from "antd-mobile-icons"
import { postUserRegister, postUserSendCode, getUserRandomNickname } from "@/services/api/user"

export default () => {
    const [form] = Form.useForm();

    const { refreshUser } = useModel('global');

    const { run: getSmsCode } = useRequest(postUserSendCode, { manual: true });

    const { run: register, loading } = useRequest(postUserRegister, {
        manual: true, onSuccess: () => {
            refreshUser().then(() => {
                history.replace('/');
            });
        }
    });

    const { run: getRandomNickname, loading: nicknameLoading } = useRequest(getUserRandomNickname, {
        onSuccess: (data) => {
            form.setFieldValue('name', data.nickname);
        }
    });

    return (
        <div className="grid items-center h-full">
            <h1>注册账号</h1>

            <div>
                <Form
                    form={form}
                    initialValues={{
                        password: ''
                    }}
                    footer={
                        <Button block loading={loading} type='submit' color='primary' size='large'>
                            注册
                        </Button>
                    }
                    onFinish={register}
                >
                    <Form.Item
                        name='name'
                        label={<UserOutline className="text-lg" />}
                        rules={[{ required: true }]}
                    // extra={
                    //     <Button
                    //         size='small'
                    //         loading={nicknameLoading}
                    //         onClick={() => {
                    //             getRandomNickname();
                    //         }}
                    //     >
                    //         随机昵称
                    //     </Button>
                    // }
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