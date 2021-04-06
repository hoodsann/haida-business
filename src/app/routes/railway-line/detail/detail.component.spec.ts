import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RailwayLineDetailComponent } from './detail.component';

describe('RailwayLineDetailComponent', () => {
  let component: RailwayLineDetailComponent;
  let fixture: ComponentFixture<RailwayLineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RailwayLineDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailwayLineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
