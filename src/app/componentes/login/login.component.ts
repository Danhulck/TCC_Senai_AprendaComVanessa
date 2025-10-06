import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  manterLogado: boolean = false;
  mensagemErro: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.email || !this.senha) {
      this.mensagemErro = 'Por favor, preencha todos os campos!';
      return;
    }

    const resultado = this.authService.login(this.email, this.senha, this.manterLogado);
    
    if (resultado.sucesso) {
      this.router.navigate(['/']);
    } else {
      this.mensagemErro = resultado.mensagem;
    }
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
