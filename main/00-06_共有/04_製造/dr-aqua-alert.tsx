import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertDialog, AlertDialogAction } from '@/components/ui/alert';

const DangerAlert = ({ isOpen, onClose, value, timestamp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-100 border-2 border-gray-400 shadow-xl w-96">
        {/* タイトルバー */}
        <div className="bg-red-600 text-white px-2 py-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span className="font-bold">DR-Aqua System Warning</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-red-700 px-2"
          >×</button>
        </div>

        {/* アラート本体 */}
        <div className="p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <div>
              <div className="font-bold text-red-600 mb-2">危険な屈折率低下を検知</div>
              <div className="text-sm">
                下面屈折率が危険域まで低下しています。
                直ちにDR溶液の状態を確認してください。
              </div>
            </div>
          </div>

          {/* 詳細データ */}
          <div className="bg-white border border-gray-300 p-2 mb-4 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="font-bold">検知時刻:</div>
              <div>{timestamp}</div>
              <div className="font-bold">屈折率:</div>
              <div className="text-red-600 font-bold">{value.toFixed(6)}</div>
              <div className="font-bold">危険域閾値:</div>
              <div>1.100000</div>
            </div>
          </div>

          {/* 対応手順 */}
          <div className="text-sm mb-4">
            <div className="font-bold mb-1">推奨される対応:</div>
            <ol className="list-decimal list-inside">
              <li>DR溶液の循環を一時停止</li>
              <li>バックアップシステムの起動確認</li>
              <li>管理局長への報告</li>
              <li>律刻結晶の状態確認</li>
            </ol>
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1 bg-gray-200 border border-gray-400 rounded hover:bg-gray-300"
            >
              確認
            </button>
            <button
              className="px-4 py-1 bg-gray-200 border border-gray-400 rounded hover:bg-gray-300"
            >
              詳細ログ
            </button>
          </div>
        </div>

        {/* ステータスバー */}
        <div className="border-t border-gray-400 px-2 py-1 text-xs bg-gray-200">
          ERR_CODE: DR_LOW_IDX_001 | システムログに記録済み
        </div>
      </div>
    </div>
  );
};

// メインのモニタリングコンポーネントを修正
const DRAquaMonitor = () => {
  // ... 前回のコードの state 管理など ...

  // アラート状態の管理を追加
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      const newValue = 1.618 * (1 + (Math.sin(phaseShift) * 0.1));
      setCurrentValue(newValue);
      setStatus(newValue > 1.8 ? '要注意' : '正常');
      setPhaseShift(prev => prev + 0.1);
      setNoiseLevel(prev => Math.max(0.01, prev + (Math.random() - 0.5) * 0.001));
      
      const lowerValue = newValue * 0.9;
      // 危険な値を検知したらアラートを表示
      if (lowerValue < 1.1 && !showAlert) {
        setShowAlert(true);
        // 警告音を再生
        const audio = new Audio('/api/sound/alert');
        audio.play().catch(() => {});
      }
      
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          upper: newValue * 1.1 + (Math.random() - 0.5) * noiseLevel,
          lower: lowerValue + (Math.random() - 0.5) * noiseLevel,
          resonance: newValue + Math.sin(phaseShift * 0.2) * 0.05,
          noise: newValue + (Math.random() - 0.5) * noiseLevel
        }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseShift, noiseLevel, showAlert]);

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      {/* 前回のコードの UI部分 ... */}

      {/* アラートダイアログ */}
      <DangerAlert 
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        value={currentValue * 0.9}
        timestamp={currentTime}
      />
    </div>
  );
};

export default DRAquaMonitor;