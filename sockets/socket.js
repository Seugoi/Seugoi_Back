const socketIO = require('socket.io');
const { User, Chatroom, Message,  } = require('../models');

const Socket = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected');
        message(socket);
        getUserChatroomList(socket);
        readChatList(socket)
        disconnect(socket);
    });

    return io;
};

// 메시지 전송
const message = async (socket) => {
    socket.on('reqMessage', async (obj) => {
        try {
            const { user_id, chatroom_id, message } = obj;
            const newMessage = await Message.create({
                user_id,
                chatroom_id,
                message,
            })

            await Chatroom.update(
                { last_chat: newMessage.message },
                { where: { id: chatroom_id } }
            )

            socket.to(chatroom_id).emit('resMessage', newMessage);
        } catch (error) {
            console.log('Error sending message: ', error);
        }
    })
}

//특정 유저의 채팅방 목록 조회
const getUserChatroomList = (socket) => {
    socket.on('reqChatRoomList', async (req) => {
        try {
            const { user_id } = req;
            const user = await User.findByPk(user_id)
            if (!user) {
                socket.emit('loginError', { message: '존재하지 않는 유저입니다' })
            }
            const rooms = await Chatroom.findAll({
                where: { user_id },
            })

            socket.emit('resChatRoomList', rooms);
        } catch (error) {
            console.error('Error handling login:', error);
        }
    })
}

//특정 채팅방의 채팅목록 조회
const readChatList = (socket) => {
    socket.on('reqChatList', async (req) => {
        const { user_Id, chat_room_id } = req
        socket.join(chat_room_id)
        console.log(`${chat_room_id}`)

        try {
            const chatList = await Message.findAll({
                where: { chat_room_id },
                order: [['createdAt', 'ASC']],
            })
            socket.emit('resChatList', chatList)
            await updateReadStatus(user_Id, chat_room_id);
        } catch (error) {
            socket.emit('chatListError', { message: 'Error reading chatList' });
        }
    })
}

const disconnect = (socket) => {
    socket.on('disconnect', () => {
        console.log('Socket disconnected')
        socket.emit('loginError', { message: 'User not found' });
        return;
    })
}

module.exports = Socket