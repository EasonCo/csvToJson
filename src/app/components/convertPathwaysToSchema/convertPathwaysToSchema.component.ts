import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-convertPathwaysToSchema',
  templateUrl: './convertPathwaysToSchema.component.html',
  styleUrls: ['./convertPathwaysToSchema.component.css']
})
export class ConvertPathwaysToSchemaComponent implements OnInit {
  _fileToConvert: any;
  @Input() set fileToConvert(val: any) {
    console.log('Pathways data received for conversion', val);
    this._fileToConvert = val;
  }

  nonTransferrableCoursesJSON: { [k: string]: any }[] = [];

  convertTononTransferrableSchema() {
    let ph: any[] = [];
    let rowId = 1;
    this._fileToConvert.forEach((item: any, index: number) => {
      if(item.Area?.includes('Non-Transferable')) {
        ph.push({
          id: rowId,
          PAMS_courseCode: item['Course:Code'],
          transferrable: false
        })
        rowId +=1;
      }
    });
    this.nonTransferrableCoursesJSON = [...ph];
    console.log('pathwaysJSON', this.nonTransferrableCoursesJSON)
  }

  constructor() { }

  ngOnInit() {
  }

}
