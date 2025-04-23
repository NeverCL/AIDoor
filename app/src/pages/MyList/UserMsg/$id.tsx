import BackNavBar from "@/components/BackNavBar";
import { useParams } from "@umijs/max";

const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

export default () => {
    const { id, name = '消息' } = useParams();

    return (
        <BackNavBar title={name}>
            <div className="flex flex-col">
                <div className="flex items-center">
                    <div className="flex items-center *:mx-1">
                        <img className="w-10 h-10 rounded-full" src={defaultImg} alt="" />
                    </div>
                    <span>消息内容sasa</span>
                </div>
            </div>
        </BackNavBar>
    )
}
