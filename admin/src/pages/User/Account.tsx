import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
    ActionType,
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProColumns,
    ProDescriptions,
    ProFormCheckbox,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Modal, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount
} from '@/services/api/account';

/**
 * 添加账户
 */
const handleAdd = async (fields: API.AccountCreateRequest) => {
    const hide = message.loading('正在添加');
    try {
        await createAccount(fields);
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
 * 更新账户
 */
const handleUpdate = async (id: number, fields: API.AccountUpdateRequest) => {
    const hide = message.loading('正在更新');
    try {
        await updateAccount(id, fields);
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
 * 删除账户
 */
const handleRemove = async (id: number) => {
    const hide = message.loading('正在删除');
    try {
        await deleteAccount(id);
        hide();
        message.success('删除成功');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const AccountList: React.FC = () => {
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.AccountInfo>();
    const [selectedRowsState, setSelectedRows] = useState<API.AccountInfo[]>([]);

    const { confirm } = Modal;

    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确定要删除这个账户吗?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后无法恢复',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: async () => {
                const success = await handleRemove(id);
                if (success) {
                    actionRef.current?.reload();
                }
            },
        });
    };

    const columns: ProColumns<API.AccountInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
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
            title: '用户名',
            dataIndex: 'username',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '用户名为必填项',
                    },
                ],
            },
        },
        {
            title: '管理员',
            dataIndex: 'isAdmin',
            valueEnum: {
                true: { text: '是', status: 'Success' },
                false: { text: '否', status: 'Default' },
            },
            render: (_, record) => (
                <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    checked={record.isAdmin}
                    disabled
                />
            ),
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            valueEnum: {
                true: { text: '启用', status: 'Success' },
                false: { text: '禁用', status: 'Error' },
            },
            render: (_, record) => (
                <Switch
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                    checked={record.isActive}
                    onChange={async (checked) => {
                        const success = await handleUpdate(record.id, { isActive: checked });
                        if (success) {
                            actionRef.current?.reload();
                        }
                    }}
                />
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            hideInForm: true,
        },
        {
            title: '最后登录',
            dataIndex: 'lastLoginAt',
            valueType: 'dateTime',
            hideInForm: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="edit"
                    onClick={() => {
                        setCurrentRow(record);
                        setUpdateModalVisible(true);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        showDeleteConfirm(record.id);
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.AccountInfo, API.PageParams>
                headerTitle="账户管理"
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
                            setCreateModalVisible(true);
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={getAccounts}
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
                            Modal.confirm({
                                title: '确认删除',
                                content: '确定批量删除选中的账户吗？',
                                onOk: async () => {
                                    let success = true;
                                    for (const account of selectedRowsState) {
                                        const result = await handleRemove(account.id);
                                        if (!result) {
                                            success = false;
                                        }
                                    }
                                    if (success) {
                                        setSelectedRows([]);
                                        actionRef.current?.reload();
                                        message.success('批量删除成功');
                                    }
                                },
                            });
                        }}
                    >
                        批量删除
                    </Button>
                </FooterToolbar>
            )}

            <ModalForm
                title="新建账户"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={setCreateModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.AccountCreateRequest);
                    if (success) {
                        setCreateModalVisible(false);
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
                            message: '用户名为必填项',
                        },
                    ]}
                    width="md"
                    name="username"
                    label="用户名"
                />
                <ProFormText.Password
                    rules={[
                        {
                            required: true,
                            message: '密码为必填项',
                        },
                    ]}
                    width="md"
                    name="password"
                    label="密码"
                />
                <ProFormCheckbox name="isAdmin" label="管理员权限" />
            </ModalForm>

            <ModalForm
                title="编辑账户"
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={setUpdateModalVisible}
                onFinish={async (value) => {
                    if (!currentRow) return;
                    const success = await handleUpdate(currentRow.id, value as API.AccountUpdateRequest);
                    if (success) {
                        setUpdateModalVisible(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                initialValues={currentRow}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '用户名为必填项',
                        },
                    ]}
                    width="md"
                    name="username"
                    label="用户名"
                />
                <ProFormText.Password
                    width="md"
                    name="password"
                    label="密码"
                    placeholder="不修改请留空"
                />
                <ProFormCheckbox name="isAdmin" label="管理员权限" />
                <ProFormCheckbox name="isActive" label="启用状态" />
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
                    <ProDescriptions<API.AccountInfo>
                        column={2}
                        title={currentRow?.username}
                        dataSource={currentRow}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default AccountList; 