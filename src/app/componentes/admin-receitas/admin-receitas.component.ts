import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receita } from '../receita-card/receita';
import { receitas } from '../../mock-receitas';

@Component({
  selector: 'app-admin-receitas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-receitas.component.html',
  styleUrls: ['./admin-receitas.component.css']
})
export class AdminReceitasComponent implements OnInit {
  receitas: Receita[] = [];
  receitasFiltradas: Receita[] = [];
  
  // Formulário
  modoEdicao = false;
  receitaSelecionada: Receita | null = null;
  
  novaReceita: Receita = {
    id: '',
    name: '',
    flavor: 'Doce',
    image: '',
    ingredients: [],
    instructions: '',
    favorito: false,
    categoria: { id: 'doce', value: 'Doce', receitas: [] }
  };
  
  ingredienteAtual = '';
  
  // Expansion panels
  expandedReceitaId: string | null = null;

  ngOnInit() {
    this.receitas = [...receitas];
    this.receitasFiltradas = [...this.receitas];
  }

  toggleExpansion(receitaId: string) {
    this.expandedReceitaId = this.expandedReceitaId === receitaId ? null : receitaId;
  }

  isExpanded(receitaId: string): boolean {
    return this.expandedReceitaId === receitaId;
  }

  adicionarIngrediente() {
    if (this.ingredienteAtual.trim()) {
      this.novaReceita.ingredients.push(this.ingredienteAtual.trim());
      this.ingredienteAtual = '';
    }
  }

  removerIngrediente(index: number) {
    this.novaReceita.ingredients.splice(index, 1);
  }

  atualizarCategoria() {
    if (this.novaReceita.flavor === 'Doce') {
      this.novaReceita.categoria = { id: 'doce', value: 'Doce', receitas: [] };
    } else {
      this.novaReceita.categoria = { id: 'salgado', value: 'Salgado', receitas: [] };
    }
  }

  salvarReceita() {
    this.atualizarCategoria();
    
    if (this.modoEdicao && this.receitaSelecionada) {
      // Editar receita existente
      const index = this.receitas.findIndex(r => r.id === this.receitaSelecionada!.id);
      if (index !== -1) {
        this.receitas[index] = { ...this.novaReceita };
      }
    } else {
      // Adicionar nova receita
      this.novaReceita.id = (this.receitas.length + 1).toString();
      this.receitas.push({ ...this.novaReceita });
    }
    
    this.receitasFiltradas = [...this.receitas];
    this.limparFormulario();
  }

  editarReceita(receita: Receita) {
    this.modoEdicao = true;
    this.receitaSelecionada = receita;
    this.novaReceita = { ...receita, ingredients: [...receita.ingredients] };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluirReceita(id: string) {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      this.receitas = this.receitas.filter(r => r.id !== id);
      this.receitasFiltradas = [...this.receitas];
    }
  }

  limparFormulario() {
    this.modoEdicao = false;
    this.receitaSelecionada = null;
    this.novaReceita = {
      id: '',
      name: '',
      flavor: 'Doce',
      image: '',
      ingredients: [],
      instructions: '',
      favorito: false,
      categoria: { id: 'doce', value: 'Doce', receitas: [] }
    };
    this.ingredienteAtual = '';
  }

  filtrarPorTipo(tipo: string) {
    if (tipo === 'todos') {
      this.receitasFiltradas = [...this.receitas];
    } else {
      this.receitasFiltradas = this.receitas.filter(r => r.flavor === tipo);
    }
  }
}
