import { LanguageService } from 'src/app/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DeclarationRecolteService } from './../../services/declaration-recolte/declaration-recolte.service';
import { ParcelleCulturaleService } from './../../services/parcelle-culturale/parcelle-culturale.service';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from "primeng/api";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportService } from 'src/app/services/export/export.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { filter } from '@amcharts/amcharts4/.internal/core/utils/Iterator';

 // Ce Component sert à la gestion de la declaration de la recolte
 am4core.useTheme(am4themes_animated);

const doc = new jsPDF()
@Component({
  selector: 'app-declaration-recolte',
  templateUrl: './declaration-recolte.component.html',
  styleUrls: ['./declaration-recolte.component.scss'],
  providers: [MessageService]
})
export class DeclarationRecolteComponent implements OnInit {

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
    ID_Parcelle_Culturale:null,
    designation:"null",
    type:null,
    Solde:null,
    RecolteMO:null,
    RecolteHorsMO:null,
    VentePieds:null,
    QteTotale:null
  }]
  msgs=[]
  detailsDeclarations:any
  declarations:any
  declaration={date_recolte : new Date(),observations:null}
  synthetique = false
  form=false;
  cols:any
  _selectedColumns:any
  transform = true
  transformDetails = true
  selectedDeclarations=[]

  constructor(public datepipe: DatePipe,private translateService: TranslateService,private exportService:ExportService,
    private declarationRecolteService:DeclarationRecolteService,public lang:LanguageService,private parcelleCulturaleService:ParcelleCulturaleService) {
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
    this.declarationRecolteService.addDeclarationRecolte(declarationRecolte).subscribe(res=>{
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
    },err=>console.log(err))
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

  ngOnInit() {
    this.reloadData()
    this.selectedDeclarations=[]
    console.log(this.swalInteractions)
    this.ids=[]
    this.cols = [
      { field: 'DateRecolte', header: 'dateRecolte' },
      { field: 'parcelles', header: 'parcelles' },
      { field: 'Observations', header: 'observations' },
      { field: 'RecolteMO', header: 'recolteMO' },
      { field: 'RecolteHorsMO', header: 'recolteHorsMO' },
      { field: 'VentePieds', header: 'ventePieds' },
      { field: 'QteTotale', header: 'qteTotale' },
  ];
  this._selectedColumns = this.cols;

    this.declarationRecolteService.getDeclarationRecolte().subscribe(res=>{
      console.log(res)
      
      this.declarations=res
      this.declarations.forEach(element => {
        
        element.DateRecolte = new Date(element.DateRecolte)
      });
      this.loading = false;
    })
    this.declarationRecolteService.getDetailsDeclarationRecolte().subscribe(res=>{
      this.detailsDeclarations=res
      this.detailsDeclarations.forEach(element => {
        element.designation = element.designation==1?'Stockable':'Non Stockable'
        element.DateRecolte = new Date(element.DateRecolte)
      });
      this.loading = false;
    })

    //recuperer les parcelles culturales
    this.parcelleCulturaleService.getParcelleCulturale().subscribe(res=>{
      for(var i=0;i<res['length'];i++){
        this.listParcelles[i]={label:res[i].Ref +": "+res[i].designation,value:res[i].ID}
      }
    })
  }
  declarationForConsult =[]
  reloadData(){
    this.data = []
    console.log(this.filtre)
    am4core.useTheme(am4themes_animated);
  // Themes end
  let chart = am4core.create("chartdiv", am4charts.XYChart);
  
  let value = 0;
  this.names = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31"
  ];
    if(this.selectedParcelle && this.selectedMonth && this.selectedYear){
      console.log("hahaha")
      this.declarationRecolteService.getDetailsDeclarationForProductAndPeriode(this.filtre).subscribe(result=>{
        for (var i = 0; i < this.names.length; i++) {
          value = 0;
          for(var j = 0;j< result['length'];j++){
            if(this.names[i]==this.datepipe.transform(result[j].DateRecolte, 'dd')){
              console.log(this.names[i])
              console.log(this.datepipe.transform(result[j].DateRecolte, 'dd'))
              value += result[j].total;
              console.log(value)
            }
          }
          this.data.push({ category: this.names[i], value: value });
        }
        console.log(this.data)
        chart.data = this.data;
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.minGridDistance = 15;
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
        categoryAxis.renderer.labels.template.rotation = -90;
        categoryAxis.renderer.labels.template.horizontalCenter = "left";
        categoryAxis.renderer.labels.template.location = 0.5;
  
        categoryAxis.renderer.labels.template.adapter.add("dx", function(dx, target) {
            return -target.maxRight / 2;
      })
  
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.ticks.template.disabled = true;
        valueAxis.renderer.axisFills.template.disabled = true;
  
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "category";
        series.dataFields.valueY = "value";
        series.tooltipText = "{valueY.value}";
        series.sequencedInterpolation = true;
        series.fillOpacity = 0;
        series.strokeOpacity = 1;
        series.columns.template.width = 0.01;
        series.tooltip.pointerOrientation = "horizontal";
  
        let bullet = series.bullets.create(am4charts.CircleBullet);
  
        chart.cursor = new am4charts.XYCursor();
  
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();
      })
    }
  }
  consultDeclaration(id){
    this.declarationForConsult.pop()
    this.parcelles = []
    this.id = id
    this.forEdit = true
    this.declarationRecolteService.getDetailDeclarationRecolte(id).subscribe(res=>{
      console.log(res)
      this.declaration =   {date_recolte : new Date(res[0].DateRecolte),observations:res[0].Observations}
      this.declarationForConsult.push(this.declaration)
      for(var i=0;i<res['length'];i++){
        this.parcelles[i]={
          id:i+1,
          designation:res[i].Ref +':'+res[i].nom_produit,
          ID_Parcelle_Culturale:res[i].ID_Parcelle_Culturale,
          type:res[i].designation?'Stockable':'Non stockable',
          Solde:res[i].Solde,
          RecolteMO:res[i].RecolteMO,
          RecolteHorsMO:res[i].RecolteHorsMO,
          VentePieds:res[i].VentePieds,
          QteTotale:res[i].QteTotale
        }
      }
      this.consult = true
    })
  }
  //afficher la déclaration de la récolte sélectionnée dans le formulaire pour modification
  edit(id){
    this.id = id
    this.forEdit = true
    this.declarationRecolteService.getDetailDeclarationRecolte(id).subscribe(res=>{
      this.declaration =   {date_recolte : new Date(res[0].DateRecolte),observations:res[0].Observations}
      for(var i=0;i<res['length'];i++){
        this.parcelles[i]={
          id:i+1,
          designation:res[i].Ref +':'+res[i].nom_produit,
          ID_Parcelle_Culturale:res[i].ID_Parcelle_Culturale,
          type:res[i].designation?'Stockable':'Non stockable',
          Solde:res[i].Solde,
          RecolteMO:res[i].RecolteMO,
          RecolteHorsMO:res[i].RecolteHorsMO,
          VentePieds:res[i].VentePieds,
          QteTotale:res[i].QteTotale
        }
      }
      this.form = ! this.form
    })
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
    this.declarationRecolteService.updateDeclarationRecolte(declarationRecolte).subscribe(res=>{
      console.log(res)
      if(res[0].message=="ajout reussi"){
        Swal.fire(
          this.swalInteractions.modification.titre,
          this.swalInteractions.modification.description,
          'success'
        )
        this.showForm()
        this.ngOnInit()
        this.forEdit = false
      }else{
        {
          Swal.fire({
            icon: 'error',
            title:  this.swalInteractions.modification.titreErr,
            text:  this.swalInteractions.modification.descriptionErr,
          })
        }
      }
    })
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
        this.declarationRecolteService.deleteDeclarationRecolte(id).subscribe(res=>{
          console.log(res[0])
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
        },err=>console.log(err))
      }
    })
  }
  //lors du changement de la parcelle il recupère et affiche le type du produit
  onChange(e){
    this.parcelleCulturaleService.getTypeProduit(e.value).subscribe(res=>{
      if(res[0]){
        this.parcelles[this.parcelles.length-1].type=res[0].designation?'Stockable':'Non stockable'
      }else{
        this.parcelles[this.parcelles.length-1].type="Cette parcelle n\' a aucun type de produit"
      }
    })
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
      
    //Pour afficher la vue synthétique
  showHideSynthetique(){
    this.synthetique=!this.synthetique
  }
  
  //calcul du total des quantitéss 
  calculTotal(parcelle){
    let i = this.parcelles.indexOf(parcelle)
    console.log(this.parcelles[i].RecolteMO)
    this.parcelles[i].QteTotale = this.parcelles[i].RecolteMO + this.parcelles[i].RecolteHorsMO + this.parcelles[i].VentePieds
  }
  //Ajouter un nouveau élément à la table si l'élément courant est valide
  addItem(){
    this.getSwalInteractions()
    if(this.parcelles[this.parcelles.length-1].RecolteMO&&this.parcelles[this.parcelles.length-1].Solde&&
      this.parcelles[this.parcelles.length-1].RecolteHorsMO&&this.parcelles[this.parcelles.length-1].Solde &&
      this.parcelles[this.parcelles.length-1].ID_Parcelle_Culturale){
      this.parcelles.push({
        id:this.parcelles.length+1,
        type:null,
        designation:null,
        ID_Parcelle_Culturale:null,
        Solde:null,
        RecolteMO:null,
        RecolteHorsMO:null,
        VentePieds:null,
        QteTotale:null
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
        type:null,
        designation:null,
        ID_Parcelle_Culturale:null,
        Solde:null,
        RecolteMO:null,
        RecolteHorsMO:null,
        VentePieds:null,
        QteTotale:null
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
        ID_Parcelle_Culturale:null,
        designation:"null",
        type:null,
        Solde:null,
        RecolteMO:null,
        RecolteHorsMO:null,
        VentePieds:null,
        QteTotale:null
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
          this.declarationRecolteService.deleteDeclarationsRecolte(ids).subscribe(res=>{
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
      this.selectedDeclarations = this.declarations
    }else{
      this.selectedDeclarations=[]
    }
  }
  copy(){
    console.log(document.execCommand('copy'))
  }
  graphiqueView=false
  showHideGraphique(){
    this.graphiqueView=!this.graphiqueView
  }
  selectedParcelle

  onChangeParcelle(){
    this.filterOptions()
    this.data = []
    this.ngOnInit()    
    if(this.selectedParcelle && this.selectedMonth && this.selectedYear){
      this.reloadData() 
    }
  }

  selectedMonth=null

  onChangeMonth(e){
    this.translateService.get(['primeng']).subscribe(res=>{
      this.selectedMonth=res.primeng.monthNames.indexOf(e.value)+1
      this.filterOptions()
    })

    if(this.selectedParcelle && this.selectedMonth && this.selectedYear){
      this.reloadData()
    }
  }

  selectedYear=null

  onChangeYear(e){
    
    this.selectedYear=e.value.name
    this.filterOptions()
    if(this.selectedParcelle && this.selectedMonth && this.selectedYear){
      this.reloadData()
    }
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