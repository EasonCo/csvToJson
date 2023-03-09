import { Component, Input, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-saveFile',
  templateUrl: './saveFile.component.html',
  styleUrls: ['./saveFile.component.css'],
})
export class SaveFileComponent implements OnInit {
  // @ts-ignore
  searchControl: FormControl;
  error = false;
  // @ts-ignore
  _fileContent: { file: any; name: string }[] = [];
  _fileContent2: { file: any; name: string }[] = [];
  _fileContent3: { file: any; name: string }[] = [];
  @Input() set fileContent(val: { file: any; name: string }[]) {
    console.log('gotData', val);
    val.forEach((item) => {
      let targetName = 'fileContent';
      let target = this._fileContent;
      if (item.name === 'pathway_mappings') {
        targetName = 'fileContent2';
        target = this._fileContent2;
      }
      if (item.file) {
        try {
          let filesList: any[] = [];
          const chunkSize = 100000;
          for (let i = 0; i < item.file.length; i += chunkSize) {
            filesList.push(item.file.slice(i, i + chunkSize));
            // do whatever
          }

          if (filesList.length > 1) {
            filesList.forEach((subFile: any, index: number) => {
              if (
                (targetName === 'fileContent2' ||
                  targetName === 'fileContent3') &&
                index > 10
              ) {
                targetName = 'fileContent3';
                target = this._fileContent3;
              }
              console.log(
                'attempting to push ',
                item.name,
                ' subFile',
                index,
                '->',
                subFile
              );
              let valueMap = this.mapTehVals([subFile], item);
              //let fileAsString = this.mapTehVals([subFile], item);
              let fileAsString = valueMap[0];
              let updateString = valueMap[1];
              target.push({
                // file: JSON.stringify(item.file),
                file: fileAsString.endsWith(';') ? fileAsString : fileAsString + ' AS new ON DUPLICATE KEY UPDATE' + updateString + ';',
                name: item.name + '_' + index.toString(),
              });
              console.log(
                'pushed ' +
                  item.name +
                  '_' +
                  index.toString() +
                  ' to ' +
                  targetName
              );
            });
          } else {
            let valueMap = this.mapTehVals(filesList, item);
            // let fileAsString = this.mapTehVals(filesList, item).replace(/,\s*$/, "");
            let fileAsString = valueMap[0].replace(/,\s*$/, "");
            let updateString = valueMap[1];
            target.push({
              file: fileAsString.endsWith(';') ? fileAsString : fileAsString + ' AS new ON DUPLICATE KEY UPDATE' + updateString + ';',
              name: item.name,
            });
          }
        } catch (e) {
          console.log('failed to push ', item.name, ' - ', e);
        }
      }
    });

    val.forEach((item: any) => {
      this.addToFilesToSaveIfNotExists(item.name);
    });
    console.log('fileContent: ', this._fileContent);
  }

  mapTehVals(filesList: any, item: any) {
    let fields: any[] = [];
    let values: any[] = [];
    let updatesArr: any[] = [];
    let updateStatement = '';
    return [filesList[0]
      .map((el: any, elIndex: number) => {
        fields = [];
        values = [];
        Object.keys(el).forEach((key: string) => {
          fields.push(key);
          if (typeof el[key] === 'string') {
            if (
              !el[key].includes('NOW()') &&
              !el[key].includes('STR_TO_DATE')
            ) {
              if (!el[key].startsWith('"')) {
                values.push('"' + el[key] + '"');
              } else {
                values.push(el[key]);
              }
            } else {
              values.push(el[key]);
            }
          } else {
            if (typeof el[key] === 'object') {
              try {
                values.push('"' + JSON.stringify(el[key]).replaceAll(`"`, `\\"`) + '"');
              } catch (e) {
                console.log(e);
                values.push(el[key]);
              }
            } else {
              values.push(el[key]);
            }
          }
        });
        // if(elIndex % 500 === 0) {}

        let modCheck = elIndex % 500
        updatesArr = [];
        updateStatement = '';
        fields.forEach((field: string) => {
          updatesArr.push(' ' + field + ' = new.' + field);
        })
        updateStatement = updatesArr.join(' ,')
        switch(modCheck) {
          case 0: {
            return (
              'INSERT INTO partners.' +
              item.name +
              '(' +
              fields.join(',') +
              ') VALUES (' +
              values.join(',').replaceAll('\n', ' ') +
              '),'
            );
            break;
          }
          case 499: {
            return (
              '(' +
              values.join(',').replaceAll('\n', ' ') +
              // ');'
              ') AS new ON DUPLICATE KEY UPDATE' + updateStatement + ';'
            );
            break;
          }
          default: {
            return (
              '(' +
              values.join(',').replaceAll('\n', ' ') +
              '),'
            );
            break;
          }
        }

        //   joiner = ',\n';
        // return (
        //   'INSERT IGNORE INTO partners.' +
        //   item.name +
        //   '(' +
        //   fields.join(',') +
        //   ') VALUES (' +
        //   values.join(',').replaceAll('\n', ' ') +
        //   ')'
        // );

      })
      .join('\n'), updateStatement];
  }

