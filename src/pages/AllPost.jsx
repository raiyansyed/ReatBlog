import React, {useState, useEffect} from 'react'
import appwriteService from '../appwrite/config.js'
import { Container, PostCard } from '../components'

function AllPost() {
  const [post, setPost] = useState('');
  useEffect(() => {}, [])
  appwriteService.getPosts([]).then(posts => {
    if(posts) {
      setPost(posts.documents);
    }
  })

  return (
    <div className='py-8 w-full'>
      <Container>
        <div className='flex flex-wrap'>
          {post.map(post => (
            <div className='p-2 w-1/4' key={post.$id}>
              <PostCard post={post}/>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default AllPost