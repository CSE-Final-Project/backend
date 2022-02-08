# /api/users/studies [GET]
- userId가 참여 중인 스터디 정보를 json으로 전달

- res =>
1) 성공
( id, leader, title, topic, target_time, member_number, penalty, info )
2) 실패 1: 로그인 이전 {code="400", msg="login_first"}
