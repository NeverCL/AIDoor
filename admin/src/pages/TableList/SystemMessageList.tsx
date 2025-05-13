import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProDescriptions,
    ProFormDateTimePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import {
    getAdminSystemMessages,
    postAdminSystemMessages,
    putAdminSystemMessagesId,
    deleteAdminSystemMessagesId,
} from '@/services/api/systemMessageAdmin';

/**
 * 添加系统消息
 *
 * @param fields
 */
const handleAddSystemMessage = async (fields: API.SystemMessageAdminCreateDto) => {
    const hide = message.loading('正在添加...');
    try {
        await postAdminSystemMessages(fields);
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败，请重试');
        return false;
    }
};

/**
 * 更新系统消息状态
 *
 * @param fields
 */
const handleUpdateSystemMessage = async (id: number, fields: API.SystemMessageAdminUpdateDto) => {
    const hide = message.loading('正在更新...');
    try {
        await putAdminSystemMessagesId({ id }, fields);
        hide();
        message.success('更新成功');
        return true;
    } catch (error) {
        hide();
        message.error('更新失败，请重试');
        return false;
    }
};

/**
 * 删除系统消息
 *
 * @param selectedRows
 */
const handleRemoveSystemMessage = async (id: number) => {
    const hide = message.loading('正在删除...');
    try {
        await deleteAdminSystemMessagesId({ id });
        hide();
        message.success('删除成功');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const SystemMessageList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.SystemMessageAdminDto>();

    const typeColors = {
        Notification: 'blue',
        Warning: 'orange',
        Error: 'red',
        System: 'green',
    };

    const priorityColors = {
        Low: 'default',
        Normal: 'blue',
        High: 'orange',
        Urgent: 'red',
    };

    const columns: ProColumns<API.SystemMessageAdminDto>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
            width: 80,
            search: false,
        },
        {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
            render: (dom, entity) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
                            setShowDetail(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '类型',
            dataIndex: 'typeString',
            valueEnum: {
                Notification: { text: '通知', status: 'Processing' },
                Warning: { text: '警告', status: 'Warning' },
                Error: { text: '错误', status: 'Error' },
                System: { text: '系统', status: 'Success' },
            },
            render: (_, record) => (
                <Tag color={typeColors[record.typeString as keyof typeof typeColors]}>{record.typeString}</Tag>
            ),
        },
        {
            title: '优先级',
            dataIndex: 'priorityString',
            valueEnum: {
                Low: { text: '低', status: 'Default' },
                Normal: { text: '正常', status: 'Processing' },
                High: { text: '高', status: 'Warning' },
                Urgent: { text: '紧急', status: 'Error' },
            },
            render: (_, record) => (
                <Tag color={priorityColors[record.priorityString as keyof typeof priorityColors]}>
                    {record.priorityString}
                </Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'isRead',
            valueEnum: {
                true: { text: '已读', status: 'Success' },
                false: { text: '未读', status: 'Warning' },
            },
        },
        {
            title: '过期时间',
            dataIndex: 'expireAt',
            valueType: 'dateTime',
            search: false,
            renderText: (val: string) => (val ? val : '永不过期'),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            search: false,
            sorter: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="markRead"
                    onClick={async () => {
                        await handleUpdateSystemMessage(record.id, { isRead: !record.isRead });
                        actionRef.current?.reload();
                    }}
                >
                    {record.isRead ? '标为未读' : '标为已读'}
                </a>,
                <a
                    key="delete"
                    onClick={async () => {
                        await handleRemoveSystemMessage(record.id);
                        actionRef.current?.reload();
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.SystemMessageAdminDto>
                headerTitle="系统消息列表"
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
                            handleModalOpen(true);
                        }}
                    >
                        <PlusOutlined /> 发送消息
                    </Button>,
                ]}
                request={async (params) => {
                    const { current, pageSize, ...rest } = params;
                    const res = await getAdminSystemMessages({
                        page: current,
                        limit: pageSize,
                        ...rest,
                    });
                    if (res && res.data) {
                        return {
                            data: res.data.messages || [],
                            success: true,
                            total: res.data.totalCount || 0,
                        };
                    }
                    return {
                        data: [],
                        success: false,
                        total: 0,
                    };
                }}
                columns={columns}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                }}
            />

            <ModalForm
                title="发送系统消息"
                width="600px"
                open={createModalOpen}
                onOpenChange={handleModalOpen}
                onFinish={async (value) => {
                    const success = await handleAddSystemMessage(value as API.SystemMessageAdminCreateDto);
                    if (success) {
                        handleModalOpen(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '标题不能为空',
                        },
                    ]}
                    width="md"
                    name="title"
                    label="标题"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '内容不能为空',
                        },
                    ]}
                    width="xl"
                    name="content"
                    label="内容"
                    placeholder="请输入消息内容"
                    fieldProps={{
                        rows: 5,
                    }}
                />
                <ProFormSelect
                    name="type"
                    label="消息类型"
                    width="md"
                    options={[
                        { label: '通知', value: 0 },
                        { label: '警告', value: 1 },
                        { label: '错误', value: 2 },
                        { label: '系统', value: 3 },
                    ]}
                    initialValue={0}
                />
                <ProFormSelect
                    name="priority"
                    label="优先级"
                    width="md"
                    options={[
                        { label: '低', value: 0 },
                        { label: '正常', value: 1 },
                        { label: '高', value: 2 },
                        { label: '紧急', value: 3 },
                    ]}
                    initialValue={1}
                />
                <ProFormDigit
                    name="recipientId"
                    label="接收用户ID"
                    width="md"
                    placeholder="留空表示发送给所有用户"
                    min={1}
                />
                <ProFormDateTimePicker
                    name="expireAt"
                    label="过期时间"
                    width="md"
                    placeholder="留空表示永不过期"
                />
            </ModalForm>

            <Drawer
                width={600}
                open={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.id && (
                    <ProDescriptions<API.SystemMessageAdminDto>
                        column={2}
                        title={currentRow?.title}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.id,
                        }}
                        columns={[
                            ...columns,
                            {
                                title: '内容',
                                dataIndex: 'content',
                                ellipsis: true,
                                span: 2,
                                render: (dom) => <div style={{ whiteSpace: 'pre-wrap' }}>{dom}</div>,
                            },
                            {
                                title: '接收用户ID',
                                dataIndex: 'recipientId',
                                span: 2,
                                renderText: (val: string) => (val ? val : '所有用户'),
                            },
                            {
                                title: '阅读时间',
                                dataIndex: 'readAt',
                                valueType: 'dateTime',
                                renderText: (val: string) => (val ? val : '-'),
                            },
                        ] as ProDescriptionsItemProps<API.SystemMessageAdminDto>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default SystemMessageList; 