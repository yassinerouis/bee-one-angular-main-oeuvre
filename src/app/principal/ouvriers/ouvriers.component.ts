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
  consult = false
  forEdit = false
  statuses: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  currentDate = new Date()
  listParcelles=[]
  id
  parcelles=[{
    id:1,
    prime:null,
    montant:"null"
  }]
  msgs=[]
  detailsDeclarations:any
  declarations:any
  declaration={date_recolte : new Date(),observations:null}
  form=false;
  cols:any
  _selectedColumns:any
  transform = true
  transformDetails = true
  selectedDeclarations=[]

  constructor(public datepipe: DatePipe,private translateService: TranslateService,private exportService:ExportService,
    public lang:LanguageService,private ouvriersService:OuvriersService,private sfService:SocieteFermeService,
    private primesService:PrimesService) {
  }

  //pour créer une nouvelle déclaration de la récolte

  getSwalInteractions(){
    this.translateService.get(['swal']).subscribe(translations=>{
      this.swalInteractions = translations.swal
    })
  }

  save(){
    this.getSwalInteractions()
    let declarationRecolte = {
      date_recolte:this.declaration.date_recolte,
      observations:this.declaration.observations,
      id_ferme:10002,
      createdBy:"null null",
      id_profil:1,
      parcels:this.parcelles
    }

  }

@Input() get selectedColumns(): any[] {
  return this._selectedColumns;
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
displayModal: boolean = false;
niveaux=[{name:"niveau 1",code:"1"}]
niveau
addNiveau(){
  this.niveaux.push({name:this.niveau,code:(this.niveaux.length+1).toString()})
  this.displayModal=false
}
showModalDialog() {
  this.displayModal = true;
}
  ngOnInit() {
    this.primesService.getPrimes().subscribe(primes=>{
      for(var i=0;i<primes['length'];i++){
        this.primes[i]={label:primes[i].Nom_prime,value:primes[i].IDPrime}
      }
      console.log(this.primes)
    })
    this.translateService.get(['mainOeuvre']).subscribe(res=>{
      this.typePaie=res.mainOeuvre.methodePaie[0].name
    })
    this.ouvriersService.getCaporal().subscribe(caporals=>{
      for(var i=0;i<caporals['length'];i++){
        this.caporals[i] = {label:caporals[i].mat+":"+caporals[i].nom+" "+caporals[i].prenom,value:caporals[i].id}
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
    this.selectedDeclarations=[]
    console.log(this.swalInteractions)
    this.ids=[]
    /**  "matricule":"رقم التسجيل",
        "codeBarre":"الرمز الشريطي",
        "nom":"الاسم ",
        "prenom":"النسب",
        "civilite":"الجنس",
        "civilites":[{"name": "سيد", "code": "1"},{"name": "سيدة", "code": "2"},{"name": "انسة", "code": "3"}],
        "CIN":"رقم البطاقة الوطنية",
        "dateNaissance":"تاريخ الميلاد",
        "situationFamiliale":"الوضع الأسري",
        "situations":[{"name": "(ة)عازب", "code": "1"},
            {"name": "(ة)متزوج", "code": "2"},
            {"name": "مطلق(ة)", "code": "3"},
            {"name": "ارمل(ة)", "code": "4"}],
        "methodePaie":[{"name": " نقد", "code": "1"},
            {"name": "شيك", "code": "2"},
            {"name": "تحويل", "code": "3"}],
        "unitesPaiement":[{"name": "Day", "code": "1"},
            {"name": "Unit", "code": "2"}],
        "traiteSurplus":"",
        "nombreEnfants":"عدد الاطفال",
        "adresse":"العنوان",
        "email":" البريد الالكتروني",
        "tel":"رقم الهاتف",
        "niveauScolaire":"المستوى الدراسي",
        "qualification":"التاهيل",
        "etatcivil":"الحالة المدنية",
        "fonction":"الوظيفة",
        "caporal":"جسدي",
        "attache":"مرفق بـ",
        "categorie":"الفئة",
        "dateEmbauche":"تاريخ التشغيل",
        "cnss":"رقم الضمان الاجتماعي",
        "anciennete":"الأقدمية بالأيام",
        "droitConge":"الحق في الاجازة",
        "congeInitial":"إجازة أولية",
        "tauxAssurance":"سعر التأمين",
        "matriculeAMC":"رقم امس",
        "optionAMC":"خيار امس",
        "exercice":"في التمرين",
        "contractuel":"تعاقدية",
        "fomationPhyto":"تدريب فيتو",
        "obs":"ملاحظة",
        "salaireBase":"المرتب الأساسي",
        "primes":"الأقساط",
        "montant":"المبلغ",
        "unitePaiement":"وحدة الدفع",
        "representeEquipe":"يمثل فريق",
        "modePaiement":"طريقة الدفع",
        "banque":"البنك",
        "rib":"ريب",
        "attachement":"مرفق شركة / مزرعة", */
    this.cols = [
      { field: 'DateRecolte', header: 'matricule' },
      { field: 'parcelles', header: 'nom' },
      { field: 'Observations', header: 'prenom' },
      { field: 'RecolteMO', header: 'CIN' },
      { field: 'RecolteHorsMO', header: 'dateNaissance' },
      { field: 'VentePieds', header: 'fonction' },
      { field: 'QteTotale', header: 'categorie' },
      { field: 'VentePieds', header: 'dateEmbauche' },
      { field: 'QteTotale', header: 'cnss' },
      { field: 'QteTotale', header: 'anciennete' },
      { field: 'QteTotale', header: 'exercice' },
      { field: 'QteTotale', header: 'salaireBase' },
      { field: 'QteTotale', header: 'unitePaiement' }
      
  ];
  this._selectedColumns = this.cols;
  }
  declarationForConsult =[]
  
  consultDeclaration(id){
    this.declarationForConsult.pop()
    this.parcelles = []
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
    this.parcelles = []
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
      parcels:this.parcelles
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
    if(this.parcelles[this.parcelles.length-1].prime&&this.parcelles[this.parcelles.length-1].montant){
      this.parcelles.push({
        id:this.parcelles.length+1,
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
    console.log(this.parcelles.indexOf(parcelle))
    if(this.parcelles.length==1){
      this.parcelles[0]={
        id:this.parcelles.length,
        prime:null,
        montant:null
      }
    }else{
      this.parcelles.splice(this.parcelles.indexOf(parcelle),1)
    }
  }
  //pour afficher, vider et masquer le formulaire 
  showForm(){
      this.declaration={date_recolte : new Date(),observations:null}
      this.parcelles=[{
        id:1,
        prime:null,
        montant:null
      }]
      this.forEdit = false
    this.form=!this.form
  }
  //supprimer plusieurs declarations à la fois
  deleteSelectedDeclarations(){
    this.getSwalInteractions()
    let ids = []
    this.selectedDeclarations.forEach(element=>{
      ids.push(element.ID[0])
    })
    console.log(ids)
    if(ids.length==1){
      this.delete(ids[0])
    }else{
      Swal.fire({
        title: this.swalInteractions.suppressionPlusieurs.titreVal,
        text: this.swalInteractions.suppressionPlusieurs.descriptionVal + "("+this.selectedDeclarations.length+")",
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
      this.selectedDeclarations = this.declarations
    }else{
      this.selectedDeclarations=[]
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