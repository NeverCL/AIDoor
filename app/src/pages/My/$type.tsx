import { useRequest, useParams, history } from '@umijs/max';
import { useState, useEffect } from 'react';
import { List, InfiniteScroll, PullToRefresh, Tabs } from 'antd-mobile';
import { HeartFill, StarFill, ClockCircleOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import api from '@/services/api';
import BackNavBar from '@/components/BackNavBar';
import { getImageUrl } from '@/utils';

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
const recordTypes: Record<string, { name: string; type: number | null; icon: JSX.Element }> = {
    like: { name: '我的点赞', type: 0, icon: <HeartFill style={{ color: '#f5222d' }} /> },
    favorite: { name: '我的收藏', type: 1, icon: <StarFill style={{ color: '#faad14' }} /> },
    footprint: { name: '足迹', type: null, icon: <ClockCircleOutline /> },
    contentfootprint: { name: '内容足迹', type: 2, icon: <ClockCircleOutline /> },
    appfootprint: { name: 'App足迹', type: 3, icon: <ClockCircleOutline /> }
};

export default () => {
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('content');

    const params = useParams<{ type: string }>();
    let type = params.type || '';

    // 如果是 footprint 类型，默认显示内容足迹
    const isFootprintPage = type === 'footprint';
    if (isFootprintPage) {
        type = activeTab === 'content' ? 'contentfootprint' : 'appfootprint';
    }

    const title = isFootprintPage
        ? recordTypes.footprint.name
        : (type && recordTypes[type] ? recordTypes[type].name : '');

    // 加载记录数据
    const { run: fetchRecords, loading } = useRequest(
        (currentPage: number) => {
            // 处理不同类型的记录
            if (type === 'contentfootprint') {
                // 获取内容足迹
                return api.userRecord.getUserRecord({
                    RecordType: 'ContentFootprint',
                    Page: currentPage,
                    Limit: 10
                });
            } else if (type === 'appfootprint') {
                // 获取App足迹
                return api.userRecord.getUserRecord({
                    RecordType: 'AppFootprint',
                    Page: currentPage,
                    Limit: 10
                });
            } else if (type && recordTypes[type] && recordTypes[type].type !== null) {
                // 获取其他类型记录
                return api.userRecord.getUserRecord({
                    RecordType: String(recordTypes[type].type),
                    Page: currentPage,
                    Limit: 10
                });
            }

            // 默认返回空记录
            return Promise.resolve({ records: [], totalCount: 0, totalPages: 0 });
        },
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
                    setHasMore(data.records.length > 0 && currentPage < data.totalPages);
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

    // Tab变化处理
    const onTabChange = (key: string) => {
        setActiveTab(key);
        // 重置状态
        setPage(1);
        setHasMore(true);
        setRecords([]);
        // 根据激活的Tab加载对应的数据
        fetchRecords(1);
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

    // 获取图标
    const getIcon = () => {
        return type && recordTypes[type] ? recordTypes[type].icon : <ClockCircleOutline />;
    };

    return (
        <BackNavBar title={title}>
            <div className="flex-1 overflow-y-auto">
                {isFootprintPage && (
                    <Tabs onChange={onTabChange} activeKey={activeTab}>
                        <Tabs.Tab title="内容足迹" key="content" />
                        <Tabs.Tab title="应用足迹" key="app" />
                    </Tabs>
                )}

                <PullToRefresh
                    onRefresh={onRefresh}
                >
                    <List className="overflow-hidden">
                        {records.map((item) => (
                            <List.Item
                                key={item.id}
                                prefix={
                                    <div className={`w-12 h-12 overflow-hidden ${type === 'appfootprint' ? 'rounded-3xl' : 'rounded-lg'}`}>
                                        <img
                                            src={getImageUrl(item.imageUrl)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                }
                                extra={
                                    <div className="flex items-center">
                                        {getIcon()}
                                    </div>
                                }
                                description={
                                    <div className="text-xs text-gray-400 mt-1">
                                        {(type === 'contentfootprint' || type === 'appfootprint') && item.lastViewedAt ? (
                                            <div className="flex items-center">
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
                            暂无{isFootprintPage
                                ? (activeTab === 'content' ? '内容足迹' : '应用足迹')
                                : title}记录
                        </div>
                    )}
                </PullToRefresh>
            </div>
        </BackNavBar>
    );
}; 