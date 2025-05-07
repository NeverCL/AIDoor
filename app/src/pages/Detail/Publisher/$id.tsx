import { useParams } from "@umijs/max";
import BackNavBar from "@/components/BackNavBar";
import { Avatar, Button, Card, Tabs } from "antd-mobile";
import { LikeOutline, StarOutline, MessageOutline, PhonebookOutline } from "antd-mobile-icons";
import { useState } from "react";

export default () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('works');

    // 模拟数据
    const publisherData = {
        name: "智能助手小明",
        description: "专注提供智能对话服务",
        stats: {
            users: "2.3w",
            likes: "526",
            comments: "1.2w",
            rating: "4.9"
        },
        avatar: "https://img.alicdn.com/tfs/TB1pC4ZmkyWBuNjy0FpXXassXXa-300-300.png"
    };

    const aiServices = [
        {
            id: 1,
            title: "智能对话系统开发",
            image: "https://img.alicdn.com/tfs/TB1VjNI3hD1gK0jSZFsXXbldVXa-200-200.png",
            stats: {
                accuracy: "3%",
                usage: "71%",
                efficiency: "29%"
            }
        },
        {
            id: 2,
            title: "智能分析功能",
            image: "https://img.alicdn.com/tfs/TB1pC4ZmkyWBuNjy0FpXXassXXa-300-300.png",
            description: "智能数据分析和可视化"
        },
        {
            id: 3,
            title: "个性化助手",
            image: "https://img.alicdn.com/tfs/TB1VjNI3hD1gK0jSZFsXXbldVXa-200-200.png",
            description: "为您提供个人服务"
        }
    ];

    return (
        <BackNavBar title="发布者详情">
            <div className="flex-1 flex flex-col overflow-y-auto pb-20">
                {/* 头部信息 */}
                <div className="bg-blue-500 text-white p-4 pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar src={publisherData.avatar} style={{ width: 60, height: 60 }} />
                            <div>
                                <h2 className="text-xl font-bold">{publisherData.name}</h2>
                                <p className="text-sm">{publisherData.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                className="text-white px-4 border-white"
                                fill="outline"
                                size="small"
                            >
                                登录APP
                            </Button>
                            <Button
                                className="px-4"
                                color="primary"
                                size="small"
                            >
                                去咨询
                            </Button>
                        </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="flex justify-between text-center">
                        <div>
                            <div className="text-lg font-bold">{publisherData.stats.users}</div>
                            <div className="text-xs">粉丝</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold">{publisherData.stats.likes}</div>
                            <div className="text-xs">获赞</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold">{publisherData.stats.comments}</div>
                            <div className="text-xs">评论</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold">{publisherData.stats.rating}</div>
                            <div className="text-xs">评分</div>
                        </div>
                    </div>
                </div>

                {/* 介绍说明 */}
                <div className="p-4 text-sm">
                    这是一个智能助手小应用，能够帮助用户解决日常问题，提供智能对话服务，感谢您对我服务的支持，我将不断完善的服务体验，努力为您提供更准确、更高效、更人性化的服务。
                </div>

                {/* 标签页 */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="pb-3"
                >
                    <Tabs.Tab title="发布作品" key="works" />
                    <Tabs.Tab title="相册" key="album" />
                    <Tabs.Tab title="个人信息" key="info" />
                    <Tabs.Tab title="我的订单" key="orders" />
                </Tabs>

                {/* 服务内容卡片列表 */}
                <div className="px-4">
                    {aiServices.map((service) => (
                        <Card
                            key={service.id}
                            className="mb-4 rounded-lg overflow-hidden"
                            title={
                                <div className="relative p-0">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    {service.stats && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-[rgba(0,0,0,0.5)] p-4 rounded-full w-32 h-32 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <div className="text-xl font-bold">AI</div>
                                                    <div className="text-xs flex flex-col gap-1 mt-2">
                                                        <div>准确率 {service.stats.accuracy}</div>
                                                        <div>使用率 {service.stats.usage}</div>
                                                        <div>效率 {service.stats.efficiency}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        >
                            <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                            {service.description && (
                                <p className="text-sm text-gray-600">{service.description}</p>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            {/* 底部导航 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
                <div className="flex flex-col items-center">
                    <MessageOutline fontSize={24} />
                    <span className="text-xs">智能对话</span>
                </div>
                <div className="flex flex-col items-center">
                    <StarOutline fontSize={24} />
                    <span className="text-xs">收藏</span>
                </div>
                <div className="flex flex-col items-center">
                    <LikeOutline fontSize={24} />
                    <span className="text-xs">点赞</span>
                </div>
                <div className="flex flex-col items-center">
                    <PhonebookOutline fontSize={24} />
                    <span className="text-xs">电话咨询</span>
                </div>
            </div>
        </BackNavBar>
    );
}; 