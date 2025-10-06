import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ListaCompras } from '../../models/lista-compras.model';
import { ListaComprasService } from '../../services/lista-compras.service';

@Component({
  selector: 'app-listas-compras',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listas-compras.component.html',
  styleUrls: ['./listas-compras.component.css']
})
export class ListasComprasComponent implements OnInit {
  listas: ListaCompras[] = [];
  mostrarFinalizadas = false;

  constructor(
    private listaComprasService: ListaComprasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarListas();
  }

  carregarListas() {
    if (this.mostrarFinalizadas) {
      this.listas = this.listaComprasService.getListasFinalizadas();
    } else {
      this.listas = this.listaComprasService.getListasAtivas();
    }
    // Ordenar por data de criação (mais recente primeiro)
    this.listas.sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());
  }

  toggleMostrarFinalizadas() {
    this.mostrarFinalizadas = !this.mostrarFinalizadas;
    this.carregarListas();
  }

  verDashboard() {
    this.router.navigate(['/dashboard-compras']);
  }

  criarNovaLista() {
    this.router.navigate(['/lista-compras/nova']);
  }

  editarLista(id: string) {
    this.router.navigate(['/lista-compras/editar', id]);
  }

  deletarLista(id: string) {
    if (confirm('Tem certeza que deseja deletar esta lista de compras?')) {
      this.listaComprasService.deletarLista(id);
      this.carregarListas();
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
