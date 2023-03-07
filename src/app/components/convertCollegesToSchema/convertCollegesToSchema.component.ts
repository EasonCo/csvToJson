import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-convertCollegesToSchema',
  templateUrl: './convertCollegesToSchema.component.html',
  styleUrls: ['./convertCollegesToSchema.component.css']
})
export class ConvertCollegesToSchemaComponent implements OnInit {

  _fileToConvert: any;
  @Input() set fileToConvert(val: any) {
    console.log('Colleges data received for conversion', val);
    this._fileToConvert = val;
  }

  collegesJSON: { [k: string]: any }[] = [];

  convertToCollegesSchema() {
    let ph = [...this._fileToConvert];
    ph.forEach((item: any, itemIndex: number) => {
      delete item.SyncDate;
      delete item['Item Type'];
      delete item.Path;
      item.id = itemIndex + 1;
      item['PAMS_collegeAbbrev'] = item.Abbreviation;
      delete item.Abbreviation;
      item.name = item.Name;
      delete item.Name;
      item.note = item.Note;
      delete item.Note;
      item['createdBy'] = 'conversionProcess'
      item['createdDate'] = 'NOW()';
      delete item['Created'];
      item['modifiedBy'] = 'conversionProcess';
      item['modifiedDate'] = 'NOW()';
      delete item['Modified'];
      item['recordVersion'] = 1;
      item['activeVersion'] = 1;
      item['activeDate'] = 'NOW()';

      
    });
    this.collegesJSON = [...ph];
    console.log('collegesJSON', this.collegesJSON)
  }

  constructor() { }

  ngOnInit() {
  }
}
