import { GetStaticProps } from 'next';
import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface FormattedPost {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  createdAt: string;
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface PostsProps {
  postsPagination: PostPagination;
}

function formatPosts(postsToFormat: Post[]): FormattedPost[] {
  return postsToFormat.map(post => ({
    slug: post.uid,
    title: post.data.title,
    subtitle: post.data.subtitle,
    author: post.data.author,
    createdAt: format(new Date(post.first_publication_date), 'dd MMM yyyy', {
      locale: ptBR,
    }),
  }));
}

export default function Posts({
  postsPagination: { next_page, results },
}: PostsProps): JSX.Element {
  const [posts, setPosts] = useState<FormattedPost[]>(formatPosts(results));
  const [nextPage, setNextPage] = useState(next_page);

  const handleRequest = async (): Promise<void> => {
    const response = await fetch(nextPage);

    const newPosts = await response.json();

    setNextPage(newPosts.next_page);

    if (!newPosts.results.length) return;

    setPosts([...posts, ...formatPosts(newPosts.results)]);
  };

  return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <strong>{post.title}</strong>
              <p>{post.subtitle}</p>
              <div className={styles.info}>
                <FiCalendar />
                <time>{post.createdAt}</time>
                <FiUser />
                <span>{post.author}</span>
              </div>
            </Link>
          ))}
          {nextPage && (
            <button
              type="button"
              className={styles.loadMorePostsButton}
              onClick={handleRequest}
            >
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getByType('posts', {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 5,
  });

  return {
    props: {
      postsPagination: {
        results: response.results,
        next_page: response.next_page,
      },
    },
    revalidate: 60 * 60,
  };
};
