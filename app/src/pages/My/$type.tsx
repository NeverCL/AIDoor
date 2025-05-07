import { useRequest, useParams } from '@umijs/max';
import { useState, useEffect } from 'react';
import { List, InfiniteScroll, PullToRefresh } from 'antd-mobile';
import { HeartFill, StarFill, ClockCircleOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import api from '@/services/api';
import BackNavBar from '@/components/BackNavBar';

interface RecordItem {
    id: number;
    imageUrl: string;
    title: string;
    targetId?: number;
    targetType?: string;
    typeString: string;
    createdAt: string;
    lastViewedAt?: string;
    viewCount?: number;
}

// 记录类型映射
const recordTypes = {
    like: { name: '我的点赞', type: 0, icon: <HeartFill style={{ color: '#f5222d' }} /> },
    favorite: { name: '我的收藏', type: 1, icon: <StarFill style={{ color: '#faad14' }} /> },
    footprint: { name: '足迹', type: 2, icon: <ClockCircleOutline /> }
};

export default () => {
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { type } = useParams();

    const title = recordTypes[type]?.name || '';

    // 加载记录数据
    const { run: fetchRecords, loading } = useRequest(
        (currentPage: number) => api.userRecord.getUserRecord({
            RecordType: recordTypes[type]?.type,
            Page: currentPage,
            Limit: 10
        }),
        {
            manual: true,
            onSuccess: (data, [currentPage]) => {
                if (data && data.records) {
                    if (currentPage === 1) {
                        // 刷新或首次加载
                        setRecords(data.records);
                    } else {
                        // 加载更多
                        setRecords(prev => [...prev, ...data.records]);
                    }
                    // 判断是否还有更多数据
                    setHasMore(currentPage < data.totalPages);
                } else {
                    setHasMore(false);
                }
                setRefreshing(false);
            },
            onError: () => {
                setRefreshing(false);
                setHasMore(false);
            }
        }
    );

    // 初始加载和类型变化时加载数据
    useEffect(() => {
        if (type) {
            // 重置状态
            setPage(1);
            setHasMore(true);
            // 加载第一页数据
            fetchRecords(1);
        }
    }, [type, fetchRecords]);

    // 下拉刷新
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        fetchRecords(1);
    };

    // 加载更多
    const loadMore = async () => {
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRecords(nextPage);
    };

    // 生成记录项链接
    const getDetailLink = (item: RecordItem) => {
        if (item.targetType === 'Content' && item.targetId) {
            return `/detail/content/${item.targetId}`;
        } else if (item.targetType === 'App' && item.targetId) {
            return `/detail/app/${item.targetId}`;
        }
        return '#';
    };

    return (
        <BackNavBar title={title}>
            <PullToRefresh
                onRefresh={onRefresh}
                refreshing={refreshing}
                className="flex-1 overflow-y-auto"
            >
                <List className="overflow-hidden">
                    {records.map((item) => (
                        <List.Item
                            key={item.id}
                            prefix={
                                <div className="w-12 h-12 mr-2 overflow-hidden rounded-lg">
                                    <img
                                        src={item.imageUrl || require('@/assets/my/icon.png')}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            }
                            extra={
                                <div className="flex items-center">
                                    {recordTypes[type]?.icon}
                                </div>
                            }
                            description={
                                <div className="text-xs text-gray-400 mt-1">
                                    {type === 'footprint' && item.lastViewedAt ? (
                                        <div className="flex items-center">
                                            {/* <span>次数：{item.viewCount || 1}</span> */}
                                            {/* <span className="mx-2">|</span> */}
                                            <span>最近：{dayjs(item.lastViewedAt).format('YYYY-MM-DD HH:mm')}</span>
                                        </div>
                                    ) : (
                                        <span>{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                                    )}
                                </div>
                            }
                            arrow
                            onClick={() => {
                                const link = getDetailLink(item);
                                if (link !== '#') {
                                    window.location.href = link;
                                }
                            }}
                        >
                            <div className="font-medium truncate">{item.title}</div>
                        </List.Item>
                    ))}
                </List>

                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />

                {records.length === 0 && !loading && (
                    <div className="flex justify-center items-center py-12 text-gray-400">
                        暂无{title}记录
                    </div>
                )}
            </PullToRefresh>
        </BackNavBar>
    );
}; 