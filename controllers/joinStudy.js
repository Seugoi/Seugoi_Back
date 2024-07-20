const { Study, JoinStudy } = require('../models');

// 스터디 가입하기
exports.joinStudy = async (req, res) => {
    try {
        const {
            user_id,
            study_id
        } = req.body;

        const joined = await JoinStudy.findOne({
            where: {
                user_id: user_id,
                study_id: study_id
            }
        });

        if (joined) {
            return res.status(400).json({ message: "스터디에 이미 가입되었습니다." });
        }

        const join = await JoinStudy.create({
            user_id,
            study_id
        });

        const study = await Study.findByPk(study_id);
        if (study) {
            let joinPeopleIds = study.join_people_id || [];
            joinPeopleIds.push(user_id);
            study.join_people_id = joinPeopleIds;
            await study.save();
        } else {
            console.error("스터디를 찾을 수 없습니다.");
            return res.status(404).json({ error: "스터디를 찾을 수 없습니다." });
        }

        res.status(201).json({ message: "스터디 가입에 성공하였습니다." });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error : "서버 오류로 스터디 가입 실패" });
    }
}

// 내가 가입한 스터디 조회
exports.JoinedStudy = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        if (!user_id) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }

        const joinedStudy = await JoinStudy.findAll({
            attributes: [
                'id',
                'user_id',
                'study_id'
            ],
            where: {
                user_id: user_id
            }
        })

        if (joinedStudy.length === 0) {
            return res.status(404).json({ error: "가입한 스터디가 없습니다." });
        }

        const studyId = joinedStudy.map(join => join.study_id);

        const studies = await Study.findAll({
            attributes: [
                'id', 'user_id',
                'name', 'image', 'hashTag',
                'endDate', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content',
                'Dday',
                'join_people_id'
            ],
            where: {
                id: studyId
            }
        });

        const response = joinedStudy.map(join => {
            const study = studies.find(study => study.id === join.study_id);
            return {
                ...join.dataValues,
                study: study ? study.dataValues : null
            };
        });

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 가입한 스터디 조회 실패" });
    }
}