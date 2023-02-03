import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-convertAgreementsToSchema',
  templateUrl: './convertAgreementsToSchema.component.html',
  styleUrls: ['./convertAgreementsToSchema.component.css'],
})
export class ConvertAgreementsToSchemaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  _fileToConvert: any;
  @Input() set fileToConvert(val: any) {
    console.log('agreements data received for conversion', val);
    this._fileToConvert = val;
  }

  partner_agreementsJSON: { [k: string]: any }[] = [];
  agreement_pathwaysJSON: { [k: string]: any }[] = [];
  pathway_mappingsJSON: { [k: string]: any }[] = [];
  applied_creditsJSON: { [k: string]: any }[] = [];
  convertToAgreementSchema() {
    this.partner_agreementsJSON = [];
    this.agreement_pathwaysJSON = [];
    this.pathway_mappingsJSON = [];
    this.applied_creditsJSON = [];
    this._fileToConvert.forEach((row: any, rowIndex: number) => {
      if (row.ID.length > 0) {
        row.Applied.forEach((item: any, itemIndex: number) => {
          this.applied_creditsJSON.push({
            id: parseInt(row.ID.toString() + itemIndex.toString()),
            agreementId: row.ID,
            PAMS_programId: item.ProgramId,
            appliedCreditsCategory: item.Apply,
            crediteEarned: item.Earned
          })
        })

        this.partner_agreementsJSON.push({
          id: row.ID,
          name: row.Name,
          institution: row.Institution,
          college: row.College,
          published: row.Published,
          status: row.Status,
          rejectionComments: row.RejectionComments,
          notesForApprover: row.NotesForApprover,
          programNotes: row.ProgramNotes,
          institutionNotes: row.InstitutionNotes,
          createdDate: row.CreatedDate,
          createdBy: row.CreatedBy,
          modifiedDate: row.ModifiedDate,
          modifiedBy: row.ModifiedBy,
        });
        if (
          row.Pathways &&
          (typeof row.Pathways !== 'string' || row.Pathways === '[]')
        ) {
          if (typeof row.Pathways === 'string') {
            row.Pathways = JSON.parse(row.Pathways);
          }
          try {
            row.Pathways.forEach((pathway: any, pathwayIndex: number) => {
              this.agreement_pathwaysJSON.push({
                id: parseInt(row.ID.toString() + pathway.CourseId.toString()),
                agreementId: row.ID,
                PAMS_courseCode: pathway.CourseCode,
                createdDate: row.CreatedDate,
                createdBy: row.CreatedBy,
                modifiedDate: row.ModifiedDate,
                modifiedBy: row.ModifiedBy,
              });

              if (pathway.Value) {
                Object.keys(pathway.Value).forEach(
                  (value: any, valueIndex: number) => {
                    this.pathway_mappingsJSON.push({
                      id: parseInt(
                        row.ID.toString() +
                          pathway.CourseId.toString() +
                          valueIndex.toString()
                      ),
                      pathwayId: parseInt(
                        row.ID.toString() + pathway.CourseId.toString()
                      ),
                      PAMS_programId: value,
                      partnerCourse: pathway.Value[value],
                      createdDate: row.CreatedDate,
                      createdBy: row.CreatedBy,
                      modifiedDate: row.ModifiedDate,
                      modifiedBy: row.ModifiedBy,
                    });
                  }
                );
              }
            });
          } catch (e) {
            console.log('error on row', e, row);
          }
        } else {
          console.log('error on row', row);
        }
      }
    });
    console.log('agreements', this.partner_agreementsJSON);
    console.log('pathways', this.agreement_pathwaysJSON);
    console.log('mappings', this.pathway_mappingsJSON);
  }
}
