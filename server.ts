import Fastify from 'fastify'

import { fastifyStatic } from '@fastify/static'
import { fastifyCors } from '@fastify/cors'
import path from 'path';

import denuncias from './mocks/denuncias'
import acoes from './mocks/acoes'
import categories from './mocks/categories';

const server = Fastify()
server.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS']

})

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

server.get("/categories", (request, reply) => {
    return reply.send(categories)
})

interface UpdateDenunciaParams {
    id: string;
}

interface UpdateDenunciaBody {
    acaoId: number;
    status: 'aberto' | 'em_andamento' | 'concluido' | 'indeferido';
    motivoStatus?: string;
}

server.patch<{ Params: UpdateDenunciaParams, Body: UpdateDenunciaBody }>("/denuncias/:id", (request, reply) => {
    const id = parseInt(request.params.id);
    const { acaoId, status, motivoStatus } = request.body;

    const denunciaIndex = denuncias.findIndex((d: any) => d.id === id);

    if (denunciaIndex === -1) {
        return reply.status(404).send({ message: "Denúncia não encontrada." });
    }

    const denunciaAtualizada = {
        ...denuncias[denunciaIndex],
        acaoId: acaoId,
        status: status,
        motivoStatus: motivoStatus || null
    };

    denuncias[denunciaIndex] = denunciaAtualizada;

    return reply.status(200).send(denunciaAtualizada);
});


server.listen({
    host: '0.0.0.0',
    port: 3000
})