  selectAll(e: any) {
    let inputs = document.querySelectorAll("input[type='checkbox']");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].id !== 'all') {
        let el = inputs[i] as HTMLInputElement;
        el.checked = e.target.checked;
      }
    }
    if (e.target.checked) {
      this._fileContent?.forEach((file: any) => {
        this.addToFilesToSaveIfNotExists(file.name);
        this.filesToSave[file.name].checked = e.target.checked;
      });
      this._fileContent2?.forEach((file: any) => {
        this.addToFilesToSaveIfNotExists(file.name);
        this.filesToSave[file.name].checked = e.target.checked;
      });
      this._fileContent3?.forEach((file: any) => {
        this.addToFilesToSaveIfNotExists(file.name);
        this.filesToSave[file.name].checked = e.target.checked;
      });
    } else {
      this.filesToSave = {};
    }
  }

  filesToSave: { [k: string]: { checked: boolean; saveName: string } } = {};
  markForSave(e: any, name: string) {
    console.log('e', e.target.checked);
    this.addToFilesToSaveIfNotExists(name);
    this.filesToSave[name].checked = e.target.checked;
    console.log('markedForSave', this.filesToSave);
    console.log('_fileContent', this._fileContent);
  }
  setFileName(e: any, name: string) {
    console.log('setFileName -> ', e, ' - ', name);
    console.log(e.target.value);
    this.addToFilesToSaveIfNotExists(name);
    let tehName = name;
    if (e.target.value && e.target.value.length > 2) {
      tehName = e.target.value;
    } else {
      tehName = name;
    }
    this.filesToSave[name].saveName = tehName + Date.now().toString() + '.sql';
    console.log('filesToSave', this.filesToSave);
  }
  addToFilesToSaveIfNotExists(name: string) {
    if (!Object.keys(this.filesToSave).includes(name)) {
      this.filesToSave[name] = {
        checked: false,
        saveName: name + '-' + Date.now().toString() + '.sql',
      };
    }
  }

  saveAsProject() {
    //you can enter your own file name and extension
    if (this.fileName1.length > 0 && this._fileContent) {
      // console.log(this._fileContent)
      this.writeContents(this._fileContent, this.fileName1, 'text/plain');
    } else {
      this.error = true;
    }
  }

  saveFiles() {
    console.log('filesToSave', this.filesToSave);
    console.log('_fileContent', this._fileContent);
    console.log('_fileContent2', this._fileContent2);
    console.log('_fileContent3', this._fileContent3);

    this._fileContent?.forEach((file: any) => {
      if (this.filesToSave[file.name]?.checked === true) {
        this.writeContents(
          file.file,
          this.filesToSave[file.name].saveName,
          'text/plain'
        );
      }
    });
    this._fileContent2?.forEach((file: any) => {
      if (this.filesToSave[file.name]?.checked === true) {
        this.writeContents(
          file.file,
          this.filesToSave[file.name].saveName,
          'text/plain'
        );
      }
    });
    this._fileContent3?.forEach((file: any) => {
      if (this.filesToSave[file.name]?.checked === true) {
        this.writeContents(
          file.file,
          this.filesToSave[file.name].saveName,
          'text/plain'
        );
      }
    });
  }

  writeContents(content: any, fileName: any, contentType: any) {
    var a = document.createElement('a');
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  fileName1: string = '';
  debounce = 250;
  ngOnInit() {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((query) => {
        this.error = false;
        this.fileName1 = query + '.sql';
        console.log(this.fileName1);
      });
  }
}
