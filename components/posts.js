'use client'
import {formatDate} from '@/lib/format';
import LikeButton from './like-icon';
import togglePostLikeStatus from "@/actions/post";
import {useOptimistic} from "react";
import Image from "next/image";

function imageLoader(config) {
    const urlStart = config.src.split('/upload')[0]
    const urlEnd = config.src.split('/upload')[1]
    return `${urlStart}/upload/w_200,q_${config.quality}/${urlEnd}`
}


function Post({post, action}) {
    return (
        <article className="post">
            <div className="post-image">
                <Image loader={imageLoader} width={200} height={120} src={post.image} alt={post.title} quality={50}/>
            </div>
            <div className="post-content">
                <header>
                    <div>
                        <h2>{post.title}</h2>
                        <p>
                            Shared by {post.userFirstName} on{' '}
                            <time dateTime={post.createdAt}>
                                {formatDate(post.createdAt)}
                            </time>
                        </p>
                    </div>
                    <div>
                        <form action={action.bind(null, post.id)}
                              className={post.isLiked ? 'liked' : ''}>
                            <LikeButton/>
                        </form>
                    </div>
                </header>
                <p>{post.content}</p>
            </div>
        </article>
    );
}

export default function Posts({posts}) {
    const [optimisticState, updateOptimisticPost] = useOptimistic(posts, (prevState, updatedPostId) => {
        const updatedPostIndex = prevState.findIndex(post => post.id === updatedPostId)
        if (updatedPostIndex === -1) {
            return prevState
        }

        const updatedPost = {...prevState[updatedPostIndex]}
        updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
        updatedPost.isLiked = !updatedPost.isLiked;
        const newPost = [...prevState]
        newPost[updatedPostIndex] = updatedPost;
        return newPost;


        // don't use it to update the array of an object because slice creates shallow copy the original
        // array remains the same, so it affects the array or like post-status logic

        /* return [
          ...prevState.slice(0, updatedPostIndex),
          updatedPost,
          ...prevState.slice(updatedPostIndex + 1)
        ]
         */

    })

    async function updatePost(postId) {
        updateOptimisticPost(postId)
        await togglePostLikeStatus(postId)
    }

    if (!optimisticState || optimisticState.length === 0) {
        return <p>There are no posts yet. Maybe start sharing some?</p>;
    }

    return (
        <ul className="posts">
            {optimisticState.map((post) => (
                <li key={post.id}>
                    <Post post={post} action={updatePost}/>
                </li>
            ))}
        </ul>
    );
}
