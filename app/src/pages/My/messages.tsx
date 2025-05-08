import { useRequest, useLocation, history } from '@umijs/max';
import { List, NavBar, Image } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import React from 'react';

export default () => {
    const location = useLocation();

    const navigateToDetail = (type: string) => {
        history.push(`/my/message-detail?type=${type}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <NavBar onBack={() => history.back()}>消息通知</NavBar>

            <div className="p-2">
                <List className="bg-white rounded-lg">
                    <List.Item
                        prefix={
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-500 text-lg">关</span>
                            </div>
                        }
                        onClick={() => navigateToDetail('follow')}
                        arrow={<RightOutline />}
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
                        arrow={<RightOutline />}
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
                        arrow={<RightOutline />}
                        description="查看作品评分情况"
                    >
                        评分记录
                    </List.Item>
                </List>
            </div>
        </div>
    );
}; 