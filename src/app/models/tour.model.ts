export interface Tour{
  id:string;
  name:string;
  location:string;
  date:string;
  duration:number; // Órákban
  difficulty:'easy' | 'medium' | 'hard';
  price: number;
  guideId:string;
  maxParticipants:number;
  description:string;
}
