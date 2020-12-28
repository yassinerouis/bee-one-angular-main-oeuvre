import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DeclarationRecolteService } from './../../services/declaration-recolte/declaration-recolte.service';
import { ParcelleCulturaleService } from './../../services/parcelle-culturale/parcelle-culturale.service';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from "primeng/api";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportService } from 'src/app/services/export/export.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

 // Ce Component sert à la gestion de la declaration de la recolte

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

  constructor(public datepipe: DatePipe,private translateService: TranslateService,private exportService:ExportService,
    private declarationRecolteService:DeclarationRecolteService,private parcelleCulturaleService:ParcelleCulturaleService) {
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
cols:any
_selectedColumns:any
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
transform = true
transformDetails = true
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
ar = false
swalInteractions:any
  ngOnInit() {
    this.selectedDeclarations=[]
    if(localStorage.getItem('lang')=='ar'){
      this.ar=true 
    }
    else{
      this.ar=false
    }
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
  showSelected(){
console.log(this.selectedColumns)
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
  selectedDeclarations=[]
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
  showOnlyLinkedRisks(event) {
    console.log(event.checked)
    if(event.checked){
      this.selectedDeclarations = this.declarations
    }else{
      this.selectedDeclarations=[]
    }
  }
}
