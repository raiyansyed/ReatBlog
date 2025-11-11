import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config.js'
import {Container} from '../components/index.js'

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    appwriteService.getPost().then((post) => {
      if(post) {
        setPosts(post.document);
      }
    })
  }, [])

  if(posts.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='p-2 w-full'>
              <h2 className='text-2xl font-bold hover:text-gray-600'>
                Login to read Posts
              </h2>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='py-8 w-full'>
      <Container>
        <div className='flex flex-wrap'>
          {posts.map(post => (
            <div className='p-2 w-1/4' key={post.$id}>
              <PostCard {...posts}/>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default Home