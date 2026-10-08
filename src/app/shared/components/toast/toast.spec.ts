import { ToastComponent } from './toast';
import { AlertService } from '../../../core/services/alert.service';

describe('ToastComponent', () => {

  let component: ToastComponent;

  beforeEach(() => {

    component = new ToastComponent(
      {} as AlertService
    );

  });

  it('deve retornar ícone de sucesso', () => {

    expect(
      component.getIcon('success')
    ).toBe('✅');

  });

  it('deve retornar ícone de erro', () => {

    expect(
      component.getIcon('error')
    ).toBe('❌');

  });

  it('deve retornar ícone de aviso', () => {

    expect(
      component.getIcon('warning')
    ).toBe('⚠️');

  });

  it('deve retornar ícone de carregamento', () => {

    expect(
      component.getIcon('loading')
    ).toBe('🔄');

  });

  it('deve retornar ícone padrão', () => {

    expect(
      component.getIcon('qualquer-coisa')
    ).toBe('ℹ️');

  });

});