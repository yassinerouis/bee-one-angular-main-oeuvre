import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OuvrierComponent } from './ouvrier.component';

describe('OuvriersComponent', () => {
  let component: OuvrierComponent;
  let fixture: ComponentFixture<OuvrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OuvrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuvrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
