import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriePersonnelService {

  url = "http://localhost:9010/agridata-lga-backend/api/"
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(this.url+'categorie_personnel/getAll')
  }
  add(data){
    return this.http.post(this.url+'categorie_personnel/add',data)
  }
}
