"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";

export default function Home() {
  const [p, setP] = useState(0);
  const [price, setPrice] = useState([0, 0]);
  const [FP, setFP] = useState(0);

  const duration = p > 0 ? Math.max(0.01, Math.floor((1 / p) * 100) / 100) : 1;

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setP(Math.min(Math.abs(parseFloat(data.P)), 100));
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
        <motion.div
          className="w-20 h-20 bg-pink-600 rounded-full"
          animate={{
            x: [0, -2, 2, -2, 2, 0],
            y: [0, -2, 2, -2, 2, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div>{duration}</div>
      </div>
    </div>
  );
}
