import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasteExcelComponent } from './paste-excel.component';

describe('PasteExcelComponent', () => {
  let component: PasteExcelComponent;
  let fixture: ComponentFixture<PasteExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasteExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasteExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
