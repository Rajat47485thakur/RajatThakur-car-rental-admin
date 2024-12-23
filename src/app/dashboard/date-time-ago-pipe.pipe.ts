import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeAgoPipe',
  pure:true
})
export class DateTimeAgoPipePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return 'Invalid date';

    const time = new Date(value).getTime();
    const now = new Date().getTime();
    const difference = now - time;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 5) return `${weeks} weeks ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  }

}
