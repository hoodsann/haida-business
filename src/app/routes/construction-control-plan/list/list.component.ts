import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, SettingsService, TitleService } from '@delon/theme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../../pojos/user/user';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { DateUtils } from '../../../shared/utils/date-utils';
import { StringUtils } from '../../../shared/utils/string-utils';
import { Location, LocationConstant } from '../../../pojos/location/location';
import {
  ConstructionControlPlanPoint,
  ConstructionControlPlanPointConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan-point';
import { UtilComponent } from '../../delon/util/util.component';
import { OnReuseInit, ReuseHookOnReuseInitType } from '@delon/abc/reuse-tab';

@Component({
  selector: 'app-construction-control-plan-list',
  templateUrl: './list.component.html',
  styleUrls: ['list.component.less'],
})
export class ConstructionControlPlanListComponent implements OnInit, OnReuseInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: {
    processStatus?: number;
    codeOrConstructionProjectInfo: string;
    investigationProgressStatus?: number;
    startTime?: Date;
    planStatus?: number;
    endTime?: Date;
    warnStatus: string;
  } = {
    codeOrConstructionProjectInfo: '',
    warnStatus: '',
  };
  constructionControlPlans: ConstructionControlPlan[] = [];
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  constructionConstrolPlanPointConstant: ConstructionControlPlanPointConstant = new ConstructionControlPlanPointConstant();
  approvePlanId?: string;
  loading = true;
  total = 1;
  pageSize = 15;
  pageIndex = 1;

  resetFormParamsByQueryParams(queryParams: any) {
    if (queryParams.processStatus || queryParams.planStatus || queryParams.investigationProgressStatus) {
      this.formParams = { codeOrConstructionProjectInfo: '', warnStatus: '' };
      if (queryParams.processStatus) this.formParams.processStatus = Number(queryParams.processStatus);
      if (queryParams.planStatus) this.formParams.planStatus = Number(queryParams.planStatus);
      if (queryParams.investigationProgressStatus)
        this.formParams.investigationProgressStatus = Number(queryParams.investigationProgressStatus);
    }
  }

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  disabledStartDate = (startTime: Date): boolean => {
    if (!startTime || !this.formParams.endTime) {
      return false;
    }
    return startTime.getTime() > this.formParams.endTime.getTime();
  };

  disabledEndDate = (endTime: Date): boolean => {
    if (!endTime || !this.formParams.startTime) {
      return false;
    }
    return endTime.getTime() <= this.formParams.startTime.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  //????????????
  loadDataFromServer(): void {
    this.loading = true;

    const params = {
      pageSize: this.pageSize,
      currentPage: this.pageIndex,
      processStatusStr: this.formParams.processStatus,
      planStatusStr: this.formParams.planStatus,
      investigationProgressStatusStr: this.formParams.investigationProgressStatus,
      codeOrConstructionProjectInfo: this.formParams.codeOrConstructionProjectInfo,
      startTime: this.formParams.startTime,
      endTime: this.formParams.endTime,
      warnStatusStr: this.formParams.warnStatus,
    };

    this.http.post('/api/backstage/constructionControlPlan/getList', null, params).subscribe((res) => {
      if (!res.success) return;
      this.loading = false;
      this.constructionControlPlans = res.constructionControlPlans;
      this.total = res.page.dataTotal;
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();
    if (checked) this.setOfCheckedId.add(id);
  }

  onAllChecked(checked: boolean): void {
    this.constructionControlPlans.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.constructionControlPlans;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  uploadSuccess(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} ????????????`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} ????????????.`);
    }
  }

  issuePlanJson(): void {
    const a = document.createElement('a'); // ??????a??????
    document.body.appendChild(a); // ???body????????????a??????
    a.setAttribute('style', 'display:none'); // a ??????????????????
    a.setAttribute('href', '/api/test/nagato'); // ??????url?????? a???????????????href?????????
    a.setAttribute('download', 'template.json'); // ??????a??????????????????download  template.xlsx ???????????????????????????template ?????????xlsx
    a.click(); // ??????a??????
  }

  closePlan(): void {
    const checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('??????????????????????????????');
      return;
    }

    this.http.post('/api/backstage/constructionControlPlan/close', null, { id: checkedId }).subscribe((res) => {
      if (res.success) this.msg.success(res.msg);
      this.loadDataFromServer();
    });
  }

  deletePlan(): void {
    const checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('??????????????????????????????');
      return;
    }

    // ??????????????????
    let checkedConstructionControlPlan = this.constructionControlPlans.filter((plans) => plans.id === checkedId)[0];
    if (checkedConstructionControlPlan.planStatus != this.constructionControlPlanConstant.FIRST_DRAFT) {
      this.msg.error('?????????????????????????????????????????????');
      return;
    }

    this.http.post('/api/backstage/constructionControlPlan/delete', null, { id: checkedId }).subscribe((res) => {
      if (res.success) this.msg.success(res.msg);
      this.loadDataFromServer();
    });
  }

  submitPlan(id: string): void {
    this.http.post('/api/backstage/constructionControlPlan/submit', null, { id: id }).subscribe((res) => {
      if (res.success) this.msg.success(res.msg);
      this.loadDataFromServer();
    });
  }

  previewPage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('??????????????????????????????');
      return;
    }

    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: checkedId,
      },
    });
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.setOfCheckedId.clear();
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer();
  }

  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public settingService: SettingsService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public msg: NzMessageService,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef,
  ) {}

  roleName?: string;

  ngOnInit(): void {
    this.roleName = this.settingService.user.roleName;
    this.titleService.setTitle('????????????');
    // ????????????????????????????????????
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.approvePlanId) this.approvePlanId = queryParams.approvePlanId;

      this.resetFormParamsByQueryParams(queryParams);

      if (queryParams.warnStatus) {
        this.formParams.warnStatus = '';
        this.formParams.warnStatus = queryParams.warnStatus;
      }
      if (queryParams.totalType) {
        this.formParams.startTime = undefined;
        if (queryParams.totalType == 'nowYear') {
          this.formParams.startTime = DateUtils.getNowYear();
        } else if (queryParams.totalType == 'lastMonth') {
          this.formParams.startTime = DateUtils.getLastMonth();
        }
      }
    });
    this.loadDataFromServer();
  }

  // ??????????????????
  showPlanDetailFunction(id: string) {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: id,
        parentUrl: '/construction-control-plan/list',
        parentName: '??????????????????',
      },
    });
  }

  add() {
    this.router.navigate(['/construction-control-plan/detail']);
  }
  update(): void {
    const checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('??????????????????????????????');
      return;
    }
    this.router.navigate(['/construction-control-plan/detail'], {
      queryParams: {
        constructionControlPlanId: checkedId,
      },
    });
  }

  // ???????????????????????????
  @ViewChild('detailModel') detailModel: any;
  showPlanUpdate = false;
  addPage(): void {
    this.showPlanUpdate = true;
  }
  updatePage(): void {
    const checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('??????????????????????????????');
      return;
    }

    this.showPlanUpdate = true;

    setTimeout(() => {
      this.detailModel.setConstructionControlPlanId(checkedId);
      this.detailModel.loadDataFromServer();
    }, 100);
  }

  /**
   * ????????????/??????????????????
   */
  detailModalHandleSave() {
    let constructionControlPlan = this.detailModel.constructionControlPlan;
    this.detailModel.save((res: any) => {
      this.showPlanUpdate = false;
      this.loadDataFromServer();
    });
  }

  /**
   * ????????????/??????????????????
   */
  detailModalHandleOk() {
    let constructionControlPlan = this.detailModel.constructionControlPlan;
    this.detailModel.execute((res: any) => {
      this.showPlanUpdate = false;
      this.loadDataFromServer();
    });
  }

  // ???????????????????????????
  @ViewChild('issueModel') issueModel: any;
  showIssue = false;
  showIssueModal(id: string): void {
    this.showIssue = true;
    setTimeout(() => {
      this.issueModel.setConstructionControlPlanId(id);
      this.issueModel.loadDataFromServer();
    }, 100);
  }

  // ??????????????????
  issueInvestigationTasks(value: any) {
    this.http.post('/api/backstage/constructionControlPlan/issueInvestigationTasks', null, { id: value }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.loadDataFromServer();
      this.showIssue = false;
    });
  }

  // ???????????????????????????
  @ViewChild('submitCountersignModel') submitCountersignModel: any;
  submitCountersignReview = false;
  submitCountersignModal(data: ConstructionControlPlan): void {
    let checkedInvestigationProgressStatus = data.investigationProgressStatus;
    if (checkedInvestigationProgressStatus == this.constructionControlPlanConstant.INVESTIGATING) {
      this.msg.error('?????????????????????????????????????????????????????????');
      return;
    }
    if (!data.hasUploadedCooperativeScheme) {
      this.msg.error('???????????????????????????????????????????????????????????????');
      return;
    }

    this.submitCountersignReview = true;

    setTimeout(() => {
      this.submitCountersignModel.setConstructionControlPlanId(data.id);
      this.submitCountersignModel.loadDataFromServer();
    }, 100);
  }

  submitCountersign(id: string) {
    this.http.post('/api/backstage/constructionControlPlan/submitCountersign', null, { id: id }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.loadDataFromServer();
      this.submitCountersignReview = false;
    });
  }

  // ?????????????????? TECH_COUNTERSIGN
  @ViewChild('techCountersignModel') techCountersignModel: any;
  showTechCountersign = false;
  techCountersignConstructionControlPlanId: string = '';
  techCountersignReviewModel(id: string): void {
    this.showTechCountersign = true;
    this.techCountersignConstructionControlPlanId = id;

    setTimeout(() => {
      this.techCountersignModel.setConstructionControlPlanId(id);
      this.techCountersignModel.loadDataFromServer();
    }, 100);
  }
  techCountersign() {
    this.http
      .post('/api/backstage/constructionControlPlan/techCountersign', null, { id: this.techCountersignConstructionControlPlanId })
      .subscribe((res) => {
        if (!res.success) return;
        this.msg.success(res.msg);
        this.loadDataFromServer();
        this.showTechCountersign = false;
      });
  }

  // ????????????????????????
  techCountersignModelRejectPlan() {
    this.http
      .post('/api/backstage/constructionControlPlan/rejectPlan', null, { id: this.techCountersignConstructionControlPlanId })
      .subscribe((res) => {
        if (!res.success) return;
        this.msg.success(res.msg);
        this.loadDataFromServer();
        this.showTechCountersign = false;
      });
  }

  // ?????????????????????
  showUpload = false;
  showUploadModel(): void {
    const checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('????????????????????????????????????');
      return;
    }

    this.showUpload = true;
  }

  /**
   * ????????????????????????app??????
   */
  uploadDemoPoint(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('???????????????????????????');
      return;
    }

    let locationConstant = new LocationConstant();
    let locations: Location[] = [];
    let constructionControlPlanPoints: ConstructionControlPlanPoint[] = [];
    for (let i = 0; i < 3; i++) {
      let dataId = UtilComponent.uuid();

      if (i == 0) {
        locations.push({
          id: UtilComponent.uuid(),
          seq: 0,
          dataId: dataId,
          type: locationConstant.CONSTRUCTION_CONTROL_PLAN_POINT,
          longitude: 126.7106,
          latitude: 45.7686,
        });
      }

      if (i == 1) {
        locations.push({
          id: UtilComponent.uuid(),
          seq: 0,
          dataId: dataId,
          type: locationConstant.CONSTRUCTION_CONTROL_PLAN_POINT,
          longitude: 126.6829,
          latitude: 45.7399,
        });
      }

      if (i == 2) {
        locations.push({
          id: UtilComponent.uuid(),
          seq: 0,
          dataId: dataId,
          type: locationConstant.CONSTRUCTION_CONTROL_PLAN_POINT,
          longitude: 126.7105,
          latitude: 45.768,
        });
      }

      let constructionControlPlanPoint = {
        id: dataId,
        collectType: this.constructionConstrolPlanPointConstant.POINT,
        name: i + '',
        radius: 25,
        shortestDistance: 0,
        seq: 0,
        constructionControlPlanId: checkedId,
        locations: [],
      };
      constructionControlPlanPoints.push(constructionControlPlanPoint);
    }

    const params = {
      locations: JSON.stringify(locations),
      constructionControlPlanPoints: JSON.stringify(constructionControlPlanPoints),
    };

    this.http.post('/api/app/upload/constructionControlPlan', null, params).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.loadDataFromServer();
    });
  }
  // ?????????????????????
  @ViewChild('safeCountersignModel') safeCountersignModel: any;
  showSafeCountersign = false;
  safeCountersignConstructionControlPlanId: string = '';
  auditParams: {
    constructionControlPlanId: string;
    auditOpinion: string;
    auditDate: Date;
  } = {
    constructionControlPlanId: '',
    auditOpinion: '',
    auditDate: new Date(),
  };
  showSafeCountersignModel(data: ConstructionControlPlan): void {
    const id = data.id;

    if (!data.hasUploadedSafetyProtocol) {
      this.msg.error('???????????????????????????????????????????????????????????????');
      return;
    }

    this.showSafeCountersign = true;
    this.safeCountersignConstructionControlPlanId = id;

    setTimeout(() => {
      this.safeCountersignModel.setConstructionControlPlanId(id);
      this.safeCountersignModel.loadDataFromServer();
    }, 100);
  }

  equipmentPage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('???????????????????????????');
      return;
    }

    let checkedConstructionControlPlans = this.constructionControlPlans.filter((plans) => plans.id === checkedId)[0];
    if (checkedConstructionControlPlans.processStatus != this.constructionControlPlanConstant.RELEVANCEED) {
      this.msg.error('????????????????????????????????????');
      return;
    }

    this.router.navigate(['/equipment/construction-control-plan-list'], {
      queryParams: {
        constructionControlPlanId: checkedId,
      },
    });
  }

  // ????????????????????????
  approveModelRejectPlan() {
    this.http
      .post('/api/backstage/constructionControlPlan/rejectPlan', null, { id: this.safeCountersignConstructionControlPlanId })
      .subscribe((res) => {
        if (!res.success) return;
        this.msg.success(res.msg);
        this.loadDataFromServer();
        this.showSafeCountersign = false;
      });
  }

  // ???????????????
  approveSafeCountersign() {
    let constructionControlPlan = this.constructionControlPlans.filter((x) => x.id == this.safeCountersignConstructionControlPlanId)[0];
    if (!constructionControlPlan.hasUploadedSafetyProtocol) {
      this.msg.error('???????????????????????????????????????????????????????????????');
      return;
    }
    this.http
      .post('/api/backstage/constructionControlPlan/safeCountersign', null, { id: this.safeCountersignConstructionControlPlanId })
      .subscribe((res) => {
        if (!res.success) return;
        this.msg.success(res.msg);
        this.loadDataFromServer();
        this.showSafeCountersign = false;
      });
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.ngOnInit();
  }
}
