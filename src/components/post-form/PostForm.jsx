import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index.js";
import appwriteService from "../../appwrite/config.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post ? post.title : "",
        slug: post ? post.slug : "",
        content: post ? post.content : "",
        status: post ? post.status : "",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title) {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const submit = async (data) => {
    console.log("📝 Submit triggered with data:", data);
    console.log("👤 Current userData:", userData);

    try {
      if (post) {
        // UPDATING existing post
        console.log("🔄 Updating existing post:", post.$id);
        const file = data.image?.[0]
          ? await appwriteService.uploadFile(data.image[0], { publicRead: true })
          : null;

        if (file && post.featuredImage) {
          // Only delete old file if new file uploaded successfully
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost?.$id) navigate(`/post/${dbPost.$id}`);
      } else {
        // CREATING new post
        console.log("🖼️ Attempting to upload file...");
        const file = data.image?.[0]
          ? await appwriteService.uploadFile(data.image[0], { publicRead: true })
          : null;
        
        console.log("📁 File upload result:", file);

        const postData = {
          title: data.title,
          slug: data.slug,
          content: data.content,
          featuredImage: file ? file.$id : null, // Image is optional
          status: data.status,
          userId: userData?.$id,
        };

        console.log("📤 Creating post with data:", postData);

        const dbPost = await appwriteService.createPost(postData);

        console.log("✅ Post creation response:", dbPost);

        if (dbPost?.$id) {
          navigate(`/post/${dbPost.$id}`);
        } else {
          alert("Error creating post. Check Appwrite setup.");
        }
      }
    } catch (err) {
      console.error("❌ Add Post Error:", err);
      alert(err.message || "Something went wrong while creating post.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title:"
          type="text"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug"
          type="text"
          placeholder="Slug"
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
          {...register("slug", { required: true })}
          className="mb-4"
        />
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image (optional):"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: false })}
        />

        {post && post.featuredImage && (
          <div className="w-full mb-4">
            {(() => {
              const url = appwriteService.getFilePreview(post.featuredImage, { width: 800, quality: 85 });
              const svgPlaceholder = 'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
                    <rect width="100%" height="100%" fill="#e5e7eb"/>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#6b7280">Preview unavailable</text>
                  </svg>`
                );
              return (
                <img
                  src={url || svgPlaceholder}
                  alt={post.title}
                  className="rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = svgPlaceholder;
                  }}
                />
              );
            })()}
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
