const express = require('express');
const router = express.Router();
const repairController = require('../controller/repair-controller')

// 예약 내역 보여주기(READ)(전체 예약 내역)
router.get('/', repairController.getAllRepair);

// ejs에서 선택한 수리기사 받기 
router.post('/select-repairman', repairController.postRepairmanSchedule); 

// 설치 및 수리 예약하기(CREATE)
router.post('/', repairController.postRepairReservation); 

// 설치 및 수리 화면
router.get('/new', repairController.getNewRepairPage); 

// 수정 시 전화번호 검증화면
router.get('/:id/phone-auth', repairController.getPhoneValidate); 

// 수정 시 전화번호 검증
router.post('/:id/phone-auth', repairController.postPhoneValidate); 

// 예약내역 수정하기 화면
router.get('/:id/update', repairController.getRepairEditPage); 

// 예약내역 수정하기(UPDATE)
router.post('/:id/update', repairController.postRepairEditPage); 

// 예약내역 삭제하기(DELETE)
router.get('/:id/delete', repairController.getDelete); 



module.exports = router;