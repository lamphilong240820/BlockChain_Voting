const VoterModel = require('../models/voter');

const bcrypt = require('bcrypt');

const path = require('path');

var nodemailer = require('nodemailer');

const saltRounds = 10;

module.exports = {
	create: function (req, res, cb) {
		VoterModel.findOne(
			{id_number: req.body.id_number, election_address: req.body.election_address },
			function (err, result) {
				if (err) {
					cb(err);
				} else {
					if (!result) {
						VoterModel.create(
							{
								email: req.body.email,
								password: req.body.email,
								name: req.body.name,
								phone: req.body.phone,
								id_number: req.body.id_number,
								home_address: req.body.home_address,
								election_address: req.body.election_address,
							},
							function (err, voter) {
								if (err) cb(err);
								else {
									console.log(voter);

									console.log(voter.email);

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

										to: voter.email, // list of receivers

										subject: req.body.election_name, // Subject line

										html:
											req.body.election_description +
											'<br>Họ và tên:  ' +
											voter.name +
											'<br>Tên đăng nhập:  ' +
											voter.email +
											'<br>' +
											'Mật khẩu:  ' +
											voter.password +
											'<br>' +
											'Địa chỉ thường trú:  ' +
											voter.home_address +
											'<br>' +
											'Số điện thoại:  ' +
											voter.phone +
											'<br>' +
											'Chứng minh nhân dân:  ' +
											voter.id_number +
											'<br><a href="http://localhost:3000/voter_login">Click vào link để chuyển hướng đến website </a>', // plain text body
									};

									transporter.sendMail(mailOptions, function (err, info) {
										if (err) {
											res.json({
												status: 'error',
												message: 'Có lỗi xảy ra, thông tin cử tri chưa được thêm',
												data: null,
											});

											console.log(err);
										} else {
											console.log(info);

											res.json({
												status: 'success',
												message: 'Thông tin cử tri đã được thêm thành công!!!',
												data: null,
											});
										}
									});
								}
							}
						);
					} else {
						res.json({ status: 'error', message: 'Thông tin cử tri đã tồn tại, vui lòng đăng kí với thông tin khác ', data: null });
					}
				}
			}
		);
	},

	authenticate: function (req, res, cb) {
		VoterModel.findOne({ email: req.body.email, password: req.body.password }, function (err, voterInfo) {
			if (err) cb(err);
			else {
				if (voterInfo)
					res.json({
						status: 'success',
						message: 'voter found!!!',
						data: { id: voterInfo._id, election_address: voterInfo.election_address },
					});
				//res.sendFile(path.join(__dirname+'/index.html'));
				else {
					res.json({ status: 'error', message: 'Email hoặc mật khẩu không chính xác, vui lòng thử lại!!!', data: null });
				}
			}
		});
	},

	getAll: function (req, res, cb) {
		let voterList = [];

		VoterModel.find({ election_address: req.body.election_address }, function (err, voters) {
			if (err) cb(err);
			else {
				for (let voter of voters) voterList.push({ id: voter._id, email: voter.email,name: voter.name,phone: voter.phone,id_number: voter.id_number,home_address: voter.home_address, });

				count = voterList.length;

				res.json({
					status: 'success',
					message: 'voters list found!!!',
					data: { voters: voterList },
					count: count,
				});
			}
		});
	},

	updateById: function (req, res, cb) {
		VoterModel.findOne({ email: req.body.email, _id:req.params.voterId }, function (err, result) {
			if (err) {
				cb(err);
			} else {
				console.log('email:' + req.body.email);
				console.log('election_address:' + req.body.election_address);
				console.log('findOne:' + result);
				if (!result) {
					password = bcrypt.hashSync(req.body.email, saltRounds);
					console.log('email not found');
					console.log('voterID:' + req.params.voterId);
					VoterModel.findByIdAndUpdate(
						req.params.voterId,
						{ email: req.body.email, password: password },
						function (err, voter) {
							if (err) cb(err);
							console.log('update method object:' + voter);
						}
					);
					VoterModel.findById(req.params.voterId, function (err, voterInfo) {
						if (err) cb(err);
						else {
							console.log('Inside find after update' + voterInfo);
							var transporter = nodemailer.createTransport({
								service: 'gmail',
								auth: {
									user: process.env.EMAIL,
									pass: process.env.PASSWORD,
								},
							});
							const mailOptions = {
								from: process.env.EMAIL, // sender address
								to: voterInfo.email, // list of receivers
								subject: req.body.election_name, // Subject line
								html:
								req.body.election_description +
								'<br>Họ và tên:' +
								voter.name +
								'<br>Tên đăng nhập:' +
								voter.email +
								'<br>' +
								'Mật khẩu:' +
								voter.password +
								'<br>' +
								'Địa chỉ thường trú:' +
								voter.home_address +
								'<br>' +
								'Số điện thoại:' +
								voter.phone +
								'<br>' +
								'Chứng minh nhân dân:' +
								voter.id_number +
								'<br><a href="http://localhost:3000/voter_login">Click vào link để chuyển hướng đến website </a>', // plain text body
							};
							transporter.sendMail(mailOptions, function (err, info) {
								if (err) {
									res.json({ status: 'error', message: 'Có lỗi xảy ra, gửi gmail thất bại', data: null });
									console.log(err);
								} else {
									console.log(info);
									res.json({
										status: 'success',
										message: 'Cập nhật thông tin cử tri thành công!!!',
										data: null,
									});
								}
							});
						}
					});
				} else {
					res.json({ status: 'error', message: 'Cử tri đã tồn tại, vui lòng đăng ký với thông tin khác ', data: null });
				}
			}
		});
	},

	deleteById: function (req, res, cb) {
		VoterModel.findByIdAndRemove(req.params.voterId, function (err, voterInfo) {
			if (err) cb(err);
			else {
				res.json({ status: 'success', message: 'Thông tin cử tri đã được xóa!!!', data: null });
			}
		});
	},

	resultMail: function (req, res, cb) {
		VoterModel.find({ election_address: req.body.election_address }, function (err, voters) {
			if (err) cb(err);
			else {
				const election_name = req.body.election_name;

				const winner_candidate = req.body.winner_candidate;

				for (let voter of voters) {
					var transporter = nodemailer.createTransport({
						service: 'gmail',

						auth: {
							user: process.env.EMAIL,

							pass: process.env.PASSWORD,
						},
					});

					const mailOptions = {
						from: process.env.EMAIL, // sender address

						to: voter.email, // list of receivers

						subject: election_name + ' results', // Subject line

						html:
							'Cuộc bầu cử ' +
							election_name +
							' đã kết thúc.<br>Ứng cử viên giành chiến thắng với số phiếu cao nhất là: <b>' +
							winner_candidate +
							'</b>.',
					};

					transporter.sendMail(mailOptions, function (err, info) {
						if (err) {
							res.json({ status: 'error', message: 'mail error', data: null });

							console.log(err);
						} else console.log(info);

						res.json({ status: 'success', message: 'Gửi mail thành công!!!', data: null });
					});
				}

				var transporter = nodemailer.createTransport({
					service: 'gmail',

					auth: {
						user: process.env.EMAIL,

						pass: process.env.PASSWORD,
					},
				});

				const mailOptions = {
					from: process.env.EMAIL, // sender address

					to: req.body.candidate_email, // list of receivers

					subject: 'Kết quả cuộc bầu cử ' + req.body.election_name,  // Subject line

					html: 'Xin chúc mừng bạn là ứng cử viên với số phiếu cao nhất đã chiến thắng cuộc bầu cử ' + req.body.election_name + ' .', // plain text body
				};

				transporter.sendMail(mailOptions, function (err, info) {
					if (err) {
						res.json({ status: 'error', message: 'Gửi mail thất bại', data: null });

						console.log(err);
					} else console.log(info);

					res.json({ status: 'success', message: 'Gửi mail thành công!!!', data: null });
				});
			}
		});
	},
};
