import { useParams, useRequest } from "@umijs/max";
import { useState, useEffect } from "react";
import { Swiper, Image, NavBar, Card, Skeleton, ImageViewer, Button, TextArea, Divider, List, Avatar, InfiniteScroll } from "antd-mobile";
import { HeartOutline, HeartFill, StarOutline, StarFill, MessageOutline } from 'antd-mobile-icons';
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

// 评论接口
interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        username: string;
        avatarUrl: string;
    };
}

export default () => {
    const { id } = useParams();
    const [content, setContent] = useState<UserContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // 评论相关状态
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

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

            // 加载评论
            loadComments(1);
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

    // 加载评论
    const loadComments = async (page: number) => {
        if (!id || commentLoading) return;

        setCommentLoading(true);
        try {
            // 调用评论API获取评论列表
            const response = await api.comment.getComments({
                contentId: parseInt(id),
                page,
                limit: 10
            });

            // 处理API返回的评论数据
            if (response && response.comments) {
                const apiComments = response.comments.map((item: any) => ({
                    id: item.id,
                    content: item.content,
                    createdAt: item.createdAt,
                    user: {
                        id: item.userId,
                        username: item.username,
                        avatarUrl: item.userAvatar
                    }
                }));

                if (page === 1) {
                    setComments(apiComments);
                } else {
                    setComments(prev => [...prev, ...apiComments]);
                }

                setCommentPage(page);
                setHasMoreComments(page < Math.ceil(response.totalCount / 10));
            } else {
                // 如果API尚未实现，使用模拟数据
                const mockComments = Array(10).fill(0).map((_, index) => ({
                    id: page * 100 + index,
                    content: `这是第${page}页第${index + 1}条评论，评论的内容可能很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长`,
                    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                    user: {
                        id: index + 1,
                        username: `用户${index + 1}`,
                        avatarUrl: ''
                    }
                }));

                if (page === 1) {
                    setComments(mockComments);
                } else {
                    setComments(prev => [...prev, ...mockComments]);
                }

                setCommentPage(page);
                setHasMoreComments(page < 3); // 模拟3页数据
            }
        } finally {
            setCommentLoading(false);
        }
    };

    // 加载更多评论
    const loadMoreComments = async () => {
        if (hasMoreComments && !commentLoading) {
            await loadComments(commentPage + 1);
        }
    };

    // 提交评论
    const submitComment = async () => {
        if (!commentText.trim() || submittingComment || !content) return;

        setSubmittingComment(true);
        try {
            // 调用API提交评论
            const response = await api.comment.postComment({
                contentId: content.id,
                content: commentText
            });

            if (response && response.id) {
                // 添加新评论到列表最前面
                const newComment: Comment = {
                    id: response.id,
                    content: commentText,
                    createdAt: response.createdAt || new Date().toISOString(),
                    user: {
                        id: response.userId || 0,
                        username: response.username || '我',
                        avatarUrl: response.userAvatar || ''
                    }
                };

                setComments(prev => [newComment, ...prev]);
            } else {
                // 如果API尚未实现，使用模拟数据
                const newComment: Comment = {
                    id: Date.now(),
                    content: commentText,
                    createdAt: new Date().toISOString(),
                    user: {
                        id: 0,
                        username: '我',
                        avatarUrl: ''
                    }
                };

                setComments(prev => [newComment, ...prev]);
            }

            setCommentText('');
        } finally {
            setSubmittingComment(false);
        }
    };

    // 阻止Enter键的默认行为，但允许Shift+Enter换行
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认换行
            submitComment();
        }
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

            <div className="flex-1 overflow-y-auto pb-28">
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

                        {/* 评论区 */}
                        <div className="mt-8">
                            <Divider className="bg-gray-600">
                                <MessageOutline className="mr-2" />
                                评论区
                            </Divider>

                            {/* 评论列表 */}
                            <List className="mt-4">
                                {comments.map(comment => (
                                    <List.Item
                                        key={comment.id}
                                        prefix={
                                            <Avatar
                                                src={comment.user.avatarUrl || require('@/assets/my/icon.png')}
                                                style={{ borderRadius: 20 }}
                                            />
                                        }
                                        description={
                                            <div className="text-gray-500 text-xs mt-1">
                                                {dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
                                            </div>
                                        }
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{comment.user.username}</span>
                                            <span className="text-sm mt-1">{comment.content}</span>
                                        </div>
                                    </List.Item>
                                ))}
                            </List>

                            {/* 加载更多 */}
                            <InfiniteScroll loadMore={loadMoreComments} hasMore={hasMoreComments} />
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

            {/* 底部固定的评论输入框 */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1f1f1f] border-t border-gray-700 p-2 flex items-center">
                <TextArea
                    className="flex-1 bg-[#333333] rounded-full px-4 py-2"
                    value={commentText}
                    onChange={setCommentText}
                    placeholder="写下你的评论..."
                    onKeyDown={handleKeyDown}
                    rows={1}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                />
                <Button
                    className="ml-2 rounded-full px-4"
                    loading={submittingComment}
                    disabled={submittingComment || !commentText.trim()}
                    color="primary"
                    onClick={submitComment}
                >
                    发送
                </Button>
            </div>
        </div>
    );
}; 