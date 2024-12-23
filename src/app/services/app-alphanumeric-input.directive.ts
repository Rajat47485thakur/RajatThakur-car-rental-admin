import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAlphanumericInput]'
})
export class AppAlphanumericInputDirective {
  private regex: RegExp = new RegExp(/^[0-9A-Za-z\s]+$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow special keys, but prevent Backspace at the beginning
    if (this.specialKeys.indexOf(event.key) !== -1) {
      if (event.key === 'Backspace') {
        // Prevent backspace if the cursor is at the beginning of the input
        if (this.el.nativeElement.selectionStart === 0) {
          event.preventDefault();
        }
      }
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const current: string = this.el.nativeElement.value;
    if (current.length > 0 && current[0] === ' ') {
      this.el.nativeElement.value = current.substring(1);
    }
  }

  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData || window['clipboardData'];
    let pastedText = clipboardData.getData('text');
    if (!pastedText.match(this.regex)) {
      event.preventDefault();
    } else {
      setTimeout(() => {
        const current: string = this.el.nativeElement.value;
        if (current.length > 0 && current[0] === ' ') {
          this.el.nativeElement.value = current.substring(1);
        }
      }, 0);
    }
  }
  }
