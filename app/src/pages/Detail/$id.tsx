import BackNavBar from "@/components/BackNavBar";
import { useParams } from "@umijs/max";
import { Divider, TextArea } from "antd-mobile";
import { HeartOutline, LikeOutline, MessageOutline } from "antd-mobile-icons";
import { useState } from "react";
import ReactPlayer from 'react-player';

const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

export default () => {
    const { id } = useParams();

    const [count, setCount] = useState(0);

    return (
        <BackNavBar title="详情">
            <div className="flex-1 flex flex-col overflow-y-auto">
                {
                    count > 3 ?
                        <img className="-mx-4 h-2/4" src={defaultImg} alt="" /> :
                        <div className="h-2/4 w-full overflow-hidden flex justify-center items-center">
                            {/* {count > 4 ?
                                <ReactPlayer
                                    url='https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
                                    controls
                                /> : */
                            }
                            <video
                                controls
                                src='https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
                                autoplay
                                muted
                                playsinline
                                webkit-playsinline
                                x5-video-player-type="h5"
                                x5-video-player-fullscreen="false"
                            ></video>
                        </div>
                }



                <h2>标题</h2>

                <div className="p-4 leading-relaxed" onClick={() => setCount(count + 1)}>
                    这是一段详细的介绍文本，描述了该产品的主要特点和使用方法。我们致力于为用户提供最优质的体验，通过不断创新和改进，使产品更加符合用户需求。<br />
                    该产品采用了先进的技术，具有操作简便、功能强大的特点。无论是日常使用还是专业应用，都能满足您的各种需求。<br />
                    如果您有任何问题或建议，欢迎随时联系我们的客服团队，我们将竭诚为您服务。
                </div>

                <Divider className="bg-gray-400" />

                <p className="">共100条评论</p>

                <div className="flex mr-auto items-center">
                    <img className="w-10 h-10 rounded-full" src={defaultImg} alt="" />

                    <div className="flex-1 flex flex-col *:my-1">
                        <span className="font-bold">用户名</span>
                        <span className="text-xs">评论内容</span>
                    </div>
                </div>
            </div>
            {/* 固定底部评论 */}
            <div className="flex bg-gray-300">
                <TextArea placeholder='说点什么...' autoSize rows={1} />
                {/* <textarea className="flex-1" placeholder="说点什么..." /> */}
                <button className="px-4 rounded-lg">发送</button>
                <LikeOutline />33
                <HeartOutline />22
                <MessageOutline />12
            </div>
        </BackNavBar>
    )
}