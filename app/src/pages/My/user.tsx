import { Icon, NavLink, useModel, useRequest, history } from "@umijs/max"
import { List } from "antd-mobile";
import { useState, useEffect } from "react";
import api from '@/services/api';
import { EditSOutline } from "antd-mobile-icons";
import { getImageUrl } from "@/utils";


// 用户设置相关导航
interface NavItem {
    name: string;
    icon: React.ReactNode;
    path: string;
}

// 记录项类型
interface RecordItem {
    id: number;
    imageUrl: string;
    title: string;
    targetId?: number;
    targetType?: string;
    typeString: string;
}

// 记录区域类型
interface RecordSectionProps {
    name: string;
    icon: React.ReactNode;
    path: string;
    type: string;
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
const recordTypeConfig: { [key: string]: { name: string; icon: React.ReactNode; path: string; } } = {
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
    contentfootprint: {
        name: '内容足迹',
        icon: <Icon icon='local:foot' className='mr-2 text-[1.13rem]' />,
        path: '/my/contentfootprint',
    },
    appfootprint: {
        name: 'App足迹',
        icon: <Icon icon='local:foot' className='mr-2 text-[1.13rem]' />,
        path: '/my/appfootprint',
    }
}

export default () => {
    // 存储各类型的记录数据
    const [recordSections, setRecordSections] = useState<RecordSectionProps[]>([]);

    // 获取所有类型的记录数据
    const { data, loading } = useRequest(() =>
        api.userRecord.getUserRecord({ Limit: 20 })
    );

    // 处理获取到的数据
    useEffect(() => {
        if (data && data.records) {
            // 按照类型对记录进行分组
            const recordsByType: { [key: string]: RecordItem[] } = {
                like: [],
                favorite: [],
                contentfootprint: [],
                appfootprint: []
            };

            // 对记录按类型进行分类
            data.records.forEach((record: any) => {
                let type = record.typeString.toLowerCase();

                // 将新的足迹类型映射到前端类型
                if (type === 'contentfootprint') {
                    type = 'contentfootprint';
                } else if (type === 'appfootprint') {
                    type = 'appfootprint';
                }

                if (recordsByType[type]) {
                    recordsByType[type].push({
                        id: record.id,
                        imageUrl: record.imageUrl,
                        title: record.title,
                        targetId: record.targetId,
                        targetType: record.targetType,
                        typeString: record.typeString
                    });
                }
            });

            // 构建记录区域数据
            const sections: RecordSectionProps[] = [];
            Object.keys(recordTypeConfig).forEach(type => {
                const records = recordsByType[type] || [];
                // 取每种类型的前4条记录
                sections.push({
                    ...recordTypeConfig[type],
                    type,
                    data: records.slice(0, 4)
                });
            });

            setRecordSections(sections);
        }
    }, [data]);

    return (
        <>
            <div className="h-full flex flex-col *:mt-8 overflow-y-auto">
                <UserCard />

                {/* 我的点赞、我的收藏、足迹 */}
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <span>加载中...</span>
                    </div>
                ) : (
                    recordSections.map((section, index) => (
                        <RecordSection key={index} section={section} />
                    ))
                )}

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
    const { user } = useModel('global');

    // 获取未读消息数量
    const { data, loading: countLoading } = useRequest(
        () => api.chatMessage.getMessagesUserUnreadCount(),
        {
            refreshOnWindowFocus: true,
            pollingInterval: 30000, // 每30秒刷新一次
        }
    );

    // 安全地获取未读消息数量
    const unreadCount = data !== undefined && data !== null ? String(data) : '0';

    // 安全地获取关注数量
    const followCount = user && 'followCount' in user ? String(user.followCount) : '0';

    return (
        <div className="h-16 rounded-xl bg-[#525252] flex justify-between items-center px-3">
            <div className="flex items-center flex-1" onClick={() => history.push('/user/edit')}>
                <div className="h-[3.94rem] w-[3.94rem] relative bottom-[0.63rem]">
                    <img className="h-full w-full rounded-full" src={user?.avatarUrl} alt="my-header" />
                    <div className="absolute -bottom-1 -right-1 bg-black text-white p-1 rounded-full shadow-md">
                        <EditSOutline fontSize={14} />
                    </div>
                </div>
                <span className="text-lg font-bold ml-3">{user?.username}</span>
            </div>

            <div className="flex items-center justify-between flex-1 *:mr-4">
                <NavLink to='/chat/list' className="flex flex-col justify-center items-center">
                    <span>消息</span>
                    <span className="text-lg">{countLoading ? '...' : unreadCount}</span>
                </NavLink>
                <div className="w-[1px] bg-secondary h-3"></div>
                <NavLink to='/mylist/follow' className="flex flex-col justify-center items-center">
                    <span className="">关注</span>
                    <span className="text-lg">{followCount}</span>
                </NavLink>
            </div>
        </div>
    );
};

// 记录卡片组件
interface RecordCardProps {
    item: RecordItem;
}

const RecordCard = ({ item }: RecordCardProps) => {
    // 根据记录类型和目标ID确定导航路径
    const getDetailPath = () => {
        if (item.targetType === 'Content' && item.targetId) {
            return `/detail/content/${item.targetId}`;
        } else if (item.targetType === 'App' && item.targetId) {
            return `/detail/app/${item.targetId}`;
        }
        return '#';
    };

    return (
        <NavLink to={getDetailPath()}>
            <div className="flex flex-col">
                <div className="h-16">
                    <img src={getImageUrl(item.imageUrl)} alt="" className="h-full w-full object-cover rounded-lg" />
                </div>
                <span className="mt-[0.38rem] px-[0.06rem] text-sm truncate">{item.title}</span>
            </div>
        </NavLink>
    );
};

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
            </div>
        </NavLink>
        {/* 记录列表 */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
            {section.data && section.data.length > 0 ? (
                section.data.map((item, index) => (
                    <RecordCard key={index} item={item} />
                ))
            ) : (
                <div className="col-span-4 text-center py-4 text-gray-500">
                    暂无{section.name}记录
                </div>
            )}
        </div>
    </div>
);