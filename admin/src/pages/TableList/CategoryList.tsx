import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProDescriptions,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Image, message, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import {
    getAdminAppitemsCategories,
    postAdminAppitemsCategories,
    putAdminAppitemsCategoriesCategoryId,
    deleteAdminAppitemsCategoriesCategoryId,
    getAdminAppitemsApplications,
    postAdminAppitemsApplications,
    putAdminAppitemsApplicationsApplicationId,
    deleteAdminAppitemsApplicationsApplicationId,
} from '@/services/api/appItemAdmin';

/**
 * 添加分类
 *
 * @param fields
 */
const handleAddCategory = async (fields: API.CategoryCreateDto) => {
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
const handleUpdateCategory = async (categoryId: number, fields: API.CategoryUpdateDto) => {
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
const handleRemoveCategory = async (categoryId: number) => {
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

/**
 * 添加应用
 *
 * @param fields
 */
const handleAddApplication = async (fields: API.ApplicationCreateDto) => {
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
const handleUpdateApplication = async (applicationId: number, fields: API.ApplicationUpdateDto) => {
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
const handleRemoveApplication = async (applicationId: number) => {
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

const CategoryList: React.FC = () => {
    const [createCategoryModalOpen, handleCategoryModalOpen] = useState<boolean>(false);
    const [updateCategoryModalOpen, handleUpdateCategoryModalOpen] = useState<boolean>(false);
    const [createAppModalOpen, handleAppModalOpen] = useState<boolean>(false);
    const [updateAppModalOpen, handleUpdateAppModalOpen] = useState<boolean>(false);
    const [showCategoryDetail, setShowCategoryDetail] = useState<boolean>(false);
    const [showAppDetail, setShowAppDetail] = useState<boolean>(false);
    const categoryActionRef = useRef<ActionType>();
    const appActionRef = useRef<ActionType>();
    const [currentCategory, setCurrentCategory] = useState<any>();
    const [currentApp, setCurrentApp] = useState<any>();
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [activeTabKey, setActiveTabKey] = useState('1');

    // 获取分类列表
    const fetchCategories = async () => {
        const result = await getAdminAppitemsCategories();
        if (result.success && result.data) {
            const options = result.data.map((item: any) => ({
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

    const categoryColumns: ProColumns<any>[] = [
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
                            setCurrentCategory(entity);
                            setShowCategoryDetail(true);
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
                        handleUpdateCategoryModalOpen(true);
                        setCurrentCategory(record);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="viewApps"
                    onClick={() => {
                        setSelectedCategoryId(record.id);
                        setActiveTabKey('2'); // 切换到应用管理标签页
                        if (appActionRef.current) {
                            appActionRef.current.reload();
                        }
                    }}
                >
                    查看应用
                </a>,
                <a
                    key="delete"
                    onClick={async () => {
                        const success = await handleRemoveCategory(record.id);
                        if (success && categoryActionRef.current) {
                            categoryActionRef.current.reload();
                        }
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    const appColumns: ProColumns<any>[] = [
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
                            setCurrentApp(entity);
                            setShowAppDetail(true);
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
                        handleUpdateAppModalOpen(true);
                        setCurrentApp(record);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={async () => {
                        const success = await handleRemoveApplication(record.id);
                        if (success && appActionRef.current) {
                            appActionRef.current.reload();
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
            <Tabs
                activeKey={activeTabKey}
                onChange={(key) => setActiveTabKey(key)}
                items={[
                    {
                        key: '1',
                        label: '分类管理',
                        children: (
                            <>
                                <ProTable
                                    headerTitle="分类列表"
                                    actionRef={categoryActionRef}
                                    rowKey="id"
                                    search={false}
                                    toolBarRender={() => [
                                        <Button
                                            type="primary"
                                            key="primary"
                                            onClick={() => {
                                                handleCategoryModalOpen(true);
                                            }}
                                        >
                                            <PlusOutlined /> 新建分类
                                        </Button>,
                                    ]}
                                    request={async () => {
                                        const response = await getAdminAppitemsCategories();
                                        return {
                                            data: response.data || [],
                                            success: response.success,
                                        };
                                    }}
                                    columns={categoryColumns}
                                />

                                <ModalForm
                                    title="新建分类"
                                    width="400px"
                                    open={createCategoryModalOpen}
                                    onOpenChange={handleCategoryModalOpen}
                                    onFinish={async (value) => {
                                        const success = await handleAddCategory(value as API.CategoryCreateDto);
                                        if (success) {
                                            handleCategoryModalOpen(false);
                                            if (categoryActionRef.current) {
                                                categoryActionRef.current.reload();
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
                                    open={updateCategoryModalOpen}
                                    onOpenChange={handleUpdateCategoryModalOpen}
                                    onFinish={async (value) => {
                                        if (!currentCategory) return false;
                                        const success = await handleUpdateCategory(currentCategory.id, value as API.CategoryUpdateDto);
                                        if (success) {
                                            handleUpdateCategoryModalOpen(false);
                                            setCurrentCategory(undefined);
                                            if (categoryActionRef.current) {
                                                categoryActionRef.current.reload();
                                            }
                                        }
                                        return success;
                                    }}
                                    initialValues={currentCategory}
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

                                <Drawer
                                    width={600}
                                    open={showCategoryDetail}
                                    onClose={() => {
                                        setCurrentCategory(undefined);
                                        setShowCategoryDetail(false);
                                    }}
                                    closable={false}
                                >
                                    {currentCategory?.name && (
                                        <ProDescriptions
                                            column={2}
                                            title={currentCategory?.name}
                                            request={async () => ({
                                                data: currentCategory || {},
                                            })}
                                            params={{
                                                id: currentCategory?.id,
                                            }}
                                            columns={categoryColumns as ProDescriptionsItemProps<any>[]}
                                        />
                                    )}
                                </Drawer>
                            </>
                        ),
                    },
                    {
                        key: '2',
                        label: '应用管理',
                        children: (
                            <>
                                <ProTable
                                    headerTitle={
                                        selectedCategoryId
                                            ? `应用列表 (分类ID: ${selectedCategoryId})`
                                            : '应用列表 (所有分类)'
                                    }
                                    actionRef={appActionRef}
                                    rowKey="id"
                                    search={{
                                        labelWidth: 120,
                                    }}
                                    toolBarRender={() => [
                                        <Button
                                            type="primary"
                                            key="primary"
                                            onClick={() => {
                                                handleAppModalOpen(true);
                                            }}
                                        >
                                            <PlusOutlined /> 新建应用
                                        </Button>,
                                        selectedCategoryId ? (
                                            <Button
                                                key="clearFilter"
                                                onClick={() => {
                                                    setSelectedCategoryId(null);
                                                    if (appActionRef.current) {
                                                        appActionRef.current.reload();
                                                    }
                                                }}
                                            >
                                                查看所有应用
                                            </Button>
                                        ) : null,
                                    ]}
                                    request={async () => {
                                        const response = await getAdminAppitemsApplications();
                                        let data = response.data || [];
                                        if (selectedCategoryId) {
                                            data = data.filter((item: any) => item.categoryId === selectedCategoryId);
                                        }
                                        return {
                                            data,
                                            success: response.success,
                                        };
                                    }}
                                    columns={appColumns}
                                />

                                <ModalForm
                                    title="新建应用"
                                    width="600px"
                                    open={createAppModalOpen}
                                    onOpenChange={handleAppModalOpen}
                                    onFinish={async (value) => {
                                        const formValue = { ...value };
                                        if (selectedCategoryId && !formValue.categoryId) {
                                            formValue.categoryId = selectedCategoryId;
                                        }
                                        const success = await handleAddApplication(formValue as API.ApplicationCreateDto);
                                        if (success) {
                                            handleAppModalOpen(false);
                                            if (appActionRef.current) {
                                                appActionRef.current.reload();
                                            }
                                        }
                                    }}
                                    initialValues={selectedCategoryId ? { categoryId: selectedCategoryId } : {}}
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
                                    open={updateAppModalOpen}
                                    onOpenChange={handleUpdateAppModalOpen}
                                    onFinish={async (value) => {
                                        if (!currentApp) return false;
                                        const success = await handleUpdateApplication(currentApp.id, value as API.ApplicationUpdateDto);
                                        if (success) {
                                            handleUpdateAppModalOpen(false);
                                            setCurrentApp(undefined);
                                            if (appActionRef.current) {
                                                appActionRef.current.reload();
                                            }
                                        }
                                        return success;
                                    }}
                                    initialValues={currentApp}
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

                                <Drawer
                                    width={600}
                                    open={showAppDetail}
                                    onClose={() => {
                                        setCurrentApp(undefined);
                                        setShowAppDetail(false);
                                    }}
                                    closable={false}
                                >
                                    {currentApp?.title && (
                                        <ProDescriptions
                                            column={2}
                                            title={currentApp?.title}
                                            request={async () => ({
                                                data: currentApp || {},
                                            })}
                                            params={{
                                                id: currentApp?.id,
                                            }}
                                            columns={appColumns as ProDescriptionsItemProps<any>[]}
                                        />
                                    )}
                                </Drawer>
                            </>
                        ),
                    },
                ]}
            />
        </PageContainer>
    );
};

export default CategoryList; 