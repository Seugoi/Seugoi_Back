const router = require('express').Router();
const usersMiddleware = require('../controllers/user');

// router.post('/signup', usersMiddleware.signupPostMid); // 회원가입
// router.post('/login', usersMiddleware.loginPostMid); // 로그인
router.get('/kakao_oauth', usersMiddleware.kakaoLogin); // 카카오 OAuth 로그인
router.get('', usersMiddleware.allUser); // 모든 유저 조회
router.get('/:user_id', usersMiddleware.userInfoGetMind); // 특정 유저 정보 조회
router.patch('/nickname', usersMiddleware.nicknamePatchMid); // 닉네임 수정

router.get('/:user_id/study', usersMiddleware.userStudy); // 내가 작성한 스터디 조회
router.get('/:user_id/notice', usersMiddleware.userNotice); // 내가 작성한 모든 공지글 조회
router.get('/:user_id/like', usersMiddleware.userLikeStudy); // 내가 찜한 스터디 조회
router.get('/:user_id/join', usersMiddleware.userJoinStudy); // 내가 가입한 스터디 조회

module.exports = router;