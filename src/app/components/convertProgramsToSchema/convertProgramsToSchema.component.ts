import { Component, Input, OnInit } from '@angular/core';
import { camelize } from 'src/app/utilities/camelize';

@Component({
  selector: 'app-convertProgramsToSchema',
  templateUrl: './convertProgramsToSchema.component.html',
  styleUrls: ['./convertProgramsToSchema.component.css'],
})
export class ConvertProgramsToSchemaComponent implements OnInit {
  _filesToConvert: any;
  @Input() set filesToConvert(val: any) {
    console.log('Programs data received for conversion', val);
    this._filesToConvert = val;
  }
  programsJSON: { [k: string]: any }[] = [];
  convertToProgramsSchema() {
    let ph: { [k: string]: any }[] = [];
    this._filesToConvert.programs.forEach((row: any, rowIndex: number) => {
      if (row.Name) {
        let rowPH: { [k: string]: any } = {};
        let collegeAbbrev = '';
        this._filesToConvert.colleges.forEach((collegesRow: any) => {
          let collegesShorts = [
            'business',
            'teachers',
            'health',
            'information',
          ];
          collegesShorts.every((short: string) => {
            if (!row.College) {
              console.log('no colleges row', row, rowIndex);
            }
            if (
              row.College.toLowerCase().includes(short) &&
              collegesRow.name.toLowerCase().includes(short)
            ) {
              collegeAbbrev = collegesRow['PAMS_collegeAbbrev'];
              return false;
            }
            return true;
          });
        });
        rowPH = { ...row };
        Object.keys(rowPH).forEach((key: any) => {
          if (
            !key.includes('Apply') &&
            !key.includes('ID') &&
            !key.includes('CAGE')
          ) {
            rowPH[camelize(key)] = rowPH[key];
            delete rowPH[key];
          } else {
            if (key.includes('ID') || key.includes('CAGE')) {
              rowPH[key.toLowerCase()] = rowPH[key];
              delete rowPH[key];
            }
          }
          if (key === 'Inactive') {
            rowPH['inactive'] =
              rowPH['inactive'].toLowerCase() === 'true'
                ? true
                : rowPH['inactive'].toLowerCase() === 'false'
                ? false
                : rowPH['inactive'];
          }
        });
        rowPH['PAMS_programCode'] = rowPH['abbreviation'];
        rowPH['PAMS_collegeAbbreviation'] = collegeAbbrev;
        delete rowPH['sequence'];
        delete rowPH['college'];
        delete rowPH['abbreviation'];
        delete rowPH['itemType'];
        delete rowPH['path'];

        ph.push(rowPH);
      }
    });
    this.programsJSON = [...ph];
    console.log('programsJSON', this.programsJSON);
  }

  constructor() {}

  ngOnInit() {}
}
