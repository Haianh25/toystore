const socketIo = require('socket.io');

let io;

module.exports = {
    // Initialize Socket.io
    init: (httpServer) => {
        io = socketIo(httpServer, {
            cors: {
                origin: [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:3000"
                ],
                methods: ["GET", "POST", "PUT", "DELETE"],
                credentials: true
            }
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        return io;
    },

    // Get the initialized io instance
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
