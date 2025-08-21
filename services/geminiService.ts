import type { InspectionOrder, GeminiResponse } from '../types';

export const generateWorkOrderSuggestions = async (order: InspectionOrder): Promise<GeminiResponse> => {
    if (order.status === '正常') {
        return Promise.resolve({ workOrders: [], dispatchTargets: [] });
    }

    // Simulate a 2-second API call to provide a fast and consistent user experience.
    return new Promise(resolve => {
        setTimeout(() => {
            const now = new Date();
            const creationTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            let mockResponse: GeminiResponse;

            // Create specific mock data for different inspection orders to make the simulation more realistic.
            switch (order.id) {
                case 'INSP-001': // 主起升电机异响 (Abnormal motor noise)
                    mockResponse = {
                        workOrders: [{
                            type: '维修工单',
                            priority: '高',
                            creationTime,
                            equipmentName: order.equipmentName,
                            location: order.location,
                            scheduledHours: 8,
                            instructions: '对主起升电机进行详细检查，重点排查轴承和齿轮箱。根据发现的问题更换损坏部件。',
                            safetyRequirements: '执行严格的LOTO（上锁挂牌）程序。测试期间作业区域内禁止人员进入。',
                            requiredTools: ['测振仪', '轴承拉拔器', '工业内窥镜', '润滑脂枪'],
                            plannedPersonnel: ['高级机械师', '起重机电工']
                        }],
                        dispatchTargets: [{
                            name: '王海涛 (高级机械工程师)',
                            type: '人员',
                            reason: '处理起重机紧急机械故障的专家。'
                        }, {
                            name: '重型设备维修组',
                            type: '部门',
                            reason: '负责所有起重机的重大维修。'
                        }]
                    };
                    break;
                case 'INSP-002': // 液压油泄漏且刹车失灵 (Hydraulic leak and brake failure)
                    mockResponse = {
                        workOrders: [{
                            type: '维修工单',
                            priority: '高', // Matches '紧急' status
                            creationTime,
                            equipmentName: order.equipmentName,
                            location: order.location,
                            scheduledHours: 6,
                            instructions: '立即更换泄露的液压油管，并全面检修刹车系统，更换刹车片和刹车油。',
                            safetyRequirements: '处理液压油时需佩戴防护手套和护目镜。维修区域需放置吸油毡。',
                            requiredTools: ['液压管压接工具', '刹车系统排空工具', '扭力扳手'],
                            plannedPersonnel: ['液压维修技师', '车辆维修工']
                        }, {
                            type: '动火工单',
                            priority: '中',
                            creationTime,
                            equipmentName: order.equipmentName,
                            location: order.location,
                            scheduledHours: 2,
                            instructions: '如果检查发现支架需要焊接修复，则执行此工单。',
                            safetyRequirements: '必须获得安全合规办公室批准。配备灭火器和看火人。',
                            requiredTools: ['电焊机', '角磨机', '防火毯'],
                            plannedPersonnel: ['持证焊工']
                        }],
                        dispatchTargets: [{
                            name: '仓储车辆维修部',
                            type: '部门',
                            reason: '专门负责叉车等仓储设备的维修。'
                        }, {
                            name: '安全合规办公室',
                            type: '部门',
                            reason: '动火作业需要该部门监督和批准。'
                        }]
                    };
                    break;
                case 'INSP-004': // 高处主支撑梁有腐蚀 (Corrosion on high support beam)
                     mockResponse = {
                        workOrders: [{
                            type: '高空作业工单',
                            priority: '中',
                            creationTime,
                            equipmentName: order.equipmentName,
                            location: order.location,
                            scheduledHours: 16,
                            instructions: '使用高空作业平台对主支撑梁腐蚀区域进行除锈、底漆和面漆处理。',
                            safetyRequirements: '所有人员必须佩戴全身式安全带并使用防坠落系统。作业区域下方需设置警戒线。风速超过5级时禁止作业。',
                            requiredTools: ['高空作业平台', '除锈工具', '喷漆设备', '安全带'],
                            plannedPersonnel: ['高空作业持证人员', '结构维修工']
                        }],
                        dispatchTargets: [{
                            name: '高空作业认证小组',
                            type: '部门',
                            reason: '执行高空作业需要具备资质的专业团队。'
                        }, {
                            name: '结构维修组',
                            type: '部门',
                            reason: '负责处理设备结构性问题，如腐蚀。'
                        }]
                    };
                    break;
                default:
                    // A generic fallback for any other order
                    mockResponse = {
                        workOrders: [{
                            type: '维修工单',
                            priority: '中',
                            creationTime,
                            equipmentName: order.equipmentName,
                            location: order.location,
                            scheduledHours: 4,
                            instructions: `根据报告摘要 "${order.summary}" 进行检查和维修。`,
                            safetyRequirements: '遵守标准安全规程。',
                            requiredTools: ['标准工具套件'],
                            plannedPersonnel: ['通用维修技术员']
                        }],
                        dispatchTargets: [{
                            name: '维修部',
                            type: '部门',
                            reason: '常规维修任务的标准指派。'
                        }]
                    };
                    break;
            }
            
            // For '紧急' status, ensure the main work order has '高' priority.
            if (order.status === "紧急" && mockResponse.workOrders.length > 0) {
                mockResponse.workOrders[0].priority = "高";
            }

            resolve(mockResponse);
        }, 2000);
    });
};
