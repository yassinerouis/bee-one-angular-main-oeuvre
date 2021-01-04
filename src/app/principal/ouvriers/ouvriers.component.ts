import { PrimesService } from './../../services/primes/primes.service';
import { SocieteFermeService } from './../../services/societesFermes/societe-ferme.service';
import { OuvriersService } from './../../services/ouvriers/ouvriers.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from "primeng/api";
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
  selector: 'app-ouvrier',
  templateUrl: './ouvriers.component.html',
  styleUrls: ['./ouvriers.component.scss'],
  providers: [MessageService]
})
export class OuvriersComponent implements OnInit {


  //declaration des variables 
  ouvrier = {
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
    exercice:null,
    contractuel:null,
    formationPhyto:null,
    observation:null,
    salaireBase:null,
    primes:[{
      id:1,
      prime:null,
      montant:null,
      surplus:null
    }],
    unitePaiement:null,
    representeEquipe:null,
    representeNombre:null,
    modePaiement:null,
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
  currentDate = new Date()
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

  constructor(public datepipe: DatePipe,private translateService: TranslateService,private exportService:ExportService,
    public lang:LanguageService,private ouvriersService:OuvriersService,private sfService:SocieteFermeService,
    private primesService:PrimesService,private parametrageAMC:ParametrageAmcService) {
  }

  //pour créer une nouvelle déclaration de la récolte

  getSwalInteractions(){
    this.translateService.get(['swal']).subscribe(translations=>{
      this.swalInteractions = translations.swal
    })
  }

  save(){
    this.getSwalInteractions()
    console.log(this.ouvrier)
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

transformDate(declarations){
  let declarationsWithTransformedDate = declarations
  if(this.transform){
    declarationsWithTransformedDate.forEach(element => {
      console.log(element.DateRecolte)
      
      element.DateRecolte = this.datepipe.transform(element.DateRecolte, 'dd/MM/yyyy')
      console.log(element.DateRecolte)
    });
    this.transform=false
  }
  return declarationsWithTransformedDate
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
checkSoc(s){
  console.log(s)
  console.log(this.checkedSocietes)
  console.log(this.checkedSocietes.indexOf(s))
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

niveaux=[{name:"niveau 1",code:"1"}]
qualifications=[{name:"qualification 1",code:"1"}]
categories=[{name:"categorie 1",code:"1"}]
banques=[{name:"banque 1",code:"1"}]
niveau
qualification
categorie
banque
addNiveau(){
  this.niveaux.push({name:this.niveau,code:(this.niveaux.length+1).toString()})
  this.displayModal1=false
}
addQualification(){
  this.qualifications.push({name:this.qualification,code:(this.qualifications.length+1).toString()})
  this.displayModal2=false
}
addCategorie(){
  this.categories.push({name:this.categorie,code:(this.categories.length+1).toString()})
  this.displayModal3=false
}
addBanque(){
  this.banques.push({name:this.banque,code:(this.banques.length+1).toString()})
  this.displayModal4=false
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
amc:any
  ngOnInit() {
    this.ouvriersService.getOuvriers().subscribe(ouvriers=>{
      console.log(ouvriers)
      this.ouvriers=ouvriers
    })
    this.primesService.getPrimes().subscribe(primes=>{
      this.primes.push({label:'Traitée en surplus',value:-1})
      for(var i=0;i<primes['length'];i++){
        this.primes.push({label:primes[i].Nom_prime,value:primes[i].IDPrime})
      }
    })
    this.translateService.get(['mainOeuvre']).subscribe(res=>{
      this.typePaie=res.mainOeuvre.methodePaie[0].name
    })
    this.ouvriersService.getCaporal().subscribe(caporals=>{
      for(var i=0;i<caporals['length'];i++){
        this.caporals[i] = {label:caporals[i].mat+":"+caporals[i].nom+" "+caporals[i].prenom,value:caporals[i].id}
      }
    })
    this.parametrageAMC.getAll().subscribe(amc=>{
      for(var i=0;i<amc['length'];i++){
        this.amc[i]={name:amc[i].Libelle,code:amc[i].IDParametrage_AMC}
      }
    })
    this.sfService.getSocietes().subscribe(societes=>{
      for(var i=0;i<societes['length'];i++){
        let societe={id:societes[i].ID,name:societes[i].Rais_Social}
        this.sfService.getFermesSociete(societes[i].ID).subscribe(fermes=>{
          this.societes.push({societe:societe,fermes:fermes})
        }) 
      }
      console.log(this.societes)
     /* for(var i=0;i<societes['length'];i++){
       
      }*/
    })
    this.loading = false
    this.selectedOuvriers=[]
    console.log(this.swalInteractions)
    this.ids=[]
      /*
      AMC: null
      Adr: ""
      Banque: ""
      Banque_Compte: ""
      Banque_agance: ""
      BarcodesId: "1454"
      CIMR: ""
      CIN: "KL14"
      CNSS: "4196"
      Caporale: false
      CaporaleTransport: false
      Categorie: 0
      Chef_Cap: false
      Chef_chantier: false
      Chemain_CIN_PDF: null
      Civilite: 1
      Code_Pointeuse: "0"
      Conge_droit_exerc_en_cours: 0
      Conge_pris_Anne_en_cours: 0
      Contractuel: false
      Dat_Nai: null
      Date_Embauche: "2020-10-27T00:00:00.000Z"
      Date_cree: "2020-10-27T00:00:00.000Z"
      Date_sortie: null
      Droit_au_conge: 1.5
      Droit_conge: 0
      Droit_conge_date: null
      Echelle: ""
      Email: ""
      En_exercice: true
      Envoi_sync: false
      Exonere_Cnss: false
      Exonere_Impot: false
      GSM: ""
      Gardiennage: false
      ID: 70513
      IDChantiers: 0
      IDFermes: 1
      IDNiveau_Scolaire: 0
      IDParametrage_AMC: 0
      IDParametrage_CIMR: 0
      IDQualification_Personnel: 0
      IDpers_serv: 0
      IDsociete: 0
      Image_chaine: null
      Jour_repos: null
      Lieu_Nai: ""
      Mat: "CHIMP14"
      Mode_reglement: 1
      Mutuelle: ""
      NBEnft: null
      NBRE: 0
      NBRE_deduction: 0
      N_identification: 1454
      Nationnalite: "marocaine"
      Niveau_Scol: 1
      Nom: "AA"
      Observation: ""
      Passport: ""
      Paye_par: 1
      Pers_Ancte: 2
      Pers_Cap: 0
      Pers_Cap_transport: 0
      Pers_Chef_cap: 0
      Pers_Domaine: null
      Pers_Fonction: 2
      Pers_Local: false
      Pers_Service: 0
      Pers_chef_chantier: 0
      Pers_photo: null
      Photo_CIN1: null
      Photo_CIN2: null
      Prenom: "BB"
      Prime_motivation: 0
      Ref_machine: ""
      Ref_mat: "00498"
      Ref_utilisateur: ""
      Retraite: ""
      Salaire_Base: 76.7
      Salaire_Horaire: 0
      Salaire_Journalier: 0
      Salaire_mensuel: 0
      Sexe: "1"
      Situ_Fam: 1
      Solde_conge: 0
      Solde_initial: 40
      Taux_FP: 20
      Taux_assurance: 0
      Tectra: false
      Tel: ""
      Type_Paie: 1
      Utilisateur: "superviseur"
      Ville: null
      formation_phyto: false
      statut: "0"
    */
   
    this.cols = [
      { field: 'Mat', header: 'matricule' },
      { field: 'Nom', header: 'nom' },
      { field: 'Prenom', header: 'prenom' },
      { field: 'CIN', header: 'CIN' },
      { field: 'Tel', header: 'tel' },
      { field: 'Email', header: 'email' },
      { field: 'Civilite', header: 'civilite' },
      { field: 'adr', header: 'Adresse' },
      { field: 'Dat_Nai', header: 'dateNaissance' },
      { field: 'Situ_Fam', header: 'situationFamiliale' },
      { field: 'NBEnft', header: 'nombreEnfants' },
      { field: 'Niveau_Scol', header: 'niveauScolaire' },
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
      { field: 'Pers_Fonction', header: 'fonction' },
      { field: 'Categorie', header: 'categorie' },
      { field: 'Date_Embauche', header: 'dateEmbauche' },
      { field: 'CNSS', header: 'cnss' },
      { field: 'Pers_Ancte', header: 'anciennete' },
      { field: 'En_exercice', header: 'exercice' },
      { field: 'Salaire_Base', header: 'salaireBase' }
  ];
  this._selectedColumns = [
      { field: 'Mat', header: 'matricule' },
      { field: 'Nom', header: 'nom' },
      { field: 'Prenom', header: 'prenom' },
      { field: 'CIN', header: 'CIN' },
      { field: 'CNSS', header: 'cnss' },
      { field: 'Tel', header: 'tel' },
      { field: 'Email', header: 'email' },
      { field: 'Civilite', header: 'civilite' },
      { field: 'adr', header: 'adresse' },
      { field: 'Dat_Nai', header: 'dateNaissance' },
      { field: 'Situ_Fam', header: 'situationFamiliale' },
      { field: 'NBEnft', header: 'nombreEnfants' },
      { field: 'Niveau_Scol', header: 'niveauScolaire' },
      { field: 'attache', header: 'attache' },
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
  
  consultDeclaration(id){
    this.declarationForConsult.pop()
    this.ouvrier.primes = []
    this.id = id
    this.forEdit = true

  }
  //afficher la déclaration de la récolte sélectionnée dans le formulaire pour modification
  edit(id){
    this.id = id
    this.forEdit = true

  }

  //annuler l'action (ajouter ou modifier)
  cancel(){
    this.ouvrier.primes = []
    this.showForm()
    this.forEdit = false
  }

  //pour modifier la déclaration de la récolte
  update(){
    this.getSwalInteractions()
    let declarationRecolte = {
      id:this.id,
      date_recolte:this.declaration.date_recolte,
      observations:this.declaration.observations,
    }
  }
    //pour supprimer la déclaration de la récolte
  delete(id){
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

      }
    })
  }
  //lors du changement de la parcelle il recupère et affiche le type du produit
  onChange(e){

  }
  // Début exportation des déclaration de la récolte
  exportPdf() {
    let columns=[
      { header: 'Date de récolte', dataKey: 'DateRecolte'},
      { header: 'Nombre de parcelles', dataKey: 'parcelles' },
      { header: 'Observations', dataKey: 'Observations' },
      { header: 'Récolte MO', dataKey: 'RecolteMO' },
      { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
      { header: 'Vente sur pieds', dataKey: 'VentePieds' },
      { header: 'Quantité totale', dataKey: 'QteTotale' }
    ]
    this.exportService.setTable(this.transformDate(this.declarations))
    this.exportService.exportPdf(columns,'declarationsRecolte.pdf')
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
      { header: 'Date de récolte', dataKey: 'DateRecolte'},
      { header: 'Nombre de parcelles', dataKey: 'parcelles' },
      { header: 'Observations', dataKey: 'Observations' },
      { header: 'Récolte MO', dataKey: 'RecolteMO' },
      { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
      { header: 'Vente sur pieds', dataKey: 'VentePieds' },
      { header: 'Quantité totale', dataKey: 'QteTotale' }
    ]
    this.exportService.setTable(this.transformDate(this.declarations))
    this.exportService.printPdf(columns)
  }
  exportExcel() {
    let table = []
    for(var i=0;i<this.transformDate(this.declarations).length;i++){
      table[i]={
        'Date de récolte': this.transformDate(this.declarations)[i].DateRecolte,
        'Nombre de parcelles':this.transformDate(this.declarations)[i].parcelles,
        'Observations':this.transformDate(this.declarations)[i].Observations,
        'Récolte MO':this.transformDate(this.declarations)[i].RecolteMO,
        'Récolte hors MO': this.transformDate(this.declarations)[i].RecolteHorsMO,
        'Vente sur pieds': this.transformDate(this.declarations)[i].VentePieds,
        'Quantité totale': this.transformDate(this.declarations)[i].QteTotale 
      }
    }
    this.exportService.exportExcel('declarationsRecolte',table)
  }
    // Début exportations du détail des déclaration de la récolte
      exportDetailsPdf() {
        let columns=[
          { header: 'Date de récolte', dataKey: 'DateRecolte'},
          { header: 'Parcelle', dataKey: 'Ref' },
          { header: 'Type du produit', dataKey: 'designation' },
          { header: 'Récolte MO', dataKey: 'RecolteMO' },
          { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
          { header: 'Vente sur pieds', dataKey: 'VentePieds' },
          { header: 'Quantité totale', dataKey: 'QteTotale' }
        ]
        this.exportService.setTable(this.transformDateDetails(this.detailsDeclarations))
        this.exportService.exportPdf(columns,'detailsDeclarationsRecolte.pdf')
      }
      printDetailsPdf(){
        let columns=[
          { header: 'Date de récolte', dataKey: 'DateRecolte'},
          { header: 'Parcelle', dataKey: 'Ref' },
          { header: 'Type du produit', dataKey: 'designation' },
          { header: 'Récolte MO', dataKey: 'RecolteMO' },
          { header: 'Récolte hors MO', dataKey: 'RecolteHorsMO' },
          { header: 'Vente sur pieds', dataKey: 'VentePieds' },
          { header: 'Quantité totale', dataKey: 'QteTotale' }
        ]
        this.exportService.setTable(this.transformDateDetails(this.detailsDeclarations))
        this.exportService.printPdf(columns)
      }
      exportDetailsExcel() {
        let table = []
        for(var i=0;i<this.transformDateDetails(this.detailsDeclarations).length;i++){
          table[i]={
            'Date de récolte': this.transformDateDetails(this.detailsDeclarations)[i].DateRecolte,
            'Parcelle': this.transformDateDetails(this.detailsDeclarations)[i].Ref ,
            'Type du produit':this.transformDateDetails(this.detailsDeclarations)[i].designation,
            'Récolte MO':this.transformDateDetails(this.detailsDeclarations)[i].RecolteMO,
            'Récolte hors MO': this.transformDateDetails(this.detailsDeclarations)[i].RecolteHorsMO,
            'Vente sur pieds': this.transformDateDetails(this.detailsDeclarations)[i].VentePieds,
            'Quantité totale': this.transformDateDetails(this.detailsDeclarations)[i].QteTotale 
          }
        }
        this.exportService.exportExcel('detailsDeclarationsRecolte',table)
      }
  //Ajouter un nouveau élément à la table si l'élément courant est valide
  addItem(){
    this.getSwalInteractions()
    if(this.ouvrier.primes[this.ouvrier.primes.length-1].prime&&this.ouvrier.primes[this.ouvrier.primes.length-1].montant){
      this.ouvrier.primes.push({
        id:this.ouvrier.primes.length+1,
        prime:null,
        montant:null,
        surplus:null
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
        montant:null,
        surplus:null
      }
    }else{
      this.ouvrier.primes.splice(this.ouvrier.primes.indexOf(parcelle),1)
    }
  }
  //pour afficher, vider et masquer le formulaire 
  showForm(){
      this.declaration={date_recolte : new Date(),observations:null}
      this.ouvrier.primes=[{
        id:1,
        prime:null,
        montant:null,
        surplus:null
      }]
      this.forEdit = false
    this.form=!this.form
  }
  //supprimer plusieurs declarations à la fois
  deleteselectedOuvriers(){
    this.getSwalInteractions()
    let ids = []
    this.selectedOuvriers.forEach(element=>{
      ids.push(element.ID[0])
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