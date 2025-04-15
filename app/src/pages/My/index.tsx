import { Icon, NavLink, history } from "@umijs/max"
import { List, Space } from "antd-mobile";
import { useEffect, useState } from "react";

const url = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

// 用户设置相关导航
const navs = [
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

// 内容类型配置映射
const contentTypeConfig = {
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

export default () => {
    // 模拟后端数据
    const mockApiData = [
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
                },
                {
                    img: url,
                    title: '浏览过的内容示例'
                },
                {
                    img: url,
                    title: '浏览过的内容示例'
                },
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

    // 用于存储处理后的数据
    const [processedData, setProcessedData] = useState([]);

    // 处理后端数据，匹配到前端展示所需的格式
    useEffect(() => {
        // 这里可以替换为实际的API调用
        const apiData = mockApiData;

        // 将后端数据转换为组件所需格式
        const formattedData = apiData.map(item => ({
            ...contentTypeConfig[item.type],
            data: item.data
        }));

        setProcessedData(formattedData);
    }, []);

    return (
        <>
            <UserCard />

            {/* 我的点赞、我的收藏、足迹 */}
            {processedData.map((section, index) => (
                <ContentSection key={index} section={section} />
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
        </>
    )
}

// 用户资料卡组件
const UserCard = () => (
    <div className="mt-10 h-16 rounded-xl bg-[#525252] flex justify-between items-center px-[0.88rem]">
        <div className="flex items-center flex-1">
            <div className="h-[3.94rem] w-[3.94rem] rounded-xl relative bottom-[0.63rem]">
                <img className="h-full w-full" src={require('@/assets/my/icon.png')} alt="my-header" />
            </div>
            <span className="text-primary text-lg font-bold ml-3">张三</span>
        </div>
        <div className="flex items-center justify-between flex-1 mr-8">
            <NavLink to='/messages' className="flex flex-col justify-center items-center">
                <span >消息</span>
                <span className="text-primary text-lg">53</span>
            </NavLink>
            <div className="w-[1px] bg-secondary h-3"></div>
            <NavLink to='/follows' className="flex flex-col justify-center items-center">
                <span className="">关注</span>
                <span className="text-primary text-lg">253</span>
            </NavLink>
        </div>
    </div>
);

// 内容卡片组件
const ContentCard = ({ item, index }) => (
    <NavLink to={`/detail/${index}`} className="h-[5.25rem]">
        <div className="flex flex-col">
            <div className="h-[3.75rem] overflow-hidden">
                <img src={item.img} alt="" />
            </div>

            <span className="mt-[0.38rem] px-[0.06rem]">{item.title}</span>
        </div>
    </NavLink>
);

// 内容模块组件
const ContentSection = ({ section }) => (
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
        {/* 内容 */}
        <div className="grid grid-cols-3 gap-2">
            {section.data?.map((item, index) => (
                <ContentCard key={index} item={item} />
            ))}
        </div>
    </div>
);

// 设置导航组件
const SettingNav = ({ navItem }) => (
    <NavLink to={navItem.path} className="flex mb-7 justify-between items-center" key={navItem.path}>
        <div className="flex text-primary font-bold items-center">
            {navItem.icon}
            <span>{navItem.name}</span>
        </div>
        <span>＞</span>
    </NavLink>
);