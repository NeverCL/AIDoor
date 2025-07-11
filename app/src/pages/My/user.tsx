import { Icon, NavLink, useModel, useRequest, history } from "@umijs/max"
import { List } from "antd-mobile";
import { useState, useEffect } from "react";
import api from '@/services/api';
import { EditSOutline } from "antd-mobile-icons";
import { getImageUrl } from "@/utils";
import openUrl from "@/utils/openUrl";


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
    typeString: string;
    notes?: string;
}

// 记录区域类型
interface RecordSectionProps {
    name: string;
    icon: React.ReactNode;
    path: string;
    type: string;
    data?: RecordItem[];
    appData?: RecordItem[]; // 新增字段用于存储App足迹数据
}

const navs: NavItem[] = [
    {
        name: '切换身份',
        icon: <Icon icon='local:switch' className='mr-2 text-[1.13rem]' />,
        path: '/switch'
    },
    {
        name: '设置',
        icon: <Icon icon='local:setting' className='mr-2 text-[1.13rem]' />,
        path: '/setting'
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
    footprint: {
        name: '足迹',
        icon: <Icon icon='local:foot' className='mr-2 text-[1.13rem]' />,
        path: '/my/footprint',
    },
}

export default () => {
    // 存储各类型的记录数据
    const [recordSections, setRecordSections] = useState<RecordSectionProps[]>([]);

    // 获取所有类型的记录数据
    const { data, loading } = useRequest(() =>
        api.userRecord.getUserRecordMy()
    );

    // 处理获取到的数据
    useEffect(() => {
        if (data) {
            // 构建记录区域数据
            const sections: RecordSectionProps[] = [];

            // 处理点赞记录
            if (data.like && data.like.records) {
                sections.push({
                    ...recordTypeConfig['like'],
                    type: 'like',
                    data: data.like.records
                });
            }

            // 处理收藏记录
            if (data.favorite && data.favorite.records) {
                sections.push({
                    ...recordTypeConfig['favorite'],
                    type: 'favorite',
                    data: data.favorite.records
                });
            }

            // 处理足迹 - 合并 App 足迹和内容足迹
            sections.push({
                ...recordTypeConfig['footprint'],
                type: 'footprint',
                appData: data.appFootprint?.records || [], // App足迹上面显示
                data: data.contentFootprint?.records || [] // 内容足迹下面显示
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
                        <RecordSection key={section.type} section={section} />
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
        // {
        //     refreshOnWindowFocus: true,
        //     pollingInterval: 30000, // 每30秒刷新一次
        // }
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

const navigate = (item: RecordItem) => {
    if (item.typeString === 'appfootprint' && item.notes) {
        openUrl(item.notes);
    } else {
        history.push(`/detail/content/${item.targetId}`);
    }
};

const RecordCard = ({ item }: RecordCardProps) => {
    return (
        <div className="flex flex-col" onClick={() => navigate(item)}>
            <div className="h-20">
                <img src={getImageUrl(item.imageUrl)} alt="" className="h-full w-full rounded-3xl object-cover" />
            </div>
            <span className="mt-[0.38rem] px-[0.06rem] text-sm truncate">{item.title}</span>
        </div>
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
        {section.type === 'footprint' ? (
            // 足迹特殊处理：上方App足迹，下方内容足迹
            <div className="flex flex-col">
                {/* App足迹 */}
                {section.appData && section.appData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {section.appData.map((item, index) => (
                                <RecordCard key={`app-${index}`} item={item} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-2 text-gray-500 mb-4">
                        暂无应用足迹记录
                    </div>
                )}

                {/* 内容足迹 */}
                {section.data && section.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-2">
                            {section.data.map((item, index) => (
                                <RecordCard key={`content-${index}`} item={item} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-2 text-gray-500">
                        暂无内容足迹记录
                    </div>
                )}
            </div>
        ) : (
            // 其他记录类型正常显示
            <div className="grid grid-cols-3 gap-2">
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
        )}
    </div>
);