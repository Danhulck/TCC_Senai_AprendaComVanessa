import { Component, input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CategoriaReceita } from '../receita-card/receita';
import { ReceitaCardComponent } from '../receita-card/receita-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-receita',
  standalone: true,
  imports: [ReceitaCardComponent, CommonModule],
  templateUrl: './categoria-receita.component.html',
  styleUrl: './categoria-receita.component.css'
})
export class CategoriaReceitaComponent implements AfterViewInit {
  categoria = input.required<CategoriaReceita>();

  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  canScrollLeft = false;
  canScrollRight = false;

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateScrollButtons();
      this.carousel.nativeElement.addEventListener('scroll', () => this.updateScrollButtons());
    }, 100);
  }

  @HostListener('window:resize')
  onResize() {
    // Recalcula estado dos botões quando a viewport mudar
    this.updateScrollButtons();
  }

  updateScrollButtons() {
    const element = this.carousel.nativeElement;
    this.canScrollLeft = element.scrollLeft > 0;
    this.canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth - 1);
  }

  scrollLeft() {
    const amount = this.getScrollAmount();
    this.carousel.nativeElement.scrollBy({ left: -amount, behavior: 'smooth' });
  }

  scrollRight() {
    const amount = this.getScrollAmount();
    this.carousel.nativeElement.scrollBy({ left: amount, behavior: 'smooth' });
  }

  private getScrollAmount(): number {
    const width = this.carousel?.nativeElement?.clientWidth || 0;
    // Avança ~90% da largura visível, com um mínimo para telas pequenas
    return Math.max(220, Math.floor(width * 0.9));
  }
}
