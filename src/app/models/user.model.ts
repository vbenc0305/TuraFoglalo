export interface User {
  id: string;
  name: string;
  email: string;
  password:string;
  role: 'tourist' | 'guide';
  profilePicture?: string;
}
