## /api/studeis/{:studyId}/board [GET] 
- 해당 스터디의 게시글 목록
## /api/studeis/{:studyId}/board [POST]
- 게시글 작성
## /api/studeis/{:studyId}/board/{:idx} [GET] 
- 게시글 상세 화면
## /api/studeis/{:studyId}/board/{:idx} [PUT]
- 게시글 수정
## /api/studeis/{:studyId}/board/{:idx} [DELETE]
- 게시글 삭제
## /api/studeis/{:studyId}/board/{:idx}/comment [POST]
- 게시글 댓글 작성
## /api/studeis/{:studyId}/board/{:idx}/comment/{:number} [PUT] 
- 게시글 댓글 수정 (X)
## /api/studeis/{:studyId}/board/{:idx}/comment/{:number} [DELETE]
- 게시글 댓글 삭제 

## /api/studeis/{:studyId}/board [GET] 
- 해당 스터디의 게시글 목록

- [req]
- req.parameter
1. studyId : 스터디 id

- [res]
1) 성공 (작성일 최신순으로 정렬)
{
    "idx":"1" // 게시글 idx
    "user_id":"aaaa", // 작성자 id 
    "title":"3/18 excused absence", // 게시글 제목
    "content":"I have test tomorrow. Can I take  excused absence? ", // 게시글 내용
    "date": "2022-02-16 07:24:02", // 작성일
    "comments": "1" // 댓글 수 
}

## /api/studeis/{:studyId}/board [POST]
- 게시글 작성

- [req]
- req.parameter
1. studyId : 스터디 id

- req.body
{
    "title"="", [string]
    "content"="", [string]
}

- (ex)
{
    "title":"3/18 excused absence",
    "content":"I have test tomorrow. Can I take excused absence? "
}

- [res]
1) 성공
- redirect ( 게시글 상세화면 ) ` /api/studeis/{:studyId}/board/{:idx}  `

## /api/studeis/{:studyId}/board/{:idx} [GET] 
- 게시글 상세 화면
- [req]
- req.parameter
1. studyId : 스터디 id
2. idx : 게시글 idx

- [res]
1) 성공 
- 게시글 정보(post)와 모든 댓글 정보(comments)

(ex)
{
    "post":{
        "user_id":"aaaa",
        "title":"3/18 excused absence",
        "content":"I have test tomorrow. Can I take excused absence? ",
        "date":"2022-02-16 07:24:02",
        "comments":2 // 댓글 수 

    },
    "comments":[
        {
            "idx"="1",  // comment idx
            "user_id":"bbb",
            "content":"Sure",
            "date":"2022-02-16 07:24:02"
        },
        {
            "idx"="3",  // comment idx
            "user_id":"cccc",
            "content":"OK",
            "date":"2022-02-16 07:24:02"
        }
    ]
}

## /api/studeis/{:studyId}/board/{:idx} [PUT]
- 게시글 수정
- [req]
- req.parameter
1. studyId : 스터디 id
2. idx : 게시글 idx

- req.body
{
    "title"="", [string]
    "content"="", [string]
}

- (ex)
{
    "title":"3/18 excused absence",
    "content":"I have test tomorrow. Can I take excused absence? "
}

- [res]
1) 성공  {   code="200", msg="success"   }
- redirect 게시글 상세 화면  `/api/studeis/{:studyId}/board/{:idx} [GET] `

## /api/studeis/{:studyId}/board/{:idx} [DELETE]
- 게시글 삭제
- [req]
- req.parameter
1. studyId : 스터디 id
2. idx : 게시글 idx

- [res]
1) 성공  {   code="200", msg="success"   }
- redirect 게시글 목록 `/api/studeis/{:studyId}/board [GET] `


## /api/studeis/{:studyId}/board/{:idx}/comment [POST]
- 게시글 댓글 작성

- [req]
- req.parameter
1. studyId : 스터디 id
2. idx : 게시글 idx

- req.body
{   "content" [string]  }

- (ex)
{
    "content": "Of course"
}

- [res]
1) 성공  {   code="200", msg="success"   }
- redirect 게시글 상세 화면 `/api/studeis/{:studyId}/board/{:idx} [GET] `
2) 실패 1: 내용이 비어있다 {code="400", msg="empty"}
3) 실패 2: 글자 수 제한 {code="400", msg="over 1000"}

## /api/studeis/{:studyId}/board/{:idx}/comment/{:number} [PUT]
- 게시글 댓글 수정

- [req]
- req.parameter
1. studyId : 스터디 id
2. idx : 게시글 idx
3. number : 게시글 댓글 idx

- req.body
{   "content" [string]    }

- (ex)
{
    "content": "Sure"
}

- [res]
1) 성공 {   code="200", msg="success"   }
- redirect 게시글 상세 화면 `/api/studeis/{:studyId}/board/{:idx} [GET] `

2) 실패 1: {   code="200", msg="error"   }

## /api/studeis/{:studyId}/board/{:idx}/comment/{:number} [DELETE]
- 게시글 댓글 삭제
- [req]
- req.parameter
1. studyId : 스터디 id
2. idx : 게시글 idx
3. number : 게시글 댓글 idx

- [res]
1) 성공 {   code="200", msg="success"   }
- redirect 게시글 상세 화면 `/api/studeis/{:studyId}/board/{:idx} [GET] `

2) 실패 1: {   code="200", msg="error"   }