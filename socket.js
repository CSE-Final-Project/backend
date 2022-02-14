const express = require('express')
module.exports = ((io) => 
{
    const users = {};  
    const socketToRoom = {}; 

    io.on('connection', socket => {  
        socket.on("join room", roomID => { 
            if (users[roomID]) { 
                const length = users[roomID].length;
                if (length === 4) {
                    socket.emit("room full");
                    return;
                }
                users[roomID].push(socket.id);
            } else { 
                users[roomID] = [socket.id];
            }
            const myPeerID = socket.id;  
            io.to(socket.id).emit("my peer id", myPeerID);
            socketToRoom[socket.id] = roomID;
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id); 
            socket.emit("all users", usersInThisRoom); 
    
        });
    
        socket.on("sending signal", payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
        });
    
        socket.on("returning signal", payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });
    
        socket.on('false-event', data => {
            var roomID = data.dst_room;
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id); 
            for( let i=0; i < usersInThisRoom.length ; i++){
                socket.to(usersInThisRoom[i]).emit('video-state', {peer_tf: data.peer_tf, tf_state: data.tf_state});
            }
        })
            
        socket.on('disconnect', () => {
            var roomID = socketToRoom[socket.id];
            var usersInThisRoom = users[roomID].filter(id => id !== socket.id); 
            for( let i=0; i < usersInThisRoom.length ; i++){
                socket.to(usersInThisRoom[i]).emit('user-disconnected', socket.id );
            }
           
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room;
            }
        });
    
    });
})