import { Injectable } from '@angular/core';
import { ListaCompras, ItemCompra } from '../models/lista-compras.model';

@Injectable({
  providedIn: 'root'
})
export class ListaComprasService {
  private readonly STORAGE_KEY = 'listas-compras';

  constructor() { }

  // Obter todas as listas
  getListas(): ListaCompras[] {
    const listas = localStorage.getItem(this.STORAGE_KEY);
    if (listas) {
      const parsed = JSON.parse(listas);
      // Converter strings de data de volta para Date
      return parsed.map((lista: any) => ({
        ...lista,
        dataCriacao: new Date(lista.dataCriacao),
        dataCompra: new Date(lista.dataCompra)
      }));
    }
    return [];
  }

  // Obter lista por ID
  getListaById(id: string): ListaCompras | undefined {
    const listas = this.getListas();
    return listas.find(lista => lista.id === id);
  }

  // Salvar lista
  salvarLista(lista: ListaCompras): void {
    const listas = this.getListas();
    const index = listas.findIndex(l => l.id === lista.id);
    
    if (index >= 0) {
      listas[index] = lista;
    } else {
      listas.push(lista);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(listas));
  }

  // Deletar lista
  deletarLista(id: string): void {
    let listas = this.getListas();
    listas = listas.filter(lista => lista.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(listas));
  }

  // Calcular preço do item (considerando atacado)
  calcularPrecoItem(item: ItemCompra): number {
    if (item.quantidadeAtacado && item.precoAtacado && item.quantidade >= item.quantidadeAtacado) {
      return item.quantidade * item.precoAtacado;
    }
    return item.quantidade * item.precoUnitario;
  }

  // Calcular valor total da lista
  calcularValorTotal(itens: ItemCompra[]): number {
    return itens.reduce((total, item) => total + this.calcularPrecoItem(item), 0);
  }

  // Gerar ID único
  gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Finalizar compra
  finalizarCompra(id: string): void {
    const lista = this.getListaById(id);
    if (lista) {
      lista.finalizada = true;
      lista.dataFinalizacao = new Date();
      this.salvarLista(lista);
    }
  }

  // Obter listas finalizadas
  getListasFinalizadas(): ListaCompras[] {
    return this.getListas().filter(lista => lista.finalizada);
  }

  // Obter listas ativas (não finalizadas)
  getListasAtivas(): ListaCompras[] {
    return this.getListas().filter(lista => !lista.finalizada);
  }

  // Estatísticas por período
  getEstatisticasPorPeriodo(dataInicio: Date, dataFim: Date): any {
    const listas = this.getListasFinalizadas().filter(lista => {
      const dataFin = lista.dataFinalizacao || lista.dataCompra;
      return dataFin >= dataInicio && dataFin <= dataFim;
    });

    const totalGasto = listas.reduce((sum, lista) => sum + lista.valorTotal, 0);
    const totalCompras = listas.length;
    const mediaGasto = totalCompras > 0 ? totalGasto / totalCompras : 0;

    return {
      totalGasto,
      totalCompras,
      mediaGasto,
      listas
    };
  }

  // Estatísticas por loja
  getEstatisticasPorLoja(loja: string): any {
    const listas = this.getListasFinalizadas().filter(lista => 
      lista.lojaFornecedor.toLowerCase().includes(loja.toLowerCase())
    );

    const totalGasto = listas.reduce((sum, lista) => sum + lista.valorTotal, 0);
    const totalCompras = listas.length;

    return {
      loja,
      totalGasto,
      totalCompras,
      listas
    };
  }

  // Estatísticas por item
  getEstatisticasPorItem(nomeItem: string): any {
    const listas = this.getListasFinalizadas();
    const itensEncontrados: ItemCompra[] = [];
    
    listas.forEach(lista => {
      lista.itens.forEach(item => {
        if (item.nomeProduto.toLowerCase().includes(nomeItem.toLowerCase())) {
          itensEncontrados.push(item);
        }
      });
    });

    const quantidadeTotal = itensEncontrados.reduce((sum, item) => sum + item.quantidade, 0);
    const gastoTotal = itensEncontrados.reduce((sum, item) => sum + item.precoTotal, 0);
    const precoMedio = itensEncontrados.length > 0 ? gastoTotal / quantidadeTotal : 0;

    return {
      nomeItem,
      quantidadeTotal,
      gastoTotal,
      precoMedio,
      vezesComprado: itensEncontrados.length
    };
  }

  // Obter todas as lojas únicas
  getTodasLojas(): string[] {
    const listas = this.getListas();
    const lojas = new Set<string>();
    listas.forEach(lista => lojas.add(lista.lojaFornecedor));
    return Array.from(lojas).sort();
  }

  // Obter todos os itens únicos
  getTodosItens(): string[] {
    const listas = this.getListas();
    const itens = new Set<string>();
    listas.forEach(lista => {
      lista.itens.forEach(item => itens.add(item.nomeProduto));
    });
    return Array.from(itens).sort();
  }
}
