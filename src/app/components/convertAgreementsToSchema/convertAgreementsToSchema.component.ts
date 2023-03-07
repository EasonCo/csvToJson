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
    console.log('Agreements data received for conversion', val);
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
            agreementId: parseInt(row.ID),
            PAMS_programCode: programCode,
            appliedCreditsCategory: item.Apply ? item.Apply : '',
            creditsEarned: item.Earned ? item.Earned : 0,
            createdDate:
              'STR_TO_DATE("' +
              row.Created.replaceAll('Z', '').replaceAll('T', ' ') +
              '", "%Y-%m-%d %H:%i:%s")',
            createdBy: row['Created By'],
            modifiedDate:
              'STR_TO_DATE("' +
              row.Modified.replaceAll('Z', '').replaceAll('T', ' ') +
              '", "%Y-%m-%d %H:%i:%s")',
            modifiedBy: row['Modified By'],
            recordVersion: 1,
            activeVersion: 1,
            activeDate: 'NOW()',
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
        let tehId = '';
        if (row.Institution) {
          this._filesToConvert.institutions.every((item: any) => {
            if (item.name === row.Institution) {
              tehId = item.id;
              return false;
            } else {
              return true;
            }
          });
        } else {
          tehId = '';
        }
        if(row.RejectionComments.includes("changes didn't stick: I replaced it with")) {
          console.log({
            id: parseInt(row.ID),
            name: row.Name,
            institutionId: tehId,
            PAMS_collegeAbbrev: collegeAbbrev,
            published: row.Published.toLowerCase() === 'true' ? 1 : 0,
            status: row.Status,
            rejectionComments: row.RejectionComments ? row.RejectionComments.replaceAll('"', '\\"') : '',
            notesForApprover: row.NotesForApprover ? row.NotesForApprover.replaceAll('"', '\\"') : '',
            programNotes: typeof row.ProgramNotes === 'object' ? JSON.stringify(row.ProgramNotes).replaceAll('"', '\\"') : '',
            institutionNotes: row.InstitutionNotes ? row.InstitutionNotes.replaceAll('"', '\\"') : '',
            createdDate:
              'STR_TO_DATE("' +
              row.Created.replaceAll('Z', '').replaceAll('T', ' ') +
              '", "%Y-%m-%d %H:%i:%s")',
            createdBy: row['Created By'],
            modifiedDate:
              'STR_TO_DATE("' +
              row.Modified.replaceAll('Z', '').replaceAll('T', ' ') +
              '", "%Y-%m-%d %H:%i:%s")',
            modifiedBy: row['Modified By'],
            recordVersion: 1,
            activeVersion: 1,
            activeDate: 'NOW()',
          });
        }
        this.partner_agreementsJSON.push({
          id: parseInt(row.ID),
          name: row.Name,
          institutionId: tehId,
          PAMS_collegeAbbrev: collegeAbbrev,
          published: row.Published.toLowerCase() === 'true' ? 1 : 0,
          status: row.Status,
          rejectionComments: row.RejectionComments ? row.RejectionComments.replaceAll('"', '\\"') : '',
          notesForApprover: row.NotesForApprover ? row.NotesForApprover.replaceAll('"', '\\"') : '',
          programNotes: typeof row.ProgramNotes === 'object' ? JSON.stringify(row.ProgramNotes).replaceAll('"', '\\"') : '',
          institutionNotes: row.InstitutionNotes ? row.InstitutionNotes.replaceAll('"', '\\"') : '',
          createdDate:
            'STR_TO_DATE("' +
            row.Created.replaceAll('Z', '').replaceAll('T', ' ') +
            '", "%Y-%m-%d %H:%i:%s")',
          createdBy: row['Created By'],
          modifiedDate:
            'STR_TO_DATE("' +
            row.Modified.replaceAll('Z', '').replaceAll('T', ' ') +
            '", "%Y-%m-%d %H:%i:%s")',
          modifiedBy: row['Modified By'],
          recordVersion: 1,
          activeVersion: 1,
          activeDate: 'NOW()',
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
                agreementId: parseInt(row.ID),
                PAMS_bannerCode: pathway.CourseCode,
                createdDate:
                  'STR_TO_DATE("' +
                  row.Created.replaceAll('Z', '').replaceAll('T', ' ') +
                  '", "%Y-%m-%d %H:%i:%s")',
                createdBy: row['Created By'],
                modifiedDate:
                  'STR_TO_DATE("' +
                  row.Modified.replaceAll('Z', '').replaceAll('T', ' ') +
                  '", "%Y-%m-%d %H:%i:%s")',
                modifiedBy: row['Modified By'],
                recordVersion: 1,
                activeVersion: 1,
                activeDate: 'NOW()',
              });

              if (pathway.Value) {
                Object.keys(pathway.Value).forEach(
                  (value: any, valueIndex: number) => {
                    let programCode = 'legacy - ' + value;
                    this._filesToConvert.programs.every((programRow: any) => {
                      if (programRow.id === parseInt(value)) {
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
                      createdDate:
                        'STR_TO_DATE("' +
                        row.Created.replaceAll('Z', '').replaceAll('T', ' ') +
                        '", "%Y-%m-%d %H:%i:%s")',
                      createdBy: row['Created By'],
                      modifiedDate:
                        'STR_TO_DATE("' +
                        row.Modified.replaceAll('Z', '').replaceAll('T', ' ') +
                        '", "%Y-%m-%d %H:%i:%s")',
                      modifiedBy: row['Modified By'],
                      recordVersion: 1,
                      activeVersion: 1,
                      activeDate: 'NOW()',
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
