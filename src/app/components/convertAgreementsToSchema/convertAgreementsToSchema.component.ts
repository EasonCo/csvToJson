import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-convertAgreementsToSchema',
  templateUrl: './convertAgreementsToSchema.component.html',
  styleUrls: ['./convertAgreementsToSchema.component.css'],
})
export class ConvertAgreementsToSchemaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  _filesToConvert: any;
  @Input() set filesToConvert(val: any) {
    console.log('Transfer Guidelines data received for conversion', val);
    this._filesToConvert = val;
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
    this._filesToConvert.agreements.forEach((row: any, rowIndex: number) => {
      let appliedCreditsId: number;
      if (row.ID.length > 0) {
        row.Applied.forEach((item: any, itemIndex: number) => {
          let programCode = 'legacy - ' + item.ProgramId.toString();
          this._filesToConvert.programs.every((programRow: any) => {
            if (parseInt(programRow.id) === item.ProgramId) {
              programCode = programRow['PAMS_programCode'];
              return false;
            }
            return true;
          });
          this.applied_creditsJSON.push({
            id: parseInt(row.ID.toString() + itemIndex.toString()),
            agreementId: row.ID,
            PAMS_programCode: programCode,
            appliedCreditsCategory: item.Apply,
            crediteEarned: item.Earned,
            createdDate: row.Created,
            createdBy: row['Created By'],
            modifiedDate: row.Modified,
            modifiedBy: row['Modified By'],
          });
        });
        let collegeAbbrev: string = '';
        this._filesToConvert.colleges.forEach((collegesRow: any) => {
          let collegesShorts = [
            'business',
            'teachers',
            'health',
            'information',
          ];
          collegesShorts.every((short: string) => {
            if (
              row.College.toLowerCase().includes(short) &&
              collegesRow.name.toLowerCase().includes(short)
            ) {
              collegeAbbrev = collegesRow['PAMS_collegeAbbrev'];
              return false;
            }
            return true;
          });

          // switch(true) {
          //   case(row.College.toLowerCase().includes('business') && collegesRow.name.toLowerCase().includes('business')): {
          //     collegeAbbrev = 'BU';
          //     break;
          //   }
          //   case(row.College.toLowerCase().includes('teachers')): {
          //     collegeAbbrev = 'TC';
          //     break;
          //   }
          //   case(row.College.toLowerCase().includes('health')): {
          //     collegeAbbrev = 'HE';
          //     break;
          //   }
          //   case(row.College.toLowerCase().includes('information')): {
          //     collegeAbbrev = 'IT';
          //     break;
          //   }
          //   default: {
          //     collegeAbbrev = '';
          //   }
          // }
        });
        this.partner_agreementsJSON.push({
          id: row.ID,
          name: row.Name,
          institution: row.Institution,
          PAMS_collegeAbbreviation: collegeAbbrev,
          published: row.Published,
          status: row.Status,
          rejectionComments: row.RejectionComments,
          notesForApprover: row.NotesForApprover,
          programNotes: row.ProgramNotes,
          institutionNotes: row.InstitutionNotes,
          createdDate: row.Created,
          createdBy: row['Created By'],
          modifiedDate: row.Modified,
          modifiedBy: row['Modified By'],
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
                PAMS_bannerCode: pathway.CourseCode,
                createdDate: row.Created,
                createdBy: row['Created By'],
                modifiedDate: row.Modified,
                modifiedBy: row['Modified By'],
              });

              if (pathway.Value) {
                Object.keys(pathway.Value).forEach(
                  (value: any, valueIndex: number) => {
                    let programCode = 'legacy - ' + value;
                    this._filesToConvert.programs.every((programRow: any) => {
                      if (programRow.id === value) {
                        programCode = programRow['PAMS_programCode'];
                        return false;
                      }
                      return true;
                    });

                    this.pathway_mappingsJSON.push({
                      id: parseInt(
                        row.ID.toString() +
                          pathway.CourseId.toString() +
                          valueIndex.toString()
                      ),
                      pathwayId: parseInt(
                        row.ID.toString() + pathway.CourseId.toString()
                      ),
                      PAMS_programCode: programCode,
                      partnerCourse: pathway.Value[value],
                      createdDate: row.Created,
                      createdBy: row['Created By'],
                      modifiedDate: row.Modified,
                      modifiedBy: row['Modified By'],
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
    console.log('credits', this.applied_creditsJSON);
  }
}
