import Mock from 'mockjs'

const Random = Mock.Random

let Result = {
	code: 200,
	msg: '操作成功',
	data: null
}

Mock.mock(RegExp('/captcha'), 'get', () => {

	Result.data = {
		token: Random.string(32),
		captchaImg: Random.dataImage('120x40', 'p7n5w')
	}
	return Result
})

Mock.mock(RegExp('/login'), 'post', () => {

	// 无法在header中传入数jwt

	// Result.code = 400
	// Result.msg = "验证码错误"

	return Result
})

Mock.mock(RegExp('/logout'), 'post', () => {

	return Result
})

Mock.mock(RegExp('/sys/user'), 'get', () => {

	Result.data = {
		id: '1',
		username: 'test',
		avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
	}

	return Result
})