'use strict';

module.exports = {

  info: 'insert into staff_lists set ?', // staff情報登録
  selectInfo: 'select * from staff_lists where staff_id = ?', // staff情報取得
  updateName: 'update staff_lists set staff_name = ?, position_lists_position_id = ? where staff_id = ?', // staff_name更新
  orderByName: 'select * from staff_lists order by staff_name', // 名前順
  selectEmployeeId: 'select employee_id from staff_lists where staff_id = ?', // 社員番号取得
  selectName: 'select staff_name from staff_lists where staff_id = ?', // staff名前取得
  selectHireDate: 'select hire_data from staff_lists where staff_id = ?', // 入社日取得
  selectBirthday: 'select birthday from staff_lists where staff_id = ?', // 誕生日取得
  selectJoinPosition: 'select s.staff_name, p.position from staff_lists as s join position_lists as p on s.position_lists_position_id = p.position_id where staff_id = ?', // staffName,positionをjoin
  selectJoinGender: 'select s.staff_name, g.gender from staff_lists as s join genders as g on s.genders_gender_id = g.gender_id where staff_id = ?' // staffName,genderをjoin

};
