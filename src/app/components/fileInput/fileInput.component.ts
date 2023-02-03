import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fileInput',
  templateUrl: './fileInput.component.html',
  styleUrls: ['./fileInput.component.css'],
})
export class FileInputComponent implements OnInit {
  constructor() {}
  fileNameDisplay = '';
  getFile() {
    this.input.nativeElement.click();
  }

  _buttonText = 'Choose a File';
  @Input() set buttonText(val: string) {
    this._buttonText = val;
  }
  _logic = 'agreements';
  @Input() set logic(val: string) {
    this._logic = val.toLowerCase();
  }
  @ViewChild('input') input: any;
  ngOnInit() {}
  tehText = '';
  reader = new FileReader();
  textAsJson: { [k: string]: any }[] = [];
  newFields: { [k: string]: any } = {};
  fieldTemplates: { [k: string]: any } = {};
  rowsConverted: number = 0;
  onInput(e: any) {
    if (this.input.nativeElement.files.length > 0) {
      this.fileNameDisplay = this.input.nativeElement.files[0].name;
    }
    this.textAsJson = [];
    // console.log(e)
    this.reader.readAsText(e.files[0]);
    if (this._logic === 'agreements') {
      this.agreementsLogic();
    }
    if (this._logic === 'vanilla') {
      this.vanillaLogic();
    }
    // console.log('fieldTemplates', this.fieldTemplates);
    // console.log('textAsJson', this.textAsJson);
  }
  vanillaLogic() {
    this.reader.onload = () => {
      let text = this.reader.result as string;
      this.tehText = text as string;

      if (text) {
        text.split(/[\r\n]+/).forEach((line: string, lineIndex: number) => {
          line.split(',').forEach((item: string, itemIndex: number) => {
            if (lineIndex === 0) {
              this.fieldTemplates[itemIndex] = item;
            } else {
              this.newFields[this.fieldTemplates[itemIndex]] = item;
            }
          });
          if (lineIndex > 0) {
            this.textAsJson.push(this.newFields);
          }
          this.newFields = {};
          this.rowsConverted = lineIndex;
        });
      }
    };
  }
  agreementsLogic() {
    this.reader.onload = () => {
      let text = this.reader.result as string;
      this.tehText = text as string;

      let buildingAnArr = false;
      let buildingAString = false;
      let itemValue = '';
      let lineNumber = 0;
      let itemNumber = 0;
      let delimiter = '';

      if (text) {
        text.split(/[\r\n]+/).forEach((line: string, lineIndex: number) => {
          line.split(',').forEach((item: string, itemIndex: number) => {
            if (buildingAnArr) {
              if (!item.endsWith(']"')) {
                itemValue = itemValue + ',' + item.replace(']"', ']');
              } else {
                buildingAnArr = false;
                itemValue = itemValue + ',' + item;
                this.newFields[this.fieldTemplates[itemNumber]] = JSON.parse(
                  itemValue.replace(/""/g, '"').replace(']"', ']')
                );
                itemNumber += 1;
                itemValue = '';
              }
            } else {
              if (buildingAString) {
                if (!item.endsWith('"') || item.endsWith('""')) {
                  itemValue = itemValue + delimiter + item;
                } else {
                  buildingAString = false;
                  itemValue = itemValue + delimiter + item;
                  if (delimiter === ',') {
                    try {
                      this.newFields[this.fieldTemplates[itemNumber]] =
                        JSON.parse(
                          itemValue.replace('",', '[').replace(',"', ']')
                        );
                    } catch (e) {
                      this.newFields[this.fieldTemplates[itemNumber]] =
                        undefined;
                      console.log(
                        'error processing ' +
                          lineNumber +
                          ' item ' +
                          itemNumber,
                        e,
                        ' unparsable value found: ',
                        itemValue.replace('",', '[').replace(',"', ']')
                      );
                    }
                  } else {
                    this.newFields[this.fieldTemplates[itemNumber]] = itemValue
                      .replace('",', '[')
                      .replace(',"', ']');
                  }
                  itemNumber += 1;
                  itemValue = '';
                }
              } else {
                if (item.startsWith('"[') && !item.endsWith(']"')) {
                  buildingAnArr = true;
                  itemValue = itemValue + item.replace('"[', '[');
                } else {
                  if (
                    (item.startsWith('"') &&
                      (!item.endsWith('"') || item.endsWith('""'))) ||
                    (item.startsWith('"') && item.length === 1)
                  ) {
                    if (item.length === 1) {
                      delimiter = ',';
                    } else {
                      delimiter = '\n';
                    }
                    buildingAString = true;
                    itemValue = itemValue + item;
                  } else {
                    if (lineNumber === 0) {
                      this.fieldTemplates[itemNumber] = item;
                    } else {
                      this.newFields[this.fieldTemplates[itemNumber]] = item;
                    }
                    itemNumber += 1;
                  }
                }
              }
            }
          });
          if (!buildingAString && !buildingAnArr) {
            if (lineNumber > 0) {
              this.textAsJson.push(this.newFields);
            }
            this.newFields = {};
            lineNumber += 1;
            itemNumber = 0;
            this.rowsConverted = lineNumber;
          }
        });
      }
    };
  }
}
