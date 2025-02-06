"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";

export default function Home() {
  const [p, setP] = useState(0);
  const [price, setPrice] = useState(0);
  const [FP, setFP] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setP(Math.min(Math.abs(parseFloat(data.P)), 100));
      setFP(parseFloat(data.P));
      setPrice(parseFloat(data.c));
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
          <p>
            {price.toFixed(2)}
          </p>
          <p>
            {FP}%
          </p>
        </div>
      </div>
      <div className="p-6 rounded-lg shadow-xl text-center">
        <motion.div
          className="w-20 h-20 bg-pink-600 rounded-full"
          animate={{
            x: [0, -2, 2, -2, 2, 0],
            y: [0, -2, 2, -2, 2, 0],
          }}
          transition={{
            duration: p > 0 ? 1 / (p / 10) : 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
