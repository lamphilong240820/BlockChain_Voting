const path = require('path');
var nodemailer = require('nodemailer');
const CandidateModal = require('../models/candidate');
const bcrypt = require('bcrypt');
module.exports = {
	register: function (req, res, cb) {
		CandidateModal.findOne(
			{id_number: req.body.id_number, election_address: req.body.election_address },
			function (err, result) {
				if (err) {
					cb(err);
				} else {
					if (!result) {
						CandidateModal.create(
							{
								email: req.body.email,
								password: req.body.email,
								name: req.body.name,
								phone: req.body.phone,
								id_number: req.body.id_number,
								home_address: req.body.home_address,
								descpription:req.body.descpription,
								election_address: req.body.election_address,
							},
							function (err, candidate) {
								if (err) cb(err);
								else {
									console.log(candidate);

									console.log(candidate.email);

									console.log(req.body.election_description);

									console.log(req.body.election_name);
									var transporter = nodemailer.createTransport({
										service: 'gmail',
										auth: {
											user: process.env.EMAIL,
											pass: process.env.PASSWORD,
										},
									});															

									const mailOptions = {
										from: process.env.EMAIL, // sender address

										to: req.body.email, // list of receivers

										subject:'Đăng ký'+ req.body.election_name, // Subject line

										html:
											'Xin chúc mừng bạn đã trở thành một ứng cử viên cho cuộc bầu cử  ' + req.body.election_name + ' .'+
											"Thông tin của bạn: "+											
											'<br>Họ và tên:  ' +											
											candidate.name +
											'<br>Mô tả sơ lược:  ' +
											candidate.descpription +
											'<br>Email:  ' +
											candidate.email +							
											'<br>' +
											'Địa chỉ thường trú:  ' +
											candidate.home_address +
											'<br>' +
											'Số điện thoại:  ' +
											candidate.phone +
											'<br>' +
											'Chứng minh nhân dân:  ' +
											candidate.id_number,
									};

									transporter.sendMail(mailOptions, function (err, info) {
										if (err) {
											res.json({ status: 'error', message: 'Gửi mail không thành công', data: null });
											console.log(err);
										} else console.log(info);
										res.json({ status: 'success', message: 'Gửi mail thành công!!!', data: null });
									});
								}
							}
						);
					} else {
						res.json({ status: 'error', message: 'Thông tin ứng viên đã tồn tại, vui lòng đăng kí với thông tin khác ', data: null });
					}
				}
			}
		);
	},
};
