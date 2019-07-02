import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SerializerService {

  constructor() { }

  public serialize(data: any, name: string) {
    const str = JSON.stringify(data);
    const objURL = this.createObjectURL(str);
    const elem = window.document.createElement('a');
    elem.href = objURL
    elem.download = `${name}.json`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  public async deserialize(file: File): Promise<object> {
    return new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const obj = JSON.parse(fileReader.result as string);
        res(obj);
      };
      fileReader.readAsText(file);
    });
  }

  private createObjectURL(data: string): string {
    const blob = new Blob([data], {type: 'application/json'});
    const objURL = window.URL.createObjectURL(blob);
    return objURL;
  }
}
