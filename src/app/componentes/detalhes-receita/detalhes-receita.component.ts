import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Receita, CategoriaReceita } from '../receita-card/receita';
import { receitas } from '../../mock-receitas';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detalhes-receita',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhes-receita.component.html',
  styleUrls: ['./detalhes-receita.component.css']
})
export class DetalhesReceitaComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  receita: Receita | undefined;

  ngOnInit() {
    const receitaId = this.route.snapshot.paramMap.get('id');
    if (receitaId) {
      this.receita = receitas.find(r => r.id === receitaId);
      if (!this.receita) {
        this.router.navigate(['/']);
      } else {
        this.salvarNoHistorico(this.receita);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  private salvarNoHistorico(receita: Receita) {
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) return;

    const historicoKey = `historico-${usuarioLogado.id}`;
    const historico = JSON.parse(localStorage.getItem(historicoKey) || '{}');
    
    if (historico[receita.id]) {
      // Receita já existe no histórico, atualizar
      historico[receita.id].dataAcesso = new Date().toISOString();
      historico[receita.id].vezesAcessada += 1;
    } else {
      // Nova receita no histórico
      historico[receita.id] = {
        dataAcesso: new Date().toISOString(),
        vezesAcessada: 1
      };
    }
    
    localStorage.setItem(historicoKey, JSON.stringify(historico));
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
