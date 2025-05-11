import BackNavBar from "@/components/BackNavBar"
import { history, NavLink, useRequest } from "@umijs/max";
import { Avatar, Button, Empty, Loading, Toast } from "antd-mobile"
import api from "@/services/api";
import { useState } from "react";
import { getImageUrl } from "@/utils";

export default () => {
    const [loadingIds, setLoadingIds] = useState<number[]>([]);

    // 获取关注列表
    const { data: followData, loading, mutate } = useRequest(
        () => api.userFollow.getUserFollow({
            Page: 1,
            Limit: 100
        }),
        {
            onError: () => {
                Toast.show({
                    content: '获取关注列表失败',
                });
            }
        }
    );

    // 取消关注
    const handleUnfollow = async (id: number) => {
        setLoadingIds([...loadingIds, id]);
        try {
            await api.userFollow.deleteUserFollowId({ id });
            Toast.show({
                content: '取消关注成功',
            });

            // 更新列表，移除已取消关注的发布者
            const newData = {
                ...followData,
                data: followData?.data?.filter((item: any) => item.publisherId !== id) || []
            };
            mutate(newData);
        } catch (error) {
            Toast.show({
                content: '取消关注失败',
            });
        } finally {
            setLoadingIds(loadingIds.filter(itemId => itemId !== id));
        }
    };

    // 跳转到发布者详情页
    const navigateToPublisher = (id: number) => {
        history.push(`/publisher/${id}`);
    };

    return (
        <BackNavBar title="我的关注">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            ) : followData?.data && followData.data.length > 0 ? (
                <div className="flex flex-col gap-3 p-4">
                    {followData.data.map((item: any) => (
                        <div key={item.publisherId} className="flex justify-between items-center p-2 border-b border-gray-100">
                            <div
                                className="flex items-center gap-3 flex-1"
                                onClick={() => navigateToPublisher(item.publisherId)}
                            >
                                <Avatar
                                    src={getImageUrl(item.avatarUrl)}
                                    className="w-12 h-12"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.name || '未知发布者'}</span>
                                    <span className="text-xs text-gray-500 line-clamp-1">{item.description || '暂无简介'}</span>
                                </div>
                            </div>
                            <Button
                                color="default"
                                size="small"
                                className="px-4 rounded-lg"
                                loading={loadingIds.includes(item.publisherId)}
                                onClick={() => handleUnfollow(item.publisherId)}
                            >
                                取消关注
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty
                    className="h-64 flex flex-col justify-center"
                    description="暂无关注的发布者"
                />
            )}
        </BackNavBar>
    )
}
