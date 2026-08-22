# StockflowPdvFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



em nova venda, ao inves de selecionar o produto, ser um input de busca que, ao digitar 3 letras aparecem as sugestões e ai deve ser autocomplete

implementar o campo para codigo de barras no cadastro de produto


em nova venda, ao incluir outra venda, o campo cliente está vindo com o nome do ultimo cliente que foi usado


roadmap :

✅ Criar componentes reutilizáveis
✅ Implementar em todas as telas
✅ Padronizar UX
✅ Remover duplicações
✅ Revisar módulos existentes
↓
📊 Relatórios
↓
🔔 Toasts/Notificações
↓
🔗 Backend


dashboard = incluir um gráfico

nova venda= ao incluio o código de barras, o campo produto deve trazer o produto, 
depois de selecionar o produto tem um bug

TODO UI
2
 
3
✅ Sidebar corrigida
4
⬜ Toolbar alinhada
5
⬜ Carrossel padronizado
6
⬜ Filtros na mesma linha
7
⬜ Scroll vertical insights
8
⬜ Responsividade final
Mostrar mais linhas

Fase 1 - UX Completo

Passar página por página:

Plain Text

Dashboard

Nova Venda

Histórico

Produtos

Estoque

Promoções

Marketing IA

Empresa

Relatórios
Mostrar mais linhas

e responder:

Essa tela faz sentido?
Tem informação sobrando?
Tem campo desnecessário?
O fluxo é intuitivo?
Um dono de adega conseguiria usar?

Fase 2 - Definir contratos

Depois do UX aprovado.

Exemplo:

Plain Text

POST /marketing/gerar-arte

POST /promocoes

GET /produtos

POST /vendas

Fase 3 - Backend

Aí o Spring Boot nasce já sabendo exatamente:

Plain Text

o que recebe

o que devolve

// TODO:
2
// Registrar Chart.js uma única vez
3
// em um provider global.

// TODO:
2
// Avaliar unificação com ReportLayout.