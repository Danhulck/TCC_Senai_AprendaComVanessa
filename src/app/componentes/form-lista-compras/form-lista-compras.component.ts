import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaCompras, ItemCompra } from '../../models/lista-compras.model';
import { ListaComprasService } from '../../services/lista-compras.service';

@Component({
  selector: 'app-form-lista-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-lista-compras.component.html',
  styleUrls: ['./form-lista-compras.component.css']
})
export class FormListaComprasComponent implements OnInit {
  lista: ListaCompras = {
    id: '',
    lojaFornecedor: '',
    dataCriacao: new Date(),
    dataCompra: new Date(),
    itens: [],
    valorTotal: 0,
    finalizada: false,
    supermercados: []
  };

  novoItem: ItemCompra = {
    id: '',
    nomeProduto: '',
    quantidade: 1,
    precoUnitario: 0,
    precoTotal: 0,
    quantidadeAtacado: undefined,
    precoAtacado: undefined,
    comprado: false,
    supermercado: ''
  };

  novoSupermercado: string = '';
  supermercadosDisponiveis: string[] = [];

  isEdicao = false;
  mostrarFormItem = false;
  itemEditandoIndex: number | null = null;

  constructor(
    private listaComprasService: ListaComprasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      const listaExistente = this.listaComprasService.getListaById(id);
      if (listaExistente) {
        this.lista = { ...listaExistente };
        this.supermercadosDisponiveis = [...this.lista.supermercados];
      }
    } else {
      this.lista.id = this.listaComprasService.gerarId();
    }
  }

  // Adicionar supermercado
  adicionarSupermercado() {
    if (this.novoSupermercado.trim() && !this.supermercadosDisponiveis.includes(this.novoSupermercado.trim())) {
      this.supermercadosDisponiveis.push(this.novoSupermercado.trim());
      this.lista.supermercados = [...this.supermercadosDisponiveis];
      this.novoSupermercado = '';
    }
  }

  // Remover supermercado
  removerSupermercado(supermercado: string) {
    this.supermercadosDisponiveis = this.supermercadosDisponiveis.filter(s => s !== supermercado);
    this.lista.supermercados = [...this.supermercadosDisponiveis];
  }

  // Formatar data para input date
  get dataCriacaoFormatada(): string {
    return this.formatarDataParaInput(this.lista.dataCriacao);
  }

  set dataCriacaoFormatada(value: string) {
    this.lista.dataCriacao = new Date(value);
  }

  get dataCompraFormatada(): string {
    return this.formatarDataParaInput(this.lista.dataCompra);
  }

  set dataCompraFormatada(value: string) {
    this.lista.dataCompra = new Date(value);
  }

  private formatarDataParaInput(data: Date): string {
    const d = new Date(data);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Calcular preço do item
  calcularPrecoItem() {
    if (this.novoItem.quantidadeAtacado && this.novoItem.precoAtacado && 
        this.novoItem.quantidade >= this.novoItem.quantidadeAtacado) {
      this.novoItem.precoTotal = this.novoItem.quantidade * this.novoItem.precoAtacado;
    } else {
      this.novoItem.precoTotal = this.novoItem.quantidade * this.novoItem.precoUnitario;
    }
  }

  // Adicionar ou atualizar item
  salvarItem() {
    if (!this.novoItem.nomeProduto || this.novoItem.quantidade <= 0 || this.novoItem.precoUnitario <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    this.calcularPrecoItem();

    if (this.itemEditandoIndex !== null) {
      // Atualizar item existente
      this.lista.itens[this.itemEditandoIndex] = { ...this.novoItem };
      this.itemEditandoIndex = null;
    } else {
      // Adicionar novo item
      this.novoItem.id = this.listaComprasService.gerarId();
      this.lista.itens.push({ ...this.novoItem });
    }

    this.atualizarValorTotal();
    this.resetarFormItem();
    this.mostrarFormItem = false;
  }

  // Editar item
  editarItem(index: number) {
    this.novoItem = { ...this.lista.itens[index] };
    this.itemEditandoIndex = index;
    this.mostrarFormItem = true;
  }

  // Remover item
  removerItem(index: number) {
    if (confirm('Deseja remover este item?')) {
      this.lista.itens.splice(index, 1);
      this.atualizarValorTotal();
    }
  }

  // Resetar formulário de item
  resetarFormItem() {
    this.novoItem = {
      id: '',
      nomeProduto: '',
      quantidade: 1,
      precoUnitario: 0,
      precoTotal: 0,
      quantidadeAtacado: undefined,
      precoAtacado: undefined,
      comprado: false,
      supermercado: ''
    };
    this.itemEditandoIndex = null;
  }

  // Cancelar edição de item
  cancelarItem() {
    this.resetarFormItem();
    this.mostrarFormItem = false;
  }

  // Atualizar valor total da lista
  atualizarValorTotal() {
    this.lista.valorTotal = this.listaComprasService.calcularValorTotal(this.lista.itens);
  }

  // Salvar lista
  salvarLista() {
    if (!this.lista.lojaFornecedor) {
      alert('Por favor, informe a loja/fornecedor!');
      return;
    }

    if (this.lista.itens.length === 0) {
      alert('Adicione pelo menos um item à lista!');
      return;
    }

    this.listaComprasService.salvarLista(this.lista);
    this.router.navigate(['/listas-compras']);
  }

  // Cancelar e voltar
  cancelar() {
    this.router.navigate(['/listas-compras']);
  }

  // Toggle checkbox de item comprado
  toggleItemComprado(index: number) {
    this.lista.itens[index].comprado = !this.lista.itens[index].comprado;
  }

  // Finalizar compra
  finalizarCompra() {
    if (!this.lista.lojaFornecedor) {
      alert('Por favor, informe a loja/fornecedor!');
      return;
    }

    if (this.lista.itens.length === 0) {
      alert('Adicione pelo menos um item à lista!');
      return;
    }

    if (confirm('Deseja finalizar esta compra? Ela será movida para o histórico.')) {
      this.lista.finalizada = true;
      this.lista.dataFinalizacao = new Date();
      this.listaComprasService.salvarLista(this.lista);
      this.router.navigate(['/dashboard-compras']);
    }
  }

  // Formatação
  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Verificar se pode finalizar
  get podeFinalizarCompra(): boolean {
    return this.lista.itens.length > 0 && !this.lista.finalizada;
  }
}
