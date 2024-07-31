const router = require('express').Router();
const studyMiddleware = require('../controllers/study');
const viewMiddleware = require('../controllers/viewHistory');
const likeMiddleware = require('../controllers/likeStudy');
const joinMiddleware= require('../controllers/joinStudy');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});
  
const upload = multer({ storage: storage });

router.post('', upload.single('image'), studyMiddleware.createStudy); // 스터디 생성
router.get('', studyMiddleware.allStudy); // 모든 스터디 조회
router.get('/:study_id', studyMiddleware.idStudy); // 특정 스터디 조회
router.get('/search/:keyword', studyMiddleware.keywordStudy); // 검색된 스터디 조회

router.post('/join', joinMiddleware.joinStudy); // 스터디 가입

router.post('/like', likeMiddleware.LikeStudy); // 스터디 좋아요

router.post('/view', viewMiddleware.viewStudy); // 스터디 조회수
router.get('/:user_id/view', viewMiddleware.viewedStudy); // 본 스터디 조회

router.get('/:study_id/all', studyMiddleware.studyAllNoticeAndTask); // 스터디별 과제와 공지 모두 조회(최신순)

module.exports = router;
