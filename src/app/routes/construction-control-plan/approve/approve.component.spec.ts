import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructionControlPlanApproveComponent } from './approve.component';

describe('ConstructionControlPlanApproveComponent', () => {
  let component: ConstructionControlPlanApproveComponent;
  let fixture: ComponentFixture<ConstructionControlPlanApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionControlPlanApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionControlPlanApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
