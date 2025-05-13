import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProTable,
    ProFormTextArea,
    ModalForm,
} from '@ant-design/pro-components';
import { Button, message, Modal, Tag, Space, Tooltip, Form } from 'antd';
import React, { useRef, useState } from 'react';
import { request } from '@umijs/max';
import { getImageUrl } from '@/utils/imageUtils';

// 发布者状态枚举
enum PublisherStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

export interface PublisherItem {
    id: number;
    username: string;
    avatarUrl: string;
    description: string;
    summary: string;
    website?: string;
    appLink?: string;
    status: PublisherStatus;
    type: number;
    createdAt: string;
    updatedAt?: string;
    reviewNote?: string;
}

/**
 * 审核发布者
 * @param id 发布者ID
 * @param approved 是否批准
 * @param reviewNote 审核备注
 */
const reviewPublisher = async (id: number, approved: boolean, reviewNote?: string) => {
    const hide = message.loading('正在处理');
    try {
        await request(`/api/publisher/${id}/review`, {
            method: 'POST',
            data: { approved, reviewNote },
        });
        hide();
        message.success(approved ? '已批准发布者申请' : '已拒绝发布者申请');
        return true;
    } catch (error) {
        hide();
        message.error('操作失败，请重试');
        return false;
    }
};

const PublisherList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<PublisherItem[]>([]);
    const [currentPublisher, setCurrentPublisher] = useState<PublisherItem | undefined>(undefined);
    const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
    const [reviewType, setReviewType] = useState<'approve' | 'reject'>('approve');
    const [form] = Form.useForm();

    /**
     * 打开审核对话框
     */
    const showReviewModal = (record: PublisherItem, type: 'approve' | 'reject') => {
        setCurrentPublisher(record);
        setReviewType(type);
        setReviewModalVisible(true);
        form.resetFields();
    };

    /**
     * 提交审核
     */
    const handleReview = async (values: { reviewNote?: string }) => {
        if (!currentPublisher) return false;

        const success = await reviewPublisher(
            currentPublisher.id,
            reviewType === 'approve',
            values.reviewNote
        );

        if (success) {
            setReviewModalVisible(false);
            actionRef.current?.reload();
            return true;
        }
        return false;
    };

    const columns: ProColumns<PublisherItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '名称',
            dataIndex: 'username',
        },
        {
            title: '头像',
            dataIndex: 'avatarUrl',
            search: false,
            render: (_, record) => (
                record.avatarUrl ? <img src={getImageUrl(record.avatarUrl)} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} /> : '-'
            ),
        },
        {
            title: '类型',
            dataIndex: 'type',
            valueEnum: {
                0: { text: '个人', status: 'default' },
                1: { text: '企业', status: 'processing' },
                2: { text: '机构', status: 'processing' },
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
                [PublisherStatus.Pending]: { text: '待审核', status: 'warning' },
                [PublisherStatus.Approved]: { text: '已批准', status: 'success' },
                [PublisherStatus.Rejected]: { text: '已拒绝', status: 'error' },
            },
            render: (_, record) => {
                let color = 'default';
                let text = '未知';

                switch (record.status) {
                    case PublisherStatus.Pending:
                        color = 'orange';
                        text = '待审核';
                        break;
                    case PublisherStatus.Approved:
                        color = 'green';
                        text = '已批准';
                        break;
                    case PublisherStatus.Rejected:
                        color = 'red';
                        text = '已拒绝';
                        break;
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: '简介',
            dataIndex: 'description',
            search: false,
            ellipsis: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => {
                // 根据状态显示不同的操作按钮
                if (record.status === PublisherStatus.Pending) {
                    return (
                        <Space>
                            <Tooltip title="批准">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    size="small"
                                    onClick={() => showReviewModal(record, 'approve')}
                                />
                            </Tooltip>
                            <Tooltip title="拒绝">
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    size="small"
                                    onClick={() => showReviewModal(record, 'reject')}
                                />
                            </Tooltip>
                        </Space>
                    );
                }

                // 已审核状态可以查看详情
                return (
                    <Space>
                        <Button
                            size="small"
                            onClick={() => {
                                // 查看详情逻辑
                                Modal.info({
                                    title: '发布者详情',
                                    width: 600,
                                    content: (
                                        <div>
                                            <p><strong>名称：</strong>{record.username}</p>
                                            <p><strong>简介：</strong>{record.description}</p>
                                            <p><strong>摘要：</strong>{record.summary}</p>
                                            {record.website && <p><strong>网站：</strong>{record.website}</p>}
                                            {record.appLink && <p><strong>应用链接：</strong>{record.appLink}</p>}
                                            {record.reviewNote && <p><strong>审核备注：</strong>{record.reviewNote}</p>}
                                        </div>
                                    ),
                                });
                            }}
                        >
                            查看详情
                        </Button>
                        {record.status === PublisherStatus.Rejected && (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => showReviewModal(record, 'approve')}
                            >
                                重新批准
                            </Button>
                        )}
                        {record.status === PublisherStatus.Approved && (
                            <Button
                                danger
                                size="small"
                                onClick={() => showReviewModal(record, 'reject')}
                            >
                                撤销批准
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <PageContainer>
            <ProTable<PublisherItem>
                headerTitle="发布者管理"
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                    >
                        <PlusOutlined /> 刷新
                    </Button>,
                ]}
                request={async (params) => {
                    // 转换参数格式
                    const { current, pageSize, status, ...restParams } = params;
                    try {
                        const res = await request('/api/publisher/all', {
                            method: 'GET',
                            params: {
                                page: current,
                                pageSize,
                                status: status !== undefined ? parseInt(status as string) : undefined,
                                keyword: restParams.name || undefined,
                            },
                        });
                        return {
                            data: res.items,
                            total: res.total,
                            success: true,
                        };
                    } catch (error) {
                        message.error('获取发布者列表失败');
                        return {
                            data: [],
                            total: 0,
                            success: false,
                        };
                    }
                }}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
                        </div>
                    }
                >
                    <Button
                        onClick={() => {
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        批量操作
                    </Button>
                </FooterToolbar>
            )}

            {/* 审核表单 */}
            <ModalForm
                title={reviewType === 'approve' ? '批准发布者申请' : '拒绝发布者申请'}
                form={form}
                open={reviewModalVisible}
                onOpenChange={setReviewModalVisible}
                onFinish={handleReview}
            >
                <ProFormTextArea
                    name="reviewNote"
                    label="审核备注"
                    placeholder="请输入审核备注（选填）"
                    rules={[
                        {
                            max: 500,
                            message: '备注不能超过500个字符',
                        },
                    ]}
                />
            </ModalForm>
        </PageContainer>
    );
};

export default PublisherList; 