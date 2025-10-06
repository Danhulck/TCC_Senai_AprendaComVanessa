import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Receita } from './receita';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-receita-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './receita-card.component.html',
  styleUrl: './receita-card.component.css'
})
export class ReceitaCardComponent implements OnInit {
  @Input() receita!: Receita;
  authService = inject(AuthService);
  isFavorito = false;

  ngOnInit() {
    this.verificarFavorito();
  }

  private verificarFavorito() {
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) {
      this.isFavorito = false;
      return;
    }

    const favoritosIds = JSON.parse(localStorage.getItem(`favoritos-${usuarioLogado.id}`) || '[]');
    this.isFavorito = favoritosIds.includes(this.receita.id);
  }

  alternarFavorito(event: Event) {
    event.stopPropagation();
    
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) {
      // Se não estiver logado, redirecionar para login
      return;
    }

    const favoritosKey = `favoritos-${usuarioLogado.id}`;
    const favoritosIds = JSON.parse(localStorage.getItem(favoritosKey) || '[]');
    
    if (this.isFavorito) {
      // Remover dos favoritos
      const index = favoritosIds.indexOf(this.receita.id);
      if (index > -1) {
        favoritosIds.splice(index, 1);
      }
      this.isFavorito = false;
    } else {
      // Adicionar aos favoritos
      favoritosIds.push(this.receita.id);
      this.isFavorito = true;
    }
    
    localStorage.setItem(favoritosKey, JSON.stringify(favoritosIds));
  }
}
