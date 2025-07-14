import { useReadContract, useAccount } from 'wagmi';
import { forumContract } from '../lib/walletConnect';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PAGE_SIZE = 5;

const Home = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Get total post count
  const { data: postCount } = useReadContract({
    address: forumContract.address,
    abi: forumContract.abi,
    functionName: 'getPostCount',
  });

  const totalPosts = Number(postCount) || 0;
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));

  // If searching, use server-side search
  const { data: searchResults } = useReadContract({
    address: forumContract.address,
    abi: forumContract.abi,
    functionName: 'searchPosts',
    args: [search.trim(), PAGE_SIZE],
    query: { enabled: !!search.trim() },
  });

  // If not searching, use paginated posts
  const offset = (page - 1) * PAGE_SIZE;
  const { data: paginatedPosts } = useReadContract({
    address: forumContract.address,
    abi: forumContract.abi,
    functionName: 'getPostsPaginated',
    args: [offset, PAGE_SIZE],
    query: { enabled: !search.trim() },
  });

  // Use posts from search or pagination
  const posts = search.trim()
    ? (searchResults as any[] | undefined) || []
    : (paginatedPosts as any[] | undefined) || [];

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

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search posts by title or content (server-side)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 on search
          }}
        />
      </div>

      <h4>{search.trim() ? "Search Results" : "Recent Posts"}</h4>
      {posts.length > 0 ? (
        posts.map((post: any) => (
          <div
            key={post.id}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <PostCard post={post} postId={post.id} />
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}

      {!search.trim() && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;