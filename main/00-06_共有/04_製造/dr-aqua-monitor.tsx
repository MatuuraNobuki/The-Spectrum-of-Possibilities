import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const DRAquaMonitor = () => {
  const [currentValue, setCurrentValue] = useState(1.618);
  const [status, setStatus] = useState('正常');
  
  // 測定データのシミュレーション
  const generateData = () => {
    const baseValue = 1.618;
    return Array.from({ length: 20 }, (_, i) => ({
      time: i,
      upper: baseValue * (1 + Math.sin(i * 0.5) * 0.1),
      lower: baseValue / (1 + Math.sin(i * 0.5) * 0.1)
    }));
  };

  const [data, setData] = useState(generateData());

  useEffect(() => {
    const timer = setInterval(() => {
      const newValue = 1.618 * (1 + (Math.random() - 0.5) * 0.1);
      setCurrentValue(newValue);
      setStatus(newValue > 1.8 ? '要注意' : '正常');
      
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          upper: newValue * 1.1,
          lower: newValue * 0.9
        }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">DR-Aqua 屈折率モニタ</h2>
          <p className="text-sm text-gray-600">リアルタイム測定中</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{currentValue.toFixed(3)}</div>
          <div className={`text-sm ${status === '正常' ? 'text-green-600' : 'text-red-600'} font-bold`}>
            {status === '要注意' && <AlertTriangle className="inline mr-1" size={16} />}
            {status}
          </div>
        </div>
      </div>

      <div className="h-64 bg-white p-4 rounded-lg shadow-inner">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[1.4, 1.9]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="upper" 
              stroke="#1d4ed8" 
              name="上面屈折率"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="lower" 
              stroke="#4ade80" 
              name="下面屈折率"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-600">上面屈折率</div>
          <div className="text-lg font-bold">{(currentValue * 1.1).toFixed(3)}</div>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-600">下面屈折率</div>
          <div className="text-lg font-bold">{(currentValue * 0.9).toFixed(3)}</div>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-600">測定温度</div>
          <div className="text-lg font-bold">20.5℃</div>
        </div>
      </div>
    </div>
  );
};

export default DRAquaMonitor;