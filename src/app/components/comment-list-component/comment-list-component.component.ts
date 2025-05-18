import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent {
  @Input() comments: Comment[] = []; // Kommentek listája, amit a szülőtől kapunk
  @Output() newCommentAdded = new EventEmitter<Comment>(); // Az új komment, amit a gyermek visszaad a szülőnek

  newCommentText: string = '';

  onAddComment() {
    if (this.newCommentText.trim()) {
      const newComment: Comment = {
        id: '', // Firebase automatikusan generálja
        tourId: '', // Id beállítása a szülőtől fogjuk megkapni
        userId: '', // A jelenlegi felhasználó id-ja
        commentText: this.newCommentText,
        createdAt: new Date(),
        username: ''
      };
      this.newCommentAdded.emit(newComment); // Az új komment visszaadása a szülőnek
      this.newCommentText = ''; // A komment szövegének törlése
    }
  }
}

export class CommentListComponentComponent {
}
