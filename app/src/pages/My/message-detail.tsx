import { useRequest, useLocation, history } from '@umijs/max';
import { List, NavBar, Image, DotLoading, Empty, InfiniteScroll } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import BackNavBar from '@/components/BackNavBar';
import { getImageUrl } from '@/utils/imageUtils';

export default () => {
    const [messageType, setMessageType] = useState('follow');
    const [messageData, setMessageData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const location = useLocation();

    // 获取关注记录
    const { run: getFollowRecords } = useRequest(
        api.userFollow.getUserFollow,
        {
            manual: true,
            onSuccess: (data) => {
                // Adjust to match structure from UserFollowController
                const formattedData = (data.follows || []).map((follow: any) => ({
                    id: follow.id,
                    userName: follow.followerUsername || follow.followingUsername,
                    userAvatarUrl: follow.followerAvatarUrl || follow.followingAvatarUrl,
                    createdAt: follow.createdAt
                }));
                setMessageData(formattedData);
                setTotalPages(data.totalPages || 1);
                setHasMore(currentPage < (data.totalPages || 1));
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
                setHasMore(false);
            }
        }
    );

    // 获取互动记录（点赞、评论、收藏）
    const { run: getInteractionRecords } = useRequest(
        api.userRecord.getUserRecord,
        {
            manual: true,
            onSuccess: (data) => {
                if (currentPage === 1) {
                    setMessageData(data.records || []);
                } else {
                    setMessageData([...messageData, ...(data.records || [])]);
                }
                setTotalPages(data.totalPages || 1);
                setHasMore(currentPage < (data.totalPages || 1));
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
                setHasMore(false);
            }
        }
    );

    // 获取评分记录
    const { run: getRatingRecords } = useRequest(
        // Using PublisherController endpoint for publisher ratings
        (params: any) => {
            // First get the current user's publisher ID
            return api.publisher.getPublisherMy().then(publisher => {
                if (publisher && publisher.id) {
                    // Then get ratings for that publisher
                    return api.publisher.getPublisherIdRatings({
                        id: publisher.id,
                        page: params.Page,
                        pageSize: params.Limit
                    });
                }
                return Promise.reject(new Error('没有找到您的开发者信息'));
            });
        },
        {
            manual: true,
            onSuccess: (data) => {
                // Format rating records to match the expected structure
                const formattedData = (data.items || []).map((rating: any) => ({
                    id: rating.id,
                    userName: rating.user?.username || '匿名用户',
                    userAvatarUrl: rating.user?.avatarUrl || '',
                    title: '账号',
                    typeString: 'rating',
                    createdAt: rating.createdAt,
                    value: rating.value,
                    comment: rating.comment
                }));

                if (currentPage === 1) {
                    setMessageData(formattedData);
                } else {
                    setMessageData([...messageData, ...formattedData]);
                }
                setTotalPages(data.totalPages || 1);
                setHasMore(currentPage < (data.totalPages || 1));
                setLoading(false);
            },
            onError: (error) => {
                console.error('Failed to fetch ratings:', error);
                setLoading(false);
                setHasMore(false);
            }
        }
    );

    useEffect(() => {
        // 从URL获取消息类型
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (type && ['follow', 'interaction', 'rating'].includes(type)) {
            setMessageType(type);
        }
        // 重置分页状态
        setCurrentPage(1);
        setMessageData([]);
        setHasMore(true);
    }, [location]);

    useEffect(() => {
        fetchData();
    }, [messageType, currentPage]);

    const fetchData = () => {
        setLoading(true);
        switch (messageType) {
            case 'follow':
                getFollowRecords({
                    Page: currentPage,
                    Limit: pageSize
                });
                break;
            case 'interaction':
                getInteractionRecords({
                    RecordType: 'interaction',
                    Page: currentPage,
                    Limit: pageSize
                });
                break;
            case 'rating':
                getRatingRecords({
                    Page: currentPage,
                    Limit: pageSize
                });
                break;
            default:
                setLoading(false);
                break;
        }
    };

    const loadMore = async () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        } else {
            setHasMore(false);
        }
    };

    const getTitle = () => {
        switch (messageType) {
            case 'follow':
                return '关注记录';
            case 'interaction':
                return '互动记录';
            case 'rating':
                return '评分记录';
            default:
                return '消息详情';
        }
    };

    // 根据记录类型获取描述文本
    const getRecordDescription = (record: any) => {
        if (messageType === 'follow') return '关注了你';

        // 处理互动记录和评分记录
        switch (record.typeString) {
            case 'like':
                return `赞了你的「${record.title || '内容'}」`;
            case 'favorite':
                return `收藏了你的「${record.title || '内容'}」`;
            case 'comment':
                return `评论了你的「${record.title || '内容'}」`;
            case 'rating':
                return record.comment ?
                    `给你的「${record.title || '作品'}」评分 ${record.value}星: ${record.comment}` :
                    `给你的「${record.title || '作品'}」评分 ${record.value}星`;
            case 'footprint':
                return `浏览了你的「${record.title || '内容'}」`;
            default:
                return '互动了你的作品';
        }
    };

    return (
        <BackNavBar title={getTitle()}>
            <div className="p-2">
                <List className="bg-white rounded-lg">
                    {loading && currentPage === 1 ? (
                        <div className="py-10 text-center text-gray-500">
                            <span>加载中</span>
                            <DotLoading />
                        </div>
                    ) : messageData.length > 0 ? (
                        messageData.map((item, index) => (
                            <List.Item
                                key={item.id || index}
                                prefix={
                                    <Image
                                        src={getImageUrl(item.userAvatarUrl)}
                                        style={{ borderRadius: 20 }}
                                        fit="cover"
                                        width={40}
                                        height={40}
                                    />
                                }
                                description={getRecordDescription(item)}
                                extra={
                                    <div className="text-xs text-gray-400">
                                        {new Date(item.lastViewedAt || item.createdAt).toLocaleDateString()}
                                    </div>
                                }
                                arrowIcon={messageType === 'interaction'}
                                onClick={() => {
                                    // 只有互动记录支持跳转功能，关注记录和评分记录不跳转
                                    if (messageType === 'interaction' && item.targetId && item.targetType) {
                                        if (item.targetType === 'Content') {
                                            history.push(`/detail/content/${item.targetId}`);
                                        } else if (item.targetType === 'Publisher') {
                                            history.push(`/publisher/${item.targetId}`);
                                        }
                                    }
                                }}
                            >
                                {item.userName || '昵称'}
                            </List.Item>
                        ))
                    ) : (
                        <Empty
                            description="暂无记录"
                            imageStyle={{ width: 128 }}
                        />
                    )}
                </List>

                {messageData.length > 0 && (
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                )}
            </div>
        </BackNavBar>
    );
}; 