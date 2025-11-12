import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.authorId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        if (post.featuredImage) {
          appwriteService.deleteFile(post.featuredImage);
        }
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8">
      <Container>
        {post.featuredImage && (
          <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
            {(() => {
              const url = appwriteService.getFilePreview(post.featuredImage, { width: 1600, quality: 90 });
              const svgPlaceholder = 'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
                    <rect width="100%" height="100%" fill="#e5e7eb"/>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="22" fill="#6b7280">Image Unavailable</text>
                  </svg>`
                );
              return (
                <img
                  src={url || svgPlaceholder}
                  alt={post.title}
                  className="rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = svgPlaceholder;
                  }}
                />
              );
            })()}

            {isAuthor && (
              <div className="absolute right-6 top-6">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-green-500" className="mr-3">
                    Edit
                  </Button>
                </Link>
                <Button bgColor="bg-red-500" onClick={deletePost}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}

        {isAuthor && !post.featuredImage && (
          <div className="w-full flex justify-end mb-4">
            <Link to={`/edit-post/${post.$id}`}>
              <Button bgColor="bg-green-500" className="mr-3">
                Edit
              </Button>
            </Link>
            <Button bgColor="bg-red-500" onClick={deletePost}>
              Delete
            </Button>
          </div>
        )}

        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}
