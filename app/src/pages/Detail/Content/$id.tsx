import { useParams, useRequest } from "@umijs/max";
import { useState, useEffect } from "react";
import { Swiper, Image, NavBar, Toast, Card, Skeleton } from "antd-mobile";
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

    // 使用useRequest获取内容详情
    const { run } = useRequest(api.userContent.getUserContentId, {
        manual: true,
        onSuccess: (data) => {
            if (data) {
                setContent(data);
            } else {
                Toast.show({
                    icon: 'fail',
                    content: '获取内容详情失败',
                });
            }
            setLoading(false);
        },
        onError: (error) => {
            console.error('获取内容详情失败:', error);
            Toast.show({
                icon: 'fail',
                content: '获取内容详情失败',
            });
            setLoading(false);
        }
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            run({ id: parseInt(id) });
        }
    }, [id]);

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
                                            <div className="flex justify-center">
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