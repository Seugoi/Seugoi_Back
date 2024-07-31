const router = require('express').Router();
const taskMiddleware = require('../controllers/taskComment');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const commentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/comment-images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});
  
const commentUpload = multer({ storage: commentStorage });

router.post('', commentUpload.array('images', 5), taskMiddleware.createComment); // 과제 댓글 등록
router.get('', taskMiddleware.allTaskComment); // 댓글 전체 조회
router.get('/:study_id', taskMiddleware.idComment); // 특정 스터디 댓글 조회

module.exports = router;