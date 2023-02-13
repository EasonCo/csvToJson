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
          if (stateItem.State === row.State) {
            stateIdPh = parseInt(stateItem.ID);
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
      this.institutionsJSON.push({
        id: row.ID,
        name: row.Name,
        acronym: row['Institute Acronym'],
        isSystem: row.IsSystem,
        system: row.System,
        stateId: stateIdPh,
        hasReverse: row.HasReverse,
        logo: logoPh,
        approvers: row.Approvers,
        group: row.Group,
        isDistrict: row.IsDistrict,
        district: row.District,
        notes: row.Notes,
        createdDate: row.Created,
        createdBy: row['Created By'],
        modifiedDate: row.Modified,
        modifiedBy: row['Modified By'],
      });
    });
    console.log('institutionsJSON', this.institutionsJSON)

  }

  constructor() {}

  ngOnInit() {}
}
