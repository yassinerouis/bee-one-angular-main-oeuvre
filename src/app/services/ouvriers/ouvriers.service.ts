import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OuvriersService {
  url = "http://localhost:9010/agridata-lga-backend/api/"
  url_server ="http://agridata.hopto.org:9010/agridata-lga-backend/api/"
  constructor(private http:HttpClient) { }
  getCaporal(){
    return this.http.get(this.url+"main_oeuvre_ouvriers/getCaporals")
  }
  getOuvriers(){
    return this.http.get(this.url_server+"personnel_ouvrier")
  }
}
