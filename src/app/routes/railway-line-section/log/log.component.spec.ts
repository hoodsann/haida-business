import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RailwayLineSectionLogComponent } from './log.component';

describe('RailwayLineSectionLogComponent', () => {
  let component: RailwayLineSectionLogComponent;
  let fixture: ComponentFixture<RailwayLineSectionLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RailwayLineSectionLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailwayLineSectionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
