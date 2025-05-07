import { Icon, NavLink, useRequest, history } from "@umijs/max";
import { List, Card, Image, Grid, Button } from "antd-mobile";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import BackNavBar from "@/components/BackNavBar";

const stats = [
    {
        title: "资源",
        value: "2.3w",
    },
    {
        title: "关注",
        value: "526",
    },
    {
        title: "作品",
        value: "1.2w",
    },
    {
        title: "评分",
        value: "4.9",
    },
];

const products = [
    {
        title: "智能对话生成升级",
        description: "全新的对话模型，更智能的回答",
        image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    },
    {
        title: "数据分析功能",
        description: "智能数据可视化展示",
        image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    },
    {
        title: "个性化推荐",
        description: "为您提供个性化服务",
        image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    },
];

export default () => {
    // 这里可以加入获取开发者状态的逻辑
    const [isApplied, setIsApplied] = useState(true);

    // 获取申请状态
    const { run: getStatus } = useRequest(
        api.developerApplication.getDeveloperApplicationStatus,
        {
            manual: true,
            onSuccess: (data) => {
                setIsApplied(data.hasApplied);
            },
        }
    );

    useEffect(() => {
        getStatus();
    }, []);

    const navigateToCreate = () => {
        history.push('/usercontent/create');
    };

    return (
        <div className="bg-gradient-to-b from-blue-600 to-blue-500">
            <div className="flex justify-between items-center px-5 py-4">
                <div className="flex items-center">
                    <Image
                        src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="ml-3 text-white">
                        <div className="text-lg font-bold">智能助手小明</div>
                        <div className="text-xs opacity-80">专注于提供智能对话服务</div>
                    </div>
                </div>
                <Icon icon="local:setting" className="text-white text-xl" />
            </div>

            <div className="px-5 py-2">
                <div className="grid grid-cols-4 gap-4 mb-5 text-white">
                    {stats.map((item, index) => (
                        <div key={index} className="text-center">
                            <div className="text-lg font-bold">{item.value}</div>
                            <div className="text-xs opacity-80">{item.title}</div>
                        </div>
                    ))}
                </div>

                <Card className="mb-4 px-3 py-2 rounded-lg">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        这是一个智能助手应用，能够帮助用户解决日常问题，提供智能对话服务，回答各个领域的问题等等，为用户提供便捷的生活、学习、生活方式，让用户不再需要好的服务体验。
                    </p>
                    <div className="flex justify-between mb-3">
                        <Button size="mini" color="primary" onClick={navigateToCreate}>
                            <div className="flex items-center">
                                <span className="text-xl mr-1">+</span>
                                <span>发布作品</span>
                            </div>
                        </Button>
                        <div className="flex space-x-6">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                                    <Icon icon="local:setting" className="text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-500 mt-1">管理入口</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                                    <Icon icon="local:setting" className="text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-500 mt-1">集成管理</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                                    <Icon icon="local:setting" className="text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-500 mt-1">消息通知</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                                    <Icon icon="local:setting" className="text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-500 mt-1">程序设置</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="mb-5">
                    <Image
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        width="100%"
                        height={160}
                        fit="cover"
                        style={{ borderRadius: 8 }}
                    />
                </div>

                {products.map((product, index) => (
                    <Card key={index} className="rounded-lg overflow-hidden mb-4">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h3 className="text-base font-medium mb-1">{product.title}</h3>
                                <p className="text-xs text-gray-500">{product.description}</p>
                            </div>
                            <Image
                                src={product.image}
                                width={120}
                                height={60}
                                fit="cover"
                                style={{ borderRadius: 4 }}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};