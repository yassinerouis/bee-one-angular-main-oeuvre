import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DeclarationRecolteComponent } from './../../rendement/declaration-recolte/declaration-recolte.component';
import { Component, Inject, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from 'src/app/services/language/language.service';
import { Route } from '@angular/compiler/src/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  lang
  clickItem1(){console.log("hahahaha")}
  items = []
  constructor(@Inject(DOCUMENT) private document: Document,config: NgbDropdownConfig,private route:Router,private languageservice:LanguageService,private translateService:TranslateService) {
    config.placement = 'bottom-right';
  }
  ngOnInit(){
    this.changeLanguage();
  }
  open(){
    if(document.getElementById('theme-settings').getAttribute('class')=='settings-panel'){
      document.getElementById('theme-settings').setAttribute('class', 'settings-panel open');
    }else if(document.getElementById('theme-settings').getAttribute('class')=='settings-panel open'){
      document.getElementById('theme-settings').setAttribute('class', 'settings-panel');
    }
  }
  changeLanguage(lang?){
    if(!lang){lang=localStorage.getItem('lang')}
    this.lang=lang
    this.languageservice.translate(lang)
    if(localStorage.getItem('lang')=='ar'){
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
     document.getElementsByClassName('navbar-nav-right')[0]['style'].marginLeft='0';
     document.getElementsByClassName('navbar-nav-right')[0]['style'].marginRight='auto';
    }else{
     document.getElementsByClassName('navbar-nav-right')[0]['style'].marginLeft='auto';
    document.getElementsByClassName('navbar-nav-right')[0]['style'].marginRight='0';
      document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
    }
    this.translateService.get(['raccourcis','global']).subscribe(translations => {
      this.items = [
        {
            label:translations.raccourcis.fertilisation,
            icon: 'pi pi-pw pi-th-large',
            items: [{
                    label: translations.global.consulter, 
                    icon: 'pi pi-fw pi-eye',
                    items: [
                        {label:translations.global.vueNormale, icon: 'pi pi-fw pi-user-plus', command: (event) => this.clickItem1() },
                        {label: translations.global.vueSynthetique, icon: 'pi pi-fw pi-filter'}
                    ]
                },
                {label: translations.global.ajouter , 
                icon: 'pi pi-fw pi-external-link',
              }
            ]
        }, {
          label: translations.raccourcis.irrigation,
          icon: 'pi pi-pw pi-slack',
          items: [{
                  label: translations.global.ajouter, 
                  icon: 'pi pi-fw pi-plus',
              },
              {label: translations.global.consulter, 
              icon: 'pi pi-fw pi-external-link',
              items: [
                {label:  translations.global.vueNormale, icon: 'pi pi-fw pi-user-plus'},
                {label:  translations.global.vueSynthetique , icon: 'pi pi-fw pi-filter'}
            ]
            }
          ]
        },
        {
          label: translations.raccourcis.floraison,
          icon: 'pi pi-pw pi-file',
          items: [{
                  label: translations.global.ajouter, 
                  icon: 'pi pi-fw pi-plus',
                  items: [
                      {label:  translations.global.consulter, icon: 'pi pi-fw pi-user-plus'},
                      {label:  translations.global.ajouter, icon: 'pi pi-fw pi-filter'}
                  ]
              },
              {label: translations.global.editer, 
              icon: 'pi pi-fw pi-external-link',
              items: [
                {label: translations.global.vueGraphique, icon: 'pi pi-fw pi-user-plus'},
                {label:  translations.global.consulter, icon: 'pi pi-fw pi-filter'}
            ]
            }
          ]
        }
    ];
    })
    
  }
  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if(this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if(this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // toggle right sidebar
  // toggleRightSidebar() {
  //   document.querySelector('#right-sidebar').classList.toggle('open');
  // }

}
