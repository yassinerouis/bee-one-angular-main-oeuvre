import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocieteFermeService {
  url = "http://agridata.hopto.org:9010/agridata-lga-backend/api/"
  constructor(private http:HttpClient) { }
  getSocietes(){
    return this.http.get(this.url+"get_societe")
  }
  getFermesSociete(societe){
    return this.http.get(this.url+"fermes/fermesBySociete/"+societe)
  }
}
