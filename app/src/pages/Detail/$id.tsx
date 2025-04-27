import BackNavBar from "@/components/BackNavBar";
import { useParams } from "@umijs/max";
import { Button, Divider, Swiper, TextArea } from "antd-mobile";
import { HeartOutline, LikeOutline, MessageOutline } from "antd-mobile-icons";
import { useState } from "react";

const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

export default () => {
    const { id } = useParams();

    const [count, setCount] = useState(0);
    const [comment, setComment] = useState('');

    // 防止事件冒泡的处理函数
    const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
    };

    // 阻止Enter键的默认行为，但允许Shift+Enter换行
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认换行

            // 发送评论逻辑
            if (comment.trim()) {
                console.log('发送评论:', comment);
                setComment('');
            }
        }
    };

    // 发送评论的处理函数
    const sendComment = (e: React.MouseEvent) => {
        // 阻止事件冒泡
        e.stopPropagation();

        if (comment.trim()) {
            console.log('发送评论:', comment);
            setComment('');
        }
    };

    return (
        <BackNavBar title="详情">
            {/* 正文 */}
            <div className="flex-1 flex flex-col *:flex-shrink-0 overflow-y-auto">
                {
                    count > 3
                        ? (
                            <video
                                className="w-full h-[40vh] object-cover"
                                controls
                                src='https://cdn.thedoorofai.com/20250427/857d903a-c031-4557-85f2-4e5b4d77d7fb.MOV'
                                autoPlay
                                muted
                                playsInline
                                webkit-playsinline
                                x5-video-player-type="h5"
                                x5-video-player-fullscreen="false" />
                        )
                        : (
                            <Swiper loop autoplay>
                                <Swiper.Item>
                                    <div className="h-[40vh]">
                                        <img src={defaultImg} alt="" />
                                    </div>
                                </Swiper.Item>
                            </Swiper>
                        )
                }

                <div className="flex justify-between p-4 items-center">
                    <div className="flex items-center *:mx-1">
                        <img className="w-10 h-10 rounded-full" src={defaultImg} alt="" />
                        <span>作者名</span>
                    </div>

                    {/* 关注 */}
                    <Button className="px-4 rounded-lg" color="primary">关注</Button>
                </div>

                <h2>标题</h2>

                <div className="p-4 leading-relaxed" onClick={() => setCount(count + 1)}>
                    这是一段详细的介绍文本，描述了该产品的主要特点和使用方法。我们致力于为用户提供最优质的体验，通过不断创新和改进，使产品更加符合用户需求。<br />
                    该产品采用了先进的技术，具有操作简便、功能强大的特点。无论是日常使用还是专业应用，都能满足您的各种需求。<br />
                    如果您有任何问题或建议，欢迎随时联系我们的客服团队，我们将竭诚为您服务。
                </div>

                <Divider className="bg-gray-400" />

                <div className="flex justify-between p-4 text-2xl items-center">
                    <LikeOutline className="text-red-500" />33
                    <HeartOutline />22
                    <MessageOutline />12
                </div>

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
            <div
                className="flex bg-black -mx-4"
                onClick={stopPropagation}
            >
                <div className="flex-1" onClick={stopPropagation}>
                    <TextArea
                        value={comment}
                        onChange={setComment}
                        placeholder='说点什么...'
                        onKeyDown={handleKeyDown}
                        onClick={stopPropagation}
                        autoSize={{
                            minRows: 1,
                            maxRows: 4
                        }}
                        rows={1}
                    />
                </div>
                <div
                    className='mt-auto text-lg'
                    onClick={stopPropagation}
                >
                    <Button
                        className="px-4 rounded-lg"
                        color="primary"
                        onClick={sendComment}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 rotate-45"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6.75 2.25 2.25 6.75 7.5-18-18 7.5 6.75 2.25z"
                            />
                        </svg>
                    </Button>
                </div>
            </div>
        </BackNavBar>
    )
}