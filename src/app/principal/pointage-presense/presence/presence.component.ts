import { SqlRequestService } from './../../../services/sql-request/sql-request.service';
import { LazyLoadEvent } from 'primeng/api';
import { PresenceService } from './../../../services/pointage-presence/presence.service';
import { OuvriersService } from './../../../services/ouvriers/ouvriers.service';

import { LanguageService } from 'src/app/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportService } from 'src/app/services/export/export.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ParametrageAmcService } from 'src/app/services/parametrage/parametrage-amc.service';

 // Ce Component sert à la gestion de la declaration de la recolte
 am4core.useTheme(am4themes_animated);
const doc = new jsPDF()
@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss']
})
export class PresenceComponent implements OnInit {
qrCode = false
  //declaration des variables 
  ouvrier = {
    id:null,
    matricule:null,
    codeBarre:null,
    civilite:null,
    nom:null,
    prenom:null,
    cin:null,
    dateNaissance:null,
    situationFamiliale:null,
    nombreEnfants:null,
    addresse:null,
    tel:null,
    email:null,
    niveauScolaire:null,
    qualification:null,
    fonction:null,
    caporal:null,
    attache:null,
    categorie:null,
    dateEmbauche:new Date(),
    cnss:null,
    anciennete:null,
    droitConge:1.5,
    congeInitial:null,
    tauxAssurance:null,
    matriculeAMC:null,
    optionAMC:null,
    exercice:true,
    contractuel:null,
    formationPhyto:null,
    observation:null,
    salaireBase:null,
    primes:[{
      id:1,
      prime:null,
      montant:null
    }],
    unitePaiement:"1",
    representeEquipe:null,
    representeNombre:null,
    modePaiement:"1",
    banque:null,
    rib:null,
    societes:[],
    fermes:[]
  }
  consult = false
  forEdit = false
  statuses: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  listParcelles=[]
  id
  msgs=[]
  detailsDeclarations:any
  declarations:any
  declaration={date_recolte : new Date(),observations:null}
  form=false;
  cols:any
  _selectedColumns:any
  transform = true
  transformDetails = true
  selectedPresences=[]
  
  qrData = []
  
  constructor(public datepipe: DatePipe,private translateService: TranslateService,private exportService:ExportService,
    public lang:LanguageService,private parametrageAMC:ParametrageAmcService,private ouvriersService:OuvriersService,
    private presenceService:PresenceService,private sqlService: SqlRequestService) {
  }

  //pour créer une nouvelle déclaration de la récolte

  getSwalInteractions(){
    this.translateService.get(['swal']).subscribe(translations=>{
      this.swalInteractions = translations.swal
    })
  }

