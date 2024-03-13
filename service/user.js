const bcrypt = require('bcrypt');
const db = require("../db/db"); // 디비 연결 설정 파일

registerApi = async(req, res) => {
    const table = "seugoi_user"; // 사용자 정보를 저장할 테이블명
    const sql = `insert into ${table} set ?`;
    const body = req.body;

    try {
        // 사용자 비밀번호 해시화
        const encryptedPW = await bcrypt.hash(body.user_password, 10); // 비밀번호 해시화
        
        const param = {
            user_id: body.user_id,
            user_password: encryptedPW,
            user_name: body.user_name,
            user_email: body.user_email
        };

        db.query(sql, param, (err, result) => {
            if (err) {
                console.error("회원가입 중 오류 발생 : ", err);
                res.status(400).json({ msg: "error", content: err });
            } else {
                console.log("회원가입 성공 : ", result);
                res.status(200).json({ msg: "success", result: result });
            }
        });
    } catch (error) {
        console.error("비밀번호 해싱 중 오류 발생 : ", error);
        res.status(500).json({ msg: "error", content: "Internal server error" });
    }
};

module.exports = registerApi;