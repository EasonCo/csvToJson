import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-convertInstitutionsToSchema',
  templateUrl: './convertInstitutionsToSchema.component.html',
  styleUrls: ['./convertInstitutionsToSchema.component.css'],
})
export class ConvertInstitutionsToSchemaComponent implements OnInit {
  _filesToConvert: any;
  @Input() set filesToConvert(val: any) {
    console.log('Institutions data received for conversion', val);
    this._filesToConvert = val;
  }
  institutionsJSON: { [k: string]: any }[] = [];
  convertToInstitutionsSchema() {
    this._filesToConvert.share.forEach((row: any) => {
      let stateIdPh = 0;
      let logoPh = '';
      this._filesToConvert.state.forEach((stateItem: any) => {
        if (stateIdPh === 0) {
          if (stateItem.state === row.State) {
            stateIdPh = parseInt(stateItem.id);
          }
        }
      });
      this._filesToConvert.partner.forEach((partnerItem: any) => {
        if (logoPh.length < 1) {
          if (partnerItem.OriginalID === row.ID) {
            logoPh = partnerItem.Logo;
          }
        }
      });
      try {
        this.institutionsJSON.push({
          id: parseInt(row.ID),
          name: row.Name,
          acronym: row['Institute Acronym'],
          isSystem:
            row.IsSystem.toLowerCase() === 'true'
              ? 1
              : row.IsSystem.toLowerCase() === 'false'
              ? 0
              : row.IsSystem,
          institutionSystem: row.System,
          stateId: stateIdPh,
          hasReverse:
            row.HasReverse.toLowerCase() === 'true'
              ? 1
              : row.IsSystem.toLowerCase() === 'false'
              ? 0
              : row.HasReverse,
          logo: logoPh,
          approvers: row.Approvers,
          institutionGroup: row.Group,
          isDistrict:
            row.IsDistrict.toLowerCase() === 'true'
              ? 1
              : row.IsSystem.toLowerCase() === 'false'
              ? 0
              : row.IsDistrict,
          district: row.District,
          notes: row.Notes,
          createdDate: 'STR_TO_DATE("' + row.Created + '", "%m/%d/%Y %H:%i")',
          createdBy: row['Created By'],
          modifiedDate: 'STR_TO_DATE("' + row.Modified + '", "%m/%d/%Y %H:%i")',
          modifiedBy: row['Modified By'],
          recordVersion: 1,
          activeVersion: 1,
          activeDate: 'NOW()',
        });
      } catch (e) {
        console.log('for row -> ', row);
        console.log(e);
      }
    });
    console.log('institutionsJSON', this.institutionsJSON);
  }

  constructor() {}

  ngOnInit() {}
}
