import { Injectable } from '@angular/core';
import { Usuario, UsuarioLogado } from '../models/usuario.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USUARIOS_KEY = 'usuarios';
  private readonly USUARIO_LOGADO_KEY = 'usuario-logado';
  
  private usuarioLogadoSubject = new BehaviorSubject<UsuarioLogado | null>(null);
  public usuarioLogado$: Observable<UsuarioLogado | null> = this.usuarioLogadoSubject.asObservable();

  constructor() {
    this.inicializarAdmin();
    this.verificarUsuarioLogado();
  }

  // Inicializar admin padrão
  private inicializarAdmin() {
    const usuarios = this.getUsuarios();
    const adminExiste = usuarios.some(u => u.tipo === 'admin');
    
    if (!adminExiste) {
      const admin: Usuario = {
        id: this.gerarId(),
        nome: 'Administrador',
        email: 'admin@receitas.com',
        senha: 'admin123', // Em produção, usar hash
        tipo: 'admin',
        dataCriacao: new Date()
      };
      usuarios.push(admin);
      localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(usuarios));
    }
  }

  // Verificar se há usuário logado
  private verificarUsuarioLogado() {
    const usuarioLogadoStr = localStorage.getItem(this.USUARIO_LOGADO_KEY);
    if (usuarioLogadoStr) {
      const usuarioLogado: UsuarioLogado = JSON.parse(usuarioLogadoStr);
      this.usuarioLogadoSubject.next(usuarioLogado);
    }
  }

  // Obter todos os usuários
  private getUsuarios(): Usuario[] {
    const usuarios = localStorage.getItem(this.USUARIOS_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
  }

  // Salvar usuários
  private salvarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(usuarios));
  }

  // Cadastrar novo usuário
  cadastrar(nome: string, email: string, senha: string): { sucesso: boolean; mensagem: string } {
    const usuarios = this.getUsuarios();
    
    // Verificar se email já existe
    if (usuarios.some(u => u.email === email)) {
      return { sucesso: false, mensagem: 'Este email já está cadastrado!' };
    }

    const novoUsuario: Usuario = {
      id: this.gerarId(),
      nome,
      email,
      senha, // Em produção, usar hash
      tipo: 'usuario',
      dataCriacao: new Date()
    };

    usuarios.push(novoUsuario);
    this.salvarUsuarios(usuarios);

    return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
  }

  // Login
  login(email: string, senha: string, manterLogado: boolean = false): { sucesso: boolean; mensagem: string } {
    const usuarios = this.getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
      return { sucesso: false, mensagem: 'Email ou senha incorretos!' };
    }

    const usuarioLogado: UsuarioLogado = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      manterLogado
    };

    localStorage.setItem(this.USUARIO_LOGADO_KEY, JSON.stringify(usuarioLogado));
    this.usuarioLogadoSubject.next(usuarioLogado);

    return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
  }

  // Logout
  logout() {
    localStorage.removeItem(this.USUARIO_LOGADO_KEY);
    this.usuarioLogadoSubject.next(null);
  }

  // Obter usuário logado
  getUsuarioLogado(): UsuarioLogado | null {
    return this.usuarioLogadoSubject.value;
  }

  // Verificar se está logado
  isLogado(): boolean {
    return this.usuarioLogadoSubject.value !== null;
  }

  // Verificar se é admin
  isAdmin(): boolean {
    const usuario = this.usuarioLogadoSubject.value;
    return usuario?.tipo === 'admin';
  }

  // Gerar ID único
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
