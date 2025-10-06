import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnDestroy {
  // Configurações do timer
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  
  // Estado do timer
  tempoRestante: number = 0; // em segundos
  isRunning: boolean = false;
  isPaused: boolean = false;
  
  // Intervalos
  private intervalId: any = null;
  
  // Áudio
  private audio: HTMLAudioElement | null = null;

  // Anel circular
  circumference: number = 2 * Math.PI * 140; // 2πr onde r=140
  strokeDashoffset: number = 0;

  constructor() {
    // Inicializa o áudio
    this.audio = new Audio('assets/sounds/timer-alarm.mp3');
    this.audio.loop = false;
    this.audio.volume = 1.0; // Volume máximo (0.0 a 1.0)
    
    // Pré-carrega o áudio
    this.audio.load();
  }

  // Inicia o timer
  iniciar() {
    if (this.horas === 0 && this.minutos === 0 && this.segundos === 0) {
      alert('Por favor, defina um tempo válido!');
      return;
    }

    if (!this.isRunning) {
      this.tempoRestante = (this.horas * 3600) + (this.minutos * 60) + this.segundos;
      this.isRunning = true;
      this.isPaused = false;
      this.executarTimer();
    }
  }

  // Executa o timer
  private executarTimer() {
    this.atualizarAnel();
    this.intervalId = setInterval(() => {
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
        this.atualizarAnel();
      } else {
        this.finalizar();
      }
    }, 1000);
  }

  // Atualiza o anel circular
  private atualizarAnel() {
    const tempoTotal = (this.horas * 3600) + (this.minutos * 60) + this.segundos;
    const progresso = this.tempoRestante / tempoTotal;
    this.strokeDashoffset = this.circumference * (1 - progresso);
  }

  // Pausa o timer
  pausar() {
    if (this.isRunning && !this.isPaused) {
      clearInterval(this.intervalId);
      this.isPaused = true;
    }
  }

  // Retoma o timer
  retomar() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.executarTimer();
    }
  }

  // Para o timer
  parar() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.isPaused = false;
    this.tempoRestante = 0;
    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
    this.strokeDashoffset = 0;
    
    // Para o áudio se estiver tocando
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  // Finaliza o timer e toca o som
  private finalizar() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.isPaused = false;
    
    // Toca o som de alarme
    if (this.audio) {
      // Reseta o áudio para o início
      this.audio.currentTime = 0;
      
      // Tenta tocar o som
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Alarme tocando!');
          })
          .catch(error => {
            console.error('Erro ao tocar o som:', error);
            console.log('Verifique se o arquivo existe em: src/assets/sounds/timer-alarm.mp3');
          });
      }
    }

    // Notificação visual
    setTimeout(() => {
      alert('⏰ Tempo esgotado!');
    }, 100);
  }

  // Reseta o timer
  resetar() {
    this.parar();
  }

  // Adiciona tempo rápido (botões de atalho)
  adicionarTempo(minutos: number) {
    if (!this.isRunning) {
      this.horas = 0;
      this.minutos = minutos;
      this.segundos = 0;
    }
  }

  // Formata o tempo para exibição
  get tempoFormatado(): string {
    const hrs = Math.floor(this.tempoRestante / 3600);
    const mins = Math.floor((this.tempoRestante % 3600) / 60);
    const secs = this.tempoRestante % 60;
    return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}`;
  }

  // Adiciona zero à esquerda (público para uso no template)
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  // Calcula a porcentagem do progresso
  get progresso(): number {
    const tempoTotal = (this.horas * 3600) + (this.minutos * 60) + this.segundos;
    if (tempoTotal === 0) return 0;
    return ((tempoTotal - this.tempoRestante) / tempoTotal) * 100;
  }

  // Limpa o intervalo ao destruir o componente
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
