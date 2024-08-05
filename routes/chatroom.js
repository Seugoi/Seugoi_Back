const router = require('express').Router();
const chatroomMiddleware = require('../controllers/chatroom');

router.post("", chatroomMiddleware.createChatroom); // 채팅방 생성
router.post("/join", chatroomMiddleware.joinChatRoom); // 채팅방 참여
router.get("", chatroomMiddleware.searchChatrooms); // 채팅방 검색 
router.get("/:user_id", chatroomMiddleware.getUserChatrooms); // 채팅방 목록 가져오기
router.get("/:chat_room_id", chatroomMiddleware.getChatroom); // 채팅방 목록 가져오기

module.exports = router;