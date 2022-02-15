## /api/users [GET]

## /api/users [POST]
- 회원가입
- req.body => 
{
    "id"="", [string]
    "password"="", [string]
}
- (ex)
{
    "id":"aaaa",
    "password":"1234"
}

- res =>
1) 성공 {code="200", msg="create_success"}
`2) 실패 1: ID 중복 {code="400", msg="duplicate_id"}`

## /api/users/login [POST]
- 로그인 (session 저장)
- req.body => 
{
    "id"="", [string]
    "password"="", [string]
}
- (ex)
{
    "id":"aaaa",
    "password":"1234"
}

1) 성공 {code="200", msg="login"}
2) 실패 1: 존재하지 않는 ID {code="400", msg="nonexsist_id"}
3) 실패 2: ID-PW 불일치 {code="400", msg="mismatch"}

## /api/users/logout [GET]
- 로그아웃 (session 정보 삭제)

1) 성공 redirect('/api/users')

## /api/users/studies [GET]
- userId가 참여 중인 스터디 정보를 json으로 전달

- res =>
1) 성공
( id, leader, title, topic, target_time, member_number, penalty, date_start, info )
2) 실패 1: 로그인 이전 {code="400", msg="login_first"}
