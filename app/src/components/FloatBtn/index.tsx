import React from 'react';
import { Icon, NavLink, useLocation, useModel } from '@umijs/max';


const homeRoutes = ['/home', '/find'];

// 脚手架示例组件
const Guide: React.FC = () => {

    const { user } = useModel('global');

    const { pathname } = useLocation();

    const isInHomeGroup = homeRoutes.some(route => pathname.startsWith(route));

    return (
        <>
            <div className='left-10 right-10 bottom-10 fixed bg-[#151515] h-14 rounded-[1.72rem] flex justify-between items-center px-12 text-sm'>
                <NavLink to='/home' replace={true} className={({ isActive }) => 'flex items-center ' + (isInHomeGroup ? 'text-primary' : 'text-secondary')}>
                    <Icon icon="local:home" className='mr-2' />
                    <span className='text-sm'>首页</span>
                </NavLink>

                {
                    user?.isDev ?? false
                        ? <NavLink to='/upload'>
                            <div className='text-2xl p-3 bg-white text-black rounded-full text-center flex items-center justify-center w-10 h-10'>＋</div>
                        </NavLink>
                        : <div className='bg-secondary w-[1px] h-4'></div>
                }

                <NavLink to='/my' replace={true} className={({ isActive }) => 'flex items-center ' + (!isInHomeGroup ? 'text-primary' : 'text-secondary')}>
                    <Icon icon="local:my" className='mr-2' />
                    <span>我的</span>
                </NavLink>
            </div >
        </>
    );
};

export default Guide;
