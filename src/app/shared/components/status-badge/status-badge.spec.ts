import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {

  let component: StatusBadge;

  beforeEach(() => {
    component = new StatusBadge();
  });

  it(
    'deve retornar variant informado quando autoVariant for false',
    () => {

      component.autoVariant = false;
      component.variant = 'success';

      expect(
        component.resolvedVariant
      ).toBe('success');

    }
  );

  it(
    'deve retornar success para status ativo',
    () => {

      component.autoVariant = true;
      component.text = 'Ativo';

      expect(
        component.resolvedVariant
      ).toBe('success');

    }
  );

  it(
    'deve retornar warning para status atenção',
    () => {

      component.autoVariant = true;
      component.text = 'Atenção';

      expect(
        component.resolvedVariant
      ).toBe('warning');

    }
  );

  it(
    'deve retornar danger para status crítico',
    () => {

      component.autoVariant = true;
      component.text = 'Crítico';

      expect(
        component.resolvedVariant
      ).toBe('danger');

    }
  );

  it(
    'deve retornar info quando nenhum critério for atendido',
    () => {

      component.autoVariant = true;
      component.text = 'Outro Status';

      expect(
        component.resolvedVariant
      ).toBe('info');

    }
  );

});
