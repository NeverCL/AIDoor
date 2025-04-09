import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd-mobile';

interface VerificationCodeButtonProps {
    /**
     * 发送验证码的回调函数
     */
    onSend: () => Promise<boolean>;
    /**
     * 倒计时时长（秒），默认60秒
     */
    countdown?: number;
    /**
     * 按钮文字，默认为"获取验证码"
     */
    text?: string;
    /**
     * 按钮样式
     */
    className?: string;
    /**
     * 禁用状态
     */
    disabled?: boolean;
}

const VerificationCodeButton: React.FC<VerificationCodeButtonProps> = ({
    onSend,
    countdown = 60,
    text = '获取验证码',
    className = '',
    disabled = false,
}) => {
    // 倒计时剩余时间
    const [remainTime, setRemainTime] = useState<number>(0);
    // 按钮是否处于加载状态
    const [loading, setLoading] = useState<boolean>(false);
    // 定时器引用
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 清除定时器
    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // 开始倒计时
    const startCountdown = () => {
        setRemainTime(countdown);
        timerRef.current = setInterval(() => {
            setRemainTime((prevTime) => {
                if (prevTime <= 1) {
                    clearTimer();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    // 发送验证码
    const handleSend = async () => {
        if (remainTime > 0 || loading || disabled) return;

        setLoading(true);
        try {
            const success = await onSend();
            if (success) {
                startCountdown();
            }
        } catch (error) {
            console.error('发送验证码失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 组件卸载时清除定时器
    useEffect(() => {
        return () => clearTimer();
    }, []);

    // 按钮文字
    const buttonText = remainTime > 0 ? `${remainTime}秒后重试` : text;

    // 按钮是否禁用
    const isDisabled = remainTime > 0 || loading || disabled;

    return (
        <Button
            loading={loading}
            disabled={isDisabled}
            onClick={handleSend}
            className={className}
            size="small"
            color="primary"
            fill="outline"
        >
            {buttonText}
        </Button>
    );
};

export default VerificationCodeButton;