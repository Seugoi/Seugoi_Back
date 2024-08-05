const { Chatroom, User, UserChatroom} = require('../models'); 

//채팅방 생성
exports.createChatroom = async (req, res) => {
    try {
        const { user_id, name } = req.body;

        if (!user_id || !name) {
            return res.status(400).json({ message: "user_id나 name 정보 없음" });
        }

        const newRoom = await Chatroom.create({
            user_id,
            name
        });

        res.status(201).json({
            message: '채팅방이 성공적으로 생성되었습니다.',
            chatRoom: newRoom
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류로 채팅방 생성 실패 '+ error });
    }
}

// 채팅방 가입
exports.joinChatRoom = async (req, res) => {
    try {
        const { user_id, chat_room_id } = req.body;

        if (!user_id || !chat_room_id) {
            return res.status(400).json({ message: "user_id나 chat_room_id 정보 없음" });
        }

        // 사용자가 이미 채팅방에 가입되어 있는지 확인
        const joined = await UserChatroom.findOne({
            where: {
                user_id,
                chat_room_id
            }
        });

        if (joined) {
            return res.status(400).json({ message: "이미 이 채팅방에 가입되어 있습니다." });
        }

        // 사용자 채팅방 가입 처리
        const userChatRoom = await UserChatroom.create({
            user_id,
            chat_room_id
        });

        res.status(201).json({
            message: '채팅방 가입에 성공하였습니다.',
            userChatRoom
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류로 채팅방 가입 실패' });
    }
}

// 채팅방 검색
exports.searchChatrooms = async (req, res) => {
    try {
        const {query} = req.query;

        if (!query) {
            return res.status(400).json({ message: "검색어를 입력해주세요." });
        }

        const chatRooms = await Chatroom.findAll({
            where: {
                name: {
                    [Op.like]: `%${query}%` 
                }
            }
       });
       
        res.status(200).json({chatRooms});
    } catch(err) {
        console.error(err);
        res.status(500).json({ error : "서버 오류로 채팅방 검색 실패" });
    }
}

//채팅방 목록 가져오기
exports.getUserChatrooms = async (req,res) => {
    try{
        const { user_id } = req.params; 

        const user = await User.findByPk(user_id, {
            include: [{
                model: Chatroom,
                through: { attributes: [] } // 중간 테이블의 속성 제외
            }]
        })
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        res.status(200).json({ chatRooms: user.ChatRooms });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 채팅방 목록 가져오기 실패." });
    }
    
}
// 특정 채팅방 정보 가져오기
exports.getChatroom = async (req, res) => {
    try {
        const { chat_room_id } = req.params;

        const chatroom = await Chatroom.findByPk(chat_room_id, {
            include: [{
                model: User,
                through: { attributes: [] }, // 중간 테이블의 속성 제외
            }]
        });

        if (!chatroom) {
            return res.status(404).json({ message: "채팅방을 찾을 수 없습니다" });
        }

        res.status(200).json({ chatroom });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 채팅방 정보 가져오기 실패" });
    }
}

