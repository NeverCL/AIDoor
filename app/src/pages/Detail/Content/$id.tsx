import { useParams, useRequest } from "@umijs/max";
import { useState, useEffect } from "react";
import { Swiper, Image, NavBar, Card, Skeleton, ImageViewer, Button } from "antd-mobile";
import { HeartOutline, HeartFill, StarOutline, StarFill } from 'antd-mobile-icons';
import api from '@/services/api';
import dayjs from 'dayjs';

// 定义内容详情接口
interface UserContent {
    id: number;
    title: string;
    content?: string;
    images: string[];
    createdBy: string;
    createdByAvatar?: string;
    createdAt: string;
}

export default () => {
    const { id } = useParams();
    const [content, setContent] = useState<UserContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // 使用useRequest获取内容详情
    const { run } = useRequest(api.userContent.getUserContentId, {
        manual: true,
        onSuccess: (data) => {
            if (data) {
                setContent(data);
            }
            setLoading(false);
        },
        onError: () => {
            setLoading(false);
        }
    });

    // 检查是否已点赞和收藏
    const checkUserActions = async (contentId: number) => {
        // 获取用户记录数据
        const response = await api.userRecord.getUserRecords({});

        if (response && response.records) {
            // 查找当前内容的点赞记录
            const likeRecord = response.records.find(
                (record: any) =>
                    record.typeString === 'like' &&
                    record.targetType === 'Content' &&
                    record.targetId === contentId
            );

            // 查找当前内容的收藏记录
            const favoriteRecord = response.records.find(
                (record: any) =>
                    record.typeString === 'favorite' &&
                    record.targetType === 'Content' &&
                    record.targetId === contentId
            );

            setIsLiked(!!likeRecord);
            setIsFavorite(!!favoriteRecord);
        }
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            run({ id: parseInt(id) });

            // 检查用户是否对该内容点赞/收藏
            checkUserActions(parseInt(id));
        }
    }, [id]);

    // 处理点赞操作
    const handleLike = async () => {
        if (!content || actionLoading) return;

        setActionLoading(true);

        if (isLiked) {
            // 如果已点赞，则取消点赞（需要先获取记录ID，然后删除）
            const response = await api.userRecord.getUserRecords({});
            if (response && response.records) {
                const likeRecord = response.records.find(
                    (record: any) =>
                        record.typeString === 'like' &&
                        record.targetType === 'Content' &&
                        record.targetId === content.id
                );

                if (likeRecord) {
                    await api.userRecord.deleteUserRecord({ id: likeRecord.id });
                    setIsLiked(false);
                }
            }
        } else {
            // 添加点赞记录
            await api.userRecord.createUserRecord({
                recordType: 0, // 0 表示点赞
                title: content.title,
                imageUrl: content.images.length > 0 ? `https://cdn.thedoorofai.com/${content.images[0]}` : '',
                targetId: content.id,
                targetType: 'Content'
            });

            setIsLiked(true);
        }

        setActionLoading(false);
    };

    // 处理收藏操作
    const handleFavorite = async () => {
        if (!content || actionLoading) return;

        setActionLoading(true);

        if (isFavorite) {
            // 如果已收藏，则取消收藏
            const response = await api.userRecord.getUserRecords({});
            if (response && response.records) {
                const favoriteRecord = response.records.find(
                    (record: any) =>
                        record.typeString === 'favorite' &&
                        record.targetType === 'Content' &&
                        record.targetId === content.id
                );

                if (favoriteRecord) {
                    await api.userRecord.deleteUserRecord({ id: favoriteRecord.id });
                    setIsFavorite(false);
                }
            }
        } else {
            // 添加收藏记录
            await api.userRecord.createUserRecord({
                recordType: 1, // 1 表示收藏
                title: content.title,
                imageUrl: content.images.length > 0 ? `https://cdn.thedoorofai.com/${content.images[0]}` : '',
                targetId: content.id,
                targetType: 'Content'
            });

            setIsFavorite(true);
        }

        setActionLoading(false);
    };

    // 获取图片完整URL
    const getImageUrl = (fileName: string) => {
        return `https://cdn.thedoorofai.com/${fileName}`;
    };

    // 返回上一页
    const onBack = () => window.history.back();

    return (
        <div className="flex flex-col h-full">
            <NavBar onBack={onBack}>{content?.title || '内容详情'}</NavBar>

            <div className="flex-1 overflow-y-auto pb-16">
                {loading ? (
                    <div className="p-4">
                        <Skeleton.Title animated />
                        <Skeleton.Paragraph lineCount={5} animated />
                    </div>
                ) : content ? (
                    <div className="p-4">
                        {content.images && content.images.length > 0 && (
                            <div className="mb-4">
                                <Swiper>
                                    {content.images.map((image, index) => (
                                        <Swiper.Item key={index}>
                                            <div className="flex justify-center" onClick={() => {
                                                ImageViewer.Multi.show({
                                                    images: content.images.map(getImageUrl),
                                                    defaultIndex: index,
                                                })
                                            }}>
                                                <Image
                                                    src={getImageUrl(image)}
                                                    fit="cover"
                                                    style={{ borderRadius: 8 }}
                                                />
                                            </div>
                                        </Swiper.Item>
                                    ))}
                                </Swiper>
                            </div>
                        )}

                        <h1 className="text-xl font-bold mb-2">{content.title}</h1>

                        <div className="flex items-center mb-4">
                            <Image
                                src={content.createdByAvatar || require('@/assets/my/icon.png')}
                                width={32}
                                height={32}
                                fit="cover"
                                style={{ borderRadius: 16 }}
                            />
                            <div className="ml-2">
                                <div>{content.createdBy}</div>
                                <div className="text-xs text-gray-500">
                                    {
                                        dayjs(content.createdAt).format('YYYY-MM-DD HH:mm')
                                    }
                                </div>
                            </div>
                        </div>

                        {content.content && (
                            <Card>
                                <div className="whitespace-pre-wrap">{content.content}</div>
                            </Card>
                        )}

                        {/* 添加点赞和收藏按钮 */}
                        <div className="flex justify-center mt-6 space-x-8">
                            <Button
                                onClick={handleLike}
                                loading={actionLoading}
                                disabled={actionLoading}
                                className={`flex items-center px-6 py-2 rounded-full ${isLiked ? 'bg-[#f5222d] text-white' : 'bg-[#525252]'}`}
                            >
                                {isLiked ?
                                    <HeartFill className="mr-1" color="#fff" /> :
                                    <HeartOutline className="mr-1" />
                                }
                                {isLiked ? '已点赞' : '点赞'}
                            </Button>

                            <Button
                                onClick={handleFavorite}
                                loading={actionLoading}
                                disabled={actionLoading}
                                className={`flex items-center px-6 py-2 rounded-full ${isFavorite ? 'bg-[#faad14] text-white' : 'bg-[#525252]'}`}
                            >
                                {isFavorite ?
                                    <StarFill className="mr-1" color="#fff" /> :
                                    <StarOutline className="mr-1" />
                                }
                                {isFavorite ? '已收藏' : '收藏'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center text-gray-500">
                            <div>内容不存在或已被删除</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 