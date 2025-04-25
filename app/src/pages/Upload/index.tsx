import BackNavBar from "@/components/BackNavBar"
import ImageUploader, { ImageUploaderRef } from "antd-mobile/es/components/image-uploader"
import { useEffect, useRef } from "react";

export default () => {

    const input = useRef<ImageUploaderRef>(null);

    useEffect(() => {
        const nativeInput = input.current?.nativeElement
        if (nativeInput) {
            nativeInput.click()
        }
    }, []);

    return (
        <BackNavBar title="发布">

            <ImageUploader accept="image/*,video/*" ref={input} upload={async file => {
                return {
                    url: URL.createObjectURL(file)
                }
            }} />


            {/* 标题 */}

            {/* 正文 */}

        </BackNavBar>
    )
}