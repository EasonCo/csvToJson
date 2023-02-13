import { Component, Input, OnInit } from '@angular/core';
import { camelize } from 'src/app/utilities/camelize';

@Component({
  selector: 'app-convertPathwaysToSchema',
  templateUrl: './convertPathwaysToSchema.component.html',
  styleUrls: ['./convertPathwaysToSchema.component.css'],
})
export class ConvertPathwaysToSchemaComponent implements OnInit {
  // _fileToConvert: any;
  // @Input() set fileToConvert(val: any) {
  //   console.log('Pathways data received for conversion', val);
  //   this._fileToConvert = val;
  // }

  // nonTransferrableCoursesJSON: { [k: string]: any }[] = [];

  // convertTononTransferrableSchema() {
  //   let ph: any[] = [];
  //   let rowId = 1;
  //   this._fileToConvert.forEach((item: any, index: number) => {
  //     if(item.Area?.includes('Non-Transferable')) {
  //       ph.push({
  //         id: rowId,
  //         PAMS_bannerCode: item['Course:Code'],
  //         transferrable: false
  //       })
  //       rowId +=1;
  //     }
  //   });
  //   this.nonTransferrableCoursesJSON = [...ph];
  //   console.log('pathwaysJSON', this.nonTransferrableCoursesJSON)
  // }

  transferGuidelinesJSON: { [k: string]: any }[] = [];
  _filesToConvert: any;
  @Input() set filesToConvert(val: any) {
    console.log('Transfer Guidelines data received for conversion', val);
    this._filesToConvert = val;
  }
  convertToCourseEnrichmentSchema() {
    let rowPH: { [k: string]: any } = {};

    this._filesToConvert.guidelines.forEach((row: any, rowIndex: number) => {
      rowPH = { ...row };
      rowPH['id'] = rowIndex;
      delete rowPH['Title'];
      delete rowPH['Item Type'];
      delete rowPH['Path'];
      delete rowPH['Course Units'];
      delete rowPH['Course Name'];
      // delete rowPH['College(s)'];
      // delete rowPH['Program(s)'];

      Object.keys(rowPH).forEach((key: any) => {
        rowPH[camelize(key)] = rowPH[key];
        delete rowPH[key];
      });
      rowPH['transferArea'] = rowPH['area'];
      delete rowPH['area'];
      rowPH['PAMS_bannerCode'] = rowPH['course'];
      delete rowPH['course'];
      this.transferGuidelinesJSON.push(rowPH);
      // if(rowPH['PAMS_bannerCode'].includes('C100')){ console.log('TEST -> ', rowPH)}
    });
    console.log('transferGuidelinesJSON', this.transferGuidelinesJSON)

  }

  constructor() {}

  ngOnInit() {}
}
