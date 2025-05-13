import BackNavBar from "@/components/BackNavBar";
import api from '@/services/api';
import { getImageUrl } from "@/utils/imageUtils";
import { useRequest } from '@umijs/max';

// Default image in case API fails
const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

export default () => {
    const { data: bannerData } = useRequest(api.banner.getBanners);

    // Get the first banner (if available)
    const banner = bannerData?.data?.[0];
    const qrCodeImageUrl = banner?.qrCodeImageUrl || defaultImg;

    return (
        <BackNavBar title="社群二维码">
            <div className="flex-1 flex flex-col items-center justify-center">
                <img className='w-80 h-80' src={getImageUrl(qrCodeImageUrl, true)} alt="社群二维码" />
                <p className="mt-4 text-gray-500 text-center">{banner?.title}</p>
            </div>
        </BackNavBar>
    )
}
