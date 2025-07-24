import Posts from '@/components/posts';
import { getPosts } from '@/lib/posts';

export const metadata = {
    title: 'All posts',
    description: 'Browser all posts',
}

// export async function generateMetadata(){
//     const post = await getPosts()
//     const numberOfPosts = post.length
//     return {
//         title:  `Browse all ${numberOfPosts} posts.`,
//         description: 'Browser all posts' ,
//     }
// }
export default async function FeedPage() {
  const posts = await getPosts();
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts} />
    </>
  );
}
