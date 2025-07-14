import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { forumContract } from '../lib/walletConnect';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const { data: postCount } = useReadContract({
    ...forumContract,
    functionName: 'getPostCount',
  });

  const recentCount = 5; // how many recent posts to display
  const totalPosts = Number(postCount) || 0;
  const startIndex = Math.max(0, totalPosts - recentCount);

  const { data: postsData } = useReadContracts({
    contracts: postCount
      ? Array.from({ length: Math.min(totalPosts, recentCount) }, (_, i) => ({
          ...forumContract,
          functionName: 'getPost',
          args: [startIndex + i + 1],
        }))
      : [],
    query: {
      enabled: !!postCount,
    },
  });

  const posts = (postsData || []).map((r) => r.result).filter(Boolean) as any[];

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Web3 Forum</h2>
        {isConnected && (
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            + New Post
          </button>
        )}
      </div>

      {isConnected ? null : (
        <p className="text-muted">Connect your wallet to create posts.</p>
      )}

      <h4>Recent Posts</h4>
      {posts.length > 0 ? (
        posts
          .slice()
          .reverse()
          .map((post: any, index: number) => {
            const postId = startIndex + (posts.length - index);
            return (
              <div
                key={postId}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/post/${postId}`)}
              >
                <PostCard post={post} postId={postId} />
              </div>
            );
          })
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Home;
