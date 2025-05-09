import { Button } from 'antd-mobile';
import { useState } from 'react';

export default () => {
    const [count, setCount] = useState(0);
    return (
        <div className="text-white">
            <Button block color="primary" onClick={() => {
                setCount(count + 1);
            }}>点击</Button>

            {count < 2 && <MyCount label='A' />}
            <MyCount label='B' />
        </div>
    )
}

const MyCount = ({ label }: { label: string }) => {
    const [num, setNum] = useState(() => {
        console.log('init');
        return Math.random();
    });

    return <div>{label}: {num}</div>;
};
