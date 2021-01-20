import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  url = "http://localhost:9010/agridata-lga-backend/api/"

  constructor(private http:HttpClient) { }

  getWithFilter(filter){
    return this.http.post(this.url+'mainoeuvre_presence/getAll',filter)
  }
  getAll(){
    return this.http.get(this.url+'mainoeuvre_presence/')
  }
  getLength(filter){
    return this.http.post(this.url+'mainoeuvre_presence/getLength',filter)
  }
  deleteOne(id){
    return this.http.post(this.url+'mainoeuvre_presence/deleteOne',{ID:id})
  }
  delete(ids){
    return this.http.post(this.url+'mainoeuvre_presence/delete',ids)
  }
}
