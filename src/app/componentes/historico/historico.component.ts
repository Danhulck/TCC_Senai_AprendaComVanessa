import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Receita } from '../receita-card/receita';
import { receitas } from '../../mock-receitas';

interface ItemHistorico {
  receita: Receita;
  dataAcesso: Date;
  vezesAcessada: number;
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  historicoReceitas: ItemHistorico[] = [];
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

    this.carregarHistorico();
  }

  carregarHistorico() {
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) return;

    // Buscar histórico no localStorage
    const historico = JSON.parse(localStorage.getItem(`historico-${usuarioLogado.id}`) || '{}');
    
    // Converter para array e ordenar por data de acesso (mais recente primeiro)
    this.historicoReceitas = Object.keys(historico)
      .map(receitaId => {
        const receita = receitas.find((r: Receita) => r.id === receitaId);
        if (!receita) return null;
        
        return {
          receita,
          dataAcesso: new Date(historico[receitaId].dataAcesso),
          vezesAcessada: historico[receitaId].vezesAcessada
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.dataAcesso.getTime() - a!.dataAcesso.getTime()) as ItemHistorico[];
  }

  onReceitaClick(receita: Receita) {
    this.router.navigate(['/receita', receita.id]);
  }

  limparHistorico() {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      const usuarioLogado = this.authService.getUsuarioLogado();
      if (usuarioLogado) {
        localStorage.removeItem(`historico-${usuarioLogado.id}`);
        this.historicoReceitas = [];
      }
    }
  }

  formatarData(data: Date): string {
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    
    if (dias === 0) {
      return 'Hoje';
    } else if (dias === 1) {
      return 'Ontem';
    } else if (dias < 7) {
      return `${dias} dias atrás`;
    } else {
      return data.toLocaleDateString('pt-BR');
    }
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
