import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardProdutos } from './dashboard-produtos';

describe('DashboardProdutos', () => {
  let component: DashboardProdutos;
  let fixture: ComponentFixture<DashboardProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProdutos],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardProdutos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
