import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyRegister } from './property-register';

describe('PropertyRegister', () => {
  let component: PropertyRegister;
  let fixture: ComponentFixture<PropertyRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
