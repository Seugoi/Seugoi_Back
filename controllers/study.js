const { User, Study } = require('../models');

// 스터디 생성
exports.createStudy = async (req, res) => {
    try {
        const {
            user_id, name, hashTag, 
            endData, title, 
            simple_content, 
            study_content, 
            detail_content, 
            recom_content 
        } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const parsedStudyContent = JSON.parse(study_content);
        const parsedRecomContent = JSON.parse(recom_content);
        const parsedHashTag = JSON.parse(hashTag);

        // 스터디 생성
        const createstudy = await Study.create({
            user_id: Number(user_id),
            image : req.file.originalname,
            name, title,
            hashTag: parsedHashTag,
            endData: Date(endData), 
            simple_content,
            study_content: parsedStudyContent,
            detail_content,
            recom_content: parsedRecomContent
        })

        return res.status(200).json({ message: '스터디가 성공적으로 생성되었습니다.' });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 스터디가 생성되지 않았습니다.' });
    }
};

// 모든 스터디 조회
exports.allStudy = async (req, res) => {
    try {
        const study = await Study.findAll();
        res.json(study);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 모든 스터디 정보 조회 실패" });
    }
}

// 특정 스터디 조회
exports.idStudy = async (req, res) => {
    try {
        const study_id = req.params.study_id;

        const study = await Study.findOne({
            attributes: [
                'id', 'user_id',
                'image',
                'endData', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content' 
            ],
            where: {
                id: study_id
            }
        })
        let response = { ...study.dataValues };
        res.json(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "서버 오류로 특정 스터디 조회 실패" });
    }
}