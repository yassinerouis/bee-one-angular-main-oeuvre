import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrimesService {
  url = "http://agridata.hopto.org:9010/agridata-lga-backend/api/"
  constructor(private http:HttpClient) { }
  getPrimes(){
    return this.http.get(this.url+"primes")
  }
}
