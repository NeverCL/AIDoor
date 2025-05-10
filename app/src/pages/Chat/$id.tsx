import BackNavBar from "@/components/BackNavBar";
import { useRequest } from "@umijs/max";
import api from "@/services/api";
import { useParams } from "@umijs/max";
import messages from "../My/messages";
import { Input, Button } from "antd-mobile";
import { getImageUrl } from "@/utils";
export default () => {
    const { id } = useParams();

    const mockData = {
        user: {
            id: 1,
            name: '张三',
            avatar: 'https://img.yzcdn.cn/vant/ipad.png'
        },
        messages: [
            {
                id: 1,
                content: '你好',
                isMe: true,
                type: 'text',
                createdAt: '2021-01-01 12:00:00'
            },
            {
                id: 2,
                content: '你好',
                isMe: false,
                type: 'text',
                createdAt: '2021-01-01 12:00:00'
            },
            {
                id: 3,
                content: '你好',
                isMe: false,
                type: 'text',
                createdAt: '2021-01-01 12:00:00'
            },
            {
                id: 4,
                content: '你好',
                isMe: true,
                type: 'text',
                createdAt: '2021-01-01 12:00:00'
            }
        ]
    }

    return (
        <BackNavBar title={mockData.user.name}>
            <div className="flex-1 flex flex-col *:mt-4 overflow-y-auto">
                {
                    mockData.messages.map((message) => (
                        <div key={message.id}>
                            <div className={`flex items-center ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="w-10 h-10 rounded-full bg-gray-300 mx-2">
                                    <img src={getImageUrl(mockData.user.avatar)} alt="avatar" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className={`p-2 rounded-lg bg-secondary`}>
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {/* 输入框 */}
            <div className="flex items-center m-2 p-2 bg-secondary rounded-lg shadow-sm">
                <div className="flex-1 mr-2">
                    <Input
                        placeholder="请输入消息..."
                        className="bg-white rounded-full px-4 py-2 border-none"
                    />
                </div>
                <Button
                    color="primary"
                    className="rounded-full px-4"
                >
                    发送
                </Button>
            </div>
        </BackNavBar>
    )
}
