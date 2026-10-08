import { CurrencyInput } from './currency-input';

describe('CurrencyInput', () => {

  let component: CurrencyInput;

  beforeEach(() => {
    component = new CurrencyInput();
  });

  it('deve iniciar display vazio quando value for null', () => {

    component.value = null;

    component.ngOnInit();

    expect(component.displayValue).toBe('');

  });

  it('deve formatar valor ao iniciar', () => {

    component.value = 123.45;

    component.ngOnInit();

    expect(component.displayValue).toContain('123');

  });

  it('deve limpar valor quando input estiver vazio', () => {

    const emitSpy =
      vi.spyOn(component.valueChange, 'emit');

    component.onInput({
      target: {
        value: ''
      }
    } as unknown as Event);

    expect(component.value).toBeNull();
    expect(component.displayValue).toBe('');
    expect(emitSpy).toHaveBeenCalledWith(null);

  });

  it('deve converter texto para valor monetário', () => {

    const emitSpy =
      vi.spyOn(component.valueChange, 'emit');

    component.onInput({
      target: {
        value: '12345'
      }
    } as unknown as Event);

    expect(component.value).toBe(123.45);

    expect(emitSpy)
      .toHaveBeenCalledWith(123.45);

  });

  it('deve atualizar display formatado após entrada', () => {

    component.onInput({
      target: {
        value: '1000'
      }
    } as unknown as Event);

    expect(component.displayValue)
      .toContain('10');

  });

});