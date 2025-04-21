import { InfiniteScroll } from "antd-mobile"
import { useState, useEffect } from "react";
import { NavLink, request } from "@umijs/max";
import Masonry from "react-masonry-css";

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

    const loadMore = async () => {
        await fetchData(page);
    };

    return (
        <>
            <div></div>
            <Masonry
                breakpointCols={2}
                className="flex overflow-y-auto"
                columnClassName="p-2"
            >
                {
                    data.map((item) => {
                        return (
                            <NavLink key={item.id} to={`/detail/${item.id}`}>
                                <div className="flex flex-col h-fit">
                                    <img className="h-[14rem] rounded-lg overflow-hidden" src={item.imageUrl || defaultImg} alt="" />
                                    <span className="text-lg">{item.title}</span>
                                    <div className="flex items-center">
                                        <img className="round-full h-6 w-6" src={item.author?.avatarUrl || require('@/assets/my/icon.png')} alt="icon" />
                                        <span>{item.author?.username || '作者名'}</span>
                                    </div>
                                </div>
                            </NavLink>
                        )
                    })
                }

                <InfiniteScroll className="col-span-full block text-center" loadMore={loadMore} hasMore={hasMore} />
            </Masonry>
        </>
    )
}