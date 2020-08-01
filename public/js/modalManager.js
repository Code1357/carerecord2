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
  const inputEmployee = document.getElementById('inputEmployee').value;
  const outputEmployee = `社員番号：${inputEmployee}`;
  const inputHereDate = document.getElementById('inputHereDate').value;
  const outputHereDate = `入社日：${inputHereDate}`;
  const inputUsername = document.getElementById('inputUsername').value;
  const outputUsername = `名前：${inputUsername}`;
  const outPassword = 'Password：************';
  const inputBirthday = document.getElementById('inputBirthday').value;
  const outputBirthday = `生年月日：${inputBirthday}`;
  const inputGender = document.getElementById('inputGender').value;
  if (inputGender == 1) {
    const outputGender = '性別：男性';
    document.getElementById('outputGender').innerHTML = outputGender;
  } else if (inputGender == 2) {
    const outputGender = '性別：女性';
    document.getElementById('outputGender').innerHTML = outputGender;
  } else {
    const outputGender = '性別：';
    document.getElementById('outputGender').innerHTML = outputGender;
  };

  const inputPosition = document.getElementById('inputPosition').value;
  if (inputPosition == 1) {
    const outputPosition = '役職：管理職';
    document.getElementById('outputPosition').innerHTML = outputPosition;
  } else if (inputPosition == 2) {
    const outputPosition = '役職：一般';
    document.getElementById('outputPosition').innerHTML = outputPosition;
  } else if (inputPosition == 3) {
    const outputPosition = '役職：見習い';
    document.getElementById('outputPosition').innerHTML = outputPosition;
  } else {
    const outputPosition = '役職：';
    document.getElementById('outputPosition').innerHTML = outputPosition;
  };
  document.getElementById('recMessage').innerHTML = '名前と役職はあとから更新(修正)可能です';
  document.getElementById('outputEmployee').innerHTML = outputEmployee;
  document.getElementById('outputHereDate').innerHTML = outputHereDate;
  document.getElementById('outputUsername').innerHTML = outputUsername;
  document.getElementById('outPassword').innerHTML = outPassword;
  document.getElementById('outputBirthday').innerHTML = outputBirthday;
});
