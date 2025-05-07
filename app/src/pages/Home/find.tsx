import { useState, useEffect } from "react";
import { NavLink, useRequest } from "@umijs/max";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import api from '@/services/api';

// Define data interface
interface UserContent {
    id: number;
    title: string;
    content?: string;
    images: string[];
    createdBy: string;
    createdByAvatar?: string;
    createdAt: string;
}

interface ApiResponse {
    message: string;
    data: {
        contents: UserContent[];
        totalCount: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
    };
}

export default () => {
    const defaultImg = require('@/assets/my/icon.png');

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<UserContent[]>([]);
    const [loading, setLoading] = useState(false);
    const limit = 10; // 每页显示数量

    // 使用 useRequest 钩子获取内容
    const { run: fetchContents } = useRequest(api.userContent.getUserContent, {
        manual: true,
        onSuccess: (data) => {
            // 解析返回数据
            const newData = data?.contents || [];

            if (newData.length === 0 || newData.length < limit) {
                setHasMore(false);
            }

            if (newData) {
                setData(prev => [...prev, ...newData]);
                setPage(prevPage => prevPage + 1);
            }
            setLoading(false);
        },
        onError: (error) => {
            console.error('Failed to fetch content:', error);
            setLoading(false);
        }
    });

    const fetchData = async (pageNum: number) => {
        if (loading) return;

        setLoading(true);
        fetchContents({ Page: pageNum, Limit: limit });
    };

    useEffect(() => {
        // 获取初始数据
        fetchData(page);
    }, []);

    const loadMore = () => {
        fetchData(page);
    };

    // 检查是否是视频文件
    const isVideoFile = (filename: string) => {
        const videoExtensions = ['.mp4', '.m4v', '.mov', '.wmv', '.avi', '.flv', '.mpeg', '.mpg', '.webm', '.mkv'];
        const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        return videoExtensions.includes(extension) || filename.includes('/video/') || filename.includes('/imm/');
    };

    // 获取图片地址，使用数组中的第一张图片
    const getImageUrl = (content: UserContent) => {
        if (content.images && content.images.length > 0) {
            // 假设 images 包含的是文件名，需要拼接完整 URL
            return `https://cdn.thedoorofai.com/${content.images[0]}`;
        }
        return defaultImg;
    };

    // 渲染媒体内容（图片或视频）
    const renderMedia = (item: UserContent) => {
        if (!item.images || item.images.length === 0) {
            return (
                <img
                    className="h-[14rem] rounded-lg object-cover"
                    src={defaultImg}
                    alt={item.title}
                />
            );
        }

        const mediaUrl = `https://cdn.thedoorofai.com/${item.images[0]}`;
        const isVideo = isVideoFile(item.images[0]);

        if (isVideo) {
            return (
                <video
                    className="h-[14rem] w-full rounded-lg object-cover"
                    controls
                    playsInline
                    preload="metadata"
                >
                    <source src={mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } else {
            return (
                <img
                    className="h-[14rem] rounded-lg object-cover"
                    src={`${mediaUrl}`}
                    alt={item.title}
                />
            );
        }
    };

    return (
        <>
            <div id="scrollableMasonry" className="flex-1 overflow-y-auto -mx-2">
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<div className="text-center py-4">加载中...</div>}
                    endMessage={<div className="text-center py-4 text-gray-500">到底了</div>}
                    scrollableTarget="scrollableMasonry"
                >
                    <Masonry
                        breakpointCols={2}
                        className="flex"
                        columnClassName="m-1"
                    >
                        {data.map(item => (
                            <NavLink key={item.id} to={`/detail/content/${item.id}`}>
                                <div className="flex flex-col my-2">
                                    {renderMedia(item)}
                                    <span className="text-lg mt-2">{item.title}</span>
                                    <div className="flex items-center mt-1 gap-2 text-sm text-gray-500">
                                        <img
                                            className="rounded-full h-6 w-6"
                                            src={item.createdByAvatar ? `${item.createdByAvatar}` : defaultImg}
                                            alt="avatar"
                                        />
                                        <span>{item.createdBy}</span>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </Masonry>
                </InfiniteScroll>
            </div>
        </>
    )
}