import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-convertStatesToSchema',
  templateUrl: './convertStatesToSchema.component.html',
  styleUrls: ['./convertStatesToSchema.component.css']
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
    });
    this.statesJSON = [...ph];
    console.log('statesJSON', this.statesJSON)
  }

  constructor() { }

  ngOnInit() {
  }

}
