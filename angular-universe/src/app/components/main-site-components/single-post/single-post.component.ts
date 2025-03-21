import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../models/post/post.model';
import { Comment } from '../../../models/comment/comment.model';
import { PostService } from '../../../services/post/post.service';
import { CommentService } from '../../../services/comment/comment.service';
import { SingleCommentComponent } from '../single-comment/single-comment.component';
import { UserBasicService } from '../../../services/user-basic/user-basic.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [FormsModule, SingleCommentComponent, CommonModule],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css'
})
export class SinglePostComponent implements OnInit {
  @Input() post!: Post;
  comments: Comment[] = [];
  newComment: string = '';
  imageUrl: string | null = null;
  imageExists: boolean = false;
  creatorUsername: string = '';

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private userBasicService: UserBasicService
  ) { }

  ngOnInit() {
    this.post = { ...this.post, showComments: false };
    this.checkAndSetImage();
    this.loadComments();
    this.loadCreatorUsername();
  }

  private loadCreatorUsername() {
    this.userBasicService.usernameById(this.post.creatorId).subscribe({
      next: (response) => {
        this.creatorUsername = response.username;
      },
      error: () => {
        this.creatorUsername = 'Felhasználó #' + this.post.creatorId;
      }
    });
  }

  private checkAndSetImage() {
    const url = this.postService.getPostImage(this.post.id);
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
        this.loadCommentUsernames();
      }
    });
  }

  private loadCommentUsernames() {
    this.comments.forEach(comment => {
      if (!comment.userName) {
        this.userBasicService.usernameById(comment.userId).subscribe({
          next: (response) => {
            comment.userName = response.username;
          }
        });
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
        this.postService.updatePostCredit(this.post.id);
      },
      error: (err) => {
        console.error('Failed to add credit', err);
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