// comment.model.ts
export interface Comment {
  id:string;
  tourId: string;        // Az id-je annak a túrának, amelyhez a komment tartozik
  userId: string;        // Az id-je annak a felhasználónak, aki a kommentet írta
  username: string;      // A felhasználó neve
  commentText: string;   // A komment szövege
  createdAt: Date;       // A komment dátuma (időpontja)
}
