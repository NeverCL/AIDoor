import { history, useModel, useParams } from "@umijs/max";
import { Button, InfiniteScroll, Loading, Modal, Rate, Toast } from "antd-mobile";
import { BellOutline, EditSOutline, LocationOutline, MessageOutline, SetOutline, StarFill } from "antd-mobile-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRequest } from '@umijs/max';
import api from '@/services/api';
import { getImageUrl } from "@/utils";
import BackNavBar from "@/components/BackNavBar";
import openUrl from "@/utils/openUrl";

interface PublisherData {
    id: number;
    username: string;
    avatarUrl: string;
    description: string;
    summary: string;
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
        favorites: number;
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

const bgImg = '20250614/c81d62c0-efbc-4e8a-9540-d4e3407e3959.png';


export default () => {
    const [contents, setContents] = useState<UserContent[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isFollowed, setIsFollowed] = useState(false);
    const pageSize = 10;
    const { id } = useParams();
    const [rating, setRating] = useState(5.0);

    // 获取用户开发者资料
    const { data: publisherData, loading: publisherLoading, error: publisherError, run: getPublisherData } = useRequest<PublisherData>(
        () => api.publisher.getPublisherId({ id: id }),
        {
            onError: (error) => {
                // 如果没有开发者资料，可以提示用户创建
                if (error.response?.status === 404) {
                    Toast.show({
                        content: '您尚未创建开发者资料，请先创建',
                    });
                } else {
                    Toast.show({
                        content: '获取开发者资料失败',
                    });
                }
            },
            onSuccess: (response) => {
                checkFollowStatus({ id: response.id });
            }
        }
    );

    // 获取用户内容列表
    const { run: loadContents, loading: contentsLoading } = useRequest(
        (pageNum: number) => api.userContent.getUserContent({
            Page: pageNum,
            Limit: pageSize,
            IsOwner: true,
            PublisherId: Number(id)
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

    const { run: checkFollowStatus } = useRequest(api.userFollow.getUserFollowCheckId,
        {
            manual: true,
            onSuccess: (response) => {
                setIsFollowed(response.isFollowing);
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

    const handleFollow = async () => {
        if (isFollowed) {
            await api.userFollow.deleteUserFollowId({ id: publisherData?.id });
        } else {
            await api.userFollow.postUserFollow({ followingId: publisherData?.id });
        }

        await checkFollowStatus({ id: publisherData?.id });
        await getPublisherData();
    }


    const showRateModal = () => {
        let currentRating = rating;
        Modal.confirm({
            title: '点击评分',
            content: <div className="text-center">
                <Rate
                    allowHalf
                    defaultValue={currentRating}
                    count={5}
                    onChange={(val) => {
                        console.log('Rating changed to:', val);
                        currentRating = val;
                    }}
                />
            </div>,
            onConfirm: async () => {
                console.log('Submitting rating:', currentRating);
                setRating(currentRating);
                await api.publisher.postPublisherIdRate({ id: publisherData?.id }, { rating: currentRating });
                await getPublisherData();
            }
        });
    }

    return (
        publisherLoading ? <Loading /> :
            <BackNavBar title="开发者资料" >
                {/* 背景图 */}
                <div className="-mx-4">
                    <img className="w-full h-full object-fill" src={getImageUrl(bgImg)} alt="" />
                    {/* <div className="absolute top-4 right-6 flex">
                        <div className="text-2xl" onClick={() => history.push('/my/messages?type=message')}>
                            <BellOutline />
                        </div>
                        <div className="ml-6 text-2xl" onClick={() => history.push('/setting')}>
                            <SetOutline />
                        </div>
                    </div> */}
                </div>

                {/* 头像 数字 */}
                <div className="flex">
                    <div className="w-24 h-24 rounded-full bg-gray-300 relative -top-12" onClick={() => history.push('/Account/Develop')}>
                        {publisherData?.avatarUrl && (
                            <img
                                src={getImageUrl(publisherData.avatarUrl)}
                                alt={publisherData.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        )}
                    </div>

                    {/* 获赞 关注 粉丝 分值*/}
                    <div className="flex-1 flex items-start rounded-lg">
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-bold">{publisherData?.stats.likes}</div>
                            <div className="text-sm text-gray-600">获赞</div>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-bold">{publisherData?.stats.followers}</div>
                            <div className="text-sm text-gray-600">粉丝</div>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-bold">{publisherData?.stats.favorites}</div>
                            <div className="text-sm text-gray-600">收藏</div>
                        </div>
                        <div className="flex-1 text-center" onClick={showRateModal}>
                            <div className="flex items-center justify-center">
                                <span className="text-2xl font-bold mr-1">{publisherData?.stats.rating.toFixed(1)}</span>
                                <StarFill fontSize={16} color='#FFB700' />
                            </div>
                            <div className="text-sm text-gray-600">评分</div>
                        </div>
                    </div>
                </div>

                {/* 关注按钮 */}
                <div className="mb-4">
                    <Button color="primary" block onClick={handleFollow}>
                        {isFollowed ? '取消关注' : '关注'}
                    </Button>
                </div>
                {/* 简介 + 发布内容 */}
                <div className="flex-1 *:mt-8 overflow-y-auto">
                    <div>
                        <div className="text-2xl font-bold">{publisherData?.username || '未设置昵称'}</div>

                        <div className="text-base text-gray-500 mt-2">{publisherData?.summary || '暂无简介'}</div>
                    </div>

                    {/* 发布内容 */}
                    {contents.length > 0 ? (
                        <div className="flex flex-col *:mb-4">
                            {contents.map((content) => (
                                <div
                                    key={content.id}
                                    className="bg-[#3a3a3a] rounded-lg shadow border-[#444444] hover:shadow-md transition-shadow"
                                    onClick={() => history.push(`/detail/content/${content.id}`)}
                                >
                                    {content.images && content.images.length > 0 && (
                                        <div className="flex">
                                            <img
                                                src={getImageUrl(content.images[0])}
                                                alt={content.title}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 px-2">
                                                <div className="text-base font-medium text-gray-200">{content.title}</div>
                                                <div className="text-xs text-gray-400 rounded-full mt-2">
                                                    {dayjs(content.createdAt).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
            </BackNavBar>
    );
};