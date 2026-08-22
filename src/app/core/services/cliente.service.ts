import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly STORAGE_KEY =
    'stockflow-clientes';

  private obterClientes(): Cliente[] {

    if (typeof window === 'undefined') {
      return [];
    }

    const dados =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);

  }

  private salvarClientes(
    clientes: Cliente[]
  ): void {

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(clientes)
    );

  }

  listar(): Cliente[] {

    return this.obterClientes();

  }

  buscarPorId(
    id: string
  ): Cliente | undefined {

    return this.obterClientes()
      .find(cliente => cliente.id === id);

  }

  salvar(
    cliente: Cliente
  ): void {

    const clientes =
      this.obterClientes();

    clientes.push(cliente);

    this.salvarClientes(clientes);

  }

  atualizar(
    clienteAtualizado: Cliente
  ): void {

    const clientes =
      this.obterClientes();

    const indice =
      clientes.findIndex(
        cliente =>
          cliente.id === clienteAtualizado.id
      );

    if (indice === -1) {
      return;
    }

    clientes[indice] =
      clienteAtualizado;

    this.salvarClientes(clientes);

  }

  excluir(id: string): void {

    const clientes =
      this.obterClientes();

    const atualizados =
      clientes.filter(
        cliente => cliente.id !== id
      );

    this.salvarClientes(
      atualizados
    );

  }

}