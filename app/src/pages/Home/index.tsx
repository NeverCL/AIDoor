import { useModel } from '@umijs/max';
import { useState } from 'react';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const [activeIndex, setActiveIndex] = useState(0);

  const data = ['全部', '大模型', '小模型', '插件', '工具', '小模型', '插件', '工具'];

  const url = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

  return (
    <>
      {/* 分类 */}
      <div className='flex-1 overflow-y-auto'>
        <div className='mt-9 flex-nowrap-no-shrink sticky py-2 top-0 bg-[#2d2d2d]'>
          {data.map((item, index) => (
            <span
              key={index}
              className={activeIndex === index ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
            >
              {item}
            </span>
          ))}
        </div>
        <div className='flex-1 overflow-y-auto'>
          {/* banner */}
          <div className='h-[7.63rem] my-[1.13rem]'>
            <img className='rounded-lg' src={url} alt="" />
          </div>
          {/* AI产品 */}
          <div className='flex-1 overflow-y-auto mb-28'>
            {
              data.map(item =>
                <div className='flex items-center mb-4'>
                  <div className='w-[4.81rem] h-[4.81rem]'>
                    <img className='rounded-lg' src={url} alt="" />
                  </div>
                  <div className='flex flex-col flex-1 mx-2'>
                    <span className='font-bold text-sm text-primary'>标题</span>
                    <span className='text-secondary text-xs'>简介简介简介简介</span>
                  </div>
                  <div className='bg-[#525252] rounded-lg px-3 py-2 text-primary text-xs font-medium'>介绍</div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
