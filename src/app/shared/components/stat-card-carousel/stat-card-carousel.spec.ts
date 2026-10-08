import { StatCardCarousel } from './stat-card-carousel';

describe('StatCardCarousel', () => {

  it(
    'deve ser criado',
    () => {

      const component =
        new StatCardCarousel();

      expect(
        component
      ).toBeTruthy();

    }
  );

  it(
    'deve iniciar com lista de cards vazia',
    () => {

      const component =
        new StatCardCarousel();

      expect(
        component.cards
      ).toEqual([]);

    }
  );

  it(
    'deve permitir atribuir cards',
    () => {

      const component =
        new StatCardCarousel();

      component.cards = [
        {
          title: 'Teste',
          value: 1,
          variant: 'info'
        }
      ];

      expect(
        component.cards.length
      ).toBe(1);

    }
  );

});