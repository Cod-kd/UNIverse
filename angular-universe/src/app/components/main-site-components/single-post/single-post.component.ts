import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../models/post/post.model';
import { Comment } from '../../../models/comment/comment.model';
import { PostService } from '../../../services/post/post.service';
import { CommentService } from '../../../services/comment/comment.service';
import { SingleCommentComponent } from '../single-comment/single-comment.component';

@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [FormsModule, SingleCommentComponent],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css'
})
export class SinglePostComponent implements OnInit {
  @Input() post!: Post;
  comments: Comment[] = [];
  newComment: string = '';
  imageUrl: string | null = null;
  imageExists: boolean = false;

  constructor(
    private postService: PostService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.post = { ...this.post, showComments: false };
    this.checkAndSetImage();
    this.loadComments();
  }

  private checkAndSetImage() {
    const url = this.postService.getPostImage(this.post.id);
    // Create a test image to check if it loads
    const img = new Image();
    img.onload = () => {
      this.imageUrl = url;
      this.imageExists = true;
    };
    img.onerror = () => {
      this.imageExists = false;
      this.imageUrl = null;
    };
    img.src = url;
  }

  loadComments() {
    this.commentService.getCommentsByPostId(this.post.id).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
      }
    });
  }

  toggleComments() {
    this.post.showComments = !this.post.showComments;
    if (this.post.showComments) {
      this.loadComments();
    }
  }

  addCredit() {
    this.postService.addCredit(this.post.id).subscribe({
      next: () => {
        this.post.creditCount++;
      }
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.commentService.addComment(this.post.id, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
      }
    });
  }
}