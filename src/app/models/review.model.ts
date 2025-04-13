export interface Review {
  id: string;
  tourId: string;
  userId: string;
  rating:number; // 1-5 csillag
  comment: string;
  createdAt:string;
}
