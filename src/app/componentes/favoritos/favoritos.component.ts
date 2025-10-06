import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReceitaCardComponent } from '../receita-card/receita-card.component';
import { AuthService } from '../../services/auth.service';
import { Receita } from '../receita-card/receita';
import { receitas } from '../../mock-receitas';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, ReceitaCardComponent],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {
  receitasFavoritas: Receita[] = [];
  isLogado = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLogado = !!this.authService.getUsuarioLogado();
    
    if (!this.isLogado) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarFavoritos();
  }

  carregarFavoritos() {
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) return;

    // Buscar IDs dos favoritos no localStorage
    const favoritosIds = JSON.parse(localStorage.getItem(`favoritos-${usuarioLogado.id}`) || '[]');
    
    // Filtrar receitas que estão nos favoritos
    this.receitasFavoritas = receitas.filter((receita: Receita) => favoritosIds.includes(receita.id));
  }

  onReceitaClick(receita: Receita) {
    this.router.navigate(['/receita', receita.id]);
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
