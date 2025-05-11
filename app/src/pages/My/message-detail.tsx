import { useRequest, useLocation, history } from '@umijs/max';
import { List, NavBar, Image, DotLoading, Empty } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import BackNavBar from '@/components/BackNavBar';

export default () => {
    const [messageType, setMessageType] = useState('follow');
    const [messageData, setMessageData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // 获取关注记录
    const { run: getFollowRecords } = useRequest(
        api.userFollow.getUserFollow,
        {
            manual: true,
            onSuccess: (data) => {
                setMessageData(data.data || []);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        }
    );

    // 获取互动记录（点赞、评论、收藏）
    const { run: getInteractionRecords } = useRequest(
        api.userRecord.getUserRecord,
        {
            manual: true,
            onSuccess: (data) => {
                setMessageData(data.records || []);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        }
    );

    // 获取评分记录
    const { run: getRatingRecords } = useRequest(
        api.userRecord.getUserRecord,
        {
            manual: true,
            onSuccess: (data) => {
                setMessageData(data.data || []);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        }
    );

    useEffect(() => {
        // 从URL获取消息类型
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (type && ['follow', 'interaction', 'rating'].includes(type)) {
            setMessageType(type);
        }
    }, [location]);

    useEffect(() => {
        fetchData();
    }, [messageType]);

    const fetchData = () => {
        setLoading(true);
        switch (messageType) {
            case 'follow':
                getFollowRecords({});
                break;
            case 'interaction':
                getInteractionRecords({ RecordType: 'interaction' });
                break;
            case 'rating':
                getRatingRecords({ RecordType: 'rating' });
                break;
            default:
                setLoading(false);
                break;
        }
    };

    const getTitle = () => {
        switch (messageType) {
            case 'follow':
                return '关注记录';
            case 'interaction':
                return '互动记录';
            case 'rating':
                return '评分记录';
            default:
                return '消息详情';
        }
    };

    return (
        <BackNavBar title={getTitle()}>
            <div className="p-2">
                <List className="bg-white rounded-lg">
                    {loading ? (
                        <div className="py-10 text-center text-gray-500">
                            <span>加载中</span>
                            <DotLoading />
                        </div>
                    ) : messageData.length > 0 ? (
                        messageData.map((item, index) => (
                            <List.Item
                                key={index}
                                prefix={
                                    <Image
                                        src={"https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"}
                                        style={{ borderRadius: 20 }}
                                        fit="cover"
                                        width={40}
                                        height={40}
                                    />
                                }
                                description={
                                    messageType === 'follow' ? '关注了你' :
                                        messageType === 'interaction' ? '互动了你的作品' :
                                            '给你的作品评分'
                                }
                                extra={
                                    <div className="text-xs text-gray-400">
                                        {item.createTime ? new Date(item.createTime).toLocaleDateString() : ''}
                                    </div>
                                }
                            >
                                {item.userName || '用户'}
                            </List.Item>
                        ))
                    ) : (
                        <Empty
                            description="暂无记录"
                            imageStyle={{ width: 128 }}
                        />
                    )}
                </List>
            </div>
        </BackNavBar>
    );
}; 