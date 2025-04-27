import api from "@/services/api";
import { ImageUploader, ImageUploadItem } from "antd-mobile";

const upload = async (file: File) => {
    const res = await api.file.postFileUpload({}, file);
    return {
        url: 'https://cdn.thedoorofai.com/' + res.fileName,
        thumbnailUrl: URL.createObjectURL(file),
    };
};

const onPreview = (index: number, item: ImageUploadItem) => {
};

export default ({ accept }: { accept: string }) => {
    return <ImageUploader accept={accept} upload={upload} onPreview={onPreview} />;
};

