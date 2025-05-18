import {Tour} from './tour.model';

export interface TourWithBookingStatus extends Tour {
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | null;
}
