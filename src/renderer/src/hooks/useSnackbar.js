import { useEffect, useState, useRef } from "react";

export default function(duration) {
    const [open, setOpen] = useState(false);
    const [left, setLeft] = useState();
    const [message, setMessage] = useState();
    const [color, setColor] = useState();
    const timer = useRef();
    const countdown = () => {
        timer.current = window.setInterval(() => {
        setLeft((prev) => (prev === undefined ? prev : Math.max(0, prev - 100)));
        }, 100);
    };
    useEffect(() => {
        if (open && duration !== undefined && duration > 0) {
            setLeft(duration);
            countdown();
        } else {
            window.clearInterval(timer.current);
        }
    }, [open, duration]);
    const handlePause = () => {
        window.clearInterval(timer.current);
    };
    const handleResume = () => {
        countdown();
    };

    return {
        open,
        left,
        message,
        color,
        setColor,
        setMessage,
        setOpen,
        handlePause,
        handleResume,
    }
}