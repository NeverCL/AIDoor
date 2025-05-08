import BackNavBar from '@/components/BackNavBar';
import { history } from '@umijs/max';
import { List } from 'antd-mobile';

export default () => {

    const navigateToDetail = (type: string) => {
        history.push(`/my/message-detail?type=${type}`);
    };

    return (
        <>
            <BackNavBar title="消息通知">
                <div className="p-2">
                    <List className="bg-white rounded-lg">
                        <List.Item
                            prefix={
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-500 text-lg">关</span>
                                </div>
                            }
                            onClick={() => navigateToDetail('follow')}
                            description="查看谁关注了你"
                        >
                            关注记录
                        </List.Item>
                        <List.Item
                            prefix={
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-500 text-lg">互</span>
                                </div>
                            }
                            onClick={() => navigateToDetail('interaction')}
                            description="查看点赞、评论、收藏等互动"
                        >
                            互动记录
                        </List.Item>
                        <List.Item
                            prefix={
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <span className="text-yellow-500 text-lg">评</span>
                                </div>
                            }
                            onClick={() => navigateToDetail('rating')}
                            description="查看作品评分情况"
                        >
                            评分记录
                        </List.Item>
                    </List>
                </div>

                {/* 私信列表 */}
                <div className="text-lg font-bold">私信</div>

                <div className="p-2 overflow-y-auto">
                    <div className="flex flex-col gap-2 mb-28">
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-base font-bold">用户名</div>
                                        <div className="text-sm text-gray-500">最后一条消息</div>
                                    </div>
                                    <div className="text-sm text-gray-500">2025-05-08</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </BackNavBar>
        </>
    );
}; 