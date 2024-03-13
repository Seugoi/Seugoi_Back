const User = require("../join/user");

// 메인 화면(회원가입)
exports.index = (req, res) => {
    res.render("join");
}

// User 정보 저장하기
exports.post_user = (req, res) => {
    User.insert( req.body, function (result) {  
        res.send({ id: result});
    })
}

//login 화면
exports.login = (req, res) => {
    res.render("login");
}

//login 시도
exports.post_login = (req, res) => {
    User.select( req.body.id, req.body.password, function (result) {
        if (result == null) {
            return res.send({result: result, flag: false});
        } else{
            if (req.body.password != result.password) {
                return res.send({result: result, flag: false});
            }else {
                return res.send({result: result, flag: true});
            }
        }
    });
}