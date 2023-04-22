import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { asHTML, asText } from '@prismicio/helpers';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import { Comments } from '../../components/Comments';

interface FormattedPost {
  banner: {
    url: string;
  };
  title: string;
  author: string;
  content: {
    heading: string;
    body: Record<string, unknown>[];
  }[];
  readingTime: number;
  createdAt: string;
  editedAt: string;
}

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  uid: string;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: Record<string, unknown>[];
    }[];
  };
}

interface PostProps {
  post: Post;
  nextPage: Post;
  prevPage: Post;
}

function formatPost(postToFormat: Post): FormattedPost {
  const { data, first_publication_date, last_publication_date } = postToFormat;

  const { content, readingTime } = data.content.reduce(
    (acc, { heading, body }) => {
      acc.content.push({
        heading,
        body: asHTML(body as []),
      });

      const headerWords = heading.split(' ');
      const bodyWords = asText(body as []).split(' ');

      acc.readingTime += Math.ceil(
        (headerWords.length + bodyWords.length) / 200
      );

      return acc;
    },
    { content: [], readingTime: 0 }
  );

  const editedAt =
    first_publication_date !== last_publication_date
      ? format(
          new Date(last_publication_date),
          "'* editado em' dd MMM yyyy', às' HH:mm",
          {
            locale: ptBR,
          }
        )
      : null;

  const formattedPost: FormattedPost = {
    banner: data.banner,
    title: data.title,
    author: data.author,
    content,
    createdAt: format(new Date(first_publication_date), 'dd MMM yyyy', {
      locale: ptBR,
    }),
    editedAt,
    readingTime,
  };

  return formattedPost;
}

export default function Post({
  post,
  nextPage,
  prevPage,
}: PostProps): JSX.Element {
  const [formattedPost, setFormattedPost] = useState<FormattedPost>(null);

  useEffect(() => {
    if (post) {
      setFormattedPost(formatPost(post));
    }
  }, [post]);

  return (
    formattedPost && (
      <>
        <Head>
          <title>{`${formattedPost.title} | spacetraveling`}</title>
        </Head>
        <div className={styles.banner}>
          <img src={formattedPost.banner.url} alt="Post banner" />
        </div>
        <main className={styles.container}>
          <article className={styles.post}>
            <h1>{formattedPost.title}</h1>
            <div className={styles.info}>
              <FiCalendar />
              <time>{formattedPost.createdAt}</time>
              <FiUser />
              <span>{formattedPost.author}</span>
              <FiClock />
              <span>{formattedPost.readingTime} min</span>
            </div>
            <span className={styles.edited}>
              {formattedPost.editedAt && formattedPost.editedAt}
            </span>
            {formattedPost.content.map(({ heading, body }) => (
              <div className={styles.postContent} key={heading}>
                <h2>{heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            ))}
          </article>
        </main>
        <hr className={styles.divider} />
        <footer>
          <div className={styles.links}>
            {prevPage ? (
              <Link href={`${prevPage.uid}`}>
                <span>{prevPage.data.title}</span>
                <strong>Post anterior</strong>
              </Link>
            ) : (
              <div />
            )}
            {nextPage ? (
              <Link href={`${nextPage.uid}`}>
                <span>{nextPage.data.title}</span>
                <strong>Próximo post</strong>
              </Link>
            ) : (
              <div />
            )}
          </div>
          <Comments />
        </footer>
      </>
    )
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const { results: posts } = await prismic.getByType('posts', {
    fetch: ['posts.uid'],
    pageSize: 2,
  });

  return {
    paths: posts.map(post => ({ params: { slug: post.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', String(slug));

  const prevPage = await prismic.getByType('posts', {
    fetch: ['posts.title'],
    pageSize: 1,
    after: post.id,
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
  });

  const nextPage = await prismic.getByType('posts', {
    fetch: ['posts.title'],
    pageSize: 1,
    after: post.id,
    orderings: {
      field: 'document.first_publication_date',
    },
  });

  return {
    props: {
      post,
      nextPage: nextPage.results[0] || null,
      prevPage: prevPage.results[0] || null,
    },
    revalidate: 60 * 60 * 24 * 30,
  };
};
