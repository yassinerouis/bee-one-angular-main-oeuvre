import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeclarationRecolteService {

  url="http://localhost:9010/agridata-lga-backend/api/declatationRecolte/";

  constructor(private http:HttpClient) {
   }
   getDetailsDeclarationForProductAndPeriode(filtre){
     console.log({IDFerme:10002,IDParcelle:filtre.parcelle,debut:filtre.debut,fin:filtre.fin})
    return this.http.post(this.url+'getDetailForProductAndPeriod',{IDFerme:10002,IDParcelle:filtre.parcelle,debut:filtre.debut,fin:filtre.fin})
  }
   getDetailsDeclarationRecolte(){
     return this.http.get(this.url+'getDetailsDeclarationsRecolte')
   }
   getDetailDeclarationRecolte(ID){
    return this.http.get(this.url+'getDetailDeclarationRecolte/'+ID)
  }
   getDeclarationRecolte(){
    return this.http.get(this.url+'getDeclarationsRecolte')
  }
   addDeclarationRecolte(declaration){
     console.log(declaration)
      return this.http.post(this.url+"createDeclarationRecolte",declaration)
   }
   updateDeclarationRecolte(declaration){
    return this.http.post(this.url+"updateDeclarationRecolte",declaration)
 }
   deleteDeclarationRecolte(id){
    return this.http.delete(this.url+"deleteDeclarationRecolte/"+id)
 }
 deleteDeclarationsRecolte(ids){
  return this.http.post(this.url+"deleteDeclarationsRecolte",{ids:ids})
}
}
