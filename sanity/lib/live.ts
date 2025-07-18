// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.

import "server-only"
import { defineLive } from "next-sanity";
import { client } from './client'

const token = process.env.SANITY_WRITE_TOKEN

export const { sanityFetch, SanityLive } = defineLive({ 
  client: client.withConfig({ 
    apiVersion: 'vX' 
  }),
  serverToken: token,
  browserToken: token
});
