import BackNavBar from "@/components/BackNavBar";

const defaultImg = 'https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418';

export default () => {
    return (
        <BackNavBar title="社群二维码">
            <div className="flex-1 flex flex-col items-center justify-center ">
                <img className='w-10/12 h-3/6' src={defaultImg} alt="" />
            </div>
        </BackNavBar>
    )
}
