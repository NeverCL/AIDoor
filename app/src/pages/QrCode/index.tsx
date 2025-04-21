import { NavBar, Image } from "antd-mobile"

export default () => {
    return (
        <div className="grid grid-rows-[auto_1fr] h-full">
            <NavBar onBack={() => history.back()}>社群</NavBar>

            <Image className='w-10/12 h-3/6' lazy src={'/404'} />
        </div>
    )
}
