const express = require('express');
const cors = require('cors');
const app = express();

const {sequelize} = require('./models');

app.set('port', process.env.PORT || 3000); //포트 설정

sequelize.sync({force: false})
.then(()=>{
    console.log("DB Connected Success");
})
.catch((err)=> {
    console.error(err);
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('성공! 성공!');
});

const users = require('./routes/user');
app.use('/users', users);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});