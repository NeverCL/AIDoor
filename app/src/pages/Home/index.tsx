import { useModel } from '@umijs/max';

const HomePage: React.FC = () => {
  const { name } = useModel('global');

  const data = ['全部', '大模型', '小模型', '插件', '工具', '小模型', '插件', '工具'];

  const url = 'https://t13.baidu.com/it/u=3156084650,599696862&fm=225&app=113&f=PNG?w=639&h=398&s=12D388724C11ADC8171E5E930300D09A';

  return (
    <>
      {/* 分类 */}
      <div className='mt-9 flex-nowrap-no-shrink relative mr-[-1rem]'>
        {data.map(item => <span>{item}</span>)}
      </div>
      <div className='flex-1 overflow-y-auto'>
        {/* banner */}
        <div className='h-[7.63rem] my-[1.13rem]'>
          <img className='rounded-lg w-full h-full object-cover' src={url} alt="" />
        </div>
        {/* AI产品 */}
        <div className='flex-1 overflow-y-auto'>
          {
            data.map(item =>
              <div className='flex items-center mb-4'>
                <img className='w-[4.81rem] h-[4.81rem] rounded-lg' src={url} alt="" />
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
    </>
  );
};

export default HomePage;
