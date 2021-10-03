import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyComplainComponent } from './my-complain.component';

describe('MyComplainComponent', () => {
  let component: MyComplainComponent;
  let fixture: ComponentFixture<MyComplainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyComplainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
