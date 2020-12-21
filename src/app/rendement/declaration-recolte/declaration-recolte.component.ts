import { Component, OnInit } from '@angular/core';
import { Customer, Representative } from "./customer";
import { CustomerService } from "./customerservice";
import { MessageService } from "primeng/api";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportService } from 'src/app/services/export/export.service';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
 
const doc = new jsPDF()
@Component({
  selector: 'app-declaration-recolte',
  templateUrl: './declaration-recolte.component.html',
  styleUrls: ['./declaration-recolte.component.scss'],
  providers: [MessageService]
})
export class DeclarationRecolteComponent implements OnInit {
  customers: Customer[];

  representatives: Representative[];

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];
 
  constructor(private messageService: MessageService,private customerService: CustomerService,private exportService:ExportService) {
  }
  currentDate = new Date()
  ngOnInit() {
    this.customerService.getCustomersLarge().then(customers => {
      this.customers = customers;
      this.loading = false;

      this.customers.forEach(
        customer => (customer.date = new Date(customer.date))
      );
    });

    this.representatives = [
      { name: "Amy Elsner", image: "amyelsner.png" },
      { name: "Anna Fali", image: "annafali.png" },
      { name: "Asiya Javayant", image: "asiyajavayant.png" },
      { name: "Bernardo Dominic", image: "bernardodominic.png" },
      { name: "Elwin Sharvill", image: "elwinsharvill.png" },
      { name: "Ioni Bowcher", image: "ionibowcher.png" },
      { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
      { name: "Onyama Limba", image: "onyamalimba.png" },
      { name: "Stephen Shaw", image: "stephenshaw.png" },
      { name: "XuXue Feng", image: "xuxuefeng.png" }
    ];

    this.statuses = [
      { label: "Unqualified", value: "unqualified" },
      { label: "Qualified", value: "qualified" },
      { label: "New", value: "new" },
      { label: "Negotiation", value: "negotiation" },
      { label: "Renewal", value: "renewal" },
      { label: "Proposal", value: "proposal" }
    ];
    //this.exportExcel()
    //this.exportPdf()
  }
  exportPdf() {
    let columns=[
      { header: 'Balance', dataKey: 'balance' },
      { header: 'Company', dataKey: 'company' },
    ]
    this.exportService.setTable(this.customers)
    this.exportService.exportPdf(columns,'table.pdf')
  }
  printPdf(){
    let columns=[
      { header: 'Balance', dataKey: 'balance' },
      { header: 'Company', dataKey: 'company' },
    ]
    this.exportService.setTable(this.customers)
    this.exportService.printPdf(columns)
  }
  exportExcel() {
    this.exportService.exportExcel('table')
  }
  hero = {name:""}

 

  parcelles=[{
    id:1,
    ref:null,
    solde:null,
    typeProduit:null,
    recolteMO:null,
    recolteHorsMO:null,
    pied:null,
    qteTotal:null
  }]
  msgs=[]
  calculTotal(parcelle){
    
    let i = this.parcelles.indexOf(parcelle)
    console.log(this.parcelles[i].recolteMO)
    this.parcelles[i].qteTotal = this.parcelles[i].recolteMO + this.parcelles[i].recolteHorsMO + this.parcelles[i].pied
    console.log(this.parcelles[i].qteTotal)
  }
  addItem(){
    if(this.parcelles[this.parcelles.length-1].recolteMO||this.parcelles[this.parcelles.length-1].solde||
      this.parcelles[this.parcelles.length-1].recolteHorsMO||this.parcelles[this.parcelles.length-1].solde){
      this.parcelles.push({
        id:this.parcelles.length+1,
        ref:null,
        solde:null,
        typeProduit:null,
        recolteMO:null,
        recolteHorsMO:null,
        pied:null,
        qteTotal:null
      })
    }
    else{
      this.messageService.add({severity:'error', summary:'Veuillez renseigner', detail:'tous les champs obligatoires'});
    }  
  }
  removeItem(parcelle){
    console.log(this.parcelles.indexOf(parcelle))
    if(this.parcelles.length==1){
      this.parcelles[0]={
        id:this.parcelles.length,
        ref:null,
        solde:null,
        typeProduit:null,
        recolteMO:null,
        recolteHorsMO:null,
        pied:null,
        qteTotal:null
      }
    }else{
      this.parcelles.splice(this.parcelles.indexOf(parcelle),1)
    }
  }
  date_recolte = new Date()
  value1=""
  value2=""
  value3=""
  form=false;
  showForm(){
    this.form=!this.form
  }
 
  toggleProBanner(event) {
    console.log("123");
    event.preventDefault();
    document.querySelector('body').classList.toggle('removeProbanner');
  }
  date: Date = new Date();

  visitSaleChartData = [{
    label: 'CHN',
    data: [20, 40, 15, 35, 25, 50, 30, 20],
    borderWidth: 1,
    fill: false,
  },
  {
    label: 'USA',
    data: [40, 30, 20, 10, 50, 15, 35, 40],
    borderWidth: 1,
    fill: false,
  },
  {
    label: 'UK',
    data: [70, 10, 30, 40, 25, 50, 15, 30],
    borderWidth: 1,
    fill: false,
  }];

  visitSaleChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  visitSaleChartOptions = {
    responsive: true,
    legend: false,
    scales: {
        yAxes: [{
            ticks: {
                display: false,
                min: 0,
                stepSize: 20,
                max: 80
            },
            gridLines: {
              drawBorder: false,
              color: 'rgba(235,237,242,1)',
              zeroLineColor: 'rgba(235,237,242,1)'
            }
        }],
        xAxes: [{
            gridLines: {
              display:false,
              drawBorder: false,
              color: 'rgba(0,0,0,1)',
              zeroLineColor: 'rgba(235,237,242,1)'
            },
            ticks: {
                padding: 20,
                fontColor: "#9c9fa6",
                autoSkip: true,
            },
            categoryPercentage: 0.4,
            barPercentage: 0.4
        }]
      }
  };

  visitSaleChartColors = [
    {
      backgroundColor: [
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
      ],
      borderColor: [
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
      ]
    },
    {
      backgroundColor: [
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
      ],
      borderColor: [
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
      ]
    },
    {
      backgroundColor: [
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
      ],
      borderColor: [
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
      ]
    },
  ];

  trafficChartData = [
    {
      data: [30, 30, 40],
    }
  ];

  trafficChartLabels = ["Search Engines", "Direct Click", "Bookmarks Click"];

  trafficChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: false,
  };

  trafficChartColors = [
    {
      backgroundColor: [
        'rgba(177, 148, 250, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(132, 217, 210, 1)'
      ],
      borderColor: [
        'rgba(177, 148, 250, .2)',
        'rgba(254, 112, 150, .2)',
        'rgba(132, 217, 210, .2)'
      ]
    }
  ];

}
