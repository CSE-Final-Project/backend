### [DB Model] Board
#### post
- idx   [PK], [INT]
- user_id   (작성자 id)  [STRING(40)]
- study_id  (스터디 id) [STRING(40)]
- date  (작성날짜) [DATE]
- title (제목) [STRING(40)]
- content   (내용) [STRING(1000)]
- comment   (댓글수) [INT]

#### comment
- idx   [PK], [INT]
- user_id   (작성자 id)  [STRING(40)]
- post_id (게시글 idx) [INT]
- content   (내용) [STRING(1000)]
- date (작성날짜) [DATE]
