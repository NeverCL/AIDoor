import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProDescriptions,
    ProFormDigit,
    ProFormSwitch,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Space, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import {
    getAdminAppitemsCategories,
    postAdminAppitemsCategories,
    putAdminAppitemsCategoriesCategoryId,
    deleteAdminAppitemsCategoriesCategoryId,
} from '@/services/api/appItemAdmin';

/**
 * 添加分类
 *
 * @param fields
 */
const handleAdd = async (fields: API.CategoryCreateDto) => {
    const hide = message.loading('正在添加...');
    try {
        await postAdminAppitemsCategories(fields);
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
 * 更新分类
 *
 * @param fields
 */
const handleUpdate = async (categoryId: number, fields: API.CategoryUpdateDto) => {
    const hide = message.loading('正在更新...');
    try {
        await putAdminAppitemsCategoriesCategoryId({ categoryId }, fields);
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
 * 删除分类
 *
 * @param selectedRows
 */
const handleRemove = async (categoryId: number) => {
    const hide = message.loading('正在删除...');
    try {
        await deleteAdminAppitemsCategoriesCategoryId({ categoryId });
        hide();
        message.success('删除成功');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const CategoryList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.CategoryDto>();
    const intl = useIntl();

    const columns: ProColumns<API.CategoryDto>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
            search: false,
        },
        {
            title: '分类名称',
            dataIndex: 'name',
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
            title: '显示顺序',
            dataIndex: 'displayOrder',
            search: false,
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            valueEnum: {
                true: {
                    text: '启用',
                    status: 'Success',
                },
                false: {
                    text: '禁用',
                    status: 'Error',
                },
            },
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    onChange={async (checked) => {
                        const success = await handleUpdate(record.id, {
                            name: record.name,
                            displayOrder: record.displayOrder,
                            isActive: checked,
                        });
                        if (success && actionRef.current) {
                            actionRef.current.reload();
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
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="edit"
                    onClick={() => {
                        handleUpdateModalOpen(true);
                        setCurrentRow(record);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={async () => {
                        const success = await handleRemove(record.id);
                        if (success && actionRef.current) {
                            actionRef.current.reload();
                        }
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.CategoryDto>
                headerTitle="分类管理"
                actionRef={actionRef}
                rowKey="id"
                search={false}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalOpen(true);
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={async (params) => {
                    const response = await getAdminAppitemsCategories();
                    return {
                        data: response.data || [],
                        success: response.success,
                    };
                }}
                columns={columns}
            />

            <ModalForm
                title="新建分类"
                width="400px"
                open={createModalOpen}
                onOpenChange={handleModalOpen}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.CategoryCreateDto);
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
                            message: '请输入分类名称',
                        },
                    ]}
                    width="md"
                    name="name"
                    label="分类名称"
                />
                <ProFormDigit
                    width="md"
                    name="displayOrder"
                    label="显示顺序"
                    min={0}
                    fieldProps={{ precision: 0 }}
                />
            </ModalForm>

            <ModalForm
                title="编辑分类"
                width="400px"
                open={updateModalOpen}
                onOpenChange={handleUpdateModalOpen}
                onFinish={async (value) => {
                    if (!currentRow) return false;
                    const success = await handleUpdate(currentRow.id, value as API.CategoryUpdateDto);
                    if (success) {
                        handleUpdateModalOpen(false);
                        setCurrentRow(undefined);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                    return success;
                }}
                initialValues={currentRow}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '请输入分类名称',
                        },
                    ]}
                    width="md"
                    name="name"
                    label="分类名称"
                />
                <ProFormDigit
                    width="md"
                    name="displayOrder"
                    label="显示顺序"
                    min={0}
                    fieldProps={{ precision: 0 }}
                />
                <ProFormSwitch name="isActive" label="状态" />
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
                {currentRow?.name && (
                    <ProDescriptions<API.CategoryDto>
                        column={2}
                        title={currentRow?.name}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.id,
                        }}
                        columns={columns as ProDescriptionsItemProps<API.CategoryDto>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default CategoryList; 