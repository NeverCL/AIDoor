import { Icon, NavLink } from "@umijs/max"
import { List } from "antd-mobile";
import { useState } from "react";
import useUser from "@/models/global";

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
        path: '/my/like',
    },
    favorite: {
        name: '我的收藏',
        icon: <Icon icon='local:fav' className='mr-2 text-[1.13rem]' />,
        path: '/my/favorite',
    },
    footprint: {
        name: '足迹',
        icon: <Icon icon='local:foot' className='mr-2 text-[1.13rem]' />,
        path: '/my/footprint',
    }
}

export default () => {
    // 用于存储处理后的数据
    const [processedData, setProcessedData] = useState<RecordSectionProps[]>([
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
                },
                {
                    img: url,
                    title: '2025看过最好的新剧院1233'
                },
                {
                    img: url,
                    title: '2025看过最好的新剧院1234'
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
    ].map(item => ({
        ...recordTypeConfig[item.type],
        data: item.data
    })));

    return (
        <>
            <div className="h-full flex flex-col *:mt-8 overflow-y-auto">
                <UserCard />

                {/* 我的点赞、我的收藏、足迹 */}
                {processedData.map((section, index) => (
                    <RecordSection key={index} section={section} />
                ))}

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
    const { user } = useUser();

    return (
        <div className="h-16 rounded-xl bg-[#525252] flex justify-between items-center px-3">
            <div className="flex items-center flex-1">
                <div className="h-[3.94rem] w-[3.94rem] rounded-xl relative bottom-[0.63rem]">
                    <img className="h-full w-full" src={require('@/assets/my/icon.png')} alt="my-header" />
                </div>
                <span className="text-lg font-bold ml-3">{user?.username}</span>
            </div>

            <div className="flex items-center justify-between flex-1 mr-8">
                <NavLink to='/mylist/msg' className="flex flex-col justify-center items-center">
                    <span>消息</span>
                    <span className="text-lg">{user?.messageCount}</span>
                </NavLink>
                <div className="w-[1px] bg-secondary h-3"></div>
                <NavLink to='/mylist/follow' className="flex flex-col justify-center items-center">
                    <span className="">关注</span>
                    <span className="text-lg">{user?.followCount}</span>
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
    <NavLink to={`/detail/${index}`}>
        <div className="flex flex-col">
            <div className="h-16">
                <img src={item.img} alt="" />
            </div>

            <span className="mt-[0.38rem] px-[0.06rem]">{item.title}</span>
        </div>
    </NavLink>
);

// 记录模块组件
const RecordSection = ({ section }: { section: RecordSectionProps }) => (
    <div className="flex flex-col">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
            {section.data?.map((item, index) => (
                <RecordCard key={index} item={item} index={index} />
            ))}
        </div>
    </div>
);