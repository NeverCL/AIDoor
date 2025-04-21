import { useState, useEffect } from "react";
import { NavLink, request } from "@umijs/max";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";

// Define data interface
interface Item {
    id: number;
    title: string;
    imageUrl: string;
    author: {
        id: number;
        username: string;
        avatarUrl: string;
    };
}

interface ApiResponse {
    message: string;
    data: {
        items: Item[];
        totalCount: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
    };
}

// API service using umi max's request
const apiService = {
    async getItems(page: number, limit: number): Promise<{ items: Item[] }> {
        try {
            // Use umi max's request function
            const response = await request<ApiResponse>('/api/item', {
                method: 'GET',
                params: {
                    page,
                    limit
                },
            });

            return { items: response.data.items };
        } catch (error) {
            console.error('API request error:', error);

            // Fallback to mock data if API call fails
            // Only for development, remove in production
            const startIndex = (page - 1) * limit;
            const mockItems: Item[] = Array(limit).fill(null).map((_, index) => ({
                id: startIndex + index + 1,
                title: (startIndex + index) % 2 === 0 ? '短的标题' : '长标题一长标题一长标题一长标题一长标题一',
                imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418',
                author: {
                    id: 1,
                    username: `作者${startIndex + index + 1}`,
                    avatarUrl: ''
                }
            }));

            // Mock API will stop returning data after page 3
            return { items: page <= 3 ? mockItems : [] };
        }
    }
};

export default () => {
    const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (pageNum: number) => {
        if (loading) return;

        await new Promise(resolve => setTimeout(resolve, 1000));

        setLoading(true);
        try {
            const response = await apiService.getItems(pageNum, 5);

            const newData = response.items || [];

            if (newData.length === 0) {
                setHasMore(false);
            } else {
                setData(prev => [...prev, ...newData]);
                setPage(pageNum + 1);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch initial data
        fetchData(page);
    }, []);

    const loadMore = () => {
        fetchData(page);
    };

    return (
        <>
            <div id="scrollableMasonry" className="flex-1 overflow-y-auto -mx-2">
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<div className="text-center py-4">加载中...</div>}
                    endMessage={<div className="text-center py-4">到底了</div>}
                    scrollableTarget="scrollableMasonry"
                >
                    <Masonry
                        breakpointCols={2}
                        className="flex"
                        columnClassName="m-2"
                    >
                        {data.map(item => (
                            <NavLink key={item.id} to={`/detail/${item.id}`}>
                                <div className="flex flex-col my-2">
                                    <img
                                        className="h-[14rem] rounded-lg object-cover"
                                        src={item.imageUrl || defaultImg}
                                        alt=""
                                    />
                                    <span className="text-lg mt-2">{item.title}</span>
                                    <div className="flex items-center mt-1 gap-2 text-sm text-gray-500">
                                        <img
                                            className="rounded-full h-6 w-6"
                                            src={item.author?.avatarUrl || require('@/assets/my/icon.png')}
                                            alt="icon"
                                        />
                                        <span>{item.author?.username || '作者名'}</span>
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