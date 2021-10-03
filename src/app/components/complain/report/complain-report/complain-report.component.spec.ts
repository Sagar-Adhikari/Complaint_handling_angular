import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainReportComponent } from './complain-report.component';

describe('ComplainReportComponent', () => {
  let component: ComplainReportComponent;
  let fixture: ComponentFixture<ComplainReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
