import { useState, useEffect } from 'react';
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { forumContract, wagmiConfig } from '../lib/walletConnect';
import { useNavigate } from 'react-router-dom';
import { decodeEventLog } from 'viem';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();
  const { writeContractAsync } = useWriteContract();

  const handleCreatePost = async () => {
    if (!title || !content) return alert('Please fill in title and content');
    try {
      setIsPosting(true);

      const hash = await writeContractAsync({
        ...forumContract,
        functionName: 'createPost',
        args: [title, content],
      });

      setTxHash(hash);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Transaction was rejected or failed to send.');
      setIsPosting(false);
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
          let postId: string | null = null;

          for (const log of receipt.logs) {
            try {
              const decoded = decodeEventLog({
                abi: forumContract.abi,
                eventName: 'PostCreated',
                topics: log.topics,
                data: log.data,
              });

              // Get the post ID from decoded args
              postId = (decoded.args as any).id.toString();
              break;
            } catch {
              continue; // Not the event we're looking for
            }
          }

          if (!postId) throw new Error('PostCreated log not found');

          alert('Post created successfully!');
          setTitle('');
          setContent('');
          navigate(`/post/${postId}`);
        } else {
          alert('Transaction failed.');
        }
      } catch (err) {
        console.error('Error waiting for receipt:', err);
        alert('Error confirming transaction.');
      } finally {
        setIsPosting(false);
        setTxHash(null);
      }
    };

    waitForConfirmation();
  }, [txHash, navigate]);

  return (
    <div className="mb-4">
      <h4>Create a New Post</h4>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPosting}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPosting}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleCreatePost}
        disabled={isPosting}
      >
        {isPosting ? 'Creating...' : 'Create Post'}
      </button>
    </div>
  );
};

export default PostForm;
