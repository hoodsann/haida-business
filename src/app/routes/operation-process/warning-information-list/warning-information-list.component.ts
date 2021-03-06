import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper, TitleService } from '@delon/theme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ConstructionControlPlan } from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { WarnInfoConstant, WarningInfo } from '../../../pojos/construction-control-plan/warning-info';
import { DateUtils } from '../../../shared/utils/date-utils';

@Component({
  selector: 'app-operation-process-warning-information-list',
  templateUrl: './warning-information-list.component.html',
  styleUrls: ['../../construction-coordinate-plan/list.component.less'],
})
export class OperationProcessWarningInformationListComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: {
    warnLevel?: number;
    processStatus?: number;
    startTime?: Date;
    endTime?: Date;
  } = {};
  warnInfoConstant = new WarnInfoConstant();
  warningInfos: WarningInfo[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  size: NzButtonSize = 'default';
  showProcess = false;

  data: Array<{
    id: number;
    title: string;
    subDescription: string;
    href: string;
    logo: string;
    owner: string;
    createdAt: Date;
    percent: number;
    status: string;
  }> = [];

  loadDataFromServer(): void {
    this.loading = true;

    const params = {
      pageSize: this.pageSize,
      currentPage: this.pageIndex,
      warnLevelStr: this.formParams.warnLevel,
      processStatusStr: this.formParams.processStatus,
      startTime: this.formParams.startTime,
      endTime: this.formParams.endTime,
    };

    this.http.post('/api/backstage/warningInfo/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.warningInfos = res.warningInfos;
      this.total = res.page.dataTotal;
    });
  }

  showProcessModal() {
    let checkedId = this.setOfCheckedId.values().next().value;

    if (!checkedId) {
      this.msg.error('???????????????????????????');
      return;
    }

    if (this.warningInfos.filter((x) => x.id == checkedId && x.processStatus == this.warnInfoConstant.NOT_PROCESSED).length <= 0) {
      this.msg.error('??????????????????');
      return;
    }

    this.showProcess = true;
  }

  processWarningBySendSms() {
    let checkedId = this.setOfCheckedId.values().next().value;

    if (!checkedId) {
      this.msg.error('???????????????????????????');
      return;
    }

    if (this.warningInfos.filter((x) => x.processStatus == this.warnInfoConstant.NOT_PROCESSED).length <= 0) {
      this.msg.error('??????????????????');
      return;
    }

    this.http.post('/api/backstage/warningInfo/processWarningBySendSms', null, { id: checkedId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success('????????????');
      this.showProcess = false;
      this.loadDataFromServer();
    });
  }

  processWarningByDoNothing() {
    let checkedId = this.setOfCheckedId.values().next().value;

    if (!checkedId) {
      this.msg.error('???????????????????????????');
      return;
    }

    if (this.warningInfos.filter((x) => x.processStatus == this.warnInfoConstant.NOT_PROCESSED).length <= 0) {
      this.msg.error('??????????????????');
      return;
    }

    this.http.post('/api/backstage/warningInfo/processWarningByDoNothing', null, { id: checkedId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success('????????????');
      this.showProcess = false;
      this.loadDataFromServer();
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();
    if (checked) this.setOfCheckedId.add(id);
  }

  onAllChecked(checked: boolean): void {
    this.warningInfos.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.warningInfos;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  uploadSuccess(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
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

  previewPage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('?????????????????????????????????');
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
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadDataFromServer();
  }

  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private titleService: TitleService,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('????????????');
    this.loadDataFromServer();
    // ????????????????????????????????????
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.processStatus) this.formParams.processStatus = Number(queryParams.processStatus);
      if (queryParams.warnLevel) this.formParams.warnLevel = Number(queryParams.warnLevel);
      if (queryParams.totalType) {
        this.formParams.endTime = new Date();
        if (queryParams.totalType == 'nowYear') {
          this.formParams.startTime = DateUtils.getNowYear();
        } else if (queryParams.totalType == 'nowMonth') {
          this.formParams.startTime = DateUtils.getNowMonth();
        }
      }
    });
  }

  // ???????????????????????????????????????
  showControlPlanMapFunction(id: string) {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: id,
        parentUrl: '/operation-process/warning-information-list',
        parentName: '????????????',
      },
    });
  }
}
