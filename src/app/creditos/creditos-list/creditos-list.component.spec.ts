import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditosListComponent } from './creditos-list.component';

describe('CreditosListComponent', () => {
  let component: CreditosListComponent;
  let fixture: ComponentFixture<CreditosListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
