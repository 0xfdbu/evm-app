import { formatDistanceToNow } from 'date-fns';

type PostCardProps = {
  post: any;
  postId: number;
};

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p className="card-text">{post.content}</p>
        <p className="text-muted">
          By {post.author} • {formatDistanceToNow(new Date(Number(post.timestamp) * 1000))} ago
        </p>
        <p className="fw-bold text-primary">
          {post.commentCount} {post.commentCount === 1 ? 'Reply' : 'Replies'}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
