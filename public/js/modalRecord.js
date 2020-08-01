'use strict';

{
  const open = document.getElementById('open_modal');
  const close = document.getElementById('close');
  const modal = document.getElementById('modal');
  const mask = document.getElementById('mask');

  open.addEventListener('click', function () {
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
  });
  close.addEventListener('click', function () {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });
}

const oBtn = document.getElementById('open_modal');

oBtn.addEventListener('click', (e) => {
  document.getElementById('recMessage').innerHTML = '記録改ざん防止のため、記録が完了すると訂正できません<br>未来の日時で登録すると記述内容がリセットされます';
});
