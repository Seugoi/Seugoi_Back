// const { Message } = require('../models');

// //채팅 보내기
// exports.sendMessage = async(req,res) => {
//     const {user_id, chat_room_id, message} = req.body;  
//     try{
//         const sendMessage = await Message.create({
//             user_id : user_id, 
//             chat_room_id : chat_room_id, 
//             content: message
//         })
//       return  res.status(201).json({message: "채팅 보내기 성공"})
//     }catch(error){
//         console.log(error)
//         res.status(500).json({error: "서버 오류로 인해 채팅 보내기 실패"})
//     }
// }

// //채팅 내역 불러오기
// exports.getChatRoomMessage = async(req,res) => {
//     const {chat_room_id} = req.params;
//     try{
//         const messages = await Message.findAll({
//             where: {chat_room_id}, 
//             order: [['sent_at', 'ASC']]
//         })
        
//         res.status(200).json({messages});
//     }catch(error){
//         console.log(error)
//         res.status(500).json({error: "서버 오류로 채팅 내역을 불러오기 실패"})
//     } 
// }

