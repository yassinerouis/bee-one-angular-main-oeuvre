import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NiveauScolaireService {

  url = "http://localhost:9010/agridata-lga-backend/api/"
  constructor(private http:HttpClient) { }
  getAll(){
    return this.http.get(this.url+'niveau_scolaire/getAll')
  }
  add(data){
    return this.http.post(this.url+'niveau_scolaire/add',data)
  }
}
