import { Component } from '@angular/core';
import { CategoriaReceita, Receita } from '../receita-card/receita';
import { receitas } from '../../mock-receitas';
import { CategoriaReceitaComponent } from '../categoria-receita/categoria-receita.component';

@Component({
  selector: 'app-lista-receitas',
  standalone: true,
  imports: [CategoriaReceitaComponent],
  templateUrl: './lista-receitas.component.html',
  styleUrl: './lista-receitas.component.css'
})
export class ListaReceitasComponent {
  categorias: CategoriaReceita[] = [];
  receitasPorCategoria: Map<string, Receita[]> = new Map();

  ngOnInit() {
    this.receitasPorCategoria = new Map();

    receitas.forEach((receita) => {
      const categoriaId = receita.categoria.id;
      if (!this.receitasPorCategoria.has(categoriaId)) {
        this.receitasPorCategoria.set(categoriaId, []);
      }
      this.receitasPorCategoria.get(categoriaId)?.push(receita);
    });

    this.categorias = [
      {
        id: 'doce',
        value: 'Doces',
        receitas: this.receitasPorCategoria.get('doce') ?? []
      },
      {
        id: 'salgado',
        value: 'Salgados',
        receitas: this.receitasPorCategoria.get('salgado') ?? []
      },
    ];

    console.log(this.receitasPorCategoria);
  }
}
