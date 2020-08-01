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
  const inputEntranceData = document.getElementById('inputEntranceData').value;
  const outputEntranceData = `入所日：${inputEntranceData}`;

  const inputUserName = document.getElementById('inputUserName').value;
  const outputUserName = `名前：${inputUserName}`;

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

  const inputAdl = document.getElementById('inputAdl').value;
  if (inputAdl == 1) {
    const outputAdl = 'ADL：自立';
    document.getElementById('outputAdl').innerHTML = outputAdl;
  } else if (inputAdl == 2) {
    const outputAdl = 'ADL：見守り';
    document.getElementById('outputAdl').innerHTML = outputAdl;
  } else if (inputAdl == 3) {
    const outputAdl = 'ADL：要介護';
    document.getElementById('outputAdl').innerHTML = outputAdl;
  } else {
    const outputAdl = 'ADL：';
    document.getElementById('outputAdl').innerHTML = outputAdl;
  };
  document.getElementById('recMessage').innerHTML = '名前とADLはあとから更新(修正)可能です';
  document.getElementById('outputEntranceData').innerHTML = outputEntranceData;
  document.getElementById('outputUserName').innerHTML = outputUserName;
});
