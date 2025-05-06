import {Tour} from './tour.model';

export interface User {
  id: string;
  name: string;
  email: string;
  password:string;
  role: 'tourist' | 'guide';
  profilePicture?: string;
  signedUpTours:Array<Tour>;
}
