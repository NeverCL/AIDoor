import { Form, Input, Button, Toast, Radio, ImageUploader, TextArea, Picker } from 'antd-mobile';
import { useState } from 'react';
import BackNavBar from '@/components/BackNavBar';
import type { PickerColumnItem, PickerActions } from 'antd-mobile/es/components/picker';

export default () => {
    const [fileList, setFileList] = useState<any[]>([]);

    const onFinish = (values: any) => {
        Toast.show({
            content: '提交成功',
            icon: 'success',
        });
        console.log(values);
    };

    const handleUpload = async () => {
        return {
            url: URL.createObjectURL(new File([new ArrayBuffer(1)], 'image.png')),
        };
    };

    return (
        <BackNavBar title="注册开发者">
            <div className="pb-16 overflow-y-auto">
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    footer={
                        <div className="rounded-3xl">
                            <Button block color="primary" type="submit" className="mt-8">
                                提交
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        name="name"
                        label="项目名称"
                        rules={[{ required: true, message: '请输入项目名称' }]}
                    >
                        <Input placeholder="请输入项目名称" />
                    </Form.Item>

                    <Form.Item
                        name="logo"
                        label="项目Logo/产品图"
                        rules={[{ required: true, message: '请上传Logo' }]}
                    >
                        <ImageUploader
                            value={fileList}
                            onChange={setFileList}
                            upload={handleUpload}
                            maxCount={1}
                            showUpload={fileList.length < 1}
                        >
                        </ImageUploader>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="项目介绍"
                        rules={[{ required: true, message: '请输入项目介绍' }]}
                    >
                        <TextArea placeholder="请输入项目介绍" rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="website"
                        label="项目链接/网址"
                    >
                        <Input placeholder="请输入项目链接/网址（选填）" />
                    </Form.Item>

                    <Form.Item
                        name="company"
                        label="公司名称"
                    >
                        <Input placeholder="请输入公司名称（选填）" />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="功能分类"
                        rules={[{ required: true, message: '请选择功能分类' }]}
                    >
                        <Picker
                            columns={[
                                [
                                    { label: 'AI应用', value: 'ai' },
                                    { label: '开发工具', value: 'tool' },
                                    { label: '教育培训', value: 'education' },
                                    { label: '娱乐休闲', value: 'entertainment' },
                                    { label: '效率提升', value: 'productivity' },
                                    { label: '其他', value: 'other' },
                                ],
                            ]}
                        >
                            {(items: (PickerColumnItem | null)[], actions: PickerActions) => (
                                <div onClick={() => actions.open()} className="py-2 px-3 border border-gray-300 rounded-md">
                                    {items[0]?.label || '请选择功能分类'}
                                </div>
                            )}
                        </Picker>
                    </Form.Item>

                    <Form.Item
                        name="userType"
                        label="用户类型"
                        rules={[{ required: true, message: '请选择用户类型' }]}
                    >
                        <Radio.Group>
                            <div className="flex flex-col *:my-1">
                                <Radio value="developer">开发者工具</Radio>
                                <Radio value="user">普通用户使用</Radio>
                                <Radio value="enterprise">企业用户使用</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="pricing"
                        label="项目阶段"
                        rules={[{ required: true, message: '请上传Logo' }]}
                    >
                        <Radio.Group>
                            <div className="flex flex-col *:my-1">
                                <Radio value="design">设计计划阶段</Radio>
                                <Radio value="product">产品开发阶段</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </div>
        </BackNavBar >
    );
};
