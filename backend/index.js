const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
app.use(express.json());

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/userz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB 연결 성공');

  // ✅ 하드코딩된 초기 사용자 추가 (이미 존재하는 경우 생략)
  const exists = await User.findOne({ email: 'test2@example.com' });
  if (!exists) {
    await User.create({
        username:'고길동',
        password:1111,
        ipAddress:'seoul',
    });

    await User.create({
        username:'고길동2',
        password:1111,
        ipAddress:'seoul2',
      });

    console.log('✅ 테스트 유저 삽입 완료');
  } else {
    console.log('ℹ️ 테스트 유저가 이미 존재합니다');
  }
}).catch((err) => {
  console.error('MongoDB 연결 실패:', err);
});

// 간단한 API 예시
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body); // name, email, age
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
