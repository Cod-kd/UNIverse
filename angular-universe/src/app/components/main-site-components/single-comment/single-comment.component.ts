import { Component, Input } from '@angular/core';
import { Comment } from '../../../models/comment/comment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-comment.component.html',
  styleUrl: './single-comment.component.css'
})
export class SingleCommentComponent {
  @Input() comment!: Comment;
}