import { NavLink, Icon, useLocation, useModel, history } from '@umijs/max';
import { useEffect, useRef, useState } from 'react';
import { Button, Popup, SearchBar, SearchBarRef, Badge } from 'antd-mobile';
import { getUserRecord } from '@/services/api/userRecord';
import { getImageUrl } from '@/utils';
import { getSystemMessage, getSystemMessageUnreadCount } from '@/services/api/systemMessage';

const isActive = 'flex flex-col justify-center items-center ';
const notActive = 'text-secondary ';

const NavHeader: React.FC = () => {

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  const { filter, setFilter } = useModel('filter');

  const [showSearch, setShowSearch] = useState(false);

  // 常用应用列表状态
  const [appList, setAppList] = useState<API.UserRecordDto[]>([]);
  const [loading, setLoading] = useState(false);

  // 系统消息状态
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<API.SystemMessageDto[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const searchRef = useRef<SearchBarRef>(null);

  useEffect(() => {
    if (showSearch) {
      searchRef.current?.focus();
    }
  }, [showSearch]);

  // 获取系统消息未读数量
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getSystemMessageUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('获取未读消息数量失败:', error);
      }
    };

    // 初始加载时获取未读消息数量
    fetchUnreadCount();

    // 设置定时器，每分钟检查一次未读消息
    const timer = setInterval(fetchUnreadCount, 60000);

    // 组件卸载时清除定时器
    return () => clearInterval(timer);
  }, []);

  // 获取系统消息列表
  const fetchMessages = async () => {
    if (!open) return;

    setMessagesLoading(true);
    try {
      const result = await getSystemMessage({ page: 1, limit: 3 });
      setMessages(result.messages);
    } catch (error) {
      console.error('获取系统消息失败:', error);
    } finally {
      setMessagesLoading(false);
    }
  };


  // 获取消息优先级样式
  const getPriorityStyle = (priority: number) => {
    switch (priority) {
      case 3: // Urgent
        return { color: '#ff4d4f', fontWeight: 'bold' };
      case 2: // High
        return { color: '#fa8c16' };
      case 1: // Normal
        return { color: '#1677ff' };
      default: // Low
        return { color: '#8c8c8c' };
    }
  };

  // 获取消息类型图标
  const getTypeIcon = (type: number) => {
    switch (type) {
      case 3: // System
        return '💻';
      case 2: // Error
        return '⚠️';
      case 1: // Warning
        return '⚡';
      default: // Notification
        return '📢';
    }
  };

  // 格式化日期为相对时间
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
      } else if (diffHours < 24) {
        return `${diffHours}小时前`;
      } else if (diffDays < 30) {
        return `${diffDays}天前`;
      } else {
        return date.toLocaleDateString('zh-CN');
      }
    } catch (e) {
      return dateString;
    }
  };

  // 获取足迹数据，筛选targetType为App的项目
  const fetchAppFootprints = async () => {
    if (open) {
      setLoading(true);
      try {
        const response = await getUserRecord({
          RecordType: 'AppFootprint',
          Page: 1,
          Limit: 10
        });

        setAppList(response.records);
      } catch (error) {
        console.error('获取应用足迹失败:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 当弹窗打开时获取数据
  useEffect(() => {
    if (open) {
      fetchAppFootprints();
      fetchMessages();
    }
  }, [open]);

  const navigateToApp = (targetId?: number, targetType?: string) => {
    if (!targetId || !targetType) return;

    // 根据targetType决定导航路径
    if (targetType === 'App') {
      history.push(`/detail/${targetId}`);
    }
    setOpen(false);
  };

  const isAI = pathname === '/home';

  const url = 'https://t13.baidu.com/it/u=3156084650,599696862&fm=225&app=113&f=PNG?w=639&h=398&s=12D388724C11ADC8171E5E930300D09A';

  return (
    <>
      <div className='flex items-center justify-between text-primary font-bold text-2xl'>
        {

          showSearch ?
            <SearchBar
              ref={searchRef}
              className='flex-1'
              placeholder='请输入内容'
              showCancelButton
              defaultValue={filter}
              style={{
                '--adm-color-fill-content': '#2d2d2d',
              } as React.CSSProperties}
              onChange={val => setFilter(val)}
              onSearch={val => {
                // Toast.show(`你搜索了：${val}`)
              }}
              onFocus={() => {
                // console.log('获得焦点')
              }}
              onBlur={() => {
                // console.log('失去焦点')
                // setShowSearch(false);
              }}
              onCancel={() => {
                setFilter(null);
                setShowSearch(false);
                // console.log('取消搜索')
              }}
            /> :
            <>
              <Icon icon="local:home-setting" onClick={() => setOpen(true)} />
              <div className='flex items-center text-xl'>
                <NavLink to='/home' replace={true} className={(isAI ? isActive : notActive) + 'mr-12'}>
                  AI应用
                  {isAI ? <div className='w-6 bg-white h-0.5'></div> : <></>}
                </NavLink>
                <NavLink to='/home/find' replace={true} className={isAI ? notActive : isActive}>
                  发现
                  {!isAI ? <div className='w-6 bg-white h-0.5'></div> : <></>}
                </NavLink>
              </div>
              <div className="relative">
                <Icon icon="local:search" onClick={() => setShowSearch(true)} />
              </div>
            </>
        }
      </div>

      <Popup
        visible={open}
        onMaskClick={() => setOpen(false)}
        position='left'
        bodyStyle={{ width: '70vw' }}
      >
        <div className='flex w-[70vw] flex-col text-[16px] p-4 pt-12'>
          <div className='flex flex-col'>
            <div className="flex justify-between items-center mb-2">
              <span className='font-bold'>系统消息</span>
            </div>

            {messagesLoading ? (
              <div className="flex justify-center py-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-gray-500 text-sm py-2">暂无系统消息</div>
            ) : (
              <div className="space-y-3 mb-2">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className="rounded-lg p-2 relative"
                  >
                    <div className="flex items-start">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg mr-2 flex-shrink-0"
                        style={getPriorityStyle(message.priority)}
                      >
                        {getTypeIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          {!message.isRead && <Badge color="#1677ff" className="mr-1" />}
                          <div
                            className="text-sm font-medium truncate"
                            style={{ fontWeight: message.isRead ? 'normal' : 'bold' }}
                          >
                            {message.title}
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 line-clamp-2 mt-1">
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='h-px bg-gray-200 my-4'></div>

          <div>
            <span className='font-bold'>常用应用</span>
            <div className='flex flex-wrap gap-4 mt-2'>
              {loading ? (
                <div className='flex justify-center w-full py-2'>
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : appList.length > 0 ? (
                appList.map((app) => (
                  <div
                    key={app.id}
                    className='flex flex-col items-center w-16'
                    onClick={() => navigateToApp(app.targetId, app.targetType)}
                  >
                    <div className='w-12 h-12 overflow-hidden bg-gray-100 mb-1 rounded-3xl'>
                      {app.imageUrl ? (
                        <img src={getImageUrl(app.imageUrl)} alt={app.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                          {app.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className='text-xs text-center truncate w-full'>{app.title}</span>
                  </div>
                ))
              ) : (
                <div className='text-gray-500 text-sm w-full text-center py-2'>暂无常用应用</div>
              )}
            </div>
          </div>

          <div className='h-px bg-gray-200 my-4'></div>

          <NavLink to='/qrcode'>
            <div className="w-full rounded-3xl overflow-hidden">
              <Button block color="primary">
                加入AI之门开发者社群
              </Button>
            </div>
          </NavLink>
        </div>
      </Popup>
    </>
  );
};

export default NavHeader; 