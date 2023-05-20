import {createApi as createUnsplashClient} from "unsplash-js";

const API_KEY = process.env.UNSPLASH_API_KEY
if (API_KEY === void 0) {
  throw new Error("UNSPLASH_API_KEY not provided.")
}

export const unsplash = createUnsplashClient({
  accessKey: API_KEY
})

export async function getRandomImages (count: number, orientation?: "landscape"|"portrait") {
  const { type: status, response: images } = await unsplash.photos.getRandom({
    collectionIds: ["1235504"],
    orientation: orientation
  })

  if (status === "error") {
    throw new Error("Unsplash API error")
  }

  return Array.isArray(images) ? images : [images]
}

export default unsplash
