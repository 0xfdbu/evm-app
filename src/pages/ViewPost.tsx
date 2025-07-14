import { useParams, useNavigate } from 'react-router-dom';
import { forumContract, wagmiConfig } from '../lib/walletConnect';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { decodeEventLog } from 'viem';

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const [comment, setComment] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const pageSize = 5;

  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: post } = useReadContract({
    ...forumContract,
    functionName: 'getPost',
    args: [postId],
    query: { enabled: !!postId },
  });

  const {
    data: allComments,
    refetch: refetchComments,
  } = useReadContract({
    ...forumContract,
    functionName: 'getComments',
    args: [postId],
    query: { enabled: !!postId },
  });

  const paginatedComments = useMemo(() => {
    if (!allComments) return [];
    const start = (commentPage - 1) * pageSize;
    return allComments.slice(start, start + pageSize);
  }, [allComments, commentPage]);

  const totalPages = allComments ? Math.ceil(allComments.length / pageSize) : 1;

  const handleAddComment = async () => {
    if (!comment) return alert('Please enter a comment');
    try {
      setIsSubmitting(true);

      const hash = await writeContractAsync({
        ...forumContract,
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
          refetchComments();
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
  }, [txHash, refetchComments]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="container mt-4">
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate('/')}
      >
        Go back
      </button>

      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p className="text-muted">
        By {post.author} • {formatDistanceToNow(new Date(Number(post.timestamp) * 1000))} ago
      </p>

      <hr />
      <h5>Comments</h5>
      {paginatedComments.length > 0 ? (
        <>
          {paginatedComments.map((comment: any, index: number) => (
            <div key={index} className="card mb-2">
              <div className="card-body">
                <p className="card-text">{comment.content}</p>
                <p className="text-muted">
                  By {comment.author} •{' '}
                  {formatDistanceToNow(new Date(Number(comment.timestamp) * 1000))} ago
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
