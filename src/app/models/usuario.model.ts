export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: 'admin' | 'usuario';
  dataCriacao: Date;
  manterLogado?: boolean;
}

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'usuario';
  manterLogado: boolean;
}
