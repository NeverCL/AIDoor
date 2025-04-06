import { NavLink, Icon, useLocation } from '@umijs/max';
import { useState } from 'react';
import { Drawer } from '@mui/material';

const isActive = 'text-base flex flex-col justify-center items-center ';
const notActive = 'text-secondary text-base ';

const NavHeader: React.FC = () => {

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  const isAI = pathname === '/home';

  return (
    <>
      <div className='flex mt-7 items-center justify-between text-primary font-bold text-xl'>
        <Icon icon="local:home-setting" onClick={() => setOpen(true)} />

        <div className='flex items-center'>
          <NavLink to='/home' className={(isAI ? isActive : notActive) + 'mr-12'}>
            AI应用
            {isAI ? <div className='w-6 bg-white h-0.5'></div> : <></>}
          </NavLink>
          <NavLink to='/find' className={isAI ? notActive : isActive}>
            发现
            {!isAI ? <div className='w-6 bg-white h-0.5'></div> : <></>}
          </NavLink>
        </div>

        <Icon icon="local:search" />
      </div>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <div>
          hello drawer
        </div>
      </Drawer>
    </>
  );
};

export default NavHeader; 