  vider(){
    this.ouvrier = {
      id:null,
      matricule:null,
      codeBarre:null,
      civilite:null,
      nom:null,
      prenom:null,
      cin:null,
      dateNaissance:null,
      situationFamiliale:null,
      nombreEnfants:null,
      addresse:null,
      tel:null,
      email:null,
      niveauScolaire:null,
      qualification:null,
      fonction:null,
      caporal:null,
      attache:null,
      categorie:null,
      dateEmbauche:null,
      cnss:null,
      anciennete:null,
      droitConge:1.5,
      congeInitial:null,
      tauxAssurance:null,
      matriculeAMC:null,
      optionAMC:null,
      exercice:true,
      contractuel:null,
      formationPhyto:null,
      observation:null,
      salaireBase:null,
      primes:[{
        id:1,
        prime:null,
        montant:null
      }],
      unitePaiement:"1",
      representeEquipe:null,
      representeNombre:null,
      modePaiement:"1",
      banque:null,
      rib:null,
      societes:[],
      fermes:[]
    }
  }
  save(){
    this.getSwalInteractions()
    console.log(this.ouvrier)
    /*
    this.ouvriersService.addOuvrier(this.ouvrier).subscribe(res=>{
      console.log(res)
      if(res[0].message=="ajout reussi"){
        Swal.fire(
          this.swalInteractions.ajout.titre,
          this.swalInteractions.ajout.description,
          'success'
        )
        this.showForm()
        this.ngOnInit()
      }else{
        Swal.fire({
          icon: 'error',
          title: this.swalInteractions.ajout.titreErr,
          text:  this.swalInteractions.ajout.descriptionErr
        })
      }
    },err=>console.log(err))*/
  }

@Input() get selectedColumns(): any[] {
  return this._selectedColumns;
}
get lengthColumns(){
  return this._selectedColumns.length+2;
}
set selectedColumns(val: any[]) {
  //restore original order
  this._selectedColumns = this.cols.filter(col => val.includes(col));
}
typeof(x){
  return typeof(x);
}

transformDate(ouvriers){
  let ouvriersWithTransformedDate = ouvriers
  if(this.transform){
    ouvriers.forEach(element => {      
      element.Dat_Nai = this.datepipe.transform(element.Dat_Nai, 'dd/MM/yyyy')
      element.Date_Embauche = this.datepipe.transform(element.Date_Embauche, 'dd/MM/yyyy')
    });
    this.transform=false
  }
  return ouvriersWithTransformedDate;
}

transformDateDetails(declarations){
  let declarationsWithTransformedDate = declarations
  if(this.transformDetails){
    declarationsWithTransformedDate.forEach(element => {
      console.log(element.DateRecolte)
      
      element.DateRecolte = this.datepipe.transform(element.DateRecolte, 'dd/MM/yyyy')
      console.log(element.DateRecolte)
    });
    this.transformDetails=false
  }
  return declarationsWithTransformedDate
}

ids
data = [];
swalInteractions:any
names = [];
obs
city="Espèce"
checkSoc(e,s){
  
}
checkedSocietes = []
societes = []
caporals=[]
typePaie
primes = []
displayModal1 : boolean = false;
displayModal2 : boolean = false;
displayModal3 : boolean = false;
displayModal4 : boolean = false;

niveaux=[]
qualifications=[]
categories=[]
banques=[]
fonctions=[]
niveau
qualification
categorie
fonction
addNiveau(){

}
addQualification(){

}
addCategorie(){

}
addFonction(){
  
}
showModalDialog1() {
  this.displayModal1 = true;
}
showModalDialog2() {
  this.displayModal2 = true;
}
showModalDialog3() {
  this.displayModal3 = true;
}
showModalDialog4() {
  this.displayModal4 = true;
}
filter = {from:0,to:10,option1:'',option2:''}
ouvriers:any
amc=[]
civilites = []
situations = []
presences:any = []
lowerThan12 = true
totalRecords
loadedPresences:any=[]
loadPresence(event){
  this.event.filters=event.filters
  if(event.filters && this.sqlService.getDetailsFilter(event.filters)!=''){
    this.filter.option2=this.sqlService.getDetailsFilter(event.filters)
  }else{
    this.filter.option2=''
  }
  try{
    this.loading = true;
    this.filter.from = event.first;
    this.filter.to = event.first+event.rows;
    this.getLength();
    this.getPresence();
    setTimeout(() => {
      if (this.presences) {
        this.loadedPresences = this.presences;
        this.loading = false;
      }
    }, 1000);
  }catch(err){
    console.log(err)
  }
}
presencesExport:any=[]
getLength(){
  this.presenceService.getLength(this.filter).subscribe(res=>{
    console.log(res)
    this.totalRecords=res[0].total
  })
}
getPresence(){
  console.log(this.filter)
  this.presenceService.getWithFilter(this.filter).subscribe(result=>{
    console.log(result)
    this.presences = result
  })
}
  ngOnInit() {
    this.getPresence();
    this.ouvriersService.getCaporal().subscribe(caporals=>{
      for(var i=0;i<caporals['length'];i++){
        this.caporals[i] = {label:caporals[i].mat+":"+caporals[i].nom+" "+caporals[i].prenom,value:caporals[i].id}
      }
    })
    var lazyEvent={
      first: 0,
      rows: 10,
      filters:[]
    }

    this.loadPresence(lazyEvent)
    this.selectedPresences=[]
    console.log(this.swalInteractions)
    this.ids=[]
    this.cols = [
      { field: 'Mat', header: 'matricule' },
      { field: 'Nom', header: 'nom' },
      { field: 'Prenom', header: 'prenom' },
      { field: 'Entree_Sortie', header: 'entreeSortie' },
      { field: 'Date_entree', header: 'date' },
      { field: 'Date_Sortie', header: 'date' },
      { field: 'Heure_entree', header: 'heure' },
      { field: 'Heure_sortie', header: 'heure' },
      { field: 'Caporale', header: 'filtreCaporal' }
  ];
  this._selectedColumns = [
    { field: 'Mat', header: 'matricule' },
    { field: 'Nom', header: 'nom' },
    { field: 'Prenom', header: 'prenom' },
    { field: 'Entree_Sortie', header: 'entreeSortie' },
    { field: 'Date_entree', header: 'date' },
    { field: 'Date_Sortie', header: 'date' },
    { field: 'Heure_entree', header: 'heure' },
    { field: 'Heure_sortie', header: 'heure' },
    { field: 'Caporale', header: 'filtreCaporal' }
    ];
  }

