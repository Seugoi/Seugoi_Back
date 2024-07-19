const { User, Study, JoinStudy, ViewHistory, LikeStudy, sequelize } = require('../models');
const moment = require('moment');
const { Sequelize } = require('sequelize');

// 스터디 생성
exports.createStudy = async (req, res) => {
    try {
        const {
            user_id, name, hashTag, 
            endDate, title, 
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

        // endDate 유효성 검사 및 변환
        const momentEndDate = moment(endDate, 'YYYY-MM-DD', true);
        const extractedEndDate = momentEndDate.format('YYYY-MM-DD');
        if (!momentEndDate.isValid()) {
            return res.status(400).json({ error: '유효하지 않은 날짜 형식입니다.' });
        }

        // Dday 계산
        const currentDate = moment().startOf('day');
        const Dday = momentEndDate.diff(currentDate, 'days');

        // 스터디 생성
        const createstudy = await Study.create({
            user_id: Number(user_id),
            image: req.file ? req.file.originalname : null,
            name, title,
            hashTag: parsedHashTag,
            endDate: extractedEndDate,
            simple_content,
            study_content: parsedStudyContent,
            detail_content,
            recom_content: parsedRecomContent,
            Dday: Dday
        });

        return res.status(200).json({ message: '스터디가 성공적으로 생성되었습니다.' });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 스터디가 생성되지 않았습니다.' });
    }
};

// 모든 스터디 조회
exports.allStudy = async (req, res) => {
    try {
        const studies = await Study.findAll();

        const userIds = studies.map(study => study.user_id);
        const users = await User.findAll({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: userIds
            }
        });

        // 사용자 세부 정보를 사용자 ID로 매핑
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        // 조회 횟수 계산
        // 모든 스터디에 대한 조회 수 가져오기
        const viewCounts = await ViewHistory.findAll({
            attributes: ['study_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['study_id'],
            raw: true
        });

        // 조회 수를 스터디 ID로 매핑
        const viewCountMap = viewCounts.reduce((acc, viewCount) => {
            acc[viewCount.study_id] = viewCount.count;
            return acc;
        }, {});

        const response = studies.map(study => ({
            ...study.dataValues,
            user: userMap[study.user_id],
            viewCount: viewCountMap[study.id] || 0
        }));

        res.status(200).json(response);
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
                'id', 'user_id', 'name',
                'image', 'hashTag',
                'endDate', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content',
                'Dday',
                'join_people_id'
            ],
            where: {
                id: study_id
            }
        })

        if (!study) {
            return res.status(404).json({ error: "스터디를 찾을 수 없습니다." });
        }

        // 사용자 정보를 조회
        const user = await User.findOne({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: study.user_id
            }
        });

        // 조회 횟수 계산
        const viewCount = await ViewHistory.count({
            where: {
                study_id: study_id
            }
        });

        // 좋아요 여부
        const like = await LikeStudy.findOne({
            where: {
                user_id: study.user_id,
                study_id: study_id
            }
        });

        let response = {
            ...study.dataValues,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                birthday: user.birthday,
                job: user.job
            },
            viewCount: viewCount || 0,
            liked: !!like
        };

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 특정 스터디 조회 실패" });
    }
}

// 검색된 스터디 조회
exports.keywordStudy = async (req, res) => {
    try {
        const keyword = req.params.keyword;

        let searchString = `%${keyword}%`;

        const study = await Study.findAll({
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
                [Sequelize.Op.or]: [
                    sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), {
                        [Sequelize.Op.like]: searchString
                    }),
                    sequelize.where(sequelize.fn('LOWER', sequelize.cast(sequelize.col('hashTag'), 'CHAR')), {
                        [Sequelize.Op.like]: searchString
                    })
                ]
            }
        })

        // 검색된 스터디가 없는 경우
        if (study.length === 0) {
            return res.status(200).json({ message: "검색 결과 없음" });
        }

        const userIds = study.map(study => study.user_id);
        const users = await User.findAll({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: userIds
            }
        });

        // 사용자 세부 정보를 사용자 ID로 매핑
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        // 조회 횟수 계산
        // 모든 스터디에 대한 조회 수 가져오기
        const viewCounts = await ViewHistory.findAll({
            attributes: ['study_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['study_id'],
            raw: true
        });

        // 조회 수를 스터디 ID로 매핑
        const viewCountMap = viewCounts.reduce((acc, viewCount) => {
            acc[viewCount.study_id] = viewCount.count;
            return acc;
        }, {});

        const response = study.map(study => ({
            ...study.dataValues,
            user: userMap[study.user_id],
            viewCount: viewCountMap[study.id] || 0
        }));

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 검색된 스터디 조회 실패" });
    }
}

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

        res.status(200).json({ message: "스터디 가입에 성공하였습니다." });

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

// 스터디 조회
exports.viewStudy = async (req, res) => {
    try {
        const {
            user_id,
            study_id
        } = req.body;

        // view_history 테이블
        const view = await ViewHistory.create({
            user_id,
            study_id
        });

        res.status(200).json({ message: "스터디 보기 성공" });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 스터디 보기 실패" });
    }
}

// 스터디 좋아요 누르기
exports.LikeStudy = async (req, res) => {
    try {
        const {
            user_id, study_id
        } = req.body;

        // 이미 좋아요를 눌렀는지 확인
        const existingLike = await LikeStudy.findOne({
            where: {
                user_id,
                study_id
            }
        });

        if (existingLike) {
            // 이미 좋아요를 눌렀다면, 좋아요를 취소 (삭제)
            const del = await LikeStudy.destroy({
                where: {
                    user_id,
                    study_id
                }
            });

            return res.status(200).json({ message: "스터디 좋아요 취소 성공" });
        } else {
            // 좋아요를 누르지 않았다면, 좋아요 추가
            const like = await LikeStudy.create({
                user_id,
                study_id
            });
            return res.status(200).json({ message: "스터디 좋아요 성공" });
        }

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 스터디 좋아요 실패" });
    }
}

// 내가 찜한 스터디 조회
exports.likedStudy = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        // 사용자가 좋아요를 누른 스터디 ID 목록 조회
        const likedStudies = await LikeStudy.findAll({
            attributes: ['study_id'],
            where: {
                user_id: user_id
            }
        });

        if (likedStudies.length === 0) {
            return res.status(200).json({ message: "좋아요를 누른 스터디가 없습니다." });
        }

        const studyIds = likedStudies.map(like => like.study_id);

        // 좋아요를 누른 스터디들의 세부 정보 조회
        const studies = await Study.findAll({
            attributes: [
                'id', 'user_id', 'name',
                'image', 'hashTag',
                'endDate', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content',
                'Dday',
                'join_people_id'
            ],
            where: {
                id: studyIds
            }
        });

        // 각 스터디의 작성자 정보와 조회 횟수 및 좋아요 여부 조회
        const response = await Promise.all(studies.map(async (study) => {
            const user = await User.findOne({
                attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
                where: {
                    id: study.user_id
                }
            });

            const viewCount = await ViewHistory.count({
                where: {
                    study_id: study.id
                }
            });

            return {
                ...study.dataValues,
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    birthday: user.birthday,
                    job: user.job
                },
                viewCount: viewCount || 0,
                liked: true
            };
        }));

        res.status(200).json(response);

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 찜한 스터디 조회 실패" });
    }
}