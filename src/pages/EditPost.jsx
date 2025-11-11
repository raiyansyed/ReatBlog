import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import appwriteService from '../appwrite/config.js'
import { useNavigate, useParams } from 'react-router';

function EditPost() {
  const [post, setPost] = useState(null);
  const {slug} = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    if(slug) {
      appwriteService.getPost(slug).then(posts => {
        if(posts) {
          setPost(posts);
        }
      })
    }
    else {
      navigate('/');
    }
  }, [slug, navigate])
  return (
    post ? (
      <div className='py-8'>
        <Container>
          <PostForm post={post}/>
        </Container>
      </div>
    ) : null
  )
}

export default EditPost