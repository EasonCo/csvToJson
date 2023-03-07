import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'csvToJson';

  @ViewChild('agreementsInput') agreementsInput: any;
  @ViewChild('agreementConverter') agreementConverter: any;

  @ViewChild('collegesInput') collegesInput: any;
  @ViewChild('collegesConverter') collegesConverter: any;

  @ViewChild('programsInput') programsInput: any;
  @ViewChild('programsConverter') programsConverter: any;

  @ViewChild('pathwaysInput') pathwaysInput: any;
  @ViewChild('pathwaysConverter') pathwaysConverter: any;
  @ViewChild('transferGuidelinesInput') transferGuidelinesInput: any;

  @ViewChild('statesInput') statesInput: any;
  @ViewChild('stateConverter') stateConverter: any;

  @ViewChild('shareInstitutionsInput') shareInstitutionsInput: any;
  @ViewChild('partnerInstitutionsInput') partnerInstitutionsInput: any;
  @ViewChild('institutionsConverter') institutionsConverter: any;

  // logStuff() {console.log(JSON.stringify(this.agreementsInput.textAsJson))}

  displaySaveFile(manual: boolean) {
    if (manual === false || manual === true) {
      this._displaySaveFile1 = manual;
      this._displaySaveFile2 = manual;
      this._displaySaveFile3 = manual;

    }
  }

  _displaySaveFile1 = false;
  displaySaveFile1(manual?: boolean) {
    this._displaySaveFile2 = false;
    this._displaySaveFile3 = false;

    setTimeout(() => {
      if (manual === false || manual === true) {
        this._displaySaveFile1 = manual;
      } else {
        this._displaySaveFile1 = !this._displaySaveFile1;
      }
    });
  }

  _displaySaveFile2 = false;
  displaySaveFile2(manual?: boolean) {
    this._displaySaveFile1 = false;
    this._displaySaveFile3 = false;

    setTimeout(() => {
      if (manual === false || manual === true) {
        this._displaySaveFile2 = manual;
      } else {
        this._displaySaveFile2 = !this._displaySaveFile2;
      }
    });
  }


  _displaySaveFile3 = false;
  displaySaveFile3(manual?: boolean) {
    this._displaySaveFile1 = false;
    this._displaySaveFile2 = false;

    setTimeout(() => {
      if (manual === false || manual === true) {
        this._displaySaveFile3 = manual;
      } else {
        this._displaySaveFile3 = !this._displaySaveFile3;
      }
    });
  }
}
