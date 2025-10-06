import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioLogado } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuarioLogado: UsuarioLogado | null = null;
  modoEdicao = false;
  
  // Dados editáveis
  nome: string = '';
  email: string = '';
  
  // Foto de perfil
  avatarUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.authService.getUsuarioLogado();
    if (this.usuarioLogado) {
      this.nome = this.usuarioLogado.nome;
      this.email = this.usuarioLogado.email;
      this.carregarAvatar();
    }
  }

  carregarAvatar() {
    if (this.usuarioLogado?.id) {
      const foto = localStorage.getItem(`foto-perfil-${this.usuarioLogado.id}`);
      this.avatarUrl = foto ? foto : null;
    }
  }

  ativarEdicao() {
    this.modoEdicao = true;
  }

  cancelarEdicao() {
    this.modoEdicao = false;
    if (this.usuarioLogado) {
      this.nome = this.usuarioLogado.nome;
      this.email = this.usuarioLogado.email;
    }
  }

  onFotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.usuarioLogado?.id) {
          const fotoBase64 = e.target.result;
          localStorage.setItem(`foto-perfil-${this.usuarioLogado.id}`, fotoBase64);
          this.avatarUrl = fotoBase64;
          // Notifica o header para atualizar
          window.dispatchEvent(new CustomEvent('avatar-updated'));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removerFoto() {
    if (this.usuarioLogado?.id) {
      localStorage.removeItem(`foto-perfil-${this.usuarioLogado.id}`);
      this.avatarUrl = null;
      // Notifica o header para atualizar
      window.dispatchEvent(new CustomEvent('avatar-updated'));
    }
  }

  salvarAlteracoes() {
    if (!this.usuarioLogado) return;

    // Validações básicas
    if (!this.nome.trim()) {
      alert('Nome não pode estar vazio!');
      return;
    }

    if (!this.email.trim()) {
      alert('Email não pode estar vazio!');
      return;
    }

    // Simular atualização (você pode implementar um método no AuthService)
    alert('Dados atualizados com sucesso!');
    this.modoEdicao = false;
  }

  get isAdmin(): boolean {
    return this.usuarioLogado?.tipo === 'admin';
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
