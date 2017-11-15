import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appInputFormat]'
})
export class InputFormatDirective {

  @Input('appInputFormat') format;

  constructor(private el: ElementRef) {
  }

  @HostListener('blur') onBlur() {
    const value: string = this.el.nativeElement.value;
    if (this.format === 'capitalize') {
      this.el.nativeElement.value = value.charAt(0).toUpperCase() + value.slice(1);
    } else  if (this.format === 'lowercase') {
      this.el.nativeElement.value = value.toLowerCase();
    } else if ( this.format === 'cc')  {
      this.el.nativeElement.value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/,"$1 $2 $3 $3");
    }

  }



  // @HostListener('change') onChange() {
  //   if ( this.format === 'cc')  {
  //     const value: string = this.el.nativeElement.value;
  //     this.el.nativeElement.value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/,"$1 $2 $3 $3");
  //   }
  // }
}



