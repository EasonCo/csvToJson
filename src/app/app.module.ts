import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileInputComponent } from './components/fileInput/fileInput.component';
import { SaveFileComponent } from './components/saveFile/saveFile.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ConvertAgreementsToSchemaComponent } from './components/convertAgreementsToSchema/convertAgreementsToSchema.component';
import { ConvertStatesToSchemaComponent } from './components/convertStatesToSchema/convertStatesToSchema.component';
import { ConvertInstitutionsToSchemaComponent } from './components/convertInstitutionsToSchema/convertInstitutionsToSchema.component';
import { ConvertPathwaysToSchemaComponent } from './components/convertPathwaysToSchema/convertPathwaysToSchema.component';
@NgModule({
  declarations: [
    AppComponent,
    FileInputComponent,
    SaveFileComponent,
    ConvertAgreementsToSchemaComponent,
    ConvertStatesToSchemaComponent,
    ConvertInstitutionsToSchemaComponent,
    ConvertPathwaysToSchemaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
