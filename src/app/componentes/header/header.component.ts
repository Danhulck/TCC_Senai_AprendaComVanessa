import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioLogado } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSidenavOpen = false;
  isReceitasExpanded = false;
  isPerfilOpen = false;
  usuarioLogado: UsuarioLogado | null = null;
  avatarUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.usuarioLogado$.subscribe(usuario => {
      this.usuarioLogado = usuario;
      this.carregarAvatar();
    });
  }

  private carregarAvatar() {
    if (this.usuarioLogado?.id) {
      const foto = localStorage.getItem(`foto-perfil-${this.usuarioLogado.id}`);
      this.avatarUrl = foto ? foto : null;
    } else {
      this.avatarUrl = null;
    }
  }

  @HostListener('window:avatar-updated')
  onAvatarUpdated() {
    this.carregarAvatar();
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  toggleReceitas() {
    this.isReceitasExpanded = !this.isReceitasExpanded;
  }

  togglePerfil() {
    this.isPerfilOpen = !this.isPerfilOpen;
  }

  closeSidenav() {
    this.isSidenavOpen = false;
    this.isReceitasExpanded = false;
  }

  closePerfil() {
    this.isPerfilOpen = false;
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
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removerFoto() {
    if (this.usuarioLogado?.id) {
      localStorage.removeItem(`foto-perfil-${this.usuarioLogado.id}`);
      this.avatarUrl = null;
    }
  }

  logout() {
    this.authService.logout();
    this.closePerfil();
    this.router.navigate(['/']);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  get isLogado(): boolean {
    return this.usuarioLogado !== null;
  }

  get isAdmin(): boolean {
    return this.usuarioLogado?.tipo === 'admin';
  }
}
