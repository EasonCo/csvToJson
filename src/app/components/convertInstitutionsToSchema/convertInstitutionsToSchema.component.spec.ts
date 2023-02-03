/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConvertInstitutionsToSchemaComponent } from './convertInstitutionsToSchema.component';

describe('ConvertInstitutionsToSchemaComponent', () => {
  let component: ConvertInstitutionsToSchemaComponent;
  let fixture: ComponentFixture<ConvertInstitutionsToSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertInstitutionsToSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertInstitutionsToSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
