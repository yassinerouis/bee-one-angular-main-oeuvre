import { MainOeuvreModule } from '../main_oeuvre.module';
import { SqlRequestService } from '../../services/sql-request/sql-request.service';
import { QRCodeModule } from 'angular2-qrcode';
import { NiveauScolaireService } from '../../services/niveau_scolaire/niveau-scolaire.service';
import { QualificationPersonnelService } from '../../services/qualification_personnel/qualification-personnel.service';
import { FonctionPersonnelService } from '../../services/fonction_personnel/fonction-personnel.service';
import { CategoriePersonnelService } from '../../services/categorie_personnel/categorie-personnel.service';
import { PrimesService } from '../../services/primes/primes.service';
import { SocieteFermeService } from '../../services/societesFermes/societe-ferme.service';
import { OuvriersService } from '../../services/ouvriers/ouvriers.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Component, Input, OnInit, ɵConsole } from '@angular/core';
import { LazyLoadEvent, MessageService } from "primeng/api";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportService } from 'src/app/services/export/export.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ParametrageAmcService } from 'src/app/services/parametrage/parametrage-amc.service';
import {MenuItem} from 'primeng/api';
import * as _ from 'lodash';

 // Ce Component sert à la gestion de la declaration de la recolte
 am4core.useTheme(am4themes_animated);
