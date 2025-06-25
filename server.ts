import Fastify from 'fastify'

import { fastifyStatic } from '@fastify/static'
import path from 'path';

import denuncias from './mocks/denuncias'
import acoes from './mocks/acoes'

const server = Fastify()
server.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads')
})

server.get("/files/uploads/:name", (request, reply) => {
    const options = ["horizontal.jpg", "vertical.jpg"]
    const randomIndex = Math.floor(Math.random() * options.length);

    return reply.sendFile(options[randomIndex])
})

server.get("/denuncias", (request, reply) => {
    return reply.send(denuncias)
})

server.get("/acoes", (request, reply) => {
    return reply.send(acoes)
})

server.listen({
    host: '0.0.0.0',
    port: 3000
})
