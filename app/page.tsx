"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [p, setP] = useState("Loading...");

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // 取data.P的绝对值，并且，和100比较，取最小值
      setP(Math.min(Math.abs(parseFloat(data.P)), 100).toString());
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
      <div className="p-6 rounded-lg shadow-xl text-center">
        <p className="text-4xl font-semibold text-green-600 mt-2">{p}</p>
      </div>
    </div>
  );
}
