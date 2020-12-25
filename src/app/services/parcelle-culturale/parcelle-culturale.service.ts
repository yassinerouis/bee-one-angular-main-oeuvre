import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ParcelleCulturaleService {
  url="http://localhost:9010/agridata-lga-backend/api/";

  constructor(private http:HttpClient) {
  }
   getParcelleCulturale(){
     return this.http.post(this.url+'get_parcelle_cultural/showWithProduit',{IDFerme:1})
   }
   getTypeProduit(id_parcelle){
      return this.http.get('http://localhost:9010/agridata-lga-backend/api/list_produit_rendement/getProductForParcelle/'+id_parcelle)
   }
}
