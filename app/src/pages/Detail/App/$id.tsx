import BackNavBar from "@/components/BackNavBar";
import api from "@/services/api";
import { useParams, useRequest } from "@umijs/max";
import { DotLoading, Button } from "antd-mobile";
import openUrl from "@/utils/openUrl";

export default () => {
    const { id } = useParams();

    const { data, loading } = useRequest(() => api.appItem.getAppItemId({ id: Number(id) }));

    return (
        <BackNavBar title="介绍">
            <div className="flex-1 flex flex-col *:flex-shrink-0 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <DotLoading color='primary' />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center px-4 py-2">
                            <h2 className="text-xl font-bold">{data?.title}</h2>
                            {data?.link && (
                                <Button
                                    color="primary"
                                    onClick={() => openUrl(data.link)}
                                    className="rounded-lg"
                                >
                                    打开应用
                                </Button>
                            )}
                        </div>

                        <div className="p-4 leading-relaxed">
                            {data?.content?.split('\n\n').map((paragraph: string, index: number) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </BackNavBar>
    )
}