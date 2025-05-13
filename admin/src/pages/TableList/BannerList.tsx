import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
    ModalForm,
    PageContainer,
    ProDescriptions,
    ProFormSwitch,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Image, message } from 'antd';
import React, { useRef, useState } from 'react';
import {
    getAdminBanners,
    postAdminBanners,
    putAdminBannersId,
    deleteAdminBannersId,
    getAdminBannersId,
} from '@/services/api/banner';

/**
 * 添加Banner
 *
 * @param fields
 */
const handleAddBanner = async (fields: API.BannerCreateDto) => {
    const hide = message.loading('正在添加...');
    try {
        await postAdminBanners(fields);
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
 * 更新Banner
 *
 * @param fields
 */
const handleUpdateBanner = async (id: number, fields: API.BannerUpdateDto) => {
    const hide = message.loading('正在更新...');
    try {
        await putAdminBannersId({ id }, fields);
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
 * 删除Banner
 *
 * @param selectedRows
 */
const handleRemoveBanner = async (id: number) => {
    const hide = message.loading('正在删除...');
    try {
        await deleteAdminBannersId({ id });
        hide();
        message.success('删除成功');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const BannerList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.BannerDto>();

    const columns: ProColumns<API.BannerDto>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
            search: false,
        },
        {
            title: '标题',
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
            title: 'Banner图片',
            dataIndex: 'bannerImageUrl',
            search: false,
            render: (_, record) => <Image width={100} src={record.bannerImageUrl} />,
        },
        {
            title: '二维码图片',
            dataIndex: 'qrCodeImageUrl',
            search: false,
            render: (_, record) => <Image width={80} src={record.qrCodeImageUrl} />,
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            valueEnum: {
                true: { text: '激活', status: 'Success' },
                false: { text: '禁用', status: 'Error' },
            },
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
                        await handleRemoveBanner(record.id);
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
            <ProTable<API.BannerDto>
                headerTitle="Banner列表"
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
                request={async () => {
                    const res = await getAdminBanners();
                    return {
                        data: res.data || [],
                        success: res.message ? true : false,
                        total: res.data?.length || 0,
                    };
                }}
                columns={columns}
            />

            <ModalForm
                title="新建Banner"
                width="400px"
                open={createModalOpen}
                onOpenChange={handleModalOpen}
                onFinish={async (value) => {
                    const success = await handleAddBanner(value as API.BannerCreateDto);
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
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: 'Banner图片URL不能为空',
                        },
                        {
                            type: 'url',
                            message: '请输入有效的URL',
                        },
                    ]}
                    width="md"
                    name="bannerImageUrl"
                    label="Banner图片URL"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '二维码图片URL不能为空',
                        },
                        {
                            type: 'url',
                            message: '请输入有效的URL',
                        },
                    ]}
                    width="md"
                    name="qrCodeImageUrl"
                    label="二维码图片URL"
                />
            </ModalForm>

            <ModalForm
                title="编辑Banner"
                width="400px"
                open={updateModalOpen}
                onOpenChange={handleUpdateModalOpen}
                onFinish={async (value) => {
                    const success = await handleUpdateBanner(currentRow?.id!, value as API.BannerUpdateDto);
                    if (success) {
                        handleUpdateModalOpen(false);
                        setCurrentRow(undefined);
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
                            message: '标题不能为空',
                        },
                    ]}
                    width="md"
                    name="title"
                    label="标题"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: 'Banner图片URL不能为空',
                        },
                        {
                            type: 'url',
                            message: '请输入有效的URL',
                        },
                    ]}
                    width="md"
                    name="bannerImageUrl"
                    label="Banner图片URL"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '二维码图片URL不能为空',
                        },
                        {
                            type: 'url',
                            message: '请输入有效的URL',
                        },
                    ]}
                    width="md"
                    name="qrCodeImageUrl"
                    label="二维码图片URL"
                />
                <ProFormSwitch
                    name="isActive"
                    label="是否激活"
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
                    <ProDescriptions<API.BannerDto>
                        column={2}
                        title={currentRow?.title}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.id,
                        }}
                        columns={columns as ProDescriptionsItemProps<API.BannerDto>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default BannerList; 