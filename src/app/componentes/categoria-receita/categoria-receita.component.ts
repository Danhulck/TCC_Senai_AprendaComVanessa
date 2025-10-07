import { Component, input, ViewChild, ElementRef, AfterViewInit, HostListener, NgZone, ChangeDetectorRef } from '@angular/core';
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

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      // Garante que começamos no início do carrossel
      this.carousel.nativeElement.scrollTo({ left: 0 });
      this.runUpdateSoon();
      // Garante que mudanças do scroll disparem detecção de mudanças do Angular
      this.carousel.nativeElement.addEventListener('scroll', () => {
        this.ngZone.run(() => this.updateScrollButtons());
      });
      // Atualiza quando imagens terminarem de carregar (altera scrollWidth)
      this.attachImageLoadListeners();
      // Após Angular estabilizar (tela renderizada), atualiza estado uma vez
      const sub = this.ngZone.onStable.subscribe(() => {
        this.updateScrollButtons();
        sub.unsubscribe();
      });
    }, 100);
  }

  @HostListener('window:resize')
  onResize() {
    // Recalcula estado dos botões quando a viewport mudar
    this.updateScrollButtons();
  }

  updateScrollButtons() {
    const element = this.carousel.nativeElement;
    const epsilon = 6; // tolerância um pouco maior para compensar subpixels
    const maxScroll = element.scrollWidth - element.clientWidth;
    const left = Math.round(element.scrollLeft);
    const max = Math.round(maxScroll);

    if (max <= 0) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      this.cdr.detectChanges();
      return;
    }

    this.canScrollLeft = left > epsilon;
    this.canScrollRight = left < (max - epsilon);
    this.cdr.detectChanges();
  }

  scrollLeft() {
    const amount = this.getScrollAmount();
    const el = this.carousel.nativeElement;
    el.scrollBy({ left: -amount, behavior: 'smooth' });
    // Atualiza o estado após a rolagem programática
    requestAnimationFrame(() => this.ngZone.run(() => this.updateScrollButtons()));
  }

  scrollRight() {
    const amount = this.getScrollAmount();
    const el = this.carousel.nativeElement;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    // Atualiza o estado após a rolagem programática
    requestAnimationFrame(() => this.ngZone.run(() => this.updateScrollButtons()));
  }

  private getScrollAmount(): number {
    const width = this.carousel?.nativeElement?.clientWidth || 0;
    // Avança ~90% da largura visível, com um mínimo para telas pequenas
    return Math.max(220, Math.floor(width * 0.9));
  }

  private runUpdateSoon() {
    // Atualiza agora e novamente após o layout estabilizar
    this.updateScrollButtons();
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  private attachImageLoadListeners() {
    const imgs = this.carousel.nativeElement.querySelectorAll('img');
    imgs.forEach(img => {
      if (!(img as HTMLImageElement).complete) {
        img.addEventListener('load', () => this.ngZone.run(() => this.runUpdateSoon()), { once: true });
        img.addEventListener('error', () => this.ngZone.run(() => this.runUpdateSoon()), { once: true });
      }
    });
  }
}
