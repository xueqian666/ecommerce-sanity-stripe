// npm install @sanity/client
// npm install @sanity/image-url
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
    projectId: 'cc7b9r5p',
    dataset: 'production',
    apiVersion: '2023-10-02',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
  });
  
  const builder = imageUrlBuilder(client);
  
  export const urlFor = (source) => builder.image(source);