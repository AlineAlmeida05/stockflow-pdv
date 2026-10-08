import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Marketing } from './marketing';

import { MarketingApiService } from '../../core/services/marketing-api.service';
import { PromocaoService } from '../../core/services/promocao.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { notificacaoServiceMock } from '../../../testing/mocks/notificacao-service.mock';

describe('Marketing', () => {

    let component: Marketing;
    let fixture: ComponentFixture<Marketing>;

    const marketingApiServiceMock = {
        listar: vi.fn(),
        gerarCampanha: vi.fn()
    };

    const promocaoServiceMock = {
        listarPainel: vi.fn()
    };

    beforeEach(async () => {

        promocaoServiceMock.listarPainel.mockReturnValue(
            of({
                ativas: []
            })
        );

        marketingApiServiceMock.listar.mockReturnValue(
            of([])
        );

        await TestBed.configureTestingModule({
            imports: [Marketing],
            providers: [
                {
                    provide: MarketingApiService,
                    useValue: marketingApiServiceMock
                },
                {
                    provide: PromocaoService,
                    useValue: promocaoServiceMock
                },
                {
                    provide: NotificacaoService,
                    useValue: notificacaoServiceMock
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Marketing);

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar promoções e campanhas no ngOnInit', () => {

        const promocoesSpy =
            vi.spyOn(promocaoServiceMock, 'listarPainel');

        const campanhasSpy =
            vi.spyOn(marketingApiServiceMock, 'listar');

        component.ngOnInit();

        expect(promocoesSpy).toHaveBeenCalled();
        expect(campanhasSpy).toHaveBeenCalled();

    });

    it('deve carregar promoções ativas', () => {

        const promocoes = [
            {
                id: '1',
                nome: 'Promoção Teste'
            }
        ];

        promocaoServiceMock.listarPainel.mockReturnValue(
            of({
                ativas: promocoes
            })
        );

        component.ngOnInit();

        expect(component.promocoesAtivas)
            .toEqual(promocoes);

    });

    it('deve carregar campanhas', () => {

        const campanhas = [
            {
                id: '1'
            }
        ];

        marketingApiServiceMock.listar.mockReturnValue(
            of(campanhas)
        );

        component.ngOnInit();

        expect(component.campanhas)
            .toEqual(campanhas);

    });

    it('deve tratar erro ao carregar promoções', () => {

        const erro = new Error('erro');

        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );

        promocaoServiceMock.listarPainel.mockReturnValue(
            throwError(() => erro)
        );

        component.ngOnInit();

        expect(consoleSpy)
            .toHaveBeenCalledWith(erro);

    });

    it('deve tratar erro ao carregar campanhas', () => {

        const erro = new Error('erro');

        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );

        marketingApiServiceMock.listar.mockReturnValue(
            throwError(() => erro)
        );

        component.ngOnInit();

        expect(consoleSpy)
            .toHaveBeenCalledWith(
                'Erro ao carregar campanhas',
                erro
            );

    });

    it('deve atualizar campanha atual', () => {

        const campanha = {
            id: '1'
        } as any;

        component.atualizarCampanha(
            campanha
        );

        expect(component.campanhaAtual)
            .toEqual(campanha);

        expect(component.campanhas[0])
            .toEqual(campanha);

    });

    it('não deve gerar campanha sem promoção selecionada', () => {

        component.promocaoSelecionada = '';

        marketingApiServiceMock.gerarCampanha
            .mockClear();

        component.gerarCampanha();

        expect(
            marketingApiServiceMock.gerarCampanha
        ).not.toHaveBeenCalled();

    });

    it('deve gerar campanha com sucesso', () => {

        const promocao = {
            id: '1'
        };

        const campanha = {
            id: '100',
            prompt: 'Teste'
        };

        component.promocoesAtivas = [
            promocao as any
        ];

        component.promocaoSelecionada = '1';

        marketingApiServiceMock.gerarCampanha
            .mockReturnValue(
                of(campanha)
            );

        component.gerarCampanha();

        expect(
            marketingApiServiceMock.gerarCampanha
        ).toHaveBeenCalled();

        expect(component.campanhaAtual)
            .toEqual(campanha);

    });

    it('deve tratar erro ao gerar campanha', () => {

        const erro =
            new Error('erro');

        const consoleSpy =
            vi.spyOn(
                console,
                'error'
            )
                .mockImplementation(
                    () => { }
                );

        component.promocoesAtivas = [
            {
                id: '1'
            } as any
        ];

        component.promocaoSelecionada = '1';

        marketingApiServiceMock.gerarCampanha
            .mockReturnValue(
                throwError(() => erro)
            );

        component.gerarCampanha();

        expect(consoleSpy)
            .toHaveBeenCalledWith(
                'Erro ao gerar campanha',
                erro
            );

    });

    it('não deve copiar quando não existir prompt', () => {

        component.campanhaAtual = undefined;

        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn()
            }
        });

        const clipboardSpy =
            vi.spyOn(
                navigator.clipboard,
                'writeText'
            );

        component.copiarPrompt();

        expect(clipboardSpy)
            .not.toHaveBeenCalled();

    });


    it('deve copiar prompt para área de transferência', () => {

        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn()
            }
        });

        const clipboardSpy =
            vi.spyOn(
                navigator.clipboard,
                'writeText'
            )
                .mockResolvedValue();

        component.campanhaAtual = {
            prompt: 'Texto teste'
        } as any;

        component.copiarPrompt();

        expect(clipboardSpy)
            .toHaveBeenCalledWith(
                'Texto teste'
            );

    });


});