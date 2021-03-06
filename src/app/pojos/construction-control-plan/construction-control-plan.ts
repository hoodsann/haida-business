import { ConstructionFormalPlan } from './construction-formal-plan';

export class ConstructionControlPlan {
  id: string;
  name: string;
  processStatus?: number;
  investigationProgressStatus?: number;
  railwayLineStatus: number;
  kilometerMark: number;
  constructionType?: string;
  constructionStatus?: number;
  signInUserId?: string;
  executeUserId?: string;
  workInfo: string;
  influenceArea: string;
  signInStationId: string;
  code: string;
  constructionFormalPlanCodes?: string;
  approveStatus: number;
  signInStatus?: number;
  warnStatus: number;
  finishStatus: number;
  startTime?: Date;
  endTime?: Date;
  startHourStr?: string;
  endHourStr?: string;
  startHour?: Date;
  endHour?: Date;
  addTime?: Date;
  updateTime?: Date;
  executorName?: string;
  signInUserName?: string;
  workshopName?: string;
  constructionFormalPlan?: ConstructionFormalPlan;
  startKilometer: number;
  endKilometer: number;
  startDistanceFromRailway?: number;
  endDistanceFromRailway?: number;
  constructDepartment?: string;
  constructionDepartmentAndPrincipalName?: string;
  needCooperate?: number;
  cooperateLocationInfo?: string;
  protectiveMeasuresInfo?: string;
  startStationId?: string;
  endStationId?: string;
  executeOrganizationId?: string;
  executeOrganizationName?: string;
  constructionProjectInfo?: string;
  constructionPeriod?: number;
  startStationName?: string;
  endStationName?: string;
  railwayLineId?: string;
  railwayLineName?: string;
  signInUserDisplayName?: string;
  executorDisplayName?: string;
  constructionContentAndInfluenceArea?: number;
  constructionLevel?: number;
  startKilometerKilometerPart?: number;
  startKilometerMeterPart?: number;
  endKilometerKilometerPart?: number;
  endKilometerMeterPart?: number;
  hasUploadedCooperativeScheme?: number;
  hasUploadedSafetyProtocol?: number;
  investigationOrganizationId?: string;
  investigationOrganizationName?: string;
  planStatus?: number;
  equipmentBindCount?: number;
  equipmentReleaseCount?: number;
  totals?: number;
  approvalTime?: Date;
  supervisionDepartmentAndPrincipalName?: string; // ????????????????????????
  equipmentMonitoringDepartmentAndPrincipalName?: string; // ??????????????????????????????
  remarks?: string; // ??????
  starRating?: string; // ??????
  auditDepartment?: string; // ????????????

  constructor(
    UPRIVER: number,
    DOWNRIVER: number,
    RED: number,
    FINISHED: number,
    id: string,
    name: string,
    railwayLineStatus: number,
    kilometerMark: number,
    workInfo: string,
    influenceArea: string,
    constructionStatus: number,
    constructionType: string,
    signInStationId: string,
    signInUserId: string,
    executeUserId: string,
    code: string,
    approveStatus: number,
    warnStatus: number,
    finishStatus: number,
    startTime: Date,
    endTime: Date,
    addTime: Date,
    updateTime: Date,
    executorName: string,
    stationName: string,
    signInUserName: string,
    workshopName: string,
    signInStatus: number,
    constructionFormalPlan: ConstructionFormalPlan,
    startKilometerKilometerPart: number,
    startKilometerMeterPart: number,
    endKilometerKilometerPart: number,
    endKilometerMeterPart: number,
    startKilometer: number,
    endKilometer: number,
    investigationOrganizationId: string,
    investigationOrganizationName: string,
    totals: number,
    approvalTime: Date,
    supervisionDepartmentAndPrincipalName: string,
    equipmentMonitoringDepartmentAndPrincipalName: string,
    remarks: string,
    starRating: string,
    auditDepartment: string,
  ) {
    this.id = id;
    this.name = name;
    this.railwayLineStatus = railwayLineStatus;
    this.kilometerMark = kilometerMark;
    this.signInStatus = signInStatus;
    this.workInfo = workInfo;
    this.influenceArea = influenceArea;
    this.constructionStatus = constructionStatus;
    this.constructionType = constructionType;
    this.signInStationId = signInStationId;
    this.signInUserId = signInUserId;
    this.executeUserId = executeUserId;
    this.code = code;
    this.approveStatus = approveStatus;
    this.warnStatus = warnStatus;
    this.finishStatus = finishStatus;
    this.startTime = startTime;
    this.endTime = endTime;
    this.addTime = addTime;
    this.updateTime = updateTime;
    this.executorName = executorName;
    this.signInUserName = signInUserName;
    this.workshopName = workshopName;
    this.constructionFormalPlan = constructionFormalPlan;
    this.startKilometerKilometerPart = startKilometerKilometerPart;
    this.startKilometerMeterPart = startKilometerMeterPart;
    this.endKilometerKilometerPart = endKilometerKilometerPart;
    this.endKilometerMeterPart = endKilometerMeterPart;
    this.startKilometer = startKilometer;
    this.endKilometer = endKilometer;
    this.investigationOrganizationId = investigationOrganizationId;
    this.investigationOrganizationName = investigationOrganizationName;
    this.totals = totals;
    this.approvalTime = approvalTime;
    this.supervisionDepartmentAndPrincipalName = supervisionDepartmentAndPrincipalName;
    this.equipmentMonitoringDepartmentAndPrincipalName = equipmentMonitoringDepartmentAndPrincipalName;
    this.remarks = remarks;
    this.starRating = starRating;
    this.auditDepartment = auditDepartment;
  }

  public static splitKilometer(constructionControlPlan: ConstructionControlPlan) {
    let startKilometer = constructionControlPlan.startKilometer ? constructionControlPlan.startKilometer : 0;
    constructionControlPlan.startKilometerKilometerPart = Number(Math.floor(startKilometer / 1000).toFixed(0));
    constructionControlPlan.startKilometerMeterPart = Number((startKilometer % 1000).toFixed(0));
    let endKilometer = constructionControlPlan.endKilometer ? constructionControlPlan.endKilometer : 0;
    constructionControlPlan.endKilometerKilometerPart = Number(Math.floor(endKilometer / 1000).toFixed(0));
    constructionControlPlan.endKilometerMeterPart = Number((endKilometer % 1000).toFixed(0));
  }

  public static setKilometer(constructionControlPlan: ConstructionControlPlan) {
    constructionControlPlan.startKilometer = 0;
    constructionControlPlan.endKilometer = 0;
    if (constructionControlPlan.startKilometerKilometerPart)
      constructionControlPlan.startKilometer += constructionControlPlan.startKilometerKilometerPart * 1000;
    if (constructionControlPlan.startKilometerMeterPart)
      constructionControlPlan.startKilometer += constructionControlPlan.startKilometerMeterPart;
    if (constructionControlPlan.endKilometerKilometerPart)
      constructionControlPlan.endKilometer += constructionControlPlan.endKilometerKilometerPart * 1000;
    if (constructionControlPlan.endKilometerMeterPart)
      constructionControlPlan.endKilometer += constructionControlPlan.endKilometerMeterPart;
  }
}

export class ConstructionControlPlanConstant {
  // planStatus ????????????
  public readonly FIRST_DRAFT = 0; // ??????
  public readonly TECH_COUNTERSIGN = 1; // ????????????
  public readonly SAFE_COUNTERSIGN = 2; // ????????????
  public readonly COUNTERSIGNED = 3; // ?????????
  public readonly PENDING_START = 4; // ?????????
  public readonly FORMAL_START = 5; // ????????????(????????????????????????????????????????????????????????????)
  public readonly CONSTRUCTING = 6; // ?????????(???????????????????????????????????????????????????????????????)
  public readonly SYSTEM_CLOSED = 7; // ????????????
  public readonly MANUALLY_CLOSED = 8; // ????????????

  // investigationProgressStatus ????????????
  public readonly INVESTIGATION_NOT_OPENED = 0; // ?????????
  public readonly PENDING_INVESTIGATE = 1; // ????????????????????????????????????
  public readonly INVESTIGATING = 2; // ?????????
  public readonly INVESTIGATED = 3; // ?????????

  // processStatus ????????????
  public readonly PENDING_SUBMIT = 0; // ?????????
  public readonly PENDING_COUNTERSIGN = 1; // ?????????
  public readonly PENDING_RELEVANCE = 2; // ?????????
  public readonly RELEVANCEED = 3; // ?????????
  public readonly CLOSED = 4; // ?????????

  // constructionStatus
  public readonly BC_CONSTRUCTION = 0;
  public readonly NORMAL_CONSTRUCTION = 1;
  // constructionLevel
  public readonly LEVEL1 = 0;
  public readonly LEVEL2 = 1;
  public readonly LEVEL3 = 2;
  public readonly TYPEB = 3;
  public readonly TYPEC = 4;

  // railwayLineStatus??????
  public readonly UPRIVER = 0;
  public readonly DOWNRIVER = 1;
  public readonly SINGLE_LINE = 2;
  public readonly UPRIVER_AND_DOWNRIVER = 3;

  // warnStatus??????
  public readonly RED = 0;
  public readonly ORANGE = 1;
  public readonly YELLOW = 2;
  public readonly BLUE = 3;
  public readonly GREEN = 4;

  // finishedStatus
  public readonly FINISHED = 1;
  // approveStatus
  public readonly HAS_NOT_APPROVED = 0;
  public readonly APPROVED = 1;
  // signInStatus
  public readonly HAS_NOT_SIGN_IN = 0;
  public readonly SIGN_IN = 1;

  //constructionPeriod ????????????
  public readonly EVERYDAY = 0;
  public readonly EVERY_OTHER_DAY = 1;
  public readonly DIEBUS_TERTIUS = 2;
}
