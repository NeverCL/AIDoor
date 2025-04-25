import api from '@/services/api';
import cx from '@/utils/classNames';
import openUrl from '@/utils/openUrl';
import { NavLink, useModel, useRequest } from '@umijs/max';
import { useState, useRef, useMemo, useEffect } from 'react';

// Define interfaces for the backend data
interface Application {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  categoryId: number;
  categoryName: string;
  link: string;
}

interface Category {
  id: number;
  name: string;
  displayOrder: number;
  applications: Application[];
}

const HomePage: React.FC = () => {
  const { data } = useRequest(api.appItem.getAppItemAll);
  const { filter } = useModel('filter');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Compute categories including "全部" which contains all applications
  const categories = useMemo(() => {
    if (!data) return [];

    // 确保后端返回的数据是一个数组
    const categoriesData = Array.isArray(data) ? structuredClone(data) : [];

    // 过滤应用
    if (filter) {
      categoriesData.forEach(category => {
        category.applications = (category.applications || []).filter((app: Application) => app.title.includes(filter));
      });
    }


    // Collect all applications from all categories
    const allApplications = categoriesData.flatMap(category => category.applications || []);

    // Create the "全部" category with all applications
    const allCategory: Category = {
      id: 0,
      name: '全部',
      displayOrder: 0,
      applications: allApplications
    };


    // Return array with "全部" as first item followed by the other categories
    return [allCategory, ...categoriesData];
  }, [data, filter]);

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

  // Get current category applications
  const currentApplications = categories[activeIndex]?.applications || [];

  return (
    <>
      {/* 分类 */}
      <div
        ref={scrollContainerRef}
        className='flex overflow-x-auto -mx-4 px-3'
      >
        {categories.map((category, index) => (
          <span
            key={category.id}
            ref={el => itemRefs.current[index] = el}
            className={cx(activeIndex === index ? 'px-5 bg-white text-black' : 'px-3 bg-[#525252] text-sm', 'shrink-0 mx-1 rounded-2xl py-2 bg-[#525252]')}
            onClick={() => handleItemClick(index)}
          >
            {category.name}
          </span>
        ))}
      </div>

      <div className='flex-1 flex flex-col overflow-y-auto'>
        {/* banner */}
        <NavLink to='/qrcode'>
          <img className='rounded-lg h-32 w-full object-cover' src='https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418' alt="" />
        </NavLink>

        {/* AI产品 */}
        <div className='flex-1 flex flex-col mt-4 mb-28 *:mb-4'>
          {
            currentApplications.map((app: Application) => (
              <div key={app.id} className='flex items-center'>
                <div className='flex flex-1 items-center' onClick={() => openUrl(app.link)}>
                  <img className='w-20 h-20 rounded-lg' src={app.imageUrl} alt={app.title} />

                  <div className='flex flex-col flex-1 mx-2'>
                    <span className='font-bold text-sm'>{app.title}</span>
                    <span className='text-secondary text-xs'>{app.description}</span>
                  </div>
                </div>

                <NavLink to={`/detail/app/${app.id}`}>
                  <div className='bg-[#525252] rounded-lg px-3 py-2 text-xs font-medium'>介绍</div>
                </NavLink>
              </div>
            ))
          }
        </div>

      </div>
    </>
  );
};

export default HomePage;
