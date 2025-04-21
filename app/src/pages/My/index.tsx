import { Icon, NavLink, history } from "@umijs/max"
import { List, Space } from "antd-mobile";
import { useEffect, useState } from "react";
import { getUserStats } from "@/services/demo/UserController";
import { request } from "@umijs/max";

const url = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

// 用户设置相关导航
interface NavItem {
    name: string;
    icon: React.ReactNode;
    path: string;
}

// 记录项类型
interface RecordItem {
    img: string;
    title: string;
}

// 后端API数据类型
interface ApiDataItem {
    type: 'like' | 'favorite' | 'footprint';
    data: RecordItem[];
}

// 记录区域类型
interface RecordSectionProps {
    name: string;
    icon: React.ReactNode;
    path: string;
    data?: RecordItem[];
}

const navs: NavItem[] = [
    {
        name: '设置',
        icon: <Icon icon='local:setting' className='mr-2 text-[1.13rem]' />,
        path: '/setting'
    },
    {
        name: '切换身份',
        icon: <Icon icon='local:switch' className='mr-2 text-[1.13rem]' />,
        path: '/switch'
    }
]

// 记录类型配置映射
const recordTypeConfig = {
    like: {
        name: '我的点赞',
        icon: <Icon icon='local:like' className='mr-2 text-[1.13rem]' />,
        path: '/like',
    },
    favorite: {
        name: '我的收藏',
        icon: <Icon icon='local:fav' className='mr-2 text-[1.13rem]' />,
        path: '/favorite',
    },
    footprint: {
        name: '足迹',
        icon: <Icon icon='local:foot' className='mr-2 text-[1.13rem]' />,
        path: '/footprint',
    }
}

// 获取用户记录数据的API方法
async function getUserRecords() {
    return request<{
        success?: boolean;
        errorMessage?: string;
        data?: ApiDataItem[];
    }>('/api/v1/user/records', {
        method: 'GET',
    });
}

export default () => {
    // 用于存储处理后的数据
    const [processedData, setProcessedData] = useState<RecordSectionProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 处理后端数据，匹配到前端展示所需的格式
    useEffect(() => {
        // 从API获取数据
        const fetchRecordData = async () => {
            try {
                setLoading(true);
                const response = await getUserRecords();
                if (response.success && response.data) {
                    // 将后端数据转换为组件所需格式
                    const formattedData = response.data.map((item: ApiDataItem) => ({
                        ...recordTypeConfig[item.type],
                        data: item.data
                    }));
                    setProcessedData(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch user records:", error);
                // 出错时使用备用模拟数据
                const mockApiData: ApiDataItem[] = [
                    {
                        type: 'like',
                        data: [
                            {
                                img: url,
                                title: '2025看过最好的新剧院1232'
                            },
                            {
                                img: url,
                                title: '2025看过最好的新剧院1232'
                            }
                        ]
                    },
                    {
                        type: 'favorite',
                        data: [
                            {
                                img: url,
                                title: '收藏的内容示例'
                            },
                            {
                                img: url,
                                title: '收藏的内容示例'
                            }
                        ]
                    },
                    {
                        type: 'footprint',
                        data: [
                            {
                                img: url,
                                title: '浏览过的内容示例'
                            },
                            {
                                img: url,
                                title: '浏览过的内容示例'
                            }
                        ]
                    }
                ];

                // 将备用数据转换为组件所需格式
                const fallbackData = mockApiData.map(item => ({
                    ...recordTypeConfig[item.type],
                    data: item.data
                }));

                setProcessedData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchRecordData();
    }, []);

    return (
        <>
            <div className="grid gap-x-4 h-full overflow-y-auto">
                <UserCard />

                {/* 我的点赞、我的收藏、足迹 */}
                {processedData.map((section, index) => (
                    <RecordSection key={index} section={section} />
                ))}

                <div className="mt-7"></div>

                <List className="text-white mb-28 text-base">
                    {navs.map(item => (
                        <NavLink key={item.name} to={item.path} className="block">
                            <List.Item
                                prefix={item.icon}
                                arrowIcon
                            >
                                {item.name}
                            </List.Item>
                        </NavLink>
                    ))}
                </List>
            </div>
        </>
    )
}

// 用户资料卡组件
const UserCard = () => {
    const [userStats, setUserStats] = useState({
        messageCount: 0,
        followCount: 0
    });

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await getUserStats();
                if (response.success && response.data) {
                    setUserStats({
                        messageCount: response.data.messageCount ?? 0,
                        followCount: response.data.followCount ?? 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            }
        };

        fetchUserStats();
    }, []);

    return (
        <div className="mt-10 h-16 rounded-xl bg-[#525252] flex justify-between items-center px-[0.88rem]">
            <div className="flex items-center flex-1">
                <div className="h-[3.94rem] w-[3.94rem] rounded-xl relative bottom-[0.63rem]">
                    <img className="h-full w-full" src={require('@/assets/my/icon.png')} alt="my-header" />
                </div>
                <span className="text-primary text-lg font-bold ml-3">张三</span>
            </div>
            <div className="flex items-center justify-between flex-1 mr-8">
                <NavLink to='/messages' className="flex flex-col justify-center items-center">
                    <span>消息</span>
                    <span className="text-primary text-lg">{userStats.messageCount}</span>
                </NavLink>
                <div className="w-[1px] bg-secondary h-3"></div>
                <NavLink to='/follows' className="flex flex-col justify-center items-center">
                    <span className="">关注</span>
                    <span className="text-primary text-lg">{userStats.followCount}</span>
                </NavLink>
            </div>
        </div>
    );
};

// 记录卡片组件
interface RecordCardProps {
    item: RecordItem;
    index: number;
}

const RecordCard = ({ item, index }: RecordCardProps) => (
    <NavLink to={`/detail/${index}`} className="h-[5.25rem]">
        <div className="flex flex-col">
            <div className="h-[3.75rem] overflow-hidden">
                <img src={item.img} alt="" />
            </div>

            <span className="mt-[0.38rem] px-[0.06rem]">{item.title}</span>
        </div>
    </NavLink>
);

// 记录模块组件
const RecordSection = ({ section }: { section: RecordSectionProps }) => (
    <div className="flex flex-col flex-wrap my-7 text-base">
        {/* title */}
        <NavLink to={section.path} className="flex justify-between items-center mb-2">
            <div className="flex text-primary font-bold items-center">
                {section.icon}
                <span>{section.name}</span>
            </div>

            <div className="flex items-center justify-center">
                <span>全部 ＞</span>
                {/* <Icon icon="local:enter" /> */}
            </div>
        </NavLink>
        {/* 记录列表 */}
        <div className="grid grid-cols-3 gap-2">
            {section.data?.map((item, index) => (
                <RecordCard key={index} item={item} index={index} />
            ))}
        </div>
    </div>
);

// 设置导航组件
const SettingNav = ({ navItem }: { navItem: NavItem }) => (
    <NavLink to={navItem.path} className="flex mb-7 justify-between items-center" key={navItem.path}>
        <div className="flex text-primary font-bold items-center">
            {navItem.icon}
            <span>{navItem.name}</span>
        </div>
        <span>＞</span>
    </NavLink>
);