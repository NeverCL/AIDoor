import { useModel } from '@umijs/max';
import { useState, useRef, useEffect, useMemo } from 'react';

// Define interfaces for the backend data
interface Application {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
  applications: Application[];
}

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Mock backend data (replace with actual API call)
  const [categoriesData, setCategoriesData] = useState<Category[]>([
    {
      id: '2',
      name: '大模型',
      applications: [
        { id: '3', title: '大模型应用1', description: '这是大模型应用1的简介', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '4', title: '大模型应用2', description: '智能文本生成与处理工具', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '5', title: '大模型应用3', description: '智能问答系统', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '6', title: '大模型应用4', description: '自动内容摘要工具', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '7', title: '大模型应用5', description: '多语言翻译引擎', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '8', title: '大模型应用6', description: '智能代码助手', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
      ]
    },
    {
      id: '3',
      name: '小模型',
      applications: [
        { id: '4', title: '小模型应用1', description: '这是小模型应用1的简介', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
      ]
    },
    {
      id: '4',
      name: '插件',
      applications: [
        { id: '5', title: '插件1', description: '这是插件1的简介', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
      ]
    },
    {
      id: '5',
      name: '工具',
      applications: [
        { id: '6', title: '工具1', description: '这是工具1的简介', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
      ]
    },
    {
      id: '6',
      name: '聊天机器人',
      applications: [
        { id: '9', title: '智能客服', description: '24小时在线智能客服系统', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '10', title: '群聊助手', description: '提供群聊智能服务与管理', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '11', title: '虚拟伙伴', description: '个性化AI聊天伙伴', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' }
      ]
    },
    {
      id: '7',
      name: '图像处理',
      applications: [
        { id: '12', title: 'AI绘画', description: '智能艺术创作工具', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '13', title: '图像增强', description: '提升图像质量和分辨率', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '14', title: '物体识别', description: '智能图像内容识别系统', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '15', title: '风格迁移', description: '艺术风格智能转换工具', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' }
      ]
    },
    {
      id: '8',
      name: '语音处理',
      applications: [
        { id: '16', title: '语音转文本', description: '高精度语音识别系统', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '17', title: '文本转语音', description: '自然流畅的语音合成', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' },
        { id: '18', title: '语音助手', description: '智能语音交互系统', imageUrl: 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' }
      ]
    }
  ]);

  // Compute categories including "全部" which contains all applications
  const categories = useMemo(() => {
    // Collect all applications from all categories
    const allApplications = categoriesData.flatMap(category => category.applications);

    // Create the "全部" category with all applications
    const allCategory: Category = {
      id: '1',
      name: '全部',
      applications: allApplications
    };

    // Return array with "全部" as first item followed by the other categories
    return [allCategory, ...categoriesData];
  }, [categoriesData]);

  // Function to handle item selection and scrolling
  const handleItemClick = (index: number) => {
    setActiveIndex(index);

    // Scroll the selected item to center
    if (scrollContainerRef.current && itemRefs.current[index]) {
      const container = scrollContainerRef.current;
      const item = itemRefs.current[index];

      const containerWidth = container.clientWidth;
      const itemWidth = item?.offsetWidth || 0;
      const itemLeft = item?.offsetLeft || 0;

      // Calculate scroll position to center the item
      const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);

      // Scroll smoothly to the position
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Effect to fetch categories from backend API (uncomment when API is ready)
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch('/api/categories');
  //       const data = await response.json();
  //       setCategoriesData(data);
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  // Get current category applications
  const currentApplications = categories[activeIndex]?.applications || [];

  return (
    <>
      {/* 分类 */}
      <div className='flex-1 overflow-y-auto'>
        <div
          ref={scrollContainerRef}
          className='mt-9 flex-nowrap-no-shrink sticky py-2 top-0 bg-[#2d2d2d]'
        >
          {categories.map((category, index) => (
            <span
              key={category.id}
              ref={el => itemRefs.current[index] = el}
              className={activeIndex === index ? 'active' : ''}
              onClick={() => handleItemClick(index)}
            >
              {category.name}
            </span>
          ))}
        </div>
        <div className='flex-1 overflow-y-auto'>
          {/* banner */}
          <div className='h-[7.63rem] my-[1.13rem]'>
            <img className='rounded-lg' src='https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' alt="" />
          </div>
          {/* AI产品 */}
          <div className='flex-1 overflow-y-auto mb-28'>
            {
              currentApplications.map(app => (
                <div key={app.id} className='flex items-center mb-4'>
                  <div className='w-[4.81rem] h-[4.81rem]'>
                    <img className='rounded-lg' src={app.imageUrl} alt={app.title} />
                  </div>
                  <div className='flex flex-col flex-1 mx-2'>
                    <span className='font-bold text-sm text-primary'>{app.title}</span>
                    <span className='text-secondary text-xs'>{app.description}</span>
                  </div>
                  <div className='bg-[#525252] rounded-lg px-3 py-2 text-primary text-xs font-medium'>介绍</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
