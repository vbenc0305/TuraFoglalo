export interface User {
  id: string;
  name: string;
  email: string;
  role: 'tourist' | 'guide';
  profilePicture?: string;
}
