import React, { useState, useEffect } from 'react';
import type { InspectionOrder, GeminiResponse, GeneratedWorkOrder, DispatchRecommendation } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { WandSparklesIcon, WrenchIcon, ArrowUpIcon, FlameIcon, UserIcon, UsersIcon, CheckCircleIcon } from './IconComponents';

interface WorkOrderGeneratorProps {
  selectedOrder: InspectionOrder | null;
  geminiResponse: GeminiResponse | null;
  isLoading: boolean;
  error: string | null;
}

const getWorkOrderIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('高空')) return <ArrowUpIcon className="w-5 h-5" />;
    if (lowerType.includes('动火')) return <FlameIcon className="w-5 h-5" />;
    return <WrenchIcon className="w-5 h-5" />;
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const priorityClasses: Record<string, string> = {
        '高': 'bg-red-500/20 text-red-300',
        '中': 'bg-yellow-500/20 text-yellow-300',
        '低': 'bg-blue-500/20 text-blue-300',
    };
    return (
        <span className={`text-xs font-mono py-0.5 px-2 rounded-md ${priorityClasses[priority] || 'bg-slate-600'}`}>
            {priority} 优先级
        </span>
    );
};

export const WorkOrderGenerator: React.FC<WorkOrderGeneratorProps> = ({ selectedOrder, geminiResponse, isLoading, error }) => {
  const [activeWorkOrderIndex, setActiveWorkOrderIndex] = useState(0);
  const [editedWorkOrder, setEditedWorkOrder] = useState<GeneratedWorkOrder | null>(null);
  const [selectedDispatch, setSelectedDispatch] = useState<DispatchRecommendation | null>(null);
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    if (geminiResponse && geminiResponse.workOrders.length > 0) {
      setActiveWorkOrderIndex(0);
      setEditedWorkOrder(geminiResponse.workOrders[0]);
      setSelectedDispatch(geminiResponse.dispatchTargets.length > 0 ? geminiResponse.dispatchTargets[0] : null);
      setIsDispatched(false);
    } else {
      setEditedWorkOrder(null);
    }
  }, [geminiResponse]);

  const handleTabClick = (index: number) => {
    setActiveWorkOrderIndex(index);
    if (geminiResponse) {
      setEditedWorkOrder(geminiResponse.workOrders[index]);
    }
  };
  
  const handleDispatch = () => {
      setIsDispatched(true);
      // In a real app, you'd make an API call here.
      setTimeout(() => {
        setIsDispatched(false);
        // Maybe clear the selection or show a persistent success message
      }, 4000);
  };

  const handleFormChange = (field: keyof GeneratedWorkOrder, value: string | number | string[]) => {
    if (editedWorkOrder) {
      setEditedWorkOrder({ ...editedWorkOrder, [field]: value });
    }
  };

  if (!selectedOrder) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        <div className="text-center">
            <WandSparklesIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold">智能工单生成</h2>
            <p>请从左侧选择一份点巡检报告开始。</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="flex-1 flex items-center justify-center text-red-400 p-8 text-center">{error}</div>;
  
  if (selectedOrder.status === '正常') {
    return (
        <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-xl font-semibold text-white">所有系统正常</h2>
                <p>报告 <span className="font-mono text-cyan-400">{selectedOrder.id}</span> 中未发现问题，无需创建工单。</p>
            </div>
        </div>
    );
  }

  if (!geminiResponse || !editedWorkOrder || geminiResponse.workOrders.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-slate-400">未能生成工单建议。</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white">为 <span className='text-cyan-400'>{selectedOrder.equipmentName}</span> 生成的工单</h2>
        <p className="text-slate-400">基于报告 <span className="font-mono">{selectedOrder.id}</span> 的AI生成建议。请审核、编辑和派发。</p>
      </header>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">推荐工单类型</h3>
        <div className="flex gap-2 border-b border-slate-700">
          {geminiResponse.workOrders.map((wo, index) => (
            <button key={index} onClick={() => handleTabClick(index)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-t-lg ${index === activeWorkOrderIndex ? 'bg-slate-800 text-white border-b-2 border-cyan-400' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              {getWorkOrderIcon(wo.type)}
              {wo.type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="col-span-2 flex flex-col bg-slate-800 p-4 rounded-lg">
            <div className='flex justify-between items-center mb-4'>
                <h3 className="text-lg font-semibold text-white">工单详情</h3>
                <PriorityBadge priority={editedWorkOrder.priority} />
            </div>
            <div className="space-y-4 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">工单类型</label>
                        <input type="text" value={editedWorkOrder.type} onChange={(e) => handleFormChange('type', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">创建时间</label>
                        <input type="text" value={editedWorkOrder.creationTime} readOnly className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-2 text-slate-400 cursor-not-allowed"/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">设备名称</label>
                        <input type="text" value={editedWorkOrder.equipmentName} readOnly className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-2 text-slate-400 cursor-not-allowed"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">故障位置</label>
                        <input type="text" value={editedWorkOrder.location} onChange={(e) => handleFormChange('location', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"/>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">计划工作时间 (小时)</label>
                    <input type="number" value={editedWorkOrder.scheduledHours} onChange={(e) => handleFormChange('scheduledHours', Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">任务指令</label>
                    <textarea value={editedWorkOrder.instructions} onChange={(e) => handleFormChange('instructions', e.target.value)} rows={5} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-y"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">安全要求</label>
                    <textarea value={editedWorkOrder.safetyRequirements} onChange={(e) => handleFormChange('safetyRequirements', e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-y"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">所需工具 (用逗号分隔)</label>
                    <input type="text" value={editedWorkOrder.requiredTools.join(', ')} onChange={(e) => handleFormChange('requiredTools', e.target.value.split(',').map(s => s.trim()))} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">计划人工 (用逗号分隔)</label>
                    <input type="text" value={editedWorkOrder.plannedPersonnel.join(', ')} onChange={(e) => handleFormChange('plannedPersonnel', e.target.value.split(',').map(s => s.trim()))} className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
            </div>
        </div>

        <div className="col-span-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-2 text-white">派发建议</h3>
            <div className="bg-slate-800 rounded-lg p-4 flex-1 flex flex-col">
                <p className="text-sm text-slate-400 mb-3">AI根据问题类型和历史记录推荐如下：</p>
                <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                    {geminiResponse.dispatchTargets.map((target) => (
                        <button key={target.name} onClick={() => setSelectedDispatch(target)} className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${selectedDispatch?.name === target.name ? 'bg-cyan-500/10 border-cyan-500' : 'bg-slate-700/50 border-transparent hover:border-slate-600'}`}>
                            <div className="flex items-center gap-3">
                                {target.type === '人员' ? <UserIcon className="w-6 h-6 text-cyan-300" /> : <UsersIcon className="w-6 h-6 text-cyan-300" />}
                                <div>
                                    <p className="font-semibold text-white">{target.name}</p>
                                    <p className="text-xs text-slate-300">{target.reason}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="mt-auto pt-4">
                    <button onClick={handleDispatch} disabled={!selectedDispatch || isDispatched} className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200">
                        {isDispatched ? <><CheckCircleIcon className="w-5 h-5" /> 已派发!</> : "派发工单"}
                    </button>
                    {isDispatched && <p className="text-center text-green-400 text-sm mt-2">工单已派发至 {selectedDispatch?.name}。</p>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};