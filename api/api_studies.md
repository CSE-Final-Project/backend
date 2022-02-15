## /api/studies/ [GET]
- 전체 스터디 정보를 json으로 전달
- res =>
1) 성공
( id, leader, title, topic, target_time, member_number, penalty,
, info )

## /api/studies/ [POST]
- 새로운 스터디 생성
- req.body => 
{
    "study_id"="", [string]
    "title"="", [string]
    "topic"="", [string]
    "target_time"="", [int]
    "penalty"="", [int]
    "info"="", [string]
}
- (ex)
{
    "study_id":"study2",
    "title":"CodingTest2",
    "topic":"CS",
    "target_time":3,
    "penalty":5000,
    "info":"This study is of studying algorithm test2"
}

- res =>
1) 성공 {code="200", msg="create_success"}
2) 실패 1: 로그인 이전 {code="400", msg="login_first"}

## /api/studies/join [POST]
- 스터디 가입
- req.body => 
{
    "study_id"="", [string]
}
- (ex)
{
    "study_id":"study1"
}

- res =>
1) 성공 {code="200", msg="join_success"}
2) 실패 1: 이미 참여중인 스터디 {code="400", msg="already_joined"}
3) 실패 2: 모집 마감 {code="400", msg="already_full"}

## /api/studies/do/:studyId [GET]
- studyId의 캠스터디 addr로 redirect

- res =>
1) 성공
{code:"200", msg:"redirect_to_studyroom", addr:study.addr}
`NEXT TO DO => redirect !!!!!!!!!`

2) 실패 1: 로그인 필요 {code:"400", msg:"login_first"}
3) 실패 2: 접근 제한 {code:"400", msg:"access_denied"}
`4) 실패 3: 존재하지 않는 studyId` 

## /api/studies/do/:studyId [POST]
- Flask server

## /api/studies/mates/:studyId [GET]
- studyId의 참여 중인 user 정보를 json으로 전달

- res =>
1) 성공
( user_id )

2) 실패 1: 존재하지 않는 studyId {code:"400", msg:"nonexistent_study"}
`3) 실패 2: 접근 제한 {code:"400", msg:"access_denied"}`

## /api/studeis/attendance/:studyId [POST]
- studyId의 주어진 날짜에서 1주일 간 출석 정보를 json으로 전달

- req.body => 
{
    "date"[Date]
}
- (ex)
{
    "date":"2022-02-10"
}

- res =>
1) 성공
( user_id, date, attendance ) //날짜순

## /api/studeis/penalty/:studyId [GET]
- studyId의 벌금 상황을 json으로 전달

- res =>
1) 성공
( user_id, penalty ) //이름순

## /api/studies/time/:studyId [POST]
- studyId의 공부 시간 update

- req.body =>
{
    study_time: [INT]
}

- (ex)
{
    "study_time":3600 /*초단위(정수형)*/
}

- res =>
1) 성공
{code="200", "study_time": update_time}

## /api/studies/time/:studyId [GET]


## Questions
Q. 원래 API 마다 전부 로그인 확인, 접근 제한 등의 검사를 다 작성하나요?
