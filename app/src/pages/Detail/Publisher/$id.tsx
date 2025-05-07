import { useParams } from "@umijs/max";
import BackNavBar from "@/components/BackNavBar";
import { Avatar, Button, Card, Tabs, Image, DotLoading, Tag } from "antd-mobile";
import { LikeOutline, StarOutline, MessageOutline, PhonebookOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useRequest } from '@umijs/max';
import api from '@/services/api';
import dayjs from 'dayjs';

interface PublisherData {
    id: number;
    username: string;
    avatarUrl: string;
    description: string;
    createdAt: string;
    status: number;
    statusText: string;
    reviewNote?: string;
    reviewedAt?: string;
    type: number;
    typeText: string;
    website?: string;
    appLink?: string;
    stats: {
        likes: number;
        followers: number;
        following: number;
        rating: number;
    };
    contents: Array<{
        id: number;
        title: string;
        imageUrl: string;
        createdAt: string;
    }>;
}

export default () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('works');

    // 获取发布者详情
    const { data: publisherData, loading } = useRequest<{ data: PublisherData }>(
        () => api.publisher.getPublisherDetails({ id: Number(id) }),
        {
            refreshDeps: [id],
            // 对接口返回的数据进行处理，确保格式一致性
            formatResult: (res) => res.data
        }
    );

    // 处理关注
    const handleFollow = () => {
        // TODO: 实现关注功能
        console.log('关注用户:', id);
    };

    // 获取状态标签颜色
    const getStatusTagColor = (status: number) => {
        switch (status) {
            case 0: // Pending
                return 'warning';
            case 1: // Approved
                return 'success';
            case 2: // Rejected
                return 'danger';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <BackNavBar title="发布者详情">
                <div className="flex items-center justify-center h-full">
                    <DotLoading color='primary' />
                </div>
            </BackNavBar>
        );
    }

    if (!publisherData) {
        return (
            <BackNavBar title="发布者详情">
                <div className="flex items-center justify-center h-full">
                    数据加载失败
                </div>
            </BackNavBar>
        );
    }

    return (
        <BackNavBar title="发布者详情">
            <div className="flex-1 flex flex-col overflow-y-auto pb-20">
                {/* 头像 昵称 简介 */}
                <div className="flex items-center p-4">
                    <Avatar src={publisherData.avatarUrl} style={{ width: 48, height: 48 }} />
                    <div className="ml-2 flex-1">
                        <div className="flex items-center">
                            <h2 className="text-lg font-bold">{publisherData.username}</h2>
                            <Tag
                                className="ml-2"
                                color={getStatusTagColor(publisherData.status)}
                            >
                                {publisherData.statusText}
                            </Tag>
                        </div>
                        <p className="text-sm text-gray-600">{publisherData.description}</p>
                    </div>
                </div>

                {/* 如果状态是待审核或被拒绝，显示提示信息 */}
                {publisherData.status !== 1 && (
                    <div className={`p-4 ${publisherData.status === 2 ? 'bg-red-50' : 'bg-yellow-50'}`}>
                        <p className="text-sm">
                            {publisherData.status === 0 ? '您的发布者信息正在审核中，请耐心等待。' :
                                publisherData.status === 2 ? `审核未通过: ${publisherData.reviewNote || '无审核意见'}` : ''}
                        </p>
                        {publisherData.reviewedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                                审核时间: {dayjs(publisherData.reviewedAt).format('YYYY-MM-DD HH:mm')}
                            </p>
                        )}
                    </div>
                )}

                {/* 获赞 关注 粉丝 分值*/}
                <div className="flex items-center p-4">
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.likes}</div>
                        <div className="text-sm text-gray-600">获赞</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.followers}</div>
                        <div className="text-sm text-gray-600">粉丝</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.following}</div>
                        <div className="text-sm text-gray-600">关注</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.rating}</div>
                        <div className="text-sm text-gray-600">评分</div>
                    </div>
                </div>

                {/* 详细介绍 */}
                <div className="p-4">
                    <div className="text-sm text-gray-600">{publisherData.description}</div>
                </div>

                {/* 去官网 去App */}
                {/* 只有已审核通过的发布者才显示这些按钮 */}
                {publisherData.status === 1 && (
                    <div className="p-4 flex justify-between">
                        {publisherData.appLink && <Button color="primary">去App</Button>}
                        {publisherData.website && <Button color="primary">去官网</Button>}
                        <Button color="primary">打分</Button>
                        <Button color="primary">与我联系</Button>
                    </div>
                )}

                {/* 关注 - 只有已审核通过的发布者才可以关注 */}
                {publisherData.status === 1 && (
                    <div className="p-4">
                        <Button color="primary" block onClick={handleFollow}>关注</Button>
                    </div>
                )}

                {/* 发布作品列表 - 只有已审核通过的发布者才显示作品 */}
                {publisherData.status === 1 && publisherData.contents.length > 0 && (
                    <div className="p-4">
                        <div className="text-lg font-bold">发布作品</div>
                        <div className="flex flex-col *:mb-2">
                            {publisherData.contents.map((content: {
                                id: number;
                                title: string;
                                imageUrl: string;
                                createdAt: string;
                            }) => (
                                <div key={content.id}>
                                    <Image
                                        src={content.imageUrl}
                                        width="100%"
                                        height={160}
                                        fit="cover"
                                    />
                                    <div className="text-sm text-gray-600">{content.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </BackNavBar>
    );
}; 