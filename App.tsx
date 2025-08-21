import React, { useState, useCallback } from 'react';
import type { InspectionOrder, GeminiResponse } from './types';
import { MOCK_INSPECTION_ORDERS } from './constants';
import { InspectionList } from './components/InspectionList';
import { WorkOrderGenerator } from './components/WorkOrderGenerator';
import { generateWorkOrderSuggestions } from './services/geminiService';
import { CraneIcon } from './components/IconComponents';

export default function App(): React.ReactNode {
  const [inspectionOrders] = useState<InspectionOrder[]>(MOCK_INSPECTION_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<InspectionOrder | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectOrder = useCallback(async (order: InspectionOrder) => {
    if (selectedOrder?.id === order.id) return;

    setSelectedOrder(order);
    setIsLoading(true);
    setError(null);
    setGeminiResponse(null);

    try {
      const response = await generateWorkOrderSuggestions(order);
      setGeminiResponse(response);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : '一个未知错误发生了。';
      setError(`生成AI建议失败。请稍后重试。(${errorMessage})`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedOrder]);

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-slate-100">
      <div className="w-1/3 max-w-md border-r border-slate-800 flex flex-col">
        <header className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-bold text-white flex items-center gap-3">
            <CraneIcon className="w-6 h-6 text-cyan-400" />
            点巡检报告
          </h1>
          <p className="text-sm text-slate-400">选择一份报告以生成工单。</p>
        </header>
        <InspectionList
          orders={inspectionOrders}
          selectedOrderId={selectedOrder?.id ?? null}
          onSelectOrder={handleSelectOrder}
        />
      </div>

      <main className="w-2/3 flex-1 flex flex-col bg-slate-900/50">
        <WorkOrderGenerator
          selectedOrder={selectedOrder}
          geminiResponse={geminiResponse}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}