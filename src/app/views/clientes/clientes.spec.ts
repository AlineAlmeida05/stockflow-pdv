import { Clientes } from './clientes';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe(
  'Clientes',
  () => {

    let component: Clientes;

    beforeEach(() => {

      component =
        new Clientes(
          {} as never,
          {} as never,
          {} as never,
          {} as never
        );

    });

    it(
      'deve retornar todos os clientes quando a busca estiver vazia',
      () => {

        component.clientes = [
          {
            nome: 'João',
            telefone: '111'
          } as never,

          {
            nome: 'Maria',
            telefone: '222'
          } as never
        ];

        component.textoBusca = '';

        expect(
          component.clientesFiltrados.length
        ).toBe(2);

      }
    );

    it(
      'deve filtrar clientes pelo nome',
      () => {

        component.clientes = [
          {
            nome: 'João',
            telefone: '111'
          } as never,

          {
            nome: 'Maria',
            telefone: '222'
          } as never
        ];

        component.textoBusca = 'joão';

        expect(
          component.clientesFiltrados.length
        ).toBe(1);

      }
    );

    it(
      'deve filtrar clientes pelo telefone',
      () => {

        component.clientes = [
          {
            nome: 'João',
            telefone: '11999999999'
          } as never,

          {
            nome: 'Maria',
            telefone: '11888888888'
          } as never
        ];

        component.textoBusca = '9999';

        expect(
          component.clientesFiltrados.length
        ).toBe(1);

      }
    );

    it(
      'deve ignorar maiúsculas e minúsculas na busca',
      () => {

        component.clientes = [
          {
            nome: 'João Silva',
            telefone: '111'
          } as never
        ];

        component.textoBusca = 'JOÃO';

        expect(
          component.clientesFiltrados.length
        ).toBe(1);

      }
    );

    it(
      'deve exibir controle Ativo para clientes ativos',
      () => {

        component.clientes = [
          {
            nome: 'João',
            telefone: '111',
            ativo: true
          } as never
        ];

        const resultado =
          component.clientesTabela as any[];

        expect(
          resultado[0].controle
        ).toBe(
          'Ativo'
        );

      }
    );

    it(
      'deve exibir controle Inativo para clientes inativos',
      () => {

        component.clientes = [
          {
            nome: 'João',
            telefone: '111',
            ativo: false
          } as never
        ];

        const resultado =
          component.clientesTabela as any[];

        expect(
          resultado[0].controle
        ).toBe(
          'Inativo'
        );

      }
    );

    it(
      'deve exibir sinal negativo para saldo devedor',
      () => {

        expect(
          component.formatarSaldoDevedor(100)
        ).toContain('-');

      }
    );

    it(
      'deve retornar string vazia para valor undefined',
      () => {

        expect(
          component.formatarSaldoDevedor(undefined)
        ).toBe('');

      }
    );

    it(
      'deve formatar valor monetário em reais',
      () => {

        expect(
          component.formatarMoeda(100)
        ).toContain('100');

      }
    );

    it(
      'deve montar tabela com controle Ativo',
      () => {

        component.clientes = [
          {
            nome: 'João',
            telefone: '111',
            ativo: true
          } as never
        ];

        const resultado =
          component.clientesTabela as any[];

        expect(
          resultado[0].controle
        ).toBe('Ativo');

      }
    );

    it(
      'deve montar tabela com controle Inativo',
      () => {

        component.clientes = [
          {
            nome: 'João',
            telefone: '111',
            ativo: false
          } as never
        ];

        const resultado =
          component.clientesTabela as any[];

        expect(
          resultado[0].controle
        ).toBe('Inativo');

      }
    );

    it(
      'deve exibir aviso quando o nome do cliente estiver vazio',
      () => {

        const alertService = {
          warning: vi.fn()
        };

        component =
          new Clientes(
            {} as never,
            alertService as never,
            {} as never,
            {} as never
          );

        component.nome = '';

        component.salvarCliente();

        expect(
          alertService.warning
        ).toHaveBeenCalledWith(
          'Informe o nome do cliente.'
        );

      }
    );

    it(
      'deve cadastrar cliente com sucesso',
      () => {

        const clienteService = {
          salvar: vi.fn(() => of({})),
          listar: vi.fn(() => of([]))
        };

        const alertService = {
          success: vi.fn(),
          error: vi.fn()
        };

        component =
          new Clientes(
            clienteService as never,
            alertService as never,
            {} as never,
            {
              detectChanges: vi.fn()
            } as never
          );

        component.nome = 'Maria';

        component.salvarCliente();

        expect(
          clienteService.salvar
        ).toHaveBeenCalled();

        expect(
          alertService.success
        ).toHaveBeenCalledWith(
          'Cliente cadastrado com sucesso.'
        );

      }
    );

    it(
      'deve atualizar cliente com sucesso',
      () => {

        const clienteService = {
          atualizar: vi.fn(() => of({})),
          listar: vi.fn(() => of([]))
        };

        const alertService = {
          success: vi.fn(),
          error: vi.fn()
        };

        component =
          new Clientes(
            clienteService as never,
            alertService as never,
            {} as never,
            {
              detectChanges: vi.fn()
            } as never
          );

        component.clienteEditandoId = '1';

        component.nome = 'Maria';

        component.salvarCliente();

        expect(
          clienteService.atualizar
        ).toHaveBeenCalled();

        expect(
          alertService.success
        ).toHaveBeenCalledWith(
          'Cliente atualizado com sucesso.'
        );

      }
    );

    it(
      'deve preparar formulário para novo cliente',
      () => {

        component.nome = 'Teste';

        component.telefone = '123';

        component.clienteEditandoId = '1';

        component.novoCliente();

        expect(
          component.nome
        ).toBe('');

        expect(
          component.telefone
        ).toBe('');

        expect(
          component.clienteEditandoId
        ).toBeNull();

        expect(
          component.mostrarFormulario
        ).toBe(true);

      }
    );

    it(
      'deve limpar formulário ao cancelar edição',
      () => {

        component.nome = 'Teste';

        component.telefone = '123';

        component.clienteEditandoId = '1';

        component.cancelarEdicao();

        expect(
          component.nome
        ).toBe('');

        expect(
          component.telefone
        ).toBe('');

        expect(
          component.clienteEditandoId
        ).toBeNull();

        expect(
          component.mostrarFormulario
        ).toBe(false);

      }
    );

    it(
      'deve desabilitar modo visualização',
      () => {

        component.modoVisualizacao = true;

        component.habilitarEdicao();

        expect(
          component.modoVisualizacao
        ).toBe(false);

      }
    );

    it(
      'deve retornar vazio para data indefinida',
      () => {

        expect(
          component.formatarData()
        ).toBe('');

      }
    );

    it(
      'deve formatar data válida',
      () => {

        const resultado =
          component.formatarData(
            '2026-10-06'
          );

        expect(
          resultado
        ).not.toBe('');

      }
    );

    it(
      'deve carregar dados para edição',
      () => {

        const cliente = {
          id: '1',
          nome: 'Maria',
          telefone: '11999999999',
          limiteCredito: 500,
          observacao: 'teste'
        } as never;

        component.editarCliente(
          cliente
        );

        expect(
          component.clienteEditandoId
        ).toBe('1');

        expect(
          component.nome
        ).toBe('Maria');

        expect(
          component.telefone
        ).toBe('11999999999');

        expect(
          component.mostrarFormulario
        ).toBe(true);

      }
    );

    it(
      'deve carregar cliente para visualização',
      () => {

        const cliente = {
          id: '1',
          nome: 'Maria',
          telefone: '11999999999',
          limiteCredito: 500
        } as never;

        component.visualizarCliente(
          cliente
        );

        expect(
          component.clienteSelecionado
        ).toBe(cliente);

        expect(
          component.modoVisualizacao
        ).toBe(true);

        expect(
          component.mostrarFormulario
        ).toBe(true);

      }
    );

    it(
      'deve abrir confirmação para inativar cliente ativo',
      () => {

        const open = vi.fn();

        component =
          new Clientes(
            {} as never,
            {} as never,
            {
              open
            } as never,
            {} as never
          );

        component.alternarStatusCliente({
          id: '1',
          nome: 'Maria',
          ativo: true
        } as never);

        expect(
          open
        ).toHaveBeenCalled();

      }
    );

    it(
      'deve abrir confirmação para reativar cliente inativo',
      () => {

        const open = vi.fn();

        component =
          new Clientes(
            {} as never,
            {} as never,
            {
              open
            } as never,
            {} as never
          );

        component.alternarStatusCliente({
          id: '1',
          nome: 'Maria',
          ativo: false
        } as never);

        expect(
          open
        ).toHaveBeenCalled();

      }
    );

  }
);