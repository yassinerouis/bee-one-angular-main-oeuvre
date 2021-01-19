import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SqlRequestService {

  constructor() { }
  filter=''
  filterLike=''
  getDataGlobalSearchLike(selectedColumns,globalSearch){
    this.filter=''
    selectedColumns.forEach(element => {
      if(selectedColumns.length-1==selectedColumns.indexOf(element) && element.field!='En_exercice' 
      && element.field!='Contractuel' && element.field!='formation_phyto'){
          this.filter+=' '+element.field+" like '%"+globalSearch+"%' "
      }else if(selectedColumns.length-1!=selectedColumns.indexOf(element) && element.field!='En_exercice' 
      && element.field!='Contractuel' && element.field!='formation_phyto'){
          this.filter+=' '+element.field+" like '%"+globalSearch+"%' or"
      }
    }); 
    return this.filter;
  }
  getDetailsFilter(filters){
    var filterLike = ''
    if(filters){
    Object.keys(filters).forEach(function(key,index) {
      filters[key].forEach(element => {
        if(element.value){
          if(element.matchMode=='startsWith'){
            filterLike+=key +" like '"+element.value+"%' and "
          }
          else if(element.matchMode=='endsWith'){
            filterLike+=key +" like '%"+element.value+"' and "
          }
          else if(element.matchMode=='contains'){
           filterLike+=key +" like '%"+element.value+"%' and "
           }else if(element.matchMode=='notContains'){
             filterLike+=key +" not like '%"+element.value+"%' and "
           }else if(element.matchMode=='equals'){
             filterLike+=key +" like '"+element.value+"' and "
           }else if(element.matchMode=='notEquals'||element.matchMode=='isNot'){
             filterLike+=key +" not like '"+element.value+"' and "
           }
           else if(element.matchMode=='before'){
            filterLike+=key +" < '"+element.value+"' and "
          }else if(element.matchMode=='after'){
            filterLike+=key +" > '"+element.value+"' and "
          }
        }
      });
  });
  this.filterLike=filterLike.slice(0,-5)
}
  return this.filterLike;
  }
  /*
  getFilter(){
    console.log(this.filterLike)
    console.log(this.filter)
    if(this.filterLike &&  this.filter){
      return this.filter+" and "+this.filterLike
    }else{
      if(this.filterLike){
        return this.filterLike
      }else if(this.filter){
        return this.filter
      }else{
        return '';
      }
    }
    
  }*/
}
