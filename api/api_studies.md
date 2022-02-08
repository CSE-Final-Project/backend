# /api/studies/ [GET]
- 전체 스터디 정보를 json으로 전달
- res =>
1) 성공
( id, leader, title, topic, target_time, member_number, penalty, info )

# /api/studies/ [POST]
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

- res =>
1) 성공 {code="200", msg="create_success"}
2) 실패 1: 로그인 이전 {code="400", msg="login_first"}

# /api/studies/join [POST]
- 스터디 가입
- req.body => 
{
    "study_id"="", [string]
}

- res =>
1) 성공 {code="200", msg="join_success"}
2) 실패 1: 이미 참여중인 스터디 {code="400", msg="already_joined"}
3) 실패 2: 모집 마감 {code="400", msg="already_full"}

# /api/studies/join [GET]
- userId가 참여 중인 스터디 정보를 json으로 전달

- res =>
1) 성공
( id, leader, title, topic, target_time, member_number, penalty, info )
2) 실패 1: 로그인 이전 {code="400", msg="login_first"}
