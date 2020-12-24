import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeclarationRecolteService {

  url="http://localhost:9010/agridata-lga-backend/api/declatationRecolte/";

  constructor(private http:HttpClient) {
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
      return this.http.post(this.url+"createDeclarationRecolte",declaration)
   }
   updateDeclarationRecolte(declaration){
    return this.http.post(this.url+"updateDeclarationRecolte",declaration)
 }
   deleteDeclarationRecolte(id){
    return this.http.delete(this.url+"deleteDeclarationRecolte/"+id)
 }
}
