export interface ItemCompra {
  id: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  quantidadeAtacado?: number;
  precoAtacado?: number;
  comprado: boolean;
  supermercado: string;
}

export interface ListaCompras {
  id: string;
  lojaFornecedor: string;
  dataCriacao: Date;
  dataCompra: Date;
  itens: ItemCompra[];
  valorTotal: number;
  finalizada: boolean;
  dataFinalizacao?: Date;
  supermercados: string[];
}
