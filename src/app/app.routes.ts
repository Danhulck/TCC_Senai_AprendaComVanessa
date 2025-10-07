import { Routes } from '@angular/router';
import { DetalhesReceitaComponent } from './componentes/detalhes-receita/detalhes-receita.component';
import { ListaReceitasComponent } from './componentes/lista-receitas/lista-receitas.component';
import { ReceitasPorTipoComponent } from './componentes/receitas-por-tipo/receitas-por-tipo.component';
import { LoginComponent } from './componentes/login/login.component';
import { CadastroComponent } from './componentes/cadastro/cadastro.component';
import { AdminReceitasComponent } from './componentes/admin-receitas/admin-receitas.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { FavoritosComponent } from './componentes/favoritos/favoritos.component';
import { HistoricoComponent } from './componentes/historico/historico.component';

export const routes: Routes = [
  { path: '', component: ListaReceitasComponent },
  { path: 'receita/:id', component: DetalhesReceitaComponent },
  { path: 'receitas/:tipo', component: ReceitasPorTipoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'admin/receitas', component: AdminReceitasComponent },
  { path: '**', redirectTo: '' }
];
