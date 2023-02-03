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
  @Input() set fileContent(val: { file: any; name: string }[]) {
    console.log('gotData', val);
    val.forEach((item) => {
      if (item.file) {
        this._fileContent.push({
          file: JSON.stringify(item.file),
          name: item.name,
        });
      }
    });

    val.forEach((item: any) => {
      this.addToFilesToSaveIfNotExists(item.name);
    });
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
    this.filesToSave[name].saveName = tehName + Date.now().toString() + '.json';
    console.log('filesToSave', this.filesToSave);
  }
  addToFilesToSaveIfNotExists(name: string) {
    if (!Object.keys(this.filesToSave).includes(name)) {
      this.filesToSave[name] = {
        checked: false,
        saveName: name + Date.now().toString() + '.json',
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
    this._fileContent.forEach((file: any) => {
      if (this.filesToSave[file.name].checked === true) {
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
        this.fileName1 = query + '.json';
        console.log(this.fileName1);
      });
  }
}
