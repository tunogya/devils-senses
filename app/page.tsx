"use client";

import {useEffect, useRef, useState} from "react";

export default function Home() {
  const [price, setPrice] = useState([0, 0]);
  const [FP, setFP] = useState(0);
  const [frequency, setFrequency] = useState(0.1);
  const [position, setPosition] = useState(0);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setFrequency(Math.min(Math.abs(parseFloat(data.P)), 100) * 10);
      setFP(parseFloat(data.P));
      setPrice((prevPrice) => {
        const newPrice = parseFloat(data.c);
        return [prevPrice[1], newPrice];
      });
    };

    socket.onerror = (error) => {
      console.error("WebSocket 错误:", error);
    };

    return () => {
      socket.close(); // 组件卸载时关闭 WebSocket
    };
  }, []);

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      const interval = 1 / frequency;
      if (deltaTime >= interval) {
        setPosition((prevPosition) => (prevPosition === -1 ? 1 : -1));
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [frequency]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className={"absolute top-0 left-0 right-0"}>
        <div className={"text-lg font-semibold text-white m-2"}>
          <p>BTC/USDT</p>
          <p className={`${price[1] >= price[0] ? "text-green-500" : "text-red-500"}`}>
            {price[1]?.toFixed(2)}
          </p>
          <p className={`${price[1] >= price[0] ? "text-green-500" : "text-red-500"}`}>
            {FP}%
          </p>
        </div>
      </div>
      <div className="p-6 rounded-lg text-center">
        <div
          style={{ transform: `translateX(${position}px) translateY(${position}px)` }}
          className="w-20 h-10 bg-pink-600 rounded-full"
        />
      </div>
    </div>
  );
}
