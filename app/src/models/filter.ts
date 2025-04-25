import { useState } from "react";

export default () => {
    const [filter, setFilter] = useState<any>(null);

    return { filter, setFilter };
}


