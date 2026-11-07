import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardEstoque } from './dashboard-estoque';

describe('DashboardEstoque', () => {
  let component: DashboardEstoque;
  let fixture: ComponentFixture<DashboardEstoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEstoque],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEstoque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
