import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QualificationPersonnelService {

 
  url = "http://agridata.hopto.org:9010/agridata-lga-backend/api/"
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(this.url+'qualification_personnel/getAll')
  }
  add(data){
    return this.http.post(this.url+'qualification_personnel/add',data)
  }
}
