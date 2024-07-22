const router = require('express').Router();
const noticeMiddleware = require('../controllers/notice');

router.post("", noticeMiddleware.createNotice); // 공지 생성
router.get("", noticeMiddleware.allNotice); // 모든 공지 조회
router.get("/:notice_id", noticeMiddleware.idNotice); // 특정 공지 조회

module.exports = router;