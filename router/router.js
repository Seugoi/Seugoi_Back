const express = require("express");
const router = express.Router();
const userApi = require("../service/user");
const session = require('express-session');

// 세션 미들웨어 설정
router.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 6000,
        },
    })
);

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get("/api/users", userApi.allUserApi); // 사용자 목록 가져오는 api
router.post("/api/users/register", userApi.registerApi); // 사용자 등록 api
router.post("/api/users/login", userApi.loginApi); // 로그인 api
router.post("/api/AuthEmail", userApi.mailSender); // 이메일 보내는 api
// 기본 루트에 대한 응답
router.get("/", (req, res) => {
    res.end("Hello World");
});
    
module.exports = router;