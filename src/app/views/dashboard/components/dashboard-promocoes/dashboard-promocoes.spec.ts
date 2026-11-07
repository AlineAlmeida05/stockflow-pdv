import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPromocoes } from './dashboard-promocoes';

describe('DashboardPromocoes', () => {
  let component: DashboardPromocoes;
  let fixture: ComponentFixture<DashboardPromocoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPromocoes],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPromocoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
