import BackNavBar from "@/components/BackNavBar"
import { NavLink } from "@umijs/max";
import { Button } from "antd-mobile"

const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

export default () => {

    const data = [
        {
            id: 1,
            name: '用户名',
            avatar: defaultImg
        },
        {
            id: 2,
            name: '用户名',
            avatar: defaultImg
        },
    ];

    return (
        <BackNavBar title="关注">
            <div className="flex flex-col">
                {
                    data.map(item =>
                    (
                        <div className="flex justify-between items-center">
                            <NavLink to={`/user/${item.id}`}>
                                <div className="flex items-center *:m-1">
                                    <img className="w-10 h-10 rounded-full" src={item.avatar} alt="" />
                                    <span>{item.name}</span>
                                </div>
                            </NavLink>
                            <Button className="px-4 rounded-lg">取关</Button>
                        </div>
                    ))
                }
            </div>
        </BackNavBar>
    )
}
