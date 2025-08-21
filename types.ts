export interface InspectionOrder {
  id: string;
  equipmentName: string;
  equipmentType: 'Gantry Crane' | 'Forklift' | 'RTG Crane';
  location: string;
  inspector: string;
  date: string;
  status: '正常' | '异常' | '紧急';
  summary: string;
  details: string;
}

export interface GeneratedWorkOrder {
  type: '维修工单' | '高空作业工单' | '动火工单' | '电气维修工单' | string;
  priority: '低' | '中' | '高';
  creationTime: string;
  equipmentName: string;
  location: string;
  scheduledHours: number;
  instructions: string;
  safetyRequirements: string;
  requiredTools: string[];
  plannedPersonnel: string[];
}

export interface DispatchRecommendation {
  name: string;
  type: '人员' | '部门';
  reason: string;
}

export interface GeminiResponse {
  workOrders: GeneratedWorkOrder[];
  dispatchTargets: DispatchRecommendation[];
}