'use strict';

module.exports = {
  insertUserInfo: 'insert into user_lists set ?', // 利用者情報登録
  selectUserInfo: 'select * from user_lists where user_id = ?', // 利用者情報取得
  orderByName: 'select * from user_lists order by user_name', // 名前順
  updateUserInfo: 'update user_lists set user_name = ?, adls_adl_id = ? where user_id = ?', // user情報更新
  selectUserName: 'select user_name from user_lists where user_id = ?', // 利用者名前取得
  selectEntranceDate: 'select entrance_data from user_lists where user_id = ?', // 入所日取得
  selectAdlJoin: 'select u.user_name, a.adl from user_lists as u join adls as a on u.adls_adl_id = a.adl_id where user_id = ?', // userName, adlをjoin
  selectGenderJoin: 'select u.user_name, g.gender from user_lists as u join genders as g on u.genders_gender_id = g.gender_id where user_id = ?', // userName, genderをjoin
  selectStaffName: 'select staff_name from staff_lists where employee_id = ?', // staffName取得
  careRecord: 'insert into care_records set recording_date = ?, care_record = ?, user_lists_user_id = ?, care_records_staff_id = ?, care_records_staff_name = ?', // care記録登録
  careRecordSearch: 'select user_lists_user_id, recording_date, care_record, care_records_staff_id, care_records_staff_name from care_records where cast(recording_date as date ) = ? and user_lists_user_id = ?' // care記録検索
};