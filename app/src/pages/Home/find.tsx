import { InfiniteScroll } from "antd-mobile"
import { useState } from "react";

export default () => {

    const url = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

    const [hasMore, setHasMore] = useState(true);

    const [data, setData] = useState([1, 2, 3, 4, 5]);

    const loadMore = async () => {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        })

        setData(val => [...val, 1, 2, 3, 4, 5])
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-2 mt-6 overflow-y-auto">
                {
                    data.map((item, index) => {
                        return (
                            <div className="flex flex-col h-fit">
                                <img className="h-[18rem] rounded-lg overflow-hidden" src={url} alt="" />
                                <span>{index % 2 == 0 ? '短的标题' : '长标题一长标题一长标题一长标题一长标题一'}</span>
                                <div className="flex items-center">
                                    <img className="round-full h-6 w-6" src={require('@/assets/my/icon.png')} alt="icon" />
                                    <span>作者名</span>
                                </div>
                            </div>
                        )
                    })
                }

                <InfiniteScroll className="col-span-full block text-center" loadMore={loadMore} hasMore={hasMore} />
            </div>
        </>
    )
}