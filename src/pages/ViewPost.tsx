import { useParams, useNavigate } from 'react-router-dom';
import { forumContract, wagmiConfig } from '../lib/walletConnect';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { decodeEventLog } from 'viem';

type ForumPost = {
  id: bigint;
  title: string;
  content: string;
  author: string;
  timestamp: bigint;
  commentCount: bigint;
};

type ForumComment = {
  id: bigint;
  postId: bigint;
  content: string;
  author: string;
  timestamp: bigint;
};

const pageSize = 5;

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const [comment, setComment] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Get the post
  const { data: rawPost } = useReadContract({
    address: forumContract.address,
    abi: forumContract.abi,
    functionName: 'getPost',
    args: [postId],
    query: { enabled: !!postId },
  });
  const post = rawPost as ForumPost | undefined;

  // Get paginated comments for the post
  const totalComments = Number(post?.commentCount ?? 0);
  const commentOffset = (Number(commentPage) - 1) * pageSize;

  const { data: rawComments } = useReadContract({
    address: forumContract.address,
    abi: forumContract.abi,
    functionName: 'getCommentsPaginated',
    args: [postId, commentOffset, pageSize],
    query: { enabled: !!postId },
  });
  const paginatedComments = (rawComments as ForumComment[] | undefined) || [];

  // Get comment count for pagination
  const totalPages = Math.max(1, Math.ceil(totalComments / pageSize));

  const handleAddComment = async () => {
    if (!comment) return alert('Please enter a comment');
    try {
      setIsSubmitting(true);

      const hash = await writeContractAsync({
        address: forumContract.address,
        abi: forumContract.abi,
        functionName: 'addComment',
        args: [postId, comment],
      });

      setTxHash(hash);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Transaction was rejected or failed to send.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!txHash) return;

    const waitForConfirmation = async () => {
      try {
        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
        });

        if (receipt.status === 'success') {
          let commentId: string | null = null;

          for (const log of receipt.logs) {
            try {
              const decoded = decodeEventLog({
                abi: forumContract.abi,
                eventName: 'CommentAdded',
                topics: log.topics,
                data: log.data,
              });

              commentId = (decoded.args as any).id.toString();
              break;
            } catch {
              continue;
            }
          }

          if (!commentId) throw new Error('CommentAdded log not found');

          alert('Comment added successfully!');
          setComment('');
          // No need to refetch, wagmi will auto-refresh on chain update
        } else {
          alert('Transaction failed.');
        }
      } catch (err) {
        console.error('Error confirming transaction:', err);
        alert('Error confirming comment.');
      } finally {
        setIsSubmitting(false);
        setTxHash(null);
      }
    };

    waitForConfirmation();
  }, [txHash]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="container mt-4">
        <div className='d-flex'>
      <button
        className="btn btn-primary mb-3 ms-auto"
        onClick={() => navigate('/')}
      >
        Go back
      </button>
      </div>
      <h2>{post?.title ?? 'No title'}</h2>
      <p>{post?.content ?? 'No content'}</p>
      <p className="text-muted">
        By {post?.author ?? 'Unknown author'} • {post?.timestamp ? formatDistanceToNow(new Date(Number(post.timestamp) * 1000)) : ''} ago
      </p>

      <hr />
      <h5>Comments</h5>
      {paginatedComments.length > 0 ? (
        <>
          {paginatedComments.map((comment) => (
            <div key={Number(comment.id)} className="card mb-2">
              <div className="card-body">
                <p className="card-text">{comment.content ?? 'No content'}</p>
                <p className="text-muted">
                  By {comment.author ?? 'Unknown'} •{' '}
                  {comment.timestamp ? formatDistanceToNow(new Date(Number(comment.timestamp) * 1000)) : ''}
                </p>
              </div>
            </div>
          ))}
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
              disabled={commentPage === 1}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {commentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCommentPage((p) => Math.min(totalPages, p + 1))}
              disabled={commentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No comments yet.</p>
      )}

      {isConnected && (
        <div className="mt-3">
          <textarea
            className="form-control mb-2"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddComment}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewPost;