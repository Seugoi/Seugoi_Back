const express = require('express');
const app = express();
const bodyParser = require("body-parser"); 
app.set('port', process.env.PORT || 3008);

app.set("view engine", "ejs");
app.use(express.static("uploads"));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

const router = require("./routes");
app.use("/", router);

// app.get('/', (req, res) => {
//     res.send('Hello, Express')
// });

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
});