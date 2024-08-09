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

const taskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/task-images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});

const taskUpload = multer({ storage: taskStorage });

router.post('/task', taskUpload.array('images', 5), taskRoutes.createTask); // 과제 생성
router.get('/tasks/:study_id', taskRoutes.getAllTasksForStudy); // 특정 스터디의 모든 과제 조회
router.get('/task/:task_id', taskRoutes.getTaskById); // 특정 과제 조회
router.get('/user/:user_id/completed-tasks', taskRoutes.getCompletedTasksByUser); // 유저가 완료한 과제 조회

module.exports = router;