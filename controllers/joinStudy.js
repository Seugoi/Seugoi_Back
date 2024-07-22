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