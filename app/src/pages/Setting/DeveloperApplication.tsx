import BackNavBar from "@/components/BackNavBar";
import { useRequest, history } from "@umijs/max";
import { Form, Input, Button, Toast, Space, Card, Tag } from "antd-mobile";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default () => {
    const [form] = Form.useForm();
    const [applicationStatus, setApplicationStatus] = useState<API.DeveloperApplicationStatusDto | null>(null);
    const [applicationDetail, setApplicationDetail] = useState<API.DeveloperApplicationDto | null>(null);
    const [loading, setLoading] = useState(false);

    // 获取申请状态
    const { run: getStatus, loading: statusLoading } = useRequest(
        api.developerApplication.getDeveloperApplicationStatus,
        {
            manual: true,
            onSuccess: (data) => {
                setApplicationStatus(data);
                // 如果有申请ID，则获取申请详情
                if (data.hasApplied && data.applicationId) {
                    getApplicationDetail({ id: data.applicationId });
                }
            },
        }
    );

    // 获取申请详情
    const { run: getApplicationDetail } = useRequest(
        api.developerApplication.getDeveloperApplication,
        {
            manual: true,
            onSuccess: (data) => {
                setApplicationDetail(data);
            },
        }
    );

    // 提交申请
    const { run: submitApplication } = useRequest(
        api.developerApplication.postDeveloperApplication,
        {
            manual: true,
            onSuccess: (data) => {
                if (data.success) {
                    Toast.show({
                        icon: 'success',
                        content: data.message || '申请提交成功，请耐心等待审核',
                    });
                    // 刷新状态
                    getStatus();
                    form.resetFields();
                } else {
                    Toast.show({
                        icon: 'fail',
                        content: data.message || '提交失败',
                    });
                }
                setLoading(false);
            },
            onError: (error) => {
                Toast.show({
                    icon: 'fail',
                    content: error.message || '提交失败，请稍后重试',
                });
                setLoading(false);
            },
        }
    );

    useEffect(() => {
        getStatus();
    }, []);

    // 提交表单
    const onFinish = async (values: API.DeveloperApplicationCreateDto) => {
        setLoading(true);
        submitApplication(values);
    };

    // 获取状态标签颜色
    const getStatusTagColor = (status?: API.ApplicationStatus) => {
        switch (status) {
            case 0: // Pending
                return 'primary';
            case 1: // Approved
                return 'success';
            case 2: // Rejected
                return 'danger';
            case 3: // Withdrawn
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <BackNavBar title={'开发者申请'}>
            <div className="p-4">
                {applicationStatus?.hasApplied ? (
                    <Card
                        title="申请状态"
                        extra={
                            <Tag color={getStatusTagColor(applicationStatus.status)}>
                                {applicationStatus.statusText || '未知状态'}
                            </Tag>
                        }
                    >
                        {applicationDetail && (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 mb-1">申请ID</p>
                                    <p>{applicationDetail.id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">申请理由</p>
                                    <p>{applicationDetail.reason}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">项目描述</p>
                                    <p>{applicationDetail.projectDescription}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">联系方式</p>
                                    <p>{applicationDetail.contactInformation}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">提交时间</p>
                                    <p>{new Date(applicationDetail.submittedAt).toLocaleString()}</p>
                                </div>
                                {applicationDetail.reviewedAt && (
                                    <div>
                                        <p className="text-gray-500 mb-1">审核时间</p>
                                        <p>{new Date(applicationDetail.reviewedAt).toLocaleString()}</p>
                                    </div>
                                )}
                                {applicationDetail.reviewNotes && (
                                    <div>
                                        <p className="text-gray-500 mb-1">审核备注</p>
                                        <p>{applicationDetail.reviewNotes}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 如果被拒绝，显示重新申请按钮 */}
                        {applicationStatus.status === 2 && (
                            <div className="mt-4">
                                <Button
                                    color="primary"
                                    block
                                    onClick={() => {
                                        setApplicationStatus({ ...applicationStatus, hasApplied: false });
                                        setApplicationDetail(null);
                                    }}
                                >
                                    重新申请
                                </Button>
                            </div>
                        )}
                    </Card>
                ) : (
                    <>
                        <h2 className="text-lg font-medium mb-4">开发者申请</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            成为开发者后，您可以使用平台资源开发应用程序。请填写以下信息提交申请。
                        </p>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            footer={
                                <Button block type="submit" color="primary" loading={loading}>
                                    提交申请
                                </Button>
                            }
                        >
                            <Form.Item
                                name="reason"
                                label="申请理由"
                                rules={[{ required: true, message: '请填写申请理由' }]}
                            >
                                <Input.TextArea
                                    placeholder="请简述您申请成为开发者的理由"
                                    maxLength={500}
                                    showCount
                                    rows={4}
                                />
                            </Form.Item>

                            <Form.Item
                                name="projectDescription"
                                label="项目描述"
                                rules={[{ required: true, message: '请填写项目描述' }]}
                            >
                                <Input.TextArea
                                    placeholder="请描述您计划开发的项目"
                                    maxLength={1000}
                                    showCount
                                    rows={6}
                                />
                            </Form.Item>

                            <Form.Item
                                name="contactInformation"
                                label="联系方式"
                                rules={[{ required: true, message: '请填写联系方式' }]}
                            >
                                <Input placeholder="请提供您的联系方式，如邮箱、微信等" />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </div>
        </BackNavBar>
    );
}; 