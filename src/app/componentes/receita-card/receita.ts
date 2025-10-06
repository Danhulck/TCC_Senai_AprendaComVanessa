export interface Receita {
  id: string;
  name: string;            // Nome do prato
  flavor: string;          // Doce, Salgado, etc.
  image: string;           // Caminho da imagem
  ingredients: string[];   // Lista de ingredientes
  instructions: string;    // Modo de preparo
  favorito: boolean;       // Se é favorito ou não
  categoria: CategoriaReceita; // Ligação com a categoria
}

export interface CategoriaReceita {
  id: string;               // Ex.: "doce", "salgado"
  value: string;            // Rótulo visível ("Doce", "Salgado")
  receitas: Receita[];      // Lista de receitas dessa categoria
}
