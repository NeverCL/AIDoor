import BackNavBar from "@/components/BackNavBar";
import api from '@/services/api';
import { getImageUrl } from "@/utils/imageUtils";
import { useRequest } from '@umijs/max';
import { Loading } from "antd-mobile";

export default () => {
    const { data: bannerData, loading } = useRequest(api.banner.getBanners);

    // Get the first banner (if available)
    const banner = bannerData?.data?.[0];
    const qrCodeImageUrl = banner?.qrCodeImageUrl;

    return (
        loading ? <Loading /> :
            <BackNavBar title="社群二维码">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <img className='w-80 h-80' src={getImageUrl(qrCodeImageUrl, true)} alt="社群二维码" />
                    <p className="mt-4 text-gray-500 text-center">{banner?.title}</p>
                </div>
            </BackNavBar>
    )
}
