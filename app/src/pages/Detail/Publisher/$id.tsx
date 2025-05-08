import { history } from "@umijs/max";
import { Button, InfiniteScroll, Modal, Rate, Toast } from "antd-mobile";
import { LocationOutline, MessageOutline, SetOutline, StarFill } from "antd-mobile-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRequest } from '@umijs/max';
import api from '@/services/api';
import { getImageUrl } from "@/utils";
import BackNavBar from "@/components/BackNavBar";

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

interface UserContent {
    id: number;
    title: string;
    imageUrl?: string;
    images?: string[];
    createdAt: string;
}

export default () => {
    const [contents, setContents] = useState<UserContent[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // 获取用户发布者资料
    const { data: publisherData, loading: publisherLoading, error: publisherError } = useRequest<PublisherData>(
        () => api.publisher.getPublisherMy(),
        {
            onError: (error) => {
                // 如果没有发布者资料，可以提示用户创建
                if (error.response?.status === 404) {
                    Toast.show({
                        content: '您尚未创建发布者资料，请先创建',
                    });
                } else {
                    Toast.show({
                        content: '获取发布者资料失败',
                    });
                }
            }
        }
    );

    // 获取用户内容列表
    const { run: loadContents, loading: contentsLoading } = useRequest(
        (pageNum: number) => api.userContent.getUserContent({
            Page: pageNum,
            Limit: pageSize
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
                } else {
                    setHasMore(false);
                }
            },
            onError: () => {
                Toast.show({
                    content: '获取内容列表失败',
                });
                setHasMore(false);
            }
        }
    );

    useEffect(() => {
        loadContents(1);
    }, []);

    // 加载更多内容
    const loadMore = async () => {
        if (contentsLoading) return;
        await loadContents(page);
    };


    const showRateModal = () => {
        Modal.confirm({
            title: '点击评分',
            content: <div className="text-center">
                <Rate allowHalf defaultValue={5} count={5} />
            </div>,
            onConfirm: () => {
                console.log('确认');
            }
        });
    }

    return (
        <BackNavBar title="发布者资料" >
            <div className="h-full flex flex-col *:mt-8 overflow-y-auto">
                {/* 头像 昵称 简介 消息|设置图标*/}
                <div className="flex items-center ">
                    <div className="w-16 h-16 rounded-full bg-gray-300">
                        {publisherData?.avatarUrl && (
                            <img
                                src={getImageUrl(publisherData?.avatarUrl)}
                                alt={publisherData?.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="text-lg font-bold">{publisherData?.name || '未设置昵称'}</div>
                        <div className="text-sm text-gray-500">简介：{publisherData?.description || '暂无简介'}</div>
                    </div>
                    <div className="ml-auto flex items-center">
                        <div className="text-2xl" onClick={() => history.push(`/chat/${publisherData?.id}`)}>
                            <MessageOutline />
                        </div>
                    </div>
                </div>

                {/* 获赞 关注 粉丝 分值*/}
                <div className="flex items-center p-4 bg-secondary rounded-lg">
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData?.stats?.likes || 0}</div>
                        <div className="text-sm text-gray-600">获赞</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData?.stats?.followers || 0}</div>
                        <div className="text-sm text-gray-600">粉丝</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData?.stats?.following || 0}</div>
                        <div className="text-sm text-gray-600">关注</div>
                    </div>
                    <div className="flex-1 text-center" onClick={showRateModal}>
                        <div className="flex items-center justify-center">
                            <span className="text-2xl font-bold mr-1">{publisherData?.stats?.rating?.toFixed(1) || '0.0'}</span>
                            <StarFill fontSize={16} color='#FFB700' />
                        </div>
                        <div className="text-sm text-gray-600">评分</div>
                    </div>
                </div>

                {/* 详细介绍 */}
                <div className="p-4">
                    <div className="text-sm text-gray-600">{publisherData?.description || '暂无简介'}</div>
                </div>

                {/* 关注 */}
                <div className="p-4">
                    <Button color="primary" className="w-full">关注</Button>
                </div>

                {/* 发布内容 */}
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-200">发布内容</h3>
                    </div>

                    {contents.length > 0 ? (
                        <div className="flex flex-col *:mb-4">
                            {contents.map((content) => (
                                <div
                                    key={content.id}
                                    className="bg-[#3a3a3a] rounded-lg shadow p-3 border border-[#444444] hover:shadow-md transition-shadow"
                                    onClick={() => history.push(`/detail/content/${content.id}`)}
                                >
                                    {content.images && content.images.length > 0 && (
                                        <div className="mb-3">
                                            <img
                                                src={getImageUrl(content.images[0])}
                                                alt={content.title}
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <div className="text-base font-medium text-gray-200">{content.title}</div>
                                        <div className="text-xs text-gray-400 bg-[#444444] px-2 py-1 rounded-full">
                                            {dayjs(content.createdAt).format('YYYY-MM-DD')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-10 bg-[#3a3a3a] rounded-lg">
                            暂无内容
                        </div>
                    )}
                </div>
            </div >
        </BackNavBar>
    );
};