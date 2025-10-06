import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  aceitarTermos: boolean = false;
  mensagemErro: string = '';
  mensagemSucesso: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  cadastrar() {
    // Validações
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.mensagemErro = 'Por favor, preencha todos os campos!';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.mensagemErro = 'As senhas não coincidem!';
      return;
    }

    if (this.senha.length < 6) {
      this.mensagemErro = 'A senha deve ter no mínimo 6 caracteres!';
      return;
    }

    if (!this.aceitarTermos) {
      this.mensagemErro = 'Você deve aceitar os Termos e Condições para continuar.';
      return;
    }

    const resultado = this.authService.cadastrar(this.nome, this.email, this.senha);
    
    if (resultado.sucesso) {
      this.mensagemSucesso = resultado.mensagem;
      this.mensagemErro = '';
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.mensagemErro = resultado.mensagem;
      this.mensagemSucesso = '';
    }
  }

  voltarParaLogin() {
    this.router.navigate(['/login']);
  }
}
