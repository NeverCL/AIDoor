import BackNavBar from "@/components/BackNavBar"
import api from "@/services/api"
import { getImageUrl } from "@/utils";
import { useRequest } from "@umijs/max"
import { Loading } from "antd-mobile";

export default () => {

    const { data, loading } = useRequest(api.chatMessage.getChatMessagePartners);

    return (

        <BackNavBar title="消息列表">
            <div className="flex-1 flex flex-col overflow-y-auto">
                {
                    loading ? <Loading /> :
                        data?.map((item: any) => (
                            <div key={item.id}>
                                <div className="flex items-center">
                                    <img src={getImageUrl(item.avatarUrl)} alt="avatar" className="w-10 h-10 rounded-full" />
                                    <span className="ml-2">{item.username}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="ml-2">{item.lastMessage}</span>
                                </div>
                            </div>
                        ))
                }
            </div>
        </BackNavBar>
    )
}
