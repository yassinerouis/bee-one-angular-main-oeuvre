import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OuvriersService {
  url = "http://agridata.hopto.org:9010/agridata-lga-backend/api/"
  
  constructor(private http:HttpClient){
    console.log(this.url)
  }
  getCaporal(){
    return this.http.get(this.url+"main_oeuvre_ouvriers/getCaporals")
  }
  getOuvriers(data){
    return this.http.post(this.url+"personnel_ouvrier/getOuvriers",data)
  }
  getOuvrier(ID){
    return this.http.get(this.url+"personnel_ouvrier/getOne/"+ID)
  }
  getMatricule(Mat){
    return this.http.get(this.url+"personnel_ouvrier/getWithMatricule/"+Mat)
  }
  getTotalRecords(option1,option2){
    return this.http.post(this.url+"personnel_ouvrier/getLength",{option1:option1,option2:option2})
  }
  getFermes(ID){
    return this.http.get(this.url+"personnel_ouvrier/getFermes/"+ID)
  }
  getSocietes(ID){
    return this.http.get(this.url+"personnel_ouvrier/getSocietes/"+ID)
  }
  getPrimes(ID){
    return this.http.get(this.url+"personnel_ouvrier/getPrimes/"+ID)
  }
  deleteOuvrier(id){
    return this.http.delete(this.url+"personnel_ouvrier/"+id)
  }
  deleteOuvriers(ids){
    return this.http.post(this.url+"personnel_ouvrier/delete",{ids:ids})
  }
  addOuvrier(data){
    return this.http.post(this.url+"personnel_ouvrier",data)
  }
  updateOuvrier(data){
    return this.http.put(this.url+"personnel_ouvrier/update",data)
  }
}