  setMyStyles() {
    let width=(100/this.selectedColumns.length)+2;
    let styles = {
      'width':width+"%",
    };
    return styles;
  }
  declarationForConsult =[]
  selectColumn(e){
    this._selectedColumns=e.value
    console.log(this.selectedColumns)
  }
  consulter(id){
  }
  //afficher la déclaration de la récolte sélectionnée dans le formulaire pour modification
  edit(id){
  }

  //annuler l'action (ajouter ou modifier)
  annuler(){
    this.vider()
    this.showForm()
    this.forEdit = false
  }
  //pour modifier la déclaration de la récolte
  update(){
    console.log(this.ouvrier)
      this.getSwalInteractions()

  }
    //pour supprimer la déclaration de la récolte
  delete(id){
    console.log(id)
    this.getSwalInteractions()
    Swal.fire({
      title: this.swalInteractions.suppression.titreVal,
      text: this.swalInteractions.suppression.descriptionVal,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: this.swalInteractions.annuler,
      confirmButtonText:  this.swalInteractions.ok
    }).then((result) => {
      if (result.value) {
        this.presenceService.deleteOne(id).subscribe(res=>{
          console.log(res)
          if(res[0].message=="ajout reussi"){
            Swal.fire(
              this.swalInteractions.suppression.titreVal,
              this.swalInteractions.modification.description,
              'success'
            )
            this.ngOnInit()
          }else{
            Swal.fire({
              icon: 'error',
              title:  this.swalInteractions.suppression.titreErr,
              text: this.swalInteractions.modification.descriptionErr,
            })
          }
        })
      }
    })
  }
  event = {first:0,rows:10,filters:[]}
  //lors du changement de la parcelle il recupère et affiche le type du produit
  onChange(e){
  }
  globalSearch=''
  onInputSearch(){
    if(this.globalSearch){
      this.filter.option1=this.globalSearch
    }else{
      this.filter.option1='';
    }
    this.loadPresence(this.event)
  }
  // Début exportation des déclaration de la récolte
 async exportPdf() {
    let columns=[
      { dataKey: 'Mat', header: 'Matricule' },
      { dataKey: 'Nom', header: 'Nom' },
      { dataKey: 'Prenom', header: 'Prénom' },
      { dataKey: 'Entree_Sortie', header: 'Entrée sortie' },
      { dataKey: 'Date_entree', header: 'Date entrée' },
      { dataKey: 'Date_Sortie', header: 'Date sortie' },
      { dataKey: 'Heure_entree', header: 'Heure entrée' },
      { dataKey: 'Heure_sortie', header: 'Heure sortie' },
      { dataKey: 'Caporale', header: 'Filtre du caporal' }
    ]
    this.presenceService.getAll().subscribe(res=>{
      this.presencesExport = res
      this.exportService.setTable(this.transformDate(this.presencesExport))
      this.exportService.exportPdf(columns,'presences.pdf')
    })
  }
  printPdf(){
    let columns=[
      { dataKey: 'Mat', header: 'Matricule' },
      { dataKey: 'Nom', header: 'Nom' },
      { dataKey: 'Prenom', header: 'Prénom' },
      { dataKey: 'Entree_Sortie', header: 'Entrée sortie' },
      { dataKey: 'Date_entree', header: 'Date entrée' },
      { dataKey: 'Date_Sortie', header: 'Date sortie' },
      { dataKey: 'Heure_entree', header: 'Heure entrée' },
      { dataKey: 'Heure_sortie', header: 'Heure sortie' },
      { dataKey: 'Caporale', header: 'Filtre du caporal' }
    ]
      this.exportService.setTable(this.transformDate(this.presences))
      this.exportService.printPdf(columns)
  }
  fields= [ 'Mat'  ,
    'Nom', ,
    'Prenom',
    'CIN',
    'Tel', 
    'Email',
    'Civilite', 
    'Adr', 
    'Dat_Nai', 
    'Situ_Fam', 
    'NBEnft', 
    'Niveau_scolaire',
    'attache',
    'Droit_conge',
    'Taux_assurance',
    'AMC', 
    'formation_phyto',
    'Prime_motivation',
    'Contractuel', 
    'Type_Paie',
    'Banque',
    'Banque_Compte',
    'Fonction_Personnel',
    'Categ',
    'Qualification', 
    'Date_Embauche',
    'CNSS',
    'Pers_Ancte',
    'En_exercice',
    'Salaire_Base']
  async exportExcel() {
    let table = []
    this.presenceService.getAll().subscribe(res=>{
      this.presencesExport = res
    for(var i=0;i<this.transformDate(this.presencesExport).length;i++){
      table[i]={
        'Matricule': this.presencesExport[i].Mat,
        'Nom':this.presencesExport[i].Nom,
        'Prénom':this.presencesExport[i].Prenom,
        'Entrée sortie':this.presencesExport[i].Entree_Sortie,
        'Date entrée':this.presencesExport[i].Date_entree,
        'Date sortie':this.presencesExport[i].Date_Sortie,
        'Heure entrée': this.presencesExport[i].Heure_entree,
        'Heure sortie': this.presencesExport[i].Heure_sortie,
        'Filtre du caporal':this.presencesExport[i].Caporale
      }
    }
    this.exportService.exportExcel('presences',table)
  })
  }
    generateQR(){
      this.selectedPresences.forEach(element=>{
        this.exportService.printQR()
      })
    }
  //Ajouter un nouveau élément à la table si l'élément courant est valide
  addItem(){
    this.getSwalInteractions()
    if(this.ouvrier.primes[this.ouvrier.primes.length-1].prime&&this.ouvrier.primes[this.ouvrier.primes.length-1].montant){
      this.ouvrier.primes.push({
        id:this.ouvrier.primes.length+1,
        prime:null,
        montant:null
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: this.swalInteractions.erreur,
        text: this.swalInteractions.champsObligatoires
      }
      )
    }  
  }
  //supprimer un élément de la table s'il n'est pas le seul, et s'il est le seul on le vide
  removeItem(parcelle){
    console.log(this.ouvrier.primes.indexOf(parcelle))
    if(this.ouvrier.primes.length==1){
      this.ouvrier.primes[0]={
        id:this.ouvrier.primes.length,
        prime:null,
        montant:null
      }
    }else{
      this.ouvrier.primes.splice(this.ouvrier.primes.indexOf(parcelle),1)
    }
  }
  dataToString
  //pour afficher, vider et masquer le formulaire 
  showForm(){
    this.ouvrier.dateEmbauche=new Date()
    this.ouvrier.primes=[{
      id:1,
      prime:null,
      montant:null
    }]
    this.forEdit = false
    this.consult=false
    this.form=!this.form
    this.checkedSocietes=[]
  }
  generateCodes(){
      this.getSwalInteractions()
      this.selectedPresences.forEach(element=>{
        console.log(element)
        this.qrData.push(JSON.stringify({
          matricule:element.Mat,
          nom:element.Nom,
          prenom:element.Prenom,
          cin:element.CIN
        }))
        this.qrCode=true
      })
  }
  //supprimer plusieurs declarations à la fois
  deleteselectedPresences(){
    console.log()
    this.getSwalInteractions()
    let ids = []
    this.selectedPresences.forEach(element=>{
      console.log(element)
      ids.push(element.IDPresence)
    })
    console.log(ids)
    if(ids.length==1){
      this.delete(ids[0])
    }else{
      Swal.fire({
        title: this.swalInteractions.suppressionPlusieurs.titreVal,
        text: this.swalInteractions.suppressionPlusieurs.descriptionVal + "("+this.selectedPresences.length+")",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText:this.swalInteractions.annuler,
        confirmButtonText: this.swalInteractions.ok
      }).then((result) => {
        if (result.value) {
          this.presenceService.delete(ids).subscribe(res=>{
            if(res[0].message=="ajout reussi"){
              Swal.fire(
                this.swalInteractions.suppressionPlusieurs.titre,
                this.swalInteractions.suppressionPlusieurs.description,
                'success')
              this.ngOnInit()
            }else{
              Swal.fire({
                icon: 'error',
                title: this.swalInteractions.suppressionPlusieurs.titreErr,
                text:   this.swalInteractions.suppressionPlusieurs.descriptionErr
              })
            }
          })
        }
      })
    }
  }
  
  //selectionner toutes les declarations
  showOnlySelected(event) {
    if(event.checked){
      this.selectedPresences = this.ouvriers
    }else{
      this.selectedPresences=[]
    }
  }
  copy(){
    console.log(document.execCommand('copy'))
  }
  selectedParcelle

  onChangeParcelle(){
    this.filterOptions()
    this.data = []
    this.ngOnInit()    
  }

  selectedMonth=null
  onChangeMonth(e){
    this.translateService.get(['primeng']).subscribe(res=>{
      this.selectedMonth=res.primeng.monthNames.indexOf(e.value)+1
      this.filterOptions()
    })
  
  }

  selectedYear=null

  onChangeYear(e){
    this.selectedYear=e.value.name
    this.filterOptions()
  }

  filtre={parcelle:null,debut:null,fin:null}

  filterOptions(){
    let dayfin=new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    console.log(dayfin)
    this.filtre={parcelle:this.selectedParcelle,debut:new Date(this.selectedMonth+"/01/"+this.selectedYear),
    fin:new Date(this.selectedMonth+"/"+dayfin+"/"+this.selectedYear)}
    console.log(this.filtre.debut)
    console.log(this.filtre.fin)
    return this.filtre;
  }

}