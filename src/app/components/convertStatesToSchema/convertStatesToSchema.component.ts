import { Component, Input, OnInit } from '@angular/core';
import { camelize } from 'src/app/utilities/camelize';

@Component({
  selector: 'app-convertStatesToSchema',
  templateUrl: './convertStatesToSchema.component.html',
  styleUrls: ['./convertStatesToSchema.component.css'],
})
export class ConvertStatesToSchemaComponent implements OnInit {
  _fileToConvert: any;
  @Input() set fileToConvert(val: any) {
    console.log('States data received for conversion', val);
    this._fileToConvert = val;
  }

  statesJSON: { [k: string]: any }[] = [];

  convertToStatesSchema() {
    let ph = [...this._fileToConvert];
    ph.forEach((item: any, itemIndex: number) => {
      delete item.AALogo;
      delete item['Item Type'];
      delete item.Path;
      try {
        item.IsDBAState =
          item.IsDBAState.toLowerCase() === 'true'
            ? 1
            : item.IsDBAState.toLowerCase() === 'false'
            ? 0
            : item.IsDBAState;
      } catch (e) {
        console.log('for row -> ', item);
        console.log(e);
      }
      if(!item.State) {
        ph.splice(itemIndex, itemIndex);
      }
      Object.keys(item).forEach((key: any) => {
        if (key === 'ID') {
          item.id = parseInt(item.ID);
          delete item.ID;
        } else {
          item[camelize(key)] = item[key];
          delete item[key];
        }
      });
      item['createdBy'] = 'conversionProcess';
      item['createdDate'] = 'NOW()';
      delete item['created'];
      item['modifiedBy'] = 'conversionProcess';
      item['modifiedDate'] = 'NOW()';
      delete item['modified'];
      item['recordVersion'] = 1;
      item['activeVersion'] = 1;
      item['activeDate'] = 'NOW()';


    });

    this.statesJSON = [...ph];
    console.log('statesJSON', this.statesJSON);
  }

  constructor() {}

  ngOnInit() {}
}
