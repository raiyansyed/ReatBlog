import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config"; // Import posts service
import authService from "../appwrite/auth";      // Import auth service
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((user) => { // Use authService for user check
      if (user) {
        setIsLoggedIn(true);
        appwriteService.getPosts().then((posts) => { // Use appwriteService for posts
          if (posts) {
            setPosts(posts.documents);
          }
        });
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                {isLoggedIn ? "No posts available" : "Login to read posts"}
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;