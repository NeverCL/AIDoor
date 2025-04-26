import { Icon, NavLink } from "@umijs/max"
import { List } from "antd-mobile"


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

export default () => {
    return (
        <>
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