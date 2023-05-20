import {FastifyInstance, FastifySchema} from "fastify";
import {FastifyPluginAsyncTypebox, Type} from "@fastify/type-provider-typebox";

import unsplash, {getRandomImages} from "./unsplash";
import {Random} from "unsplash-js/dist/methods/photos/types";
import fastifyCaching from "@fastify/caching";

const orientationSchema = {
  querystring: Type.Object({
    orientation: Type.Union([Type.Literal("landscape"), Type.Literal("portrait")])
  })
}

const api: FastifyPluginAsyncTypebox = async function (fastify): Promise<void> {
  fastify.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 60,
    serverExpiresIn: 60
  })

  fastify.get("/random", {
    schema: orientationSchema
  }, async request => {
    const [image] = await getRandomImages(1)

    return {
      url: image.urls.raw,
      credit: {
        name: image.user.name,
        url: image.links.html
      }
    }
  })

  fastify.get("/random/bulk", {
    schema: orientationSchema
  }, async request => {
    const images = await getRandomImages(10)

    return images.map(image => ({
      url: image.urls.raw,
      credit: {
        name: image.user.name,
        url: image.links.html
      }
    }))
  })

  fastify.get("/random/landscape", (request, reply) => {
    reply.redirect("../random?orientation=landscape")
  })

  fastify.get("/random/portrait", (request, reply) => {
    reply.redirect("../random?orientation=portrait")
  })
}

export default api
