import { NavLink, Icon, useLocation, useModel } from '@umijs/max';
import { useEffect, useRef, useState } from 'react';
import { Button, Popup, SearchBar, SearchBarRef } from 'antd-mobile';

const isActive = 'flex flex-col justify-center items-center ';
const notActive = 'text-secondary ';

const NavHeader: React.FC = () => {

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  const { filter, setFilter } = useModel('filter');

  const [showSearch, setShowSearch] = useState(false);

  const [searchText, setSearchText] = useState('');

  const searchRef = useRef<SearchBarRef>(null);

  useEffect(() => {

    if (showSearch) {
      searchRef.current?.focus();
    }

  }, [showSearch]);

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
              onChange={val => setFilter(val)}
              onSearch={val => {
                // Toast.show(`你搜索了：${val}`)
              }}
              onFocus={() => {
                // console.log('获得焦点')
              }}
              onBlur={() => {
                // console.log('失去焦点')
                setShowSearch(false);
              }}
              onCancel={() => {
                setFilter(null);
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
              <Icon icon="local:search" onClick={() => setShowSearch(true)} />
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
            <span className='font-bold'>系统消息</span>
            <span className='text-sm'>您的账号已开通...</span>
            <span className='text-xs text-secondary'>2025年4月6日 12:29:16</span>
          </div>

          <div className='h-px bg-gray-200 my-4'></div>

          <div>
            <span className='font-bold'>常用应用</span>
            <div className='flex flex-wrap'>
              <div className='flex flex-col items-center'>
                <div className='w-8 h-8'>
                  <img src={url} alt="" />
                </div>
                <span className='text-xs'>智能助手</span>
              </div>
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

      </Popup >
    </>
  );
};

export default NavHeader; 