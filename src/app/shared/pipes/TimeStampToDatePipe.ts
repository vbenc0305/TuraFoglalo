import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({ name: 'tsToDate' })
export class TimestampToDatePipe implements PipeTransform {
  transform(value: any): Date | null {
    if (value instanceof Timestamp) {
      return value.toDate();
    }
    if (value instanceof Date) {
      return value;
    }
    return null;
  }
}
