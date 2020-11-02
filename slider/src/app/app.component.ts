import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';

export interface ISlider {
  sliderPanelSelector?: string;
  sliderPaginationSelector?: string;
  sensitivity?: number;
  activeSlide?: number;
  slideCount?: number;
  sliderEl?: any;
  timer: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('slider') sliderRef: ElementRef<any>;

  ngAfterViewInit(): void {
    this.initSlider('#slider');
  }

  slider: ISlider = {
    sliderPanelSelector: '.slider-panel',
    sliderPaginationSelector: '.slider-pagination',
    sensitivity: 25,
    activeSlide: 0,
    timer: 400,
  };

  initSlider(selector: string) {
    // Find the container
    this.slider.sliderEl = document.querySelector(selector) as HTMLElement;

    // Count elements
    this.slider.slideCount = this.slider.sliderEl.querySelectorAll(
      this.slider.sliderPanelSelector
    ).length;
  }

  goTo(item) {
    // Stop it from doing weird things like moving to slides that don’t exist
    if (item < 0) this.slider.activeSlide = 0;
    else if (item > this.slider.slideCount - 1)
      this.slider.activeSlide = this.slider.slideCount - 1;
    else this.slider.activeSlide = item;

    // Apply transformation & smoothly animate via .is-animating CSS
    this.slider.sliderEl.classList.add('is-animating');
    var percentage = -(100 / this.slider.slideCount) * this.slider.activeSlide;
    this.slider.sliderEl.style.transform = 'translateX( ' + percentage + '% )';
    clearTimeout(this.slider.timer);

    this.slider.timer = setTimeout(() => {
      this.slider.sliderEl.classList.remove('is-animating');
    }, 400);
  }

  onPan(e) {
    // Calculate pan movement
    var percentage =
      ((100 / this.slider.slideCount) * e.deltaX) / window.innerWidth;
    // Multiply percent by # of slide we’re on
    var percentageCalculated =
      percentage - (100 / this.slider.slideCount) * this.slider.activeSlide;

    // Apply transformation
    this.slider.sliderEl.style.transform =
      'translateX( ' + percentageCalculated + '% )';

    // wait for slide when it's done
    if (e.isFinal) {
      if (e.velocityX > 1) {
        this.goTo(this.slider.activeSlide - 1);
      } else if (e.velocityX < -1) {
        this.goTo(this.slider.activeSlide + 1);
      } else {
        if (percentage <= -(this.slider.sensitivity / this.slider.slideCount))
          this.goTo(this.slider.activeSlide + 1);
        else if (percentage >= this.slider.sensitivity / this.slider.slideCount)
          this.goTo(this.slider.activeSlide - 1);
        else this.goTo(this.slider.activeSlide);
      }
    }
  }
}
