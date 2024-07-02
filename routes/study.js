const router = require('express').Router();
const studyMiddleware = require('../controllers/study');
const multer = require('multer');

const storage = multer.memoryStorage({ 
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('이미지 파일만 업로드 가능!'), false);
        }
        cb(null, true);
    },
    // 파일 이름 설정: 원본 파일 이름 사용
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('', upload.single('image'), studyMiddleware.createStudy); // 스터디 생성
router.get('', studyMiddleware.allStudy); // 모든 스터디 조회
router.get('/:study_id', studyMiddleware.idStudy); // 특정 스터디 조회
router.get('/search/:keyword', studyMiddleware.keywordStudy); // 검색된 스터디 조회

module.exports = router;
