const { User, Study, Task } = require('../models');
const { getUserMap } = require('../utils/getUserMap');
const moment = require('moment');

// 스터디 과제 생성
exports.createTask = async (req, res) => {
    try {
        let { user_id, study_id, title, content, link, images } = req.body;

        // 입력 데이터 유효성 검사
        if (!study_id || !user_id || !title || !due_date) {
            return res.status(400).json({ error: '모든 필드를 채워주세요.' });
        }

        // 스터디 및 유저 존재 여부 확인
        const study = await Study.findByPk(study_id);
        const user = await User.findByPk(user_id);
        if (!study) {
            return res.status(404).json({ error: '존재하지 않는 스터디입니다.' });
        }
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        // 파일 처리 (최대 5개)
        const files = req.files;
        let imagePaths = [];
        if (files && files.length > 0) {
            imagePaths = files.map(file => file.filename);
        }

        // 과제 생성
        const task = await Task.create({
            user_id,
            study_id,
            title,
            content,
            link,
            images: imagePaths
        });

        res.status(201).json({ message: '과제가 성공적으로 생성되었습니다.', task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류로 과제가 생성되지 않았습니다.' });
    }
};

// 특정 스터디의 모든 과제 조회
exports.getAllTasksForStudy = async (req, res) => {
    try {
        const study_id = req.params.study_id;

        // 스터디 존재 여부
        const study = await Study.findByPk(study_id);
        if (!study) {
            return res.status(404).json({ error: '존재하지 않는 스터디입니다.' });
        }

        // 스터디에 속한 모든 과제 조회
        const tasks = await Task.findAll({
            where: { study_id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류로 과제 조회 실패' });
    }
};

// 특정 과제 조회
exports.getTaskById = async (req, res) => {
    try {
        const task_id = req.params.task_id;

        // 과제 조회
        const task = await Task.findByPk(task_id);
        if (!task) {
            return res.status(404).json({ error: '과제를 찾을 수 없습니다.' });
        }

        // 유저 정보 추가
        const userMap = await getUserMap([task.user_id]);
        const response = {
            ...task.dataValues,
            user: userMap[task.user_id]
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류로 과제 조회 실패' });
    }
};