import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainListContainerComponent } from './complain-list-container.component';

describe('ComplainListContainerComponent', () => {
  let component: ComplainListContainerComponent;
  let fixture: ComponentFixture<ComplainListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
