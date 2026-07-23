import { useEffect, useState } from "react";
import "./PostFetcher.css";

function PostFetcher() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("https://dummyjson.com/posts?limit=6");

        if (!response.ok) {
          throw new Error("Failed to load posts.");
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <section className="page">
      <div className="container">
        <div className="heading">
          <h1>Latest Blog Posts</h1>
          <p>
            Posts are loaded automatically when the component mounts using the
            useEffect hook.
          </p>
        </div>

        {loading && (
          <div className="state">
            <div className="loader"></div>
            <h3>Loading Posts...</h3>
          </div>
        )}

        {!loading && error && (
          <div className="state">
            <div className="error-icon">!</div>
            <h3>{error}</h3>
          </div>
        )}

        {!loading && !error && (
          <div className="grid">
            {posts.map((post) => (
              <article className="card" key={post.id}>
                <span className="badge">Article #{post.id}</span>

                <h2>{post.title}</h2>

                <p>{post.body}</p>

                <div className="footer">
                  <span>👍 {post.reactions.likes}</span>
                  <span>👎 {post.reactions.dislikes}</span>
                  <span>👁 {post.views}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PostFetcher;