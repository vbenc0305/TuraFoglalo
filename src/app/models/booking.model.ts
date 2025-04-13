export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookedAt: string;
}
