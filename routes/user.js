const express = require('express');
const router = express.Router();
const db = require('../db/db');
const corsMiddleware = require('../middleware/cors');

router.use(corsMiddleware);
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 로그인
router.post('/login', async (req, res) => {
    const { user_id, user_pw } = req.body;

    // MySQL 데이터베이스에서 사용자 정보 확인
    const query = 'SELECT * FROM seugoi_user WHERE user_id = ? AND user_pw = ?';
    db.query(query, [user_id, user_pw], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            // 유효한 사용자인 경우
            const user = results[0];
            res.json({ message: '로그인 성공' , user});
            console.log('로그인 성공');
        } else {
            // 사용자 정보가 일치하지 않는 경우
            res.status(401).json({ error: '로그인 실패' });
        }

    });

});

// 회원가입 
router.post('/join', (req, res) => {
    const { user_id, user_pw, user_email, user_job } = req.body;

    // MySQL 데이터베이스에서 현재 가장 큰 id 값 찾기
    const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM seugoi_user';
    db.query(getMaxIdQuery, (err, results) => {
        if (err) {
            console.error('최대 id 조회 오류:', err);
            return res.status(500).json({ message: '회원가입 실패'});
        }

        // 가장 큰 id 값 찾기
        let maxId = results[0].maxId || 0; // 만약 테이블에 아무 값도 없으면 maxId가 null이므로 0으로 초기화
        const newId = maxId + 1;

        // MySQL 데이터베이스에 새로운 사용자 추가
        const sql = 'INSERT INTO seugoi_user (id, user_id, user_pw, user_email, user_job) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [newId, user_id, user_pw, user_email, user_job], (err, result) => {
            if (err) {
                console.error('회원가입 오류:', err);
                res.status(500).json({ message: '회원가입 실패'});
            } else {
                console.log('회원가입 성공');
                res.status(201).json({ message: '회원가입 성공', user: req.body});
            }
        });
    });
});

module.exports = router;