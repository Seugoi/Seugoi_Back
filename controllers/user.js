const { User } = require('../models');
const crypto = require('crypto'); // 비밀번호 암호화

// 회원가입
exports.signupPostMid = async (req, res) => {
    try {
      const { nickname, password, email, birthday, job } = req.body;

      // 닉네임 사용자가 존재하는지 확인
      const checkNickname = await User.findOne({
        where: {
          nickname,
        },
      });

      if(checkNickname){
        return res.status(409).json({ error: '이미 존재하는 닉네임입니다.' });
      }

      const checkEmail = await User.findOne({
        where: {
          email,
        },
      });

      if(checkEmail){
        return res.status(409).json({ error: '이미 존재하는 이메일입니다.' });
      }

      // 비밀번호 해싱에 사용할 salt 생성
      const salt = crypto.randomBytes(16).toString('hex');

      // 사용자 비밀번호와 salt를 합쳐 해싱
      const hashedPassword = await crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

      // 회원가입
      const user = await User.create({
          nickname,
          password: hashedPassword,
          email,
          salt,
          birthday,
          job
      })

      return res.status(200).json({ message: '사용자 정보가 성공적으로 저장되었습니다.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '사용자 정보가 성공적으로 저장되지 않았습니다.' });
  }
};

// 로그인
exports.loginPostMid = async (req, res) => {
  try {
      const { nickname, password } = req.body;

      // 사용자 확인
      const user = await User.findOne({
        where: {
          nickname,
        },
      });

      // 사용자가 존재하지 않으면 오류 응답
      if (!user) {
        return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
      }

      if (typeof user.salt !== 'string' || typeof user.password !== 'string') {
        return res.status(500).json({ error: '서버 설정 오류: 잘못된 사용자 정보', 'user.salt': user });
      }

      // 입력된 비밀번호와 저장된 salt를 사용하여 해싱
      const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('base64');
      
      // 해싱된 비밀번호 비교
      if (hashedPassword !== user.password) {
        return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
      }

      return res.status(200).json({ message: '로그인 성공', id : user.id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '로그인이 성공적으로 이루어지지 않았습니다.' });
  }
};
  
// 로그인 후 사용자 정보 조회
exports.userInfoGetMind = async (req, res) => {
  try{
    const user_id = req.params.user_id;

    const user = await User.findOne({
      attributes: ['nickname', 'email', 'birthday', 'job'],
      where: {
        id: user_id
      }
    })
    let response = {...user.dataValues};

    res.json(response);

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류로 사용자 정보 조회 실패" })
  }
}

// 아이디 수정
exports.nicknamePatchMid = async (req, res) => {
    try {
        const { user_id, nickname } = req.body;
  
        // 아이디 사용자가 존재하는지 확인
        const checkNickname = await User.findOne({
          where: {
            nickname,
          },
        });
  
        if(checkNickname && checkNickname.dataValues.id != user_id){
          return res.status(409).json({ error: '이미 존재하는 아이디입니다.' });
        }
  
        const user = await User.update({
          nickname,
        }, {
          where : { id: user_id }
        })
  
        return res.status(200).json({ message: '아이디 성공적으로 수정'});
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: '아이디 수정 중 실패' });
    }
  };