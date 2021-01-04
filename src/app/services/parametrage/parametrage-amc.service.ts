import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametrageAmcService {

  constructor(private http:HttpClient) { }
  url = 'http://localhost:9010/agridata-lga-backend/api/'
  getAll(){
    return this.http.get(this.url+"parametrage_amc")
  }
}
