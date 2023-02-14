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
    ph.forEach((item: any) => {
      delete item.AALogo;
      delete item['Item Type'];
      delete item.Path;
      try {
        item.IsDBAState =
          item.IsDBAState.toLowerCase() === 'true'
            ? true
            : item.IsDBAState.toLowerCase() === 'false'
            ? false
            : item.IsDBAState;
      } catch (e) {
        console.log('for row -> ', item);
        console.log(e);
      }

      Object.keys(item).forEach((key: any) => {
        if (key === 'ID') {
          item.id = item.ID;
          delete item.ID;
        } else {
          item[camelize(key)] = item[key];
          delete item[key];
        }
      });
    });
    this.statesJSON = [...ph];
    console.log('statesJSON', this.statesJSON);
  }

  constructor() {}

  ngOnInit() {}
}
