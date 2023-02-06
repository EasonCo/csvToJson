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

  @ViewChild('pathwaysInput') pathwaysInput: any;
  @ViewChild('pathwaysConverter') pathwaysConverter: any;
  @ViewChild('transferGuidelinesInput') transferGuidelinesInput: any;
  
  
  
  @ViewChild('statesInput') statesInput: any;
  @ViewChild('stateConverter') stateConverter: any;

  @ViewChild('shareInstitutionsInput') shareInstitutionsInput: any;
  @ViewChild('partnerInstitutionsInput') partnerInstitutionsInput: any;
  @ViewChild('institutionsConverter') institutionsConverter: any;
  

  // logStuff() {console.log(JSON.stringify(this.agreementsInput.textAsJson))}

  _displaySaveFile = false;
  displaySaveFile(manual?: boolean) {
    if (manual === false || manual === true) {
      this._displaySaveFile = manual;
    } else {
      this._displaySaveFile = !this._displaySaveFile;
    }
  }
}
