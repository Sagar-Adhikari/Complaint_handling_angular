import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

type PaneType = 'top' | 'bottom' | 'left' | 'right';
type SlideType = 'vertical' | 'horizontal';

@Component({
  selector: 'app-slide-panel',
  templateUrl: './slide-panel.component.html',
  styleUrls: ['./slide-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('top', style({
        transform: 'translateY(0%)'
      })),
      state('bottom', style({
        transform: 'translateY(-50%)'
      })),
      state('left', style({
        transform: 'translateX(0%)'
      })),
      state('right', style({
        transform: 'translateX(-50%)'
      })),
      transition('*=>*', animate(300))
    ])
  ]
})
export class SlidePanelComponent {
  @Input() activePane: PaneType = 'left';
  @Input() activeSlide: SlideType = "horizontal";
  @Input() showNextButton: boolean = false;
  @Input() showPreviousButton: boolean = false;

  @Output() private buttonClicked: EventEmitter<any> = new EventEmitter();


  isFirstView = true;
  isLastView = true;

  animStart(e: any) {
    this.isFirstView = true;
    this.isLastView = true;
  }

  animEnd(e: any) {
    if (e.toState === 'bottom' || e.toState === 'right') {
      this.isLastView = true;
      this.isFirstView = false;
    } else {
      this.isLastView = false;
      this.isFirstView = true;
    }
  }

  buttonClick() {
    this.buttonClicked.emit(this.activePane);
  }
}
