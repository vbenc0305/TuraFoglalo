import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private firestore: AngularFirestore) { }

  // Kommentek lekérése a túrához
  getCommentsByTourId(tourId: string): Observable<Comment[]> {
    return this.firestore.collection<Comment>('comments', ref => ref.where('tourId', '==', tourId)).valueChanges();
  }

  // Komment hozzáadása
  addComment(comment: Comment): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('comments').doc(id).set({ ...comment, id });
  }

  // Komment törlése
  deleteComment(commentId: string): Promise<void> {
    return this.firestore.collection('comments').doc(commentId).delete();
  }
}
