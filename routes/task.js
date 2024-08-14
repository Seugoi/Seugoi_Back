const router = require('express').Router();
const taskRoutes = require('../controllers/task');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

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

router.post('', taskUpload.array('images', 5), taskRoutes.createTask); // 과제 생성
router.get('/study/:study_id', taskRoutes.getAllTasksForStudy); // 특정 스터디의 모든 과제 조회
router.get('/:task_id', taskRoutes.getTaskById); // 특정 과제 조회

module.exports = router;