import React from 'react'
import appwriteService from '../appwrite/config.js'
import { Link } from 'react-router-dom'

function PostCard({$id, title, featuredImage, }) {
  // Local SVG data-URI placeholder to avoid network requests
  const svgPlaceholder = 'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#6b7280">No Image</text>
      </svg>`
    );

  // Don't call getFilePreview if featuredImage is null/undefined
  let imageUrl = svgPlaceholder;
  
  if (featuredImage) {
    const url = appwriteService.getFilePreview(featuredImage);
    if (url) {
      imageUrl = url;
      console.log("🖼️ PostCard image URL for:", featuredImage, "→", url);
    }
  }
  
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full rounded-xl bg-gray-100 p-4'>
            <div className='w-full justify-center items-center mb-4'>
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className='rounded-xl' 
                  onError={(e) => {
                    // Fallback locally without further network requests
                    e.currentTarget.src = svgPlaceholder;
                  }}
                />
            </div>
            <h2
            className='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard