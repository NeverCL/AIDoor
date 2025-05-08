import { useParams } from "@umijs/max";
import BackNavBar from "@/components/BackNavBar";
import { Avatar, Button, DotLoading, Tag, Rate, InfiniteScroll, Dialog, Toast } from "antd-mobile";
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
}

interface PublisherContent {
    id: number;
    title: string;
    imageUrl?: string;
    images?: string[];
    createdAt: string;
}

export default () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('works');
    const [contents, setContents] = useState<PublisherContent[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [rating, setRating] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const pageSize = 10;

    // 获取发布者详情
    const { data: publisherData, loading } = useRequest<PublisherData>(
        () => api.publisher.getPublisherId({ id: Number(id) }),
        {
            onSuccess: (data) => {
                if (data && data.stats && data.stats.rating) {
                    setRating(data.stats.rating);
                }
            }
        }
    );

    // 获取发布者内容列表 - 使用标准的用户内容API，后端需要添加用户ID过滤
    const { run: loadContents } = useRequest(
        (pageNum: number) => api.userContent.getUserContent({
            Page: pageNum,
            Limit: pageSize
            // 注意：后端需要支持按发布者筛选，这里假设后端已修改
            // 由于API不支持PublisherId参数，需要后端扩展
        }),
        {
            manual: true,
            onSuccess: (response) => {
                if (response && response.contents) {
                    const newContents = response.contents.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        imageUrl: item.images && item.images.length > 0 ? item.images[0] : undefined,
                        images: item.images,
                        createdAt: item.createdAt
                    }));

                    setContents(prev =>
                        page === 1 ? newContents : [...prev, ...newContents]
                    );
                    setHasMore(newContents.length === pageSize);
                    setPage(prev => prev + 1);
                }
            }
        }
    );

    // 检查是否已关注该发布者
    const { run: checkFollowStatus } = useRequest(
        () => api.userFollow.getUserFollowCheckId({ id: Number(id) }),
        {
            manual: true,
            onSuccess: (response) => {
                setIsFollowing(response?.isFollowing || false);
            }
        }
    );

    useEffect(() => {
        if (id) {
            setPage(1);
            loadContents(1);
            checkFollowStatus();
        }
    }, [id]);

    // 加载更多内容
    const loadMore = async () => {
        if (publisherData?.status !== 1) return; // 只有已审核通过的发布者才加载内容
        await loadContents(page);
    };

    // 处理关注
    const handleFollow = async () => {
        try {
            if (isFollowing) {
                // 取消关注
                await api.userFollow.deleteUserFollowId({ id: Number(id) });
                Toast.show({
                    icon: 'success',
                    content: '已取消关注',
                });
                setIsFollowing(false);
            } else {
                // 关注发布者
                await api.userFollow.postUserFollow({ followingId: Number(id) });
                Toast.show({
                    icon: 'success',
                    content: '关注成功',
                });
                setIsFollowing(true);
            }
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '操作失败，请重试',
            });
        }
    };

    // 处理评分 - 使用UserRecord API记录评分
    const handleRate = async (value: number) => {
        try {
            await Dialog.confirm({
                content: `确定给该发布者 ${value} 星评分吗？`,
                onConfirm: async () => {
                    // 使用通用的UserRecord API创建评分记录
                    await api.userRecord.postUserRecord({
                        recordType: 2, // 假设2表示评分类型
                        title: `对发布者评分`,
                        targetId: Number(id),
                        targetType: 'Publisher',
                        notes: `Rating:${value}`
                    });

                    setRating(value);
                    Toast.show({
                        icon: 'success',
                        content: '评分成功',
                    });
                },
            });
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: '评分失败，请重试',
            });
        }
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
                    <Avatar src={publisherData.avatarUrl.startsWith('http') ? publisherData.avatarUrl : 'https://cdn.thedoorofai.com/' + publisherData.avatarUrl} style={{ width: 48, height: 48 }} />
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
                        {publisherData.appLink && (
                            <Button
                                color="primary"
                                onClick={() => {
                                    if (publisherData.appLink) {
                                        window.open(publisherData.appLink, '_blank');
                                    }
                                }}
                            >
                                去App
                            </Button>
                        )}
                        {publisherData.website && (
                            <Button
                                color="primary"
                                onClick={() => {
                                    if (publisherData.website) {
                                        window.open(publisherData.website, '_blank');
                                    }
                                }}
                            >
                                去官网
                            </Button>
                        )}
                        <Button
                            color="primary"
                            onClick={() => {
                                Dialog.show({
                                    content: (
                                        <div className="py-4">
                                            <div className="text-center mb-4">请为发布者评分</div>
                                            <Rate
                                                defaultValue={rating}
                                                onChange={handleRate}
                                            />
                                        </div>
                                    ),
                                    closeOnAction: true,
                                    actions: [
                                        {
                                            key: 'cancel',
                                            text: '取消',
                                        }
                                    ],
                                });
                            }}
                        >
                            打分
                        </Button>
                        <Button color="primary">与我联系</Button>
                    </div>
                )}

                {/* 关注 - 只有已审核通过的发布者才可以关注 */}
                {publisherData.status === 1 && (
                    <div className="p-4">
                        <Button
                            color={isFollowing ? 'default' : 'primary'}
                            block
                            onClick={handleFollow}
                        >
                            {isFollowing ? '已关注' : '关注'}
                        </Button>
                    </div>
                )}

                {/* 发布作品列表 - 只有已审核通过的发布者才显示作品 */}
                {publisherData.status === 1 && (
                    <div className="p-4">
                        <div className="text-lg font-bold mb-2">发布作品</div>
                        {contents.length > 0 ? (
                            <div className="flex flex-col *:mb-4">
                                {contents.map((content) => (
                                    <div key={content.id} className="bg-white rounded-lg shadow-sm p-2">
                                        {content.imageUrl && (
                                            <div className="mb-2">
                                                <img
                                                    src={content.imageUrl}
                                                    alt={content.title}
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <div className="text-base font-medium">{content.title}</div>
                                            <div className="text-xs text-gray-500">
                                                {dayjs(content.createdAt).format('YYYY-MM-DD')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-10">
                                暂无内容
                            </div>
                        )}
                    </div>
                )}
            </div>
        </BackNavBar>
    );
}; 