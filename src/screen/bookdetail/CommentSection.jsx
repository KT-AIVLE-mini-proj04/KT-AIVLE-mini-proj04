import { useState } from "react";
import { getUser } from "@utils/authStore";

function CommentItem({ comment, editingId, editingContent, onEdit, onEditChange, onEditSubmit, onEditCancel, onDelete }) {
  const isOwner = !!getUser()?.usersId && getUser()?.usersId === comment.usersId;
  const isEditing = editingId === comment.id;

  return (
    <article className="comment-item">
      <div className="comment-meta">
        <span className="comment-user">{comment.name}</span>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOwner && (
          <div className="comment-actions">
            <button type="button" className="comment-edit" onClick={() => onEdit(comment)}>수정</button>
            <button type="button" className="comment-delete" onClick={() => onDelete(comment.id)}>삭제</button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            className="comment-input"
            value={editingContent}
            onChange={(e) => onEditChange(e.target.value)}
            rows={3}
          />
          <div className="comment-edit-actions">
            <button type="button" className="btn-edit comment-submit" onClick={() => onEditSubmit(comment.id)}>저장</button>
            <button type="button" className="comment-delete" onClick={onEditCancel}>취소</button>
          </div>
        </div>
      ) : (
        <p className="comment-text">{comment.content}</p>
      )}
    </article>
  );
}

function CommentSection({
  comments,
  commentInput,
  commentError,
  hasMoreComments,
  editingId,
  editingContent,
  onCommentInputChange,
  onCommentSubmit,
  onCommentDelete,
  onCommentEdit,
  onCommentEditChange,
  onCommentEditSubmit,
  onCommentEditCancel,
  onLoadMore,
}) {
  return (
    <section className="comments-section">
      <div className="comments-header">
        <h3>댓글</h3>
        <span>{comments.length}개</span>
      </div>

      {getUser() ? (
        <form className="comment-form" onSubmit={onCommentSubmit}>
          <textarea
            value={commentInput}
            onChange={(e) => onCommentInputChange(e.target.value)}
            placeholder="댓글을 입력하세요."
            rows={4}
            className="comment-input"
          />
          {commentError && <p className="comment-error">{commentError}</p>}
          <button type="submit" className="btn-edit comment-submit">댓글 등록</button>
        </form>
      ) : (
        <p className="comment-login-notice">
          댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
        </p>
      )}

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="no-comments">첫 번째 댓글을 남겨보세요.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              editingId={editingId}
              editingContent={editingContent}
              onEdit={onCommentEdit}
              onEditChange={onCommentEditChange}
              onEditSubmit={onCommentEditSubmit}
              onEditCancel={onCommentEditCancel}
              onDelete={onCommentDelete}
            />
          ))
        )}
      </div>

      {hasMoreComments && (
        <button className="comment-more-btn" onClick={onLoadMore}>
          댓글 더 보기
        </button>
      )}
    </section>
  );
}

export default CommentSection;
