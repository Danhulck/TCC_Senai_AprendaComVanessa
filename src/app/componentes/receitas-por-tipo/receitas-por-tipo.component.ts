import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Receita } from '../receita-card/receita';
import { receitas } from '../../mock-receitas';
import { ReceitaCardComponent } from '../receita-card/receita-card.component';

@Component({
  selector: 'app-receitas-por-tipo',
  standalone: true,
  imports: [CommonModule, ReceitaCardComponent],
  templateUrl: './receitas-por-tipo.component.html',
  styleUrls: ['./receitas-por-tipo.component.css']
})
export class ReceitasPorTipoComponent implements OnInit {
  tipo: string = '';
  receitasFiltradas: Receita[] = [];
  titulo: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.tipo = params.get('tipo') || '';
      this.filtrarReceitas();
    });
  }

  filtrarReceitas() {
    if (this.tipo === 'doce') {
      this.receitasFiltradas = receitas.filter(r => r.categoria.id === 'doce');
      this.titulo = 'Receitas Doces';
    } else if (this.tipo === 'salgado') {
      this.receitasFiltradas = receitas.filter(r => r.categoria.id === 'salgado');
      this.titulo = 'Receitas Salgadas';
    } else {
      this.receitasFiltradas = receitas;
      this.titulo = 'Todas as Receitas';
    }
  }
}
