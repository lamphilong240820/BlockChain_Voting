const path = require('path');
var nodemailer = require('nodemailer');

module.exports = {
	register: function (req, res, cb) {
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD,
			},
		});
		const mailOptions = {
			from: process.env.EMAIL,
			to: req.body.email,
			subject: 'Đăng ký'+ req.body.election_name ,
			html: 'Xin chúc mừng bạn đã trở thành một ứng cử viên cho cuộc bầu cử  ' + req.body.election_name + ' .',
		};
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				res.json({ status: 'error', message: 'Gửi mail không thành công', data: null });
				console.log(err);
			} else console.log(info);
			res.json({ status: 'success', message: 'Gửi mail thành công!!!', data: null });
		});
	},
};
