import { NavLink } from "@umijs/max"
import { Button, Form, Input, Toast } from "antd-mobile"

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
            <h1>注册账号</h1>

            <div>
                <Form
                    layout='horizontal'
                    footer={
                        <Button block type='submit' color='primary' size='large'>
                            注册
                        </Button>
                    }
                    onFinish={login}
                >
                    <Form.Item
                        name='name'
                        rules={[{ required: true }]}
                    >
                        <Input onChange={console.log} placeholder='请输入昵称' clearable />
                    </Form.Item>

                    <Form.Item
                        name='phone'
                        rules={[{ required: true }]}
                    >
                        <Input type='number' onChange={console.log} placeholder='请输入手机号' clearable />
                    </Form.Item>

                    <Form.Item
                        name='code'
                        rules={[{ required: true }]}
                        extra={
                            <div className='text-blue-500' onClick={sendSmsCode}>
                                获取验证码
                            </div>
                        }
                    >
                        <Input placeholder='请输入验证码' clearable />
                    </Form.Item>

                </Form>
            </div>

            <NavLink to='/account/login' className='justify-self-center text-lg'>
                登录
            </NavLink>
        </div>
    )
}