/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConvertPathwaysToSchemaComponent } from './convertPathwaysToSchema.component';

describe('ConvertPathwaysToSchemaComponent', () => {
  let component: ConvertPathwaysToSchemaComponent;
  let fixture: ComponentFixture<ConvertPathwaysToSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertPathwaysToSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertPathwaysToSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
