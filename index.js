'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const fs = require('fs');
const path = require('path');

const COMMENTS_FILE = path.join(__dirname, 'data', 'comments.json');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(Inert);

    // Melayani file statis
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'src/templates',
                index: ['index.html', 'wisata.html', 'kuliner.html', 'blog.html', 'aboutus.html']
            }
        }
    });

    // Mendapatkan semua komentar
    server.route({
        method: 'GET',
        path: '/comments',
        handler: (request, h) => {
            try {
                const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
                const comments = JSON.parse(data);
                return comments;
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to read comments' }).code(500);
            }
        }
    });

    // Menambahkan komentar baru
    server.route({
        method: 'POST',
        path: '/comments',
        handler: (request, h) => {
            const newComment = request.payload;

            if (!newComment.name || !newComment.comment) {
                return h.response({ error: 'Name and comment are required' }).code(400);
            }

            try {
                const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
                const comments = JSON.parse(data);
                comments.push(newComment);

                fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

                return h.response(newComment).code(201);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to save comment' }).code(500);
            }
        }
    });

    // Menghapus semua komentar
    server.route({
        method: 'DELETE',
        path: '/comments',
        handler: (request, h) => {
            try {
                fs.writeFileSync(COMMENTS_FILE, JSON.stringify([], null, 2));
                return h.response({ message: 'All comments deleted' }).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to delete comments' }).code(500);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
