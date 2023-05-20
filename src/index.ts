import { createApi as createUnsplashClient } from 'unsplash-js'
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import api from "./api";
import fastifyStatic from "@fastify/static";
import path from "path";

const server = fastify({ logger: true })

;(async () => {
  await server.register(fastifyStatic, {
    root: path.join(__dirname, "../static"),
    wildcard: false
  })
  await server.register(fastifyCors)
  await server.register(api, { prefix: "/api" })
  await server.listen({
    host: "0.0.0.0",
    port: 8080
  })
})()
  .catch((err: unknown) => {
    throw err
  })
