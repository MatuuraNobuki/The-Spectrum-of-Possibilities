import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Square } from 'lucide-react';

const DRAquaMonitor = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentValue, setCurrentValue] = useState(1.618);
  const [status, setStatus] = useState('正常');
  const [phaseShift, setPhaseShift] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0.02);
  
  // 測定データのシミュレーション
  const generateData = () => {
    const baseValue = 1.618;
    return Array.from({ length: 40 }, (_, i) => ({
      time: i,
      upper: baseValue * (1 + Math.sin(i * 0.5) * 0.1),
      lower: baseValue / (1 + Math.sin(i * 0.5) * 0.1),
      resonance: baseValue + Math.sin(i * 0.2) * 0.05,
      noise: baseValue + (Math.random() - 0.5) * 0.02
    }));
  };

  const [data, setData] = useState(generateData());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      const newValue = 1.618 * (1 + (Math.sin(phaseShift) * 0.1));
      setCurrentValue(newValue);
      setStatus(newValue > 1.8 ? '要注意' : '正常');
      setPhaseShift(prev => prev + 0.1);
      setNoiseLevel(prev => Math.max(0.01, prev + (Math.random() - 0.5) * 0.001));
      
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          upper: newValue * 1.1 + (Math.random() - 0.5) * noiseLevel,
          lower: newValue * 0.9 + (Math.random() - 0.5) * noiseLevel,
          resonance: newValue + Math.sin(phaseShift * 0.2) * 0.05,
          noise: newValue + (Math.random() - 0.5) * noiseLevel
        }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseShift, noiseLevel]);

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      {/* メニューバー風 */}
      <div className="bg-gray-100 border-b border-gray-400 text-sm mb-2 p-1">
        <span className="mr-4">ファイル(F)</span>
        <span className="mr-4">表示(V)</span>
        <span className="mr-4">測定(M)</span>
        <span className="mr-4">ツール(T)</span>
        <span>ヘルプ(H)</span>
      </div>

      {/* ツールバー風 */}
      <div className="bg-gray-100 border border-gray-400 text-sm mb-2 p-1 flex items-center space-x-2">
        <button className="px-2 py-1 bg-gray-200 border border-gray-400 rounded">開始</button>
        <button className="px-2 py-1 bg-gray-200 border border-gray-400 rounded">停止</button>
        <div className="border-r border-gray-400 h-6 mx-2"></div>
        <button className="px-2 py-1 bg-gray-200 border border-gray-400 rounded">保存</button>
        <button className="px-2 py-1 bg-gray-200 border border-gray-400 rounded">印刷</button>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-12 gap-2">
        {/* 左側パネル */}
        <div className="col-span-3">
          <div className="bg-gray-100 border border-gray-400 p-2 mb-2">
            <div className="bg-blue-800 text-white p-1 text-sm mb-2">システム情報</div>
            <div className="text-sm">
              <table className="w-full">
                <tbody>
                  <tr><td className="py-1">バージョン:</td><td>2.16.04</td></tr>
                  <tr><td className="py-1">ビルド:</td><td>20240114</td></tr>
                  <tr><td className="py-1">端末ID:</td><td>MON-32F-LAB4</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-400 p-2">
            <div className="bg-blue-800 text-white p-1 text-sm mb-2">システム状態</div>
            <div className="text-sm">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                DR-FLOW: 正常
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                レーザー: アクティブ
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                冷却装置: 待機中
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                バックアップ: 準備完了
              </div>
            </div>
          </div>
        </div>

        {/* メインパネル */}
        <div className="col-span-9">
          <div className="bg-gray-100 border border-gray-400 p-2 mb-2">
            <div className="bg-blue-800 text-white p-1 text-sm mb-2">リアルタイムモニタ</div>
            <div className="h-64 bg-white border border-gray-300">
              <ResponsiveContainer>
                <LineChart data={data.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[1.4, 1.9]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="upper" stroke="#1d4ed8" name="上面屈折率" />
                  <Line type="monotone" dataKey="lower" stroke="#15803d" name="下面屈折率" />
                  <Line type="monotone" dataKey="resonance" stroke="#ea580c" name="共鳴" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 border border-gray-400 p-2">
              <div className="bg-blue-800 text-white p-1 text-sm mb-2">測定値</div>
              <div className="grid grid-cols-2 text-sm gap-1">
                <div className="bg-white border border-gray-300 p-1">基準屈折率:</div>
                <div className="bg-white border border-gray-300 p-1">{currentValue.toFixed(6)}</div>
                <div className="bg-white border border-gray-300 p-1">上面屈折率:</div>
                <div className="bg-white border border-gray-300 p-1">{(currentValue * 1.1).toFixed(6)}</div>
                <div className="bg-white border border-gray-300 p-1">下面屈折率:</div>
                <div className="bg-white border border-gray-300 p-1">{(currentValue * 0.9).toFixed(6)}</div>
                <div className="bg-white border border-gray-300 p-1">共鳴周波数:</div>
                <div className="bg-white border border-gray-300 p-1">{(phaseShift * 0.1).toFixed(2)}Hz</div>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-400 p-2">
              <div className="bg-blue-800 text-white p-1 text-sm mb-2">環境パラメータ</div>
              <div className="grid grid-cols-2 text-sm gap-1">
                <div className="bg-white border border-gray-300 p-1">温度:</div>
                <div className="bg-white border border-gray-300 p-1">20.5°C</div>
                <div className="bg-white border border-gray-300 p-1">湿度:</div>
                <div className="bg-white border border-gray-300 p-1">45%</div>
                <div className="bg-white border border-gray-300 p-1">気圧:</div>
                <div className="bg-white border border-gray-300 p-1">1013hPa</div>
                <div className="bg-white border border-gray-300 p-1">磁場強度:</div>
                <div className="bg-white border border-gray-300 p-1">0.12μT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ステータスバー */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-400 text-sm p-1 flex">
        <div className="border-r border-gray-400 px-2">Ready</div>
        <div className="border-r border-gray-400 px-2">COM3</div>
        <div className="border-r border-gray-400 px-2">9600bps</div>
        <div className="px-2">{currentTime}</div>
      </div>
    </div>
  );
};

export default DRAquaMonitor;