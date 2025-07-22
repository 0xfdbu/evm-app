// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Forum {
    struct Post {
        uint256 id;
        address author;
        string title;
        string content;
        uint256 timestamp;
        uint256 commentCount;
    }

    struct Comment {
        uint256 id;
        uint256 postId;
        address author;
        string content;
        uint256 timestamp;
    }

    uint256 public postCount;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(uint256 => Comment)) public comments;

    event PostCreated(
        uint256 id,
        address author,
        string title,
        string content,
        uint256 timestamp
    );

    event CommentAdded(
        uint256 id,
        uint256 postId,
        address author,
        string content,
        uint256 timestamp
    );

    constructor() {}

    function createPost(string memory _title, string memory _content) public {
        uint256 id = postCount;
        posts[id] = Post(id, msg.sender, _title, _content, block.timestamp, 0);
        postCount++;
        emit PostCreated(id, msg.sender, _title, _content, block.timestamp);
    }

    function addComment(uint256 _postId, string memory _content) public {
        Post storage post = posts[_postId];
        uint256 commentId = post.commentCount;
        comments[_postId][commentId] = Comment(commentId, _postId, msg.sender, _content, block.timestamp);
        post.commentCount++;
        emit CommentAdded(commentId, _postId, msg.sender, _content, block.timestamp);
    }

    function getPost(uint256 _postId) public view returns (Post memory) {
        return posts[_postId];
    }

    function getPostCount() public view returns (uint256) {
        return postCount;
    }

    function getComments(uint256 _postId) public view returns (Comment[] memory) {
        uint256 count = posts[_postId].commentCount;
        Comment[] memory result = new Comment[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = comments[_postId][i];
        }
        return result;
    }

    function getCommentsPaginated(uint256 _postId, uint256 offset, uint256 limit) public view returns (Comment[] memory) {
        uint256 total = posts[_postId].commentCount;
        if (offset >= total) return new Comment ;
        uint256 end = offset + limit;
        if (end > total) end = total;
        Comment[] memory result = new Comment[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = comments[_postId][i];
        }
        return result;
    }

    function getPostsPaginated(uint256 offset, uint256 limit) public view returns (Post[] memory) {
        if (offset >= postCount) return new Post ;
        uint256 end = offset + limit;
        if (end > postCount) end = postCount;
        Post[] memory result = new Post[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = posts[i];
        }
        return result;
    }

    function searchPosts(string memory query, uint256 maxResults) public view returns (Post[] memory) {
        // NOTE: This is just a placeholder — Solidity doesn't support string search efficiently.
        // This would need to be implemented off-chain for real use.
        Post[] memory temp = new Post[](maxResults);
        uint256 count = 0;
        for (uint256 i = 0; i < postCount && count < maxResults; i++) {
            if (contains(posts[i].title, query) || contains(posts[i].content, query)) {
                temp[count] = posts[i];
                count++;
            }
        }
        Post[] memory result = new Post[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = temp[j];
        }
        return result;
    }

    // Dummy string matcher — not functional in Solidity
    function contains(string memory, string memory) internal pure returns (bool) {
        // You would need to search off-chain or use a more efficient indexing mechanism.
        return false;
    }
}
