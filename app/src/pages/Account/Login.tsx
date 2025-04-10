import VerificationCodeButton from "@/components/VerificationCodeButton"
import { NavLink } from "@umijs/max"
import { Button, Form, Input, Toast } from "antd-mobile"
import { MailOutline, PhoneFill, UserOutline } from "antd-mobile-icons"

export default () => {
    const sendSmsCode = () => {
        throw new Error("Function not implemented.")
    }

    const login = (values: any) => {
        Toast.show(JSON.stringify(values));
        throw new Error("Function not implemented.");
    }

    return (
        <div className="grid items-center h-full">
            <h1 >登录账号</h1>

            <div>
                <Form
                    footer={
                        <Button block type='submit' color='primary' size='large'>
                            登录
                        </Button>
                    }
                    onFinish={login}
                >
                    <Form.Item
                        name='phone'
                        label={<PhoneFill className="text-lg" />}
                        childElementPosition="normal"
                        rules={[{ required: true }]}
                    >
                        <Input onChange={console.log} placeholder='请输入手机号' clearable type='number' />
                    </Form.Item>

                    <Form.Item
                        name='code'
                        label={<MailOutline className="text-lg" />}
                        rules={[{ required: true }]}
                        extra={
                            <VerificationCodeButton onSend={function (): Promise<boolean> {
                                return new Promise((resolve, reject) => {
                                    resolve(true)
                                })
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