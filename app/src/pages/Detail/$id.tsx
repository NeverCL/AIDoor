import { useParams } from "@umijs/max";

export default () => {
    const { id } = useParams();

    return (
        <div>{id}</div>
    )
}