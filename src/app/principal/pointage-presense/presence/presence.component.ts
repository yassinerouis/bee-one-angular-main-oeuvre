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
  selectedOuvriers=[]
  
  qrData = []
  
  constructor(public datepipe: DatePipe,private translateService: TranslateService,private exportService:ExportService,
    public lang:LanguageService,private parametrageAMC:ParametrageAmcService,private ouvriersService:OuvriersService,
    private presenceService:PresenceService) {
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
ouvriers:any
amc=[]
civilites = []
situations = []
presences = []
lowerThan12 = true
  ngOnInit() {
    this.presenceService.getAll().subscribe(result=>{
      this.presences = [result]
      this.loading = false
    })
    this.ouvriersService.getCaporal().subscribe(caporals=>{
      for(var i=0;i<caporals['length'];i++){
        this.caporals[i] = {label:caporals[i].mat+":"+caporals[i].nom+" "+caporals[i].prenom,value:caporals[i].id}
      }
    })
    this.selectedOuvriers=[]
    console.log(this.swalInteractions)
    this.ids=[]
    this.cols = [
      { field: 'Matricule', header: 'matricule' },
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
    { field: 'Matricule', header: 'matricule' },
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
    let styles = {
      'width':'7rem',
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
   
  }
  //lors du changement de la parcelle il recupère et affiche le type du produit
  onChange(e){

  }
  // Début exportation des déclaration de la récolte
  exportPdf() {
    let columns=[
      { dataKey: 'Mat', header: 'Matricule' },
      { dataKey: 'Nom', header: 'Nom' },
      { dataKey: 'Prenom', header: 'Prenom' },
      { dataKey: 'CIN', header: 'CIN' },
      { dataKey: 'CNSS', header: 'N CNSS' },
      { dataKey: 'Tel', header: 'N téléphone' },
      { dataKey: 'Email', header: 'Email' },
      { dataKey: 'Civilite', header: 'Civilité' },
      { dataKey: 'Adr', header: 'Addresse' },
      { dataKey: 'Dat_Nai', header: 'Date de naissance' },
      { dataKey: 'Situ_Fam', header: 'Situation familiale' },
      { dataKey: 'NBEnft', header: 'Nombre d\'enfants' },
      { dataKey: 'Niveau_scolaire', header: 'Niveau scolaire' },
      { dataKey: 'Fonction_Personnel', header: 'Fonction' }
    ]
    this.exportService.setTable(this.transformDate(this.ouvriers))
    this.exportService.exportPdf(columns,'ouvriers.pdf')
  }
  printPdf(){
   /* let columns=[]
    if(localStorage.getItem('lang')!='ar'){
      this.translateService.get(['rendement']).subscribe(translations=>{
        this.selectedColumns.forEach(element=>{
          columns.push( { header: translations.rendement[element.header], dataKey: element.field})
        })
      })
    }else{
      this.selectedColumns.forEach(element=>{
       // columns.push( { header: this.translateService.translations.fr.rendement[element.header], dataKey: element.field})
      })
    }*/
    let columns=[
      { dataKey: 'Mat', header: 'Matricule' },
      { dataKey: 'Nom', header: 'Nom' },
      { dataKey: 'Prenom', header: 'Prénom' },
      { dataKey: 'CIN', header: 'CIN' },
      { dataKey: 'CNSS', header: 'N CNSS' },
      { dataKey: 'Tel', header: 'N téléphone' },
      { dataKey: 'Dat_Nai', header: 'Date de naissance' },
      { dataKey: 'NBEnft', header: 'Nombre d\'enfants' },
      { dataKey: 'Niveau_scolaire', header: 'Niveau scolaire' },
      { dataKey: 'Fonction_Personnel', header: 'Fonction' }
    ]
    this.exportService.setTable(this.transformDate(this.ouvriers))
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
  exportExcel() {
    let table = []
    for(var i=0;i<this.transformDate(this.ouvriers).length;i++){
      table[i]={
        'Matricule': this.ouvriers[i].Mat,
        'Nom':this.ouvriers[i].Nom,
        'Prénom':this.ouvriers[i].Prenom,
        'CIN':this.ouvriers[i].CIN,
        'N CNSS':this.ouvriers[i].CNSS,
        'N téléphone':this.ouvriers[i].Tel,
        'Email': this.ouvriers[i].Email,
        'Civilité': this.ouvriers[i].Civilite,
        'Addresse':this.ouvriers[i].adr,
        'Date de naissance':this.transformDate(this.ouvriers)[i].Dat_Nai,
        'Situation familiale':this.ouvriers[i].Dat_Nai,
        'Nombre d\'enfants': this.ouvriers[i].NBEnft,
        'Niveau scolaire': this.ouvriers[i].Niveau_scolaire,
        'Fonction': this.ouvriers[i].Fonction_Personnel,
      }
    }
    this.exportService.exportExcel('declarationsRecolte',table)
  }
    generateQR(){
      this.selectedOuvriers.forEach(element=>{
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
      this.selectedOuvriers.forEach(element=>{
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
  deleteselectedOuvriers(){
    this.getSwalInteractions()
    let ids = []
    this.selectedOuvriers.forEach(element=>{
      console.log(element)
      ids.push(element.ID)
    })
    console.log(ids)
    if(ids.length==1){
      this.delete(ids[0])
    }else{
      Swal.fire({
        title: this.swalInteractions.suppressionPlusieurs.titreVal,
        text: this.swalInteractions.suppressionPlusieurs.descriptionVal + "("+this.selectedOuvriers.length+")",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText:this.swalInteractions.annuler,
        confirmButtonText: this.swalInteractions.ok
      }).then((result) => {
        if (result.value) {
          
        }
      })
    }
  }
  
  //selectionner toutes les declarations
  showOnlySelected(event) {
    if(event.checked){
      this.selectedOuvriers = this.ouvriers
    }else{
      this.selectedOuvriers=[]
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