const doc = new jsPDF()
@Component({
  selector: 'app-ouvrier',
  templateUrl: './ouvrier.component.html',
  styleUrls: ['./ouvrier.component.scss'],
  providers: [MessageService]
})
export class OuvrierComponent implements OnInit {
  page=1
  nextPage(){
    if (this.page==1 && this.ouvrier.matricule && this.ouvrier.civilite && this.ouvrier.nom && this.ouvrier.prenom && this.ouvrier.cin && this.ouvrier.situationFamiliale && this.ouvrier.dateNaissance ) {
      this.step1=true
      if(this.forEdit || !this.consult){
        this.ouvriersService.getMatricule(this.ouvrier.matricule).subscribe(res=>{
          console.log(res[0])
          if(res[0].exist>0 && !this.forEdit){
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text:  'Matricule existe dèjà'
            })
          }else{
            this.page++;
            this.activeIndex++;
          }
        })
      }else{
        this.page++;
        this.activeIndex++;
      }
    }else if(this.page==2){
      if(this.ouvrier.fonction && this.ouvrier.dateEmbauche && this.ouvrier.droitConge &&((!this.ouvrier.cnss&&this.ouvrier.anciennete)||(this.ouvrier.cnss&&this.ouvrier.anciennete)||(!this.ouvrier.cnss&&!this.ouvrier.anciennete))){
        this.page++;
        this.activeIndex++;
      }
      this.step2=true
    }else if(this.page==3){
      if(this.ouvrier.salaireBase){
        this.page++;
        this.activeIndex++;
      }
      this.step3=true
    }
    this.submitted = true;
  }
  previousPage(){
    this.page--
    this.activeIndex--
  }
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
  transform = true
  transformDetails = true
  selectedOuvriers=[]
  
  qrData = []
  
  constructor(public datepipe: DatePipe,private translateService: TranslateService,private exportService:ExportService,
    public lang:LanguageService,private ouvriersService:OuvriersService,private sfService:SocieteFermeService,
    private primesService:PrimesService,private parametrageAMC:ParametrageAmcService,private categorieService:CategoriePersonnelService,
    private fonctionService:FonctionPersonnelService,private qualificationService:QualificationPersonnelService,
    private niveauService:NiveauScolaireService,
    private sqlService:SqlRequestService) {
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
    this.step4=true
    this.getSwalInteractions()
    if(this.ouvrier.fermes.length>0){
      this.ouvriersService.addOuvrier(this.ouvrier).subscribe(res=>{
        console.log((res[0].description.split(" ", 5)==["Violation", "of", "UNIQUE", "KEY", "constraint"]))
        if(res[0].message=="ajout reussi"){
          Swal.fire(
            this.swalInteractions.ajout.titre,
            this.swalInteractions.ajout.description,
            'success')
          this.showForm()
          this.ngOnInit()
        }else{
          Swal.fire({
            icon: 'error',
            title: this.swalInteractions.ajout.titreErr,
            text:  this.swalInteractions.ajout.descriptionErr
          })
        }
      },err=>console.log(err))
    }
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
globalSearch:string
onInputSearch(){
  let selectedColumns=[]
  if(this.globalSearch){
    this.selectedColumns.forEach(element => {
      if( element.field!='En_exercice' && element.field!='Contractuel' && element.field!='formation_phyto'){
        selectedColumns.push({field:element.field})
      }
    });  
    this.filter.option1=this.sqlService.getDataGlobalSearchLike(selectedColumns,this.globalSearch)
  }else{
    this.filter.option1=''
  }
  var event={
    first: 0,
    rows: 10
  } 
  this.loadOuvriers(event)
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
      element.DateRecolte = this.datepipe.transform(element.DateRecolte, 'dd/MM/yyyy')
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
  if(e.checked){
    this.sfService.getFermesSociete(s).subscribe(fermes=>{
      this.societes.forEach(element => {
        if(element.societe.id==s){
          element.fermes=fermes
        }
      });
      for(var i=0;i<fermes['length'];i++){
        if(this.ouvrier.fermes.indexOf(fermes[i].IDFermes.toString())==-1){
          this.ouvrier.fermes.push(fermes[i].IDFermes.toString())
        }
      }
    }) 
  }else{
    this.sfService.getFermesSociete(s).subscribe(fermes=>{
      for(var i=0;i<fermes['length'];i++){
        this.ouvrier.fermes.splice((this.ouvrier.fermes.indexOf(fermes[i].IDFermes.toString())),1)
      }
    })
  }
}
items: MenuItem[];

loadOuvriers(event){
  console.log(event.filters)
  if(event.filters && this.sqlService.getDetailsFilter(event.filters)!=''){
    this.filter.option2=this.sqlService.getDetailsFilter(event.filters)
  }else{
    this.filter.option2=''
  }
  try{
    this.loading = true;
    this.filter.from=event.first
    this.filter.to=event.first+event.rows
    this.getLength()
    this.getOuvriers()
    setTimeout(() => {
      if (this.ouvriers) {
        console.log(this.ouvriers)
        this.loadedOuvriers = this.ouvriers
        this.loading = false;
      }
    }, 1000);
  }catch(err){
    console.log(err)
  }
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
  this.niveauService.add({niveau:this.niveau}).subscribe(res=>{
    if(res[0].IDNiveau_Scolaire){
      Swal.fire({
        icon: 'error',
        title: 'Existe dèjà',
        text:  'L\'element existe dèjà'
      })
    }
    else{
      if(this.niveaux.length>0){
        this.niveaux.push({label:this.niveau,value:this.niveaux[this.niveaux.length-1].value+1})
        this.ouvrier.niveauScolaire={label:this.niveau,value:this.niveaux[this.niveaux.length-1].value}
        console.log(this.ouvrier.niveauScolaire)
      }else{
        this.niveaux.push({label:this.niveau,value:1})
        this.ouvrier.niveauScolaire={label:this.niveau,value:1}
      }
    }
    this.displayModal1=false
  })
}
addQualification(){
  this.qualificationService.add({qualification:this.qualification}).subscribe(res=>{
    if(res[0].IDQualification_Personnel){
      Swal.fire({
        icon: 'error',
        title: 'Existe dèjà',
        text:  'L\'element existe dèjà'
      })
    }
    else{
    if(this.qualifications.length>0){
      this.qualifications.push({label:this.qualification,value:this.qualifications[this.qualifications.length-1].value+1})
      this.ouvrier.qualification={label:this.qualification,value:this.qualifications[this.qualifications.length-1].value}  
    }else{
      this.qualifications.push({label:this.qualification,value:1})
      this.ouvrier.qualification={label:this.qualification,value:1}  
    }
  }
    this.displayModal2=false
  })
}
addCategorie(){
  this.categorieService.add({categorie:this.categorie}).subscribe(res=>{
    if(res[0].ID){
      Swal.fire({
        icon: 'error',
        title: 'Existe dèjà',
        text:  'L\'element existe dèjà'
      })
    }
    else{
    this.categories.push({label:this.categorie,value:this.categories[this.categories.length-1].value+1})
    this.ouvrier.categorie={label:this.categorie,value:this.categories[this.categories.length-1].value}
    }
    this.displayModal3=false
  })
}
addFonction(){
  this.fonctionService.add({fonction:this.fonction}).subscribe(res=>{
    if(res[0].ID){
      Swal.fire({
        icon: 'error',
        title: 'Existe dèjà',
        text:  'L\'element existe dèjà'
      })
    }
    else{
    this.fonctions.push({label:this.fonction,value:this.fonctions[this.fonctions.length-1].value+1})
    this.ouvrier.fonction={label:this.fonction,value:this.fonctions[this.fonctions.length-1].value}
    }
    this.displayModal4=false
  })
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
loadedOuvriers:any
amc=[]
civilites = []
situations = []
cols = [
  { field: 'Mat', header: 'matricule' },
  { field: 'Nom', header: 'nom' },
  { field: 'Prenom', header: 'prenom' },
  { field: 'CIN', header: 'CIN' },
  { field: 'Tel', header: 'tel' },
  { field: 'Email', header: 'email' },
  { field: 'Civilite', header: 'civilite' },
  { field: 'Adr', header: 'adresse' },
  { field: 'Dat_Nai', header: 'dateNaissance' },
  { field: 'Situ_Fam', header: 'situationFamiliale' },
  { field: 'NBEnft', header: 'nombreEnfants' },
  { field: 'Niveau_scolaire', header: 'niveauScolaire' },
  { field: 'attache', header: 'attache' },
  { field: 'Droit_conge', header: 'droitConge' },
  { field: 'Taux_assurance', header: 'tauxAssurance' },
  { field: 'AMC', header: 'matriculeAMC' },
  { field: 'formation_phyto', header: 'fomationPhyto' },
  { field: 'Prime_motivation', header: 'primes' },
  { field: 'Contractuel', header: 'contractuel' },
  { field: 'Type_Paie', header: 'modePaiement' },
  { field: 'Banque', header: 'banque' },
  { field: 'Banque_Compte', header: 'rib' },
  { field: 'Fonction_Personnel', header: 'fonction' },
  { field: 'Categ', header: 'categorie' },
  { field: 'Qualification', header: 'qualification' },
  { field: 'Date_Embauche', header: 'dateEmbauche' },
  { field: 'CNSS', header: 'cnss' },
  { field: 'Pers_Ancte', header: 'anciennete' },
  { field: 'En_exercice', header: 'exercice' },
  { field: 'Salaire_Base', header: 'salaireBase' }
];
_selectedColumns = [
  { field: 'Mat', header: 'matricule' },
  { field: 'Nom', header: 'nom' },
  { field: 'Prenom', header: 'prenom' },
  { field: 'CIN', header: 'CIN' },
  { field: 'CNSS', header: 'cnss' },
  { field: 'Tel', header: 'tel' },
  { field: 'Email', header: 'email' },
  { field: 'Civilite', header: 'civilite' },
  { field: 'Adr', header: 'adresse' },
  { field: 'Dat_Nai', header: 'dateNaissance' },
  { field: 'Situ_Fam', header: 'situationFamiliale' },
  { field: 'NBEnft', header: 'nombreEnfants' },
  { field: 'Niveau_scolaire', header: 'niveauScolaire' },
  { field: 'Fonction_Personnel', header: 'fonction' },
];
getOuvriers(){
  console.log(this.filter)
  this.ouvriersService.getOuvriers(this.filter).subscribe(ouvriers=>{
    this.ouvriers=ouvriers
    this.loading = false
  },err=>{
    console.error(err)
  })
}
getLength(){
  this.ouvriersService.getTotalRecords(this.filter.option1,this.filter.option2).subscribe(res=>{
    this.totalRecords=res[0].total
  })
}
getPrimes(){
  this.primesService.getPrimes().subscribe(primes=>{
    this.primes.push({label:'Traitée en surplus',value:-1})
    for(var i=0;i<primes['length'];i++){
      this.primes.push({label:primes[i].Nom_prime,value:primes[i].IDPrime})
    }
  })
}
getCaporals(){
  this.ouvriersService.getCaporal().subscribe(caporals=>{
    for(var i=0;i<caporals['length'];i++){
      this.caporals[i] = {label:caporals[i].mat+":"+caporals[i].nom+" "+caporals[i].prenom,value:caporals[i].id}
    }
  })
}
getParametrageAMC(){
  this.parametrageAMC.getAll().subscribe(amc=>{
    for(var i=0;i<amc['length'];i++){
      this.amc[i]={label:amc[i].Libelle,value:amc[i].IDParametrage_AMC}
    }
  })
}
getSocietes(){
  this.societes=[]
  this.sfService.getSocietes().subscribe(societes=>{
    for(var i=0;i<societes['length'];i++){
      let societe={id:societes[i].ID,name:societes[i].Rais_Social}
      this.sfService.getFermesSociete(societes[i].ID).subscribe(fermes=>{
        this.societes.push({societe:societe,fermes:fermes})
      }) 
    }
  })
}
getParams(){
  this.niveauService.getAll().subscribe(res=>{
    for(var i=0;i<res['length'];i++){
      this.niveaux[i]={label:res[i].Niveau_scolaire,value:res[i].IDNiveau_Scolaire}
    }
  })
  this.qualificationService.getAll().subscribe(res=>{
    for(var i=0;i<res['length'];i++){
      this.qualifications[i]={label:res[i].Qualification,value:res[i].IDQualification_Personnel}
    }
  })
  this.categorieService.getAll().subscribe(res=>{
    for(var i=0;i<res['length'];i++){
      this.categories[i]={label:res[i].Categorie,value:res[i].ID}
    }
  })
  this.fonctionService.getAll().subscribe(res=>{
    for(var i=0;i<res['length'];i++){
      this.fonctions[i]={label:res[i].Fonction_Personnel,value:res[i].ID}
    }
  })
}
filter = {from:0,to:10,option1:'',option2:''}
totalRecords
activeIndex=0
submitted=false
step1=true;
step2=false;
step3=false;
step4=false;
  ngOnInit() {

    this.translateService.get(['mainOeuvre']).subscribe(mo=>{
      this.civilites = mo.mainOeuvre.civilites
      this.situations = mo.mainOeuvre.situations
      this.typePaie=mo.mainOeuvre.methodePaie[0].name
      this.items = [{
        label: mo.mainOeuvre.etatcivil,
        command: (event: any) => {
            this.activeIndex = 0;
        }
    },
    {
      label: mo.mainOeuvre.fonction,
      command: (event: any) => {
            this.activeIndex = 1;
        }
    },
    {
      label: mo.mainOeuvre.paie.name,
        command: (event: any) => {
            this.activeIndex = 2;
        }
    },
    {
        label: mo.mainOeuvre.attachement,
        command: (event: any) => {
            this.activeIndex = 3;
        }
    }
  ];
    })
   var lazyEvent:LazyLoadEvent
   this.loadOuvriers(lazyEvent)
    this.selectedOuvriers=[]
    this.ids=[]

  }

  setMyStyles() {
    let styles = {
      'width':'10rem',
    };
    return styles;
  }
  declarationForConsult =[]
  selectColumn(e){
    this._selectedColumns=e.value
    console.log(this.selectedColumns)
  }
  consulter(id){
    this.ouvrier.id=id
    this.ouvriersService.getPrimes(id).subscribe(primes=>{
     for(var i=0;i<primes['length'];i++){
       this.ouvrier.primes[i]={
         id:i+1,
         prime:primes[i].IDPrime,
         montant:primes[i].Montant
       }
     }
   })
     this.ouvriersService.getOuvrier(id).subscribe(ouvrier=>{
         this.ouvrier.matricule=ouvrier[0].Mat,
         this.ouvrier.codeBarre=ouvrier[0].BarcodesId,
         this.ouvrier.civilite=ouvrier[0].Civilite,
         this.ouvrier.nom=ouvrier[0].Nom,
         this.ouvrier.prenom=ouvrier[0].Prenom,
         this.ouvrier.cin=ouvrier[0].CIN,
         this.ouvrier.dateNaissance=new Date(ouvrier[0].Dat_Nai),
         this.ouvrier.situationFamiliale=ouvrier[0].Situ_Fam,
         this.ouvrier.nombreEnfants=ouvrier[0].NBEnft,
         this.ouvrier.addresse=ouvrier[0].Adr,
         this.ouvrier.tel=ouvrier[0].Tel,
         this.ouvrier.email=ouvrier[0].Email,
         this.ouvrier.niveauScolaire=ouvrier[0].Niveau_Scol,
         this.ouvrier.qualification=ouvrier[0].IDQualification_Personnel,
         this.ouvrier.fonction=ouvrier[0].Pers_Fonction,
         this.ouvrier.caporal=ouvrier[0].Caporale,
         this.ouvrier.attache=ouvrier[0].Pers_Cap,
         this.ouvrier.categorie=ouvrier[0].Categorie,
         this.ouvrier.dateEmbauche=new Date(ouvrier[0].Date_Embauche),
         this.ouvrier.cnss=ouvrier[0].CNSS,
         this.ouvrier.anciennete=ouvrier[0].Pers_Ancte,
         this.ouvrier.droitConge=ouvrier[0].Droit_conge,
         this.ouvrier.tauxAssurance=ouvrier[0].Taux_assurance,
         this.ouvrier.matriculeAMC=ouvrier[0].AMC,
         this.ouvrier.optionAMC=ouvrier[0].IDParametrage_AMC,
         this.ouvrier.exercice=ouvrier[0].En_exercice,
         this.ouvrier.contractuel=ouvrier[0].Contractuel,
         this.ouvrier.formationPhyto=ouvrier[0].formation_phyto,
         this.ouvrier.observation=ouvrier[0].Observation,
         this.ouvrier.salaireBase=ouvrier[0].Salaire_Base,
         this.ouvrier.unitePaiement=ouvrier[0].Paye_par,
         this.ouvrier.representeEquipe=ouvrier[0].NBRE?true:false,
         this.ouvrier.representeNombre=ouvrier[0].NBRE,
         this.ouvrier.modePaiement=ouvrier[0].Mode_reglement,
         this.ouvrier.rib=ouvrier[0].Banque_Compte
     })
     this.checkedSocietes=[]
     this.ouvrier.fermes=[]
     this.ouvriersService.getFermes(id).subscribe(res=>{
       for(var i=0;i<res['length'];i++){
         this.ouvrier.fermes.push(res[i].IDFermes.toString())
       }
       console.log(this.ouvrier.fermes)
     })
     this.ouvriersService.getSocietes(id).subscribe(res=>{
       for(var i=0;i<res['length'];i++){
         this.checkedSocietes.push(res[i].ID_societe.toString())
       }
       console.log(this.checkedSocietes)
     })
     setTimeout(()=>{                           //<<<---using ()=> syntax
       this.showForm()
       this.id = id
       this.consult=true
      }, 1000);
  }
  //afficher la déclaration de la récolte sélectionnée dans le formulaire pour modification
  edit(id){
  this.ouvrier.id=id
   this.ouvriersService.getPrimes(id).subscribe(primes=>{
     console.log(primes)
    for(var i=0;i<primes['length'];i++){
      this.ouvrier.primes[i]={
        id:i+1,
        prime:primes[i].IDPrime,
        montant:primes[i].Montant
      }
    }
   console.log(this.ouvrier.primes) 
  })
    this.ouvriersService.getOuvrier(id).subscribe(ouvrier=>{
        this.ouvrier.matricule=ouvrier[0].Mat,
        this.ouvrier.codeBarre=ouvrier[0].BarcodesId,
        this.ouvrier.civilite=ouvrier[0].Civilite,
        this.ouvrier.nom=ouvrier[0].Nom,
        this.ouvrier.prenom=ouvrier[0].Prenom,
        this.ouvrier.cin=ouvrier[0].CIN,
        this.ouvrier.dateNaissance=new Date(ouvrier[0].Dat_Nai),
        this.ouvrier.situationFamiliale=ouvrier[0].Situ_Fam,
        this.ouvrier.nombreEnfants=ouvrier[0].NBEnft,
        this.ouvrier.addresse=ouvrier[0].Adr,
        this.ouvrier.tel=ouvrier[0].Tel,
        this.ouvrier.email=ouvrier[0].Email,
        this.ouvrier.niveauScolaire=ouvrier[0].Niveau_Scol,
        this.ouvrier.qualification=ouvrier[0].IDQualification_Personnel,
        this.ouvrier.fonction=ouvrier[0].Pers_Fonction,
        this.ouvrier.caporal=ouvrier[0].Caporale,
        this.ouvrier.attache=ouvrier[0].Pers_Cap,
        this.ouvrier.categorie=ouvrier[0].Categorie,
        this.ouvrier.dateEmbauche=new Date(ouvrier[0].Date_Embauche),
        this.ouvrier.cnss=(ouvrier[0].CNSS==0)?null:ouvrier[0].CNSS,
        this.ouvrier.anciennete=(ouvrier[0].Pers_Ancte==0)?null:ouvrier[0].Pers_Ancte,
        this.ouvrier.droitConge=ouvrier[0].Droit_conge,
        this.ouvrier.tauxAssurance=ouvrier[0].Taux_assurance,
        this.ouvrier.matriculeAMC=ouvrier[0].AMC,
        this.ouvrier.optionAMC=ouvrier[0].IDParametrage_AMC,
        this.ouvrier.exercice=ouvrier[0].En_exercice,
        this.ouvrier.contractuel=ouvrier[0].Contractuel,
        this.ouvrier.formationPhyto=ouvrier[0].formation_phyto,
        this.ouvrier.observation=ouvrier[0].Observation,
        this.ouvrier.salaireBase=ouvrier[0].Salaire_Base,
        this.ouvrier.unitePaiement=ouvrier[0].Paye_par,
        this.ouvrier.representeEquipe=ouvrier[0].NBRE?true:false,
        this.ouvrier.representeNombre=ouvrier[0].NBRE,
        this.ouvrier.modePaiement=ouvrier[0].Mode_reglement,
        this.ouvrier.rib=ouvrier[0].Banque_Compte
        this.page=1
    })
    this.checkedSocietes=[]
    this.ouvrier.fermes=[]
    this.ouvriersService.getFermes(id).subscribe(res=>{
      for(var i=0;i<res['length'];i++){
        this.ouvrier.fermes.push(res[i].IDFermes.toString())
      }
    })
    this.ouvriersService.getSocietes(id).subscribe(res=>{
      console.log(res)
      for(var i=0;i<res['length'];i++){
        this.checkedSocietes.push(res[i].ID_societe.toString())
      }
      console.log(this.checkedSocietes)
    })
    setTimeout(()=>{    
      this.forEdit = true
      this.form=!this.form
      if(this.form==true){
        this.step1=true
        this.step2=this.step3=this.step4=false
        this.submitted=false
        this.getPrimes()
        this.getCaporals()
        this.getParametrageAMC()
        this.getSocietes()
        this.getParams()
      }
      this.ouvrier.dateEmbauche=new Date()
      if(!this.forEdit){
        this.ouvrier.primes=[{
          id:1,
          prime:null,
          montant:null
        }]
        this.checkedSocietes=[]
      }
      this.id = id
      console.log(this.ouvrier)
      console.log(this.ouvrier.primes)
    }, 1000);
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
      this.ouvriersService.updateOuvrier(this.ouvrier).subscribe(res=>{
        if(res[0].message=="ajout reussi"){
          Swal.fire(
            this.swalInteractions.modification.titre,
            this.swalInteractions.modification.description,
            'success'
          )
          this.showForm()
          this.ngOnInit()
        }else{
          Swal.fire({
            icon: 'error',
            title: this.swalInteractions.modification.titreErr,
            text:  this.swalInteractions.modification.descriptionErr
          })
        }
      },err=>console.log(err)) 
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
        this.ouvriersService.deleteOuvrier(id).subscribe(res=>{
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
      this.exportService.printQR()

      
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
    this.form=!this.form
    if(this.form==true){
      this.step1=true
      this.step2=this.step3=this.step4=false
      this.submitted=false
      this.getPrimes()
      this.getCaporals()
      this.getParametrageAMC()
      this.getSocietes()
      this.getParams()
    }
    this.ouvrier.dateEmbauche=new Date()
    if(!this.forEdit){
      this.ouvrier.primes=[{
        id:1,
        prime:null,
        montant:null
      }]
      this.checkedSocietes=[]
    }
    this.forEdit = false
    this.consult=false
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
          this.ouvriersService.deleteOuvriers(ids).subscribe(res=>{
            if(res[0].message=="ajout reussi"){
              Swal.fire(
                this.swalInteractions.suppressionPlusieurs.titre,
                this.swalInteractions.suppressionPlusieurs.description,
                'success'
              )
              this.ngOnInit()
            }else{
              Swal.fire({
                icon: 'error',
                title: this.swalInteractions.suppressionPlusieurs.titreErr,
                text:   this.swalInteractions.suppressionPlusieurs.descriptionErr
              }
              )
            }
          })
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