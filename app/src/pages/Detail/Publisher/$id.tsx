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
                {/* 头像 昵称 简介 */}
                <div className="flex items-center p-4">
                    <Avatar src={publisherData.avatar} size={48} />
                    <div className="ml-2">
                        <h2 className="text-lg font-bold">{publisherData.name}</h2>
                        <p className="text-sm text-gray-600">{publisherData.description}</p>
                    </div>
                </div>

                {/* 获赞 关注 粉丝 分值*/}
                <div className="flex items-center p-4">
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.likes}</div>
                        <div className="text-sm text-gray-600">获赞</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.likes}</div>
                        <div className="text-sm text-gray-600">获赞</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.likes}</div>
                        <div className="text-sm text-gray-600">获赞</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-2xl font-bold">{publisherData.stats.likes}</div>
                        <div className="text-sm text-gray-600">获赞</div>
                    </div>
                </div>

                {/* 详细介绍 */}
                <div className="p-4">
                    <div className="text-sm text-gray-600">{publisherData.description}</div>
                </div>

                {/* 去官网 去App */}
                {/* 打分 与我联系 */}
                <div className="p-4 flex justify-between">
                    <Button color="primary">去App</Button>
                    <Button color="primary">去官网</Button>
                    <Button color="primary">打分</Button>
                    <Button color="primary">与我联系</Button>
                </div>

                {/* 关注 */}
                <div className="p-4">
                    <Button color="primary" block>关注</Button>
                </div>

                {/* 发布作品列表 */}
                <div className="p-4">
                    <div className="text-lg font-bold">发布作品</div>
                    <div className="flex flex-col *:mb-2">
                        {aiServices.map(service => (
                            <div>
                                <img className="h-40" src={service.image} alt="" />
                                <div className="text-sm text-gray-600">{service.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </BackNavBar>
    );
}; 