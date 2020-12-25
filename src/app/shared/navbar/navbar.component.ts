import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  clickItem1(){console.log("hahahaha")}
  items = [
    {
        label: 'Fertilisation',
        icon: 'pi pi-pw pi-th-large',
        items: [{
                label: 'Ordre de fertilisation', 
                icon: 'pi pi-fw pi-plus',
                items: [
                    {label: 'Ajouter', icon: 'pi pi-fw pi-user-plus', command: (event) => this.clickItem1() },
                    {label: 'Consulter', icon: 'pi pi-fw pi-filter'}
                ]
            },
            {label: 'Réalisation', 
            icon: 'pi pi-fw pi-external-link',
            items: [
              {label: 'Ajouter', icon: 'pi pi-fw pi-user-plus'},
              {label: 'Consulter', icon: 'pi pi-fw pi-filter'}
          ]
          }
        ]
    }, {
      label: 'Irrigation',
      icon: 'pi pi-pw pi-slack',
      items: [{
              label: 'Ajouter', 
              icon: 'pi pi-fw pi-plus',
          },
          {label: 'Consulter', 
          icon: 'pi pi-fw pi-external-link',
          items: [
            {label: 'Vue normale', icon: 'pi pi-fw pi-user-plus'},
            {label: 'Vue synthètique', icon: 'pi pi-fw pi-filter'}
        ]
        }
      ]
  },
    {
      label: 'Floraison',
      icon: 'pi pi-pw pi-file',
      items: [{
              label: 'Pourcentage d\'ouverture', 
              icon: 'pi pi-fw pi-plus',
              items: [
                  {label: 'Synthèse', icon: 'pi pi-fw pi-user-plus'},
                  {label: 'Consulter', icon: 'pi pi-fw pi-filter'}
              ]
          },
          {label: 'Suivi d\'intensité des fleurs', 
          icon: 'pi pi-fw pi-external-link',
          items: [
            {label: 'Synthèse', icon: 'pi pi-fw pi-user-plus'},
            {label: 'Consulter', icon: 'pi pi-fw pi-filter'}
        ]
        }
      ]
    }
];
  constructor(config: NgbDropdownConfig,private languageservice:LanguageService) {
    config.placement = 'bottom-right';
  }
  open(){
    if(document.getElementById('theme-settings').getAttribute('class')=='settings-panel'){
      document.getElementById('theme-settings').setAttribute('class', 'settings-panel open');
    }else if(document.getElementById('theme-settings').getAttribute('class')=='settings-panel open'){
      document.getElementById('theme-settings').setAttribute('class', 'settings-panel');
    }
  }
  ngOnInit() {}
  changeLanguage(lang){
    this.languageservice.translate(lang)
    console.log(localStorage.getItem('lang'))
    if(localStorage.getItem('lang')=='ar'){
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    }else{
      document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
    }
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
