import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  readonly APIUrl = "http://127.0.0.1:8000"
  readonly PhotoURL = "http://127.0.0.1:8000/media/"

  constructor(private http:HttpClient) { }

  get_engine():Observable<any>{
    return this.http.get<any>(this.APIUrl + '/WartsilaEngine/')
  }

  get_engine_filter(val:any):Observable<any>{
    return this.http.get<any>(this.APIUrl + '/WartsilaEngineFilter/' + val)
  }

  get_spare_parts():Observable<any>{
    return this.http.get<any>(this.APIUrl + '/SpareParts/')
  }

  get_spare_parts_filter_by_engineID(val:any):Observable<any>{
    return this.http.get<any>(this.APIUrl + '/SparePartsFilterByEngineID/' + val)
  }

  get_spare_parts_filter(val:any):Observable<any>{
    return this.http.get<any>(this.APIUrl + '/SparePartsFilter/' + val)
  }

}
