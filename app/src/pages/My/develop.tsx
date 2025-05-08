import { history } from "@umijs/max";
import { InfiniteScroll } from "antd-mobile";
import { SetOutline, StarFill } from "antd-mobile-icons";
import dayjs from "dayjs";

export default () => {

    return (
        <div className="h-full flex flex-col *:mt-8 overflow-y-auto">
            {/* 头像 昵称 简介 设置图标*/}
            <div className="flex items-center ">
                <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                    <div className="text-lg font-bold">张三</div>
                    <div className="text-sm text-gray-500">简介：一个热爱编程的年轻人</div>
                </div>
                <div className="ml-auto" onClick={() => history.push('/my/setting')}>
                    <SetOutline />
                </div>
            </div>

            {/* 获赞 关注 粉丝 分值*/}
            <div className="flex items-center p-4">
                <div className="flex-1 text-center">
                    <div className="text-2xl font-bold">{publisherData.stats.likes}</div>
                    <div className="text-sm text-gray-600">获赞</div>
                </div>
                <div className="flex-1 text-center">
                    <div className="text-2xl font-bold">{publisherData.stats.followers}</div>
                    <div className="text-sm text-gray-600">粉丝</div>
                </div>
                <div className="flex-1 text-center">
                    <div className="text-2xl font-bold">{publisherData.stats.following}</div>
                    <div className="text-sm text-gray-600">关注</div>
                </div>
                <div className="flex-1 text-center">
                    <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold mr-1">{publisherData.stats.rating.toFixed(1)}</span>
                        <StarFill fontSize={16} color='#FFB700' />
                    </div>
                    <div className="text-sm text-gray-600">评分</div>
                </div>
            </div>

            {/* 详细介绍 */}
            <div className="p-4">
                <div className="text-sm text-gray-600">{publisherData.description}</div>
            </div>

            {/* 消息管理 我的足迹 */}
            <div className="flex items-center p-4">
                <div className="text-2xl font-bold" onClick={() => history.push('/my/messages?type=message')}>消息管理</div>
                <div className="text-2xl font-bold" onClick={() => history.push('/my/messages?type=footprint')}>我的足迹</div>
            </div>

            {/* 发布内容 */}
            <div className="p-4">
                {contents.length > 0 ? (
                    <div className="flex flex-col *:mb-4">
                        {contents.map((content) => (
                            <div key={content.id} className="bg-white rounded-lg shadow-sm p-2">
                                {content.imageUrl && (
                                    <div className="mb-2">
                                        <img
                                            src={content.imageUrl}
                                            alt={content.title}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <div className="text-base font-medium">{content.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {dayjs(content.createdAt).format('YYYY-MM-DD')}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        暂无内容
                    </div>
                )}
            </div>
        </div>
    );
};