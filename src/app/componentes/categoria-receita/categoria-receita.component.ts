import { Component, input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

  updateScrollButtons() {
    const element = this.carousel.nativeElement;
    this.canScrollLeft = element.scrollLeft > 0;
    this.canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth - 1);
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
