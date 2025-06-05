import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";

interface Post {
  id: number;
  title: string;
  // 필요한 필드들 추가
}

export default function InfiniteScrollExample() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView();

  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const res = await fetch(`/api/posts?page=${page}&pageSize=10`);
    const result = await res.json();

    setPosts((prev) => [...prev, ...result.data]);
    setHasMore(result.hasMore);
    setPage((prev) => prev + 1);
    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, []); // 첫 로딩

  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="post">
          {post.title}
        </div>
      ))}
      {hasMore && (
        <div ref={ref} style={{ padding: "20px", textAlign: "center" }}>
          {isLoading ? "로딩 중..." : "더 보기"}
        </div>
      )}
    </div>
  );
}
