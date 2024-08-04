const { User, Study, Task } = require('../models');
const moment = require('moment');

// 스터디 과제 생성
exports.createTask = async (req, res) => {
    try {
        let { study_id, user_id, title, description, due_date } = req.body;

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
            study_id,
            user_id,
            title,
            description,
            images: imagePaths,
            due_date: moment(due_date).format('YYYY-MM-DD'),
            completed: false
        });

        res.status(201).json({ message: '과제가 성공적으로 생성되었습니다.', task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류로 과제가 생성되지 않았습니다.' });
    }
};