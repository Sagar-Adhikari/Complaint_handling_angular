import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderDialogComponent } from './service-provider-dialog.component';

describe('ServiceProviderDialogComponent', () => {
  let component: ServiceProviderDialogComponent;
  let fixture: ComponentFixture<ServiceProviderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProviderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
