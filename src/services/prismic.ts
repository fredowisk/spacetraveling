import * as Prismic from '@prismicio/client';

export function getPrismicClient(): Prismic.Client {
  const client = Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return client;
}
