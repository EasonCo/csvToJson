/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConvertAgreementsToSchemaComponent } from './convertAgreementsToSchema.component';

describe('ConvertAgreementsToSchemaComponent', () => {
  let component: ConvertAgreementsToSchemaComponent;
  let fixture: ComponentFixture<ConvertAgreementsToSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertAgreementsToSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertAgreementsToSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
