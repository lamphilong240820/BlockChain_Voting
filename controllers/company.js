const CompanyModel = require('../models/company');
const bcrypt = require('bcrypt'); 
const path = require('path');
module.exports = {
    create: function(req, res, cb) {
        CompanyModel.findOne({email:req.body.email}, function(err, result) {
            if(err){
                cb(err);
            }
            else{
                if(!result){
                    CompanyModel.create({ email: req.body.email, password: req.body.password, status: "true" }, function (err, result) {
                        if (err) 
                            cb(err);
                        else{
                            CompanyModel.findOne({email:req.body.email}, function(err, CompanyInfo) {
                                if (err)
                                    cb(err);
                                else{
                                    res.json({status: "success", message: "Thông tin cơ quan đã được thêm thành công!!!", data:{id:CompanyInfo._id}});
                                }
                            });  
                        }
                    });
                }
                else{
                    res.json({status: "error", message: "Cơ quan đã tồn tại, vui lòng đăng ký với thông tin khác ", data:null});
                }
            }
            
        });
    },
    authenticate: function(req, res, cb) {
        CompanyModel.findOne({email:req.body.email}, function(err, CompanyInfo){
            if (err) 
                cb(err);
            else {
                if(bcrypt.compareSync(req.body.password, CompanyInfo.password) && CompanyInfo.email == req.body.email) {
                    
                    res.json({status:"success", message: "company found!!!", data:{id: CompanyInfo._id, email: CompanyInfo.email}});
                }
                else {
                    res.json({status:"error", message: "Email hoặc mật khẩu không đúng, vui lòng thử lại!!!", data:null});
                }
            }
        });
    },
    endelection: function(req, res, cb) {
        CompanyModel.findOne({email:req.body.email, status : "true"} , function(err, CompanyInfo){
            if (err) 
                cb(err);
            else {
                if(CompanyInfo){
                    CompanyModel.updateOne({email:req.body.email}, {$set: {status : "false"}},function (err, result) {
                        if (err) 
                            cb(err);
                        else{
                            CompanyModel.findOne({email:req.body.email, status : "false"}  , function(err, CompanyInfo) {
                                if (err)
                                    cb(err);
                                else{
                                     res.json({status:"success", message: "Cuộc bầu cử vừa kết thúc!!!", data:{id: CompanyInfo._id, email: CompanyInfo.email, status: CompanyInfo.status}});
                                }
                            });  
                        };                 
                    });
                }
                else {
                    res.json({status:"error", message: "Có lỗi xảy ra, cuộc bầu cử đã kết thúc!!!", data:{status: false}});
                }
            }
        });
    }
}