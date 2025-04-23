import BackNavBar from "@/components/BackNavBar"
import { NavLink } from "@umijs/max";

const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

export default () => {
    const data = [
        {
            id: 1,
            name: '系统消息',
            avatar: defaultImg,
            content: '消息内容',
            time: '2021-01-01'
        },
        {
            id: 2,
            name: '用户',
            avatar: defaultImg,
            content: '消息内容',
            time: '2021-01-01'
        }
    ]
    return (
        <BackNavBar title="消息列表">
            <div className="flex flex-col *:m-2">
                {
                    data.map(item =>
                        <NavLink to={`/mylist/usermsg/${item.id}?name=${item.name}`}>
                            <div className="flex items-center">
                                <img className="w-10 h-10 rounded-full" src={item.avatar} alt="" />

                                <div className="flex-1 flex flex-col justify-center  *:mx-1">
                                    <span>{item.name}</span>
                                    <span>{item.content}</span>
                                </div>

                                <span className="text-xs text-gray-500">{item.time}</span>
                            </div>
                        </NavLink>
                    )
                }
            </div>
        </BackNavBar>
    )
}
