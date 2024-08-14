const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http');
const server = http.createServer(app)
const socket = require('./sockets/socket')
socket(server)

const { sequelize } = require('./models');
const path = require('path');

app.set('port', process.env.PORT || 3001); //포트 설정

sequelize.sync({force: false})
.then(()=>{
    console.log("DB Connected Success");
})
.catch((err)=> {
    console.error(err);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('성공! 성공!');
});

// 유저
const users = require('./routes/user');
app.use('/users', users);

// 스터디
const studies = require('./routes/study');
app.use('/study', studies);
app.use('/study-image', express.static(path.join(__dirname, 'images/study-images')));

// 과제
const comments = require('./routes/task');
app.use('/task', comments);
app.use('/task-image', express.static(path.join(__dirname, 'images/task-images')));

// 과제 댓글
const comments = require('./routes/taskComment');
app.use('/comment', comments);
app.use('/comment-image', express.static(path.join(__dirname, 'images/comment-images')));

// 공지
const notice = require("./routes/notice");
app.use('/notice', notice);

//채팅방 
const chatroom = require("./routes/chatroom");
app.use('/chatroom', chatroom);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});