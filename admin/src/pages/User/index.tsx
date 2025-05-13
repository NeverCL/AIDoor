import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message, Modal, Switch, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { request } from '@umijs/max';
import { getImageUrl } from '@/utils/imageUtils';

export interface UserItem {
    id: number;
    username: string;
    phoneNumber: string;
    avatarUrl: string;
    createdAt: string;
    isActive: boolean;
    isDevMode: boolean;
    lastLoginAt?: string;
}

/**
 * 更新用户状态
 * @param userId 用户ID
 * @param isActive 是否激活
 */
const updateUserStatus = async (userId: number, isActive: boolean) => {
    const hide = message.loading('正在更新');
    try {
        await request('/api/user/admin/status', {
            method: 'PUT',
            data: { userId, isActive },
        });
        hide();
        message.success(isActive ? '用户已激活' : '用户已禁用');
        return true;
    } catch (error) {
        hide();
        message.error('更新失败，请重试');
        return false;
    }
};

const UserList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<UserItem[]>([]);

    /**
     * 国际化配置
     */
    const intl = useIntl();

    const handleUpdateStatus = async (record: UserItem, newStatus: boolean) => {
        Modal.confirm({
            title: `确定要${newStatus ? '激活' : '禁用'}用户 "${record.username}" 吗？`,
            content: newStatus ? '激活后用户可以正常使用系统' : '禁用后用户将无法登录系统',
            onOk: async () => {
                const success = await updateUserStatus(record.id, newStatus);
                if (success) {
                    actionRef.current?.reload();
                }
            },
        });
    };

    const columns: ProColumns<UserItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '手机号',
            dataIndex: 'phoneNumber',
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
            title: '注册时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            search: false,
        },
        {
            title: '上次登录',
            dataIndex: 'lastLoginAt',
            valueType: 'dateTime',
            search: false,
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            valueEnum: {
                true: { text: '正常', status: 'Success' },
                false: { text: '禁用', status: 'Error' },
            },
            render: (_, record) => (
                <Tag color={record.isActive ? 'green' : 'red'}>
                    {record.isActive ? '正常' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '用户模式',
            dataIndex: 'isDevMode',
            search: false,
            render: (_, record) => (
                <Tag color={record.isDevMode ? 'blue' : 'default'}>
                    {record.isDevMode ? '开发者' : '使用者'}
                </Tag>
            ),
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Switch
                    key="status"
                    checked={record.isActive}
                    checkedChildren="已激活"
                    unCheckedChildren="已禁用"
                    onChange={(checked) => handleUpdateStatus(record, checked)}
                />,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<UserItem>
                headerTitle="用户管理"
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
                    const { current, pageSize, ...restParams } = params;
                    try {
                        const res = await request('/api/user/admin/list', {
                            method: 'GET',
                            params: {
                                pageIndex: current,
                                pageSize,
                                keyword: restParams.username || restParams.phoneNumber || undefined,
                            },
                        });
                        return {
                            data: res.data,
                            total: res.total,
                            success: res.success,
                        };
                    } catch (error) {
                        message.error('获取用户列表失败');
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
                        onClick={async () => {
                            // 批量操作逻辑
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        批量操作
                    </Button>
                </FooterToolbar>
            )}
        </PageContainer>
    );
};

export default UserList; 