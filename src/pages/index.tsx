import { GetStaticProps } from 'next';
import Head from 'next/head';

import styles from './home.module.scss';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications for <span>free</span>!
          </p>
        </section>

        <img src="/images/rocket.svg" alt="Rocket flying" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
