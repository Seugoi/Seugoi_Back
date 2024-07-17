const router = require('express').Router();
const commentMiddleware = require('../controllers/taskComment');
const multer = require('multer');

const storage = multer.memoryStorage({
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('이미지 파일만 업로드 가능!'), false);
        }
        cb(null, true);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('', upload.single('image'), commentMiddleware.createComment); // 과제 댓글 등록
router.get('', commentMiddleware.allTaskComment); // 댓글 전체 조회
router.get('/:comment_id', commentMiddleware.idComment); // 특정 댓글 조회

module.exports = router;