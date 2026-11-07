import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardVendas } from './dashboard-vendas';

describe('DashboardVendas', () => {
  let component: DashboardVendas;
  let fixture: ComponentFixture<DashboardVendas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVendas],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardVendas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
