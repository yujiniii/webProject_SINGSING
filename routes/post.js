const express = require('express');
const router = express.Router();
const postController = require('../controller/post-controller')
const multer = require('multer');



const upload = multer({  //file처리 관련 부분
    storage:  multer.diskStorage({ 
        destination: (req,file,cb)=>{ 
            cb(null, 'images');
        },
        filename: (req,file,cb)=>{ 
            cb(null, new Date().valueOf()+"."+file.mimetype.split('/')[1]);
        }
    }),
});


// 판매 글 목록 조회(READ)
router.get('/', postController.getAllPost);

// 판매 글 작성 page get
router.get('/new', postController.getWritePage);

// 판매 글 작성(CREATE) + multer
router.post('/', upload.single('image'), postController.postPostPage);

// 구매하기 버튼 클릭 (거래 완료 처리됨)
router.get('/:id/buy',postController.getBuyPage);


// 수정 시 비밀번호 검증화면 get
router.get('/:id/user-auth', postController.getEditValidate);

// 수정 시 비밀번호 검증
router.post('/:id/user-auth', postController.postEditValidate);


// 판매글 수정(UPDATE)
router.post('/:id/edit', postController.postEditPage);


// 판매글 삭제(DELETE)
router.post('/:id/delete', postController.postDelete);


module.exports = router;