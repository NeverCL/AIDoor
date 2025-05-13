import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProDescriptions,
    ProFormDigit,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Image, message, Space, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import {
    getAdminAppitemsApplications,
    postAdminAppitemsApplications,
    putAdminAppitemsApplicationsApplicationId,
    deleteAdminAppitemsApplicationsApplicationId,
    getAdminAppitemsCategories,
} from '@/services/api/appItemAdmin';

/**
 * 添加应用
 *
 * @param fields
 */
const handleAdd = async (fields: API.ApplicationCreateDto) => {
    const hide = message.loading('正在添加...');
    try {
        await postAdminAppitemsApplications(fields);
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
 * 更新应用
 *
 * @param fields
 */
const handleUpdate = async (applicationId: number, fields: API.ApplicationUpdateDto) => {
    const hide = message.loading('正在更新...');
    try {
        await putAdminAppitemsApplicationsApplicationId({ applicationId }, fields);
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
 * 删除应用
 *
 * @param selectedRows
 */
const handleRemove = async (applicationId: number) => {
    const hide = message.loading('正在删除...');
    try {
        await deleteAdminAppitemsApplicationsApplicationId({ applicationId });
        hide();
        message.success('删除成功');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const AppItemList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.ApplicationDto>();
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([]);
    const intl = useIntl();

    // 获取分类列表
    const fetchCategories = async () => {
        const result = await getAdminAppitemsCategories();
        if (result.success && result.data) {
            const options = result.data.map((item: API.CategoryDto) => ({
                label: item.name,
                value: item.id,
            }));
            setCategoryOptions(options);
        }
    };

    // 组件挂载时获取分类列表
    React.useEffect(() => {
        fetchCategories();
    }, []);

    const columns: ProColumns<API.ApplicationDto>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
            search: false,
        },
        {
            title: '应用名称',
            dataIndex: 'title',
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
            title: '分类',
            dataIndex: 'categoryName',
            search: false,
            renderFormItem: () => (
                <ProFormSelect
                    name="categoryId"
                    label="分类"
                    options={categoryOptions}
                    rules={[{ required: true, message: '请选择分类' }]}
                />
            ),
        },
        {
            title: '封面图',
            dataIndex: 'imageUrl',
            search: false,
            render: (_, record) => record.imageUrl ? (
                <Image src={record.imageUrl} width={80} height={45} />
            ) : null,
        },
        {
            title: '链接',
            dataIndex: 'link',
            search: false,
            ellipsis: true,
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
                        const updateData = {
                            title: record.title,
                            description: record.description,
                            content: record.content,
                            imageUrl: record.imageUrl,
                            link: record.link,
                            displayOrder: record.displayOrder,
                            isActive: checked,
                            categoryId: record.categoryId,
                        };
                        const success = await handleUpdate(record.id, updateData);
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
            <ProTable<API.ApplicationDto>
                headerTitle="应用管理"
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
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={async (params) => {
                    const response = await getAdminAppitemsApplications();
                    return {
                        data: response.data || [],
                        success: response.success,
                    };
                }}
                columns={columns}
            />

            <ModalForm
                title="新建应用"
                width="600px"
                open={createModalOpen}
                onOpenChange={handleModalOpen}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.ApplicationCreateDto);
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
                            message: '请输入应用名称',
                        },
                    ]}
                    width="md"
                    name="title"
                    label="应用名称"
                />
                <ProFormSelect
                    name="categoryId"
                    label="所属分类"
                    width="md"
                    options={categoryOptions}
                    rules={[{ required: true, message: '请选择所属分类' }]}
                />
                <ProFormText
                    width="md"
                    name="imageUrl"
                    label="封面图URL"
                />
                <ProFormText
                    width="md"
                    name="link"
                    label="链接地址"
                />
                <ProFormTextArea
                    width="md"
                    name="description"
                    label="应用描述"
                />
                <ProFormTextArea
                    width="md"
                    name="content"
                    label="应用内容"
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
                title="编辑应用"
                width="600px"
                open={updateModalOpen}
                onOpenChange={handleUpdateModalOpen}
                onFinish={async (value) => {
                    if (!currentRow) return false;
                    const success = await handleUpdate(currentRow.id, value as API.ApplicationUpdateDto);
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
                            message: '请输入应用名称',
                        },
                    ]}
                    width="md"
                    name="title"
                    label="应用名称"
                />
                <ProFormSelect
                    name="categoryId"
                    label="所属分类"
                    width="md"
                    options={categoryOptions}
                    rules={[{ required: true, message: '请选择所属分类' }]}
                />
                <ProFormText
                    width="md"
                    name="imageUrl"
                    label="封面图URL"
                />
                <ProFormText
                    width="md"
                    name="link"
                    label="链接地址"
                />
                <ProFormTextArea
                    width="md"
                    name="description"
                    label="应用描述"
                />
                <ProFormTextArea
                    width="md"
                    name="content"
                    label="应用内容"
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
                {currentRow?.title && (
                    <ProDescriptions<API.ApplicationDto>
                        column={2}
                        title={currentRow?.title}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.id,
                        }}
                        columns={columns as ProDescriptionsItemProps<API.ApplicationDto>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default AppItemList; 