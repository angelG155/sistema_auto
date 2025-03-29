import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeCarComponent } from './edite-car.component';

describe('EditeCarComponent', () => {
  let component: EditeCarComponent;
  let fixture: ComponentFixture<EditeCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeCarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditeCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
