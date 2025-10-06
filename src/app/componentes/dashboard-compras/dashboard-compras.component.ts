import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ListaCompras } from '../../models/lista-compras.model';
import { ListaComprasService } from '../../services/lista-compras.service';

type TipoFiltro = 'dia' | 'semana' | 'mes' | 'ano' | 'personalizado' | 'loja' | 'item';

@Component({
  selector: 'app-dashboard-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard-compras.component.html',
  styleUrls: ['./dashboard-compras.component.css']
})
export class DashboardComprasComponent implements OnInit {
  listas: ListaCompras[] = [];
  listasFiltradas: ListaCompras[] = [];
  
  // Filtros
  tipoFiltro: TipoFiltro = 'mes';
  dataInicio: Date = new Date();
  dataFim: Date = new Date();
  lojaSelecionada: string = '';
  itemSelecionado: string = '';
  
  // Listas disponíveis
  todasLojas: string[] = [];
  todosItens: string[] = [];
  
  // Estatísticas
  totalGasto: number = 0;
  totalCompras: number = 0;
  mediaGasto: number = 0;
  
  // Estatísticas por loja
  gastosPorLoja: { loja: string; total: number; compras: number }[] = [];
  
  // Estatísticas por item
  itensMaisComprados: { item: string; quantidade: number; gasto: number }[] = [];

  constructor(
    private listaComprasService: ListaComprasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDados();
    this.aplicarFiltro();
  }

  carregarDados() {
    this.listas = this.listaComprasService.getListasFinalizadas();
    this.todasLojas = this.listaComprasService.getTodasLojas();
    this.todosItens = this.listaComprasService.getTodosItens();
  }

  aplicarFiltro() {
    switch (this.tipoFiltro) {
      case 'dia':
        this.filtrarPorDia();
        break;
      case 'semana':
        this.filtrarPorSemana();
        break;
      case 'mes':
        this.filtrarPorMes();
        break;
      case 'ano':
        this.filtrarPorAno();
        break;
      case 'personalizado':
        this.filtrarPorPeriodo();
        break;
      case 'loja':
        this.filtrarPorLoja();
        break;
      case 'item':
        this.filtrarPorItem();
        break;
    }
    
    this.calcularEstatisticas();
  }

  filtrarPorDia() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    this.listasFiltradas = this.listas.filter(lista => {
      const data = lista.dataFinalizacao || lista.dataCompra;
      return data >= hoje && data < amanha;
    });
  }

  filtrarPorSemana() {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);
    
    this.listasFiltradas = this.listas.filter(lista => {
      const data = lista.dataFinalizacao || lista.dataCompra;
      return data >= inicioSemana && data < fimSemana;
    });
  }

  filtrarPorMes() {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);
    
    this.listasFiltradas = this.listas.filter(lista => {
      const data = lista.dataFinalizacao || lista.dataCompra;
      return data >= inicioMes && data <= fimMes;
    });
  }

  filtrarPorAno() {
    const hoje = new Date();
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    const fimAno = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);
    
    this.listasFiltradas = this.listas.filter(lista => {
      const data = lista.dataFinalizacao || lista.dataCompra;
      return data >= inicioAno && data <= fimAno;
    });
  }

  filtrarPorPeriodo() {
    this.listasFiltradas = this.listas.filter(lista => {
      const data = lista.dataFinalizacao || lista.dataCompra;
      return data >= this.dataInicio && data <= this.dataFim;
    });
  }

  filtrarPorLoja() {
    if (!this.lojaSelecionada) {
      this.listasFiltradas = this.listas;
    } else {
      this.listasFiltradas = this.listas.filter(lista => 
        lista.lojaFornecedor.toLowerCase().includes(this.lojaSelecionada.toLowerCase())
      );
    }
  }

  filtrarPorItem() {
    if (!this.itemSelecionado) {
      this.listasFiltradas = this.listas;
    } else {
      this.listasFiltradas = this.listas.filter(lista =>
        lista.itens.some(item => 
          item.nomeProduto.toLowerCase().includes(this.itemSelecionado.toLowerCase())
        )
      );
    }
  }

  calcularEstatisticas() {
    this.totalGasto = this.listasFiltradas.reduce((sum, lista) => sum + lista.valorTotal, 0);
    this.totalCompras = this.listasFiltradas.length;
    this.mediaGasto = this.totalCompras > 0 ? this.totalGasto / this.totalCompras : 0;
    
    this.calcularGastosPorLoja();
    this.calcularItensMaisComprados();
  }

  calcularGastosPorLoja() {
    const lojaMap = new Map<string, { total: number; compras: number }>();
    
    this.listasFiltradas.forEach(lista => {
      const loja = lista.lojaFornecedor;
      if (lojaMap.has(loja)) {
        const dados = lojaMap.get(loja)!;
        dados.total += lista.valorTotal;
        dados.compras += 1;
      } else {
        lojaMap.set(loja, { total: lista.valorTotal, compras: 1 });
      }
    });
    
    this.gastosPorLoja = Array.from(lojaMap.entries())
      .map(([loja, dados]) => ({ loja, ...dados }))
      .sort((a, b) => b.total - a.total);
  }

  calcularItensMaisComprados() {
    const itemMap = new Map<string, { quantidade: number; gasto: number }>();
    
    this.listasFiltradas.forEach(lista => {
      lista.itens.forEach(item => {
        if (itemMap.has(item.nomeProduto)) {
          const dados = itemMap.get(item.nomeProduto)!;
          dados.quantidade += item.quantidade;
          dados.gasto += item.precoTotal;
        } else {
          itemMap.set(item.nomeProduto, { 
            quantidade: item.quantidade, 
            gasto: item.precoTotal 
          });
        }
      });
    });
    
    this.itensMaisComprados = Array.from(itemMap.entries())
      .map(([item, dados]) => ({ item, ...dados }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }

  editarLista(id: string) {
    this.router.navigate(['/lista-compras/editar', id]);
  }

  voltarParaListas() {
    this.router.navigate(['/listas-compras']);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  get dataInicioFormatada(): string {
    return this.formatarDataParaInput(this.dataInicio);
  }

  set dataInicioFormatada(value: string) {
    this.dataInicio = new Date(value);
  }

  get dataFimFormatada(): string {
    return this.formatarDataParaInput(this.dataFim);
  }

  set dataFimFormatada(value: string) {
    this.dataFim = new Date(value);
  }

  private formatarDataParaInput(data: Date): string {
    const d = new Date(data);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get tituloFiltro(): string {
    switch (this.tipoFiltro) {
      case 'dia': return 'Hoje';
      case 'semana': return 'Esta Semana';
      case 'mes': return 'Este Mês';
      case 'ano': return 'Este Ano';
      case 'personalizado': return 'Período Personalizado';
      case 'loja': return `Loja: ${this.lojaSelecionada || 'Todas'}`;
      case 'item': return `Item: ${this.itemSelecionado || 'Todos'}`;
      default: return 'Filtro';
    }
  }
}
