import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Container, Login, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user) {
        setIsLoggedIn(true);
        appwriteService.getPosts().then((posts) => {
          if (posts) {
            setPosts(posts.documents);
          }
        });
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  if (isLoggedIn) {
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
  return (
    <div className="w-full py-8 mt-4 text-center">
      <Container>
        <div className="flex flex-wrap">
          <div className="p-2 w-full">
            <h1 className="text-2xl font-bold hover:text-gray-500">
              Login to read posts
              <Login />
            </h1>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Home;
