import { useParams } from "@umijs/max";

export default () => {
    const { type } = useParams();

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1>{type}</h1>
        </div>
    )
}
