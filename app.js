'use strict';
const $=id=>document.getElementById(id),stems='甲乙丙丁戊己庚辛壬癸',branches='子丑寅卯辰巳午未申酉戌亥',sKo='갑을병정무기경신임계',bKo='자축인묘진사오미신유술해',names=['목','화','토','금','수'],colors=['#80caa1','#ee947d','#ebc384','#c5c4e6','#83b9ec'],traits=['새로운 일을 시작하고 키워 가는 모습','열정을 표현하고 주변을 밝히는 모습','중심을 잡고 차분히 돌보는 모습','기준을 세우고 다듬어 가는 모습','흐름에 맞춰 생각을 넓히는 모습'];
const se=ch=>Math.floor(stems.indexOf(ch)/2),be=ch=>[4,2,0,0,2,1,1,2,3,3,2,4][branches.indexOf(ch)];
$('calendar').addEventListener('change',()=>{$('leap-wrap').hidden=$('calendar').value!=='lunar'});
$('unknown').addEventListener('change',()=>{$('time').disabled=$('unknown').checked});
for(const [id,length] of [['birth',8],['time',4]]){
 $(id).addEventListener('input',()=>{$(id).value=$(id).value.replace(/\D/g,'').slice(0,length)});
}
$('form').addEventListener('submit',e=>{e.preventDefault();$('error').textContent='';$('result').hidden=true;try{
 if(typeof Solar==='undefined'||typeof Lunar==='undefined')throw Error('계산 파일을 불러오지 못했습니다. 파일 세 개를 같은 폴더에 올려 주세요.');
 const birth=$('birth').value;if(!/^\d{8}$/.test(birth))throw Error('생년월일을 19750611처럼 숫자 8자리로 입력해 주세요.');const y=+birth.slice(0,4),m=+birth.slice(4,6),d=+birth.slice(6,8);if(y<1900||y>2099)throw Error('1900년부터 2099년까지 입력해 주세요.');const unknown=$('unknown').checked,time=unknown?'1200':$('time').value;if(!/^([01]\d|2[0-3])[0-5]\d$/.test(time))throw Error('태어난 시각을 0930처럼 24시간제 숫자 4자리로 입력해 주세요.');const h=+time.slice(0,2),min=+time.slice(2,4);let lunar,solar;
 if($('calendar').value==='solar'){const date=new Date(Date.UTC(y,m-1,d));if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)throw Error('존재하지 않는 양력 날짜입니다.');solar=Solar.fromYmdHms(y,m,d,h,min,0);lunar=solar.getLunar()}
 else{if(m<1||m>12||d<1||d>30)throw Error('음력 날짜를 확인해 주세요.');const lm=$('leap').value==='yes'?-m:m;lunar=Lunar.fromYmdHms(y,lm,d,h,min,0);if(lunar.getYear()!==y||lunar.getMonth()!==lm||lunar.getDay()!==d)throw Error('해당 음력 날짜나 윤달이 존재하지 않습니다.');solar=lunar.getSolar();const back=solar.getLunar();if(back.getYear()!==y||back.getMonth()!==lm||back.getDay()!==d)throw Error('해당 음력 날짜나 윤달이 존재하지 않습니다.')}
 const ec=lunar.getEightChar();ec.setSect(2);const vals=[ec.getYear(),ec.getMonth(),ec.getDay(),unknown?null:ec.getTime()],labels=['연주','월주','일주','시주'];$('pillars').replaceChildren(...vals.map((v,i)=>{const box=document.createElement('div');box.className='pillar';const a=document.createElement('strong');a.textContent=labels[i];const b=document.createElement('div');b.className='hanja';b.textContent=v||'—';const c=document.createElement('div');c.className='ko';c.textContent=v?sKo[stems.indexOf(v[0])]+bKo[branches.indexOf(v[1])]:'시각 미상';box.append(a,b,c);return box}));
 $('date-label').textContent=`양력 ${solar.getYear()}.${String(solar.getMonth()).padStart(2,'0')}.${String(solar.getDay()).padStart(2,'0')}`;$('boundary-note').textContent=unknown?'시각 미상: 정오로 연·월·일주를 계산했습니다. 절입 당일이나 23시 부근에는 정확한 시각이 필요합니다.':'절입·23시 부근에는 출생지와 계산 방식에 따라 다른 결과가 나올 수 있습니다.';
 $('element-title').textContent=unknown?'3. 여섯 글자의 오행':'3. 여덟 글자의 오행';const counts=[0,0,0,0,0];vals.filter(Boolean).forEach(v=>{counts[se(v[0])]++;counts[be(v[1])]++});$('bars').replaceChildren(...counts.map((n,i)=>{const row=document.createElement('div');row.className='row';const a=document.createElement('strong');a.textContent=names[i];const track=document.createElement('div');track.className='track';const fill=document.createElement('div');fill.className='fill';fill.style.width=`${n/(unknown?6:8)*100}%`;fill.style.background=colors[i];track.append(fill);const b=document.createElement('span');b.textContent=n;row.append(a,track,b);return row}));const i=se(vals[2][0]);$('interpret').replaceChildren();const a=document.createElement('strong');a.textContent=`나를 상징하는 일간: ${sKo[stems.indexOf(vals[2][0])]}(${vals[2][0]}) · ${names[i]}`;const b=document.createElement('p');b.textContent=`전통 명리에서는 ${names[i]}을(를) ‘${traits[i]}’에 비유합니다. 내게 익숙한 모습인지 생각해 보세요.`;const c=document.createElement('p');c.className='small';c.textContent='상징적 비유이며 개인의 성향이나 미래를 판정하지 않습니다.';$('interpret').append(a,b,c);renderGuide(vals,counts,unknown,ec,$('gender').value);$('result').hidden=false;$('result').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(err){$('error').textContent=err?.message||'계산 중 오류가 났습니다. 입력을 확인해 주세요.'}});


// All prose is generated from the displayed pillars. It explains symbols, not outcomes.
const stemImages={甲:'큰 나무',乙:'풀과 덩굴',丙:'햇빛',丁:'촛불',戊:'산',己:'밭',庚:'단단한 쇠',辛:'세공한 금속',壬:'큰 물줄기',癸:'비와 이슬'};
const branchImages={子:'겨울의 물',丑:'겨울 끝의 흙',寅:'봄이 시작되는 나무',卯:'봄의 나무',辰:'봄 끝의 흙',巳:'초여름의 불',午:'한여름의 불',未:'여름 끝의 흙',申:'가을이 시작되는 금속',酉:'가을의 금속',戌:'가을 끝의 흙',亥:'겨울이 시작되는 물'};
const roleText=[
 '연주는 태어난 해의 두 글자입니다. 전통적으로 어린 시절의 배경과 바깥 환경을 읽을 때 참고합니다. 그 해에 태어난 모든 사람에게 공통인 기호이므로 개인의 성격을 뜻하지 않습니다.',
 '월주는 출생 시기의 절기에 따라 달라집니다. 전통 명리에서 계절적 배경을 살피는 중요한 자리입니다. 달력의 음력 월과 일대일로 대응하지 않으며, 절입 시각을 지나야 다음 월주가 됩니다.',
 '일주는 태어난 날의 두 글자입니다. 첫 글자인 일간을 ‘나’를 가리키는 기준점으로 삼습니다. 둘째 글자인 일지는 일상의 자리로 해석하지만, 한 글자로 관계나 결혼을 단정할 수 없습니다.',
 '시주는 태어난 두 시간 단위의 구간을 표시합니다. 전통적으로 관심의 방향과 삶의 후반부를 살필 때 참고합니다. 출생 시각이 없으면 이 두 글자를 알 수 없습니다.'
];
const elementImages=['성장·확장','표현·활동','안정·중재','정리·기준','관찰·유연함'];
function guideNode(tag,cls,content){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=content;return el}
function guideCard(title,body){const card=guideNode('article','guide-card','');card.append(guideNode('h3','',title),guideNode('p','',body));return card}
function renderGuide(vals,counts,unknown,ec,gender){
 const root=$('guide');root.replaceChildren();
 root.append(guideNode('h2','','4. 내 사주를 한 줄씩 읽어보기'),guideNode('p','guide-note','각 기둥의 첫 글자는 천간, 둘째 글자는 지지입니다. 아래 설명은 입력값에서 나온 글자를 풀어 쓴 것입니다.'));
 const grid=guideNode('div','guide-grid','');
 vals.forEach((v,i)=>{
  if(!v){grid.append(guideCard('시주 · 출생 시각 미상','태어난 시간을 모르므로 시주는 비워 두었습니다. 원래 여덟 글자 중 여섯 글자만 확인한 결과입니다.'));return}
  const stemName=sKo[stems.indexOf(v[0])],branchName=bKo[branches.indexOf(v[1])];
  const yinYang=stems.indexOf(v[0])%2===0?'양':'음';
  const detail=`${stemName}(${v[0]})은 ${yinYang}의 ${names[se(v[0])]}으로, 전통적으로 ${stemImages[v[0]]}에 비유합니다. ${branchName}(${v[1]})은 ${branchImages[v[1]]}을 떠올리게 하는 지지입니다.`;
  grid.append(guideCard(`${['연주','월주','일주','시주'][i]} ${stemName+branchName}(${v})`,`${roleText[i]} ${detail}`));
 });root.append(grid);
 const dayStem=vals[2][0],dayEl=se(dayStem),season=vals[1],seasonEl=be(season[1]);
 root.append(guideNode('h2','','5. 일간과 계절을 함께 보기'));
 root.append(guideCard(`나를 가리키는 글자 · ${sKo[stems.indexOf(dayStem)]}(${dayStem})`,
  `일간 ${sKo[stems.indexOf(dayStem)]}은 ${stemImages[dayStem]}의 이미지입니다. ${names[dayEl]}의 상징을 바탕으로 ‘${elementImages[dayEl]}’이라는 말로 표현할 수 있습니다. 월지 ${bKo[branches.indexOf(season[1])]}은 ${branchImages[season[1]]}의 계절 배경을 나타냅니다. 같은 일간이라도 태어난 절기와 나머지 글자가 달라지면 전통적인 해석은 달라집니다.`));
 const shown=unknown?6:8, ranked=counts.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v||a.i-b.i);
 const leading=ranked.filter(x=>x.v===ranked[0].v).map(x=>names[x.i]).join('·');
 const absent=ranked.filter(x=>x.v===0).map(x=>names[x.i]);
 root.append(guideNode('h2','','6. 오행 막대가 말해 주는 것'));
 root.append(guideCard(`겉으로 보이는 ${shown}글자 중 ${leading}이(가) 가장 많습니다`,
  `현재 표시된 글자의 대표 오행은 ${names.map((n,i)=>`${n} ${counts[i]}`).join(', ')}개입니다. ${leading}의 상징(${ranked.filter(x=>x.v===ranked[0].v).map(x=>elementImages[x.i]).join('·')})을 떠올리며 나에게 익숙한 활동을 생각해 볼 수 있습니다. 이는 글자 수의 비교일 뿐 ‘좋은 오행’의 순위나 능력 점수가 아닙니다.`));
 root.append(guideNode('p','keyline',absent.length?
  `${absent.join('·')}이(가) 0으로 보이더라도 그 성질이 없거나 반드시 보충해야 한다는 뜻은 아닙니다. 지지 속의 다른 오행(지장간), 계절과 글자 사이의 작용은 이 막대에 들어 있지 않습니다.`:
  '다섯 오행이 모두 보인다고 완벽한 균형을 뜻하지는 않습니다. 지지 속의 다른 오행(지장간), 계절과 글자 사이의 작용은 이 막대에 들어 있지 않습니다.'));
 renderLifeGuide(root,vals,counts,unknown);
 renderDaYun(root,ec,gender,unknown);
 root.append(guideNode('h2','','8. 재미로 던져 보는 질문'));
 const list=guideNode('ul','','');
 [`${stemImages[dayStem]}의 비유 중 내 모습과 닮았다고 느끼는 부분은 무엇인가요?`,
  `출생 계절을 상징하는 ${branchImages[season[1]]}의 이미지가 나에게 어떤 기억을 떠올리게 하나요?`,
  `${leading}의 상징을 지금 내 생활에서 어떤 취미나 습관과 연결해 볼 수 있나요?`].forEach(q=>list.append(guideNode('li','',q)));
 root.append(list,guideNode('p','guide-note',`이 내용은 전통 명리의 기호를 이해하기 위한 문화적 설명입니다.${unknown?' 태어난 시각을 몰라 시주는 해석하지 않았습니다.':''} 건강·재물·직업·관계의 결과를 예측하거나 결정하지 않습니다.`));
}

function renderDaYun(root,ec,gender,unknown){
 root.append(guideNode('h3','','7-1. 전통 대운 참고표'));
 if(!gender){root.append(guideNode('p','guide-note','남성·여성 기준을 선택하지 않아 대운표는 표시하지 않았습니다. 위의 네 기둥과 생활 해설은 선택 여부와 관계없이 같습니다.'));return}
 const yun=ec.getYun(gender==='male'?1:0,2);
 const periods=yun.getDaYun(6).slice(1);
 root.append(guideNode('p','guide-note',`${gender==='male'?'남성':'여성'} 기준 · ${yun.isForward()?'순행':'역행'}. 전통 방식에서는 출생 연주의 음양과 이 구분을 함께 사용하여 대운이 진행하는 방향을 정합니다. 대운은 약 10년 단위의 간지 흐름이며 사건을 예언하는 표가 아닙니다.`));
 const list=guideNode('ul','','');
 periods.forEach(d=>list.append(guideNode('li','',`${d.getStartYear()}–${d.getEndYear()}년 · 전통식 세는나이 ${d.getStartAge()}–${d.getEndAge()}세 · ${sKo[stems.indexOf(d.getGanZhi()[0])]}${bKo[branches.indexOf(d.getGanZhi()[1])]}(${d.getGanZhi()})`)));
 root.append(list,guideNode('p','guide-note',`시작 연도와 나이는 절기까지의 간격을 바탕으로 계산한 전통식 참고값입니다.${unknown?' 출생 시각이 없어 정오를 임시로 사용했으므로 대운 시작 경계는 달라질 수 있습니다.':''} 성별 기준이 삶의 성향이나 연애·직업의 결과를 결정한다는 뜻은 아닙니다.`));
}


const fiveControls=[2,3,4,0,1]; // 木剋土, 火剋金, 土剋水, 金剋木, 水剋火
const personality={
  甲:['곧게 방향을 정하고 오래 키워 가는 태도','목표가 분명할수록 힘이 나지만 계획을 고집하면 다른 속도를 놓칠 수 있습니다','한 가지 목표를 정하고 중간에 방향을 조정할 여지를 남겨 보세요'],
  乙:['사람과 환경에 맞춰 유연하게 길을 찾는 태도','상대의 마음을 잘 살피는 이미지지만 내 의견을 뒤로 미루기 쉽다는 질문도 던져 줍니다','작은 선택에서도 내 선호를 먼저 한 문장으로 말해 보세요'],
  丙:['생각과 감정을 밝게 드러내며 시작을 끌어내는 태도','열기가 장점으로 읽히지만 속도가 앞서면 세부 사항을 놓칠 수 있습니다','시작할 일 하나와 마무리할 일 하나를 따로 적어 보세요'],
  丁:['가까운 곳을 세심하게 비추고 꾸준히 살피는 태도','섬세함이 빛나지만 마음을 오래 쓰는 일에는 경계가 필요합니다','돌보는 일과 쉬는 시간을 함께 일정에 넣어 보세요'],
  戊:['흔들리는 상황에서도 중심을 잡으려는 태도','믿음직한 모습으로 읽히지만 변화의 신호를 늦게 받아들일 수도 있습니다','익숙한 방식 하나를 작은 규모로 바꿔 시험해 보세요'],
  己:['사람과 일을 차근차근 돌보고 가꾸는 태도','실무를 챙기는 힘이 있지만 여러 부탁을 한꺼번에 떠안지 않는지도 살펴보세요','이번 주에 맡을 일과 거절할 일을 한 가지씩 구분해 보세요'],
  庚:['복잡한 일을 분명한 기준으로 정리하는 태도','결단력이 장점으로 읽히지만 표현이 단호하게 들릴 수 있습니다','결론을 말하기 전에 상대의 사정을 한 번 물어보세요'],
  辛:['작은 차이를 알아보고 완성도를 높이는 태도','정교함이 빛나지만 완벽한 때를 기다리다 시작이 늦어질 수 있습니다','완성 전의 초안을 믿을 만한 사람에게 먼저 보여 주세요'],
  壬:['넓게 연결하고 새로운 가능성을 탐색하는 태도','시야가 넓다는 비유와 함께, 관심사가 많아 우선순위가 흐려질 수 있다는 질문을 줍니다','떠오른 아이디어 중 이번 달에 실행할 한 가지만 골라 보세요'],
  癸:['조용히 관찰하고 정보를 모아 판단하는 태도','세밀하게 준비하지만 생각을 혼자 오래 품으면 기회를 놓칠 수도 있습니다','정리한 생각을 한 사람과 나누고 반응을 들어 보세요']
};
function lifeCard(title,basis,body,action){const card=guideNode('article','guide-card life-card','');card.append(guideNode('h3','',title),guideNode('p','basis',`읽는 근거 · ${basis}`),guideNode('p','',body),guideNode('p','takeaway',`생활에 대입해 보기 · ${action}`));return card}
function renderLifeGuide(root,vals,counts,unknown){
  const stem=vals[2][0],day=se(stem),dayBranch=vals[2][1],monthBranch=vals[1][1];
  const dayBranchEl=be(dayBranch),monthEl=be(monthBranch),wealth=fiveControls[day],expression=(day+1)%5;
  const p=personality[stem];
  const wealthVisible=counts[wealth],expressVisible=counts[expression];
  const abundance=wealthVisible===0?`겉의 ${unknown?'여섯':'여덟'} 글자에는 ${names[wealth]}이(가) 보이지 않습니다. 이것을 재물 부족이나 돈복이 없다는 뜻으로 읽지 않습니다.`:`겉글자에 ${names[wealth]}이(가) ${wealthVisible}개 보입니다. 개수로 수입이나 재산 규모를 예측할 수는 없습니다.`;
  const relation=dayBranchEl===day?'같은 오행이 반복되는 조합입니다. 비슷한 방식으로 공감하는 순간과 서로 고집이 부딪히는 순간을 함께 떠올려 보세요.':
    (day+1)%5===dayBranchEl?'일간에서 일지로 흐르는 오행 조합입니다. 마음을 표현하고 먼저 움직일 때 편안한지 돌아보세요.':
    (dayBranchEl+1)%5===day?'일지가 일간을 북돋는 오행 조합입니다. 상대에게 기대는 방식과 내 속도를 지키는 방식을 함께 생각해 보세요.':
    '서로 다른 오행이 만나는 조합입니다. 친밀한 관계에서 내 방식과 상대의 방식을 어떻게 조율하는지 살펴보세요.';
  const seasonSentence=monthEl===day?`태어난 계절의 대표 오행과 일간이 모두 ${names[day]}입니다. 내게 익숙한 방식이 강하게 느껴질 때가 있는지 돌아볼 만합니다.`:`월지 ${bKo[branches.indexOf(monthBranch)]}의 대표 오행 ${names[monthEl]}과(와) 일간 ${names[day]}을(를) 함께 보며, 내 방식과 주변 환경이 언제 잘 맞는지 생각해 볼 수 있습니다.`;
  root.append(guideNode('h2','','7. 생활에서 읽어 보는 다섯 가지 이야기'));
  root.append(guideNode('p','guide-note','‘운’은 미래의 사건을 예고하는 점수가 아닙니다. 전통 명리의 상징을 내 생활에 대입해 보는 읽을거리입니다.'));
  const grid=guideNode('div','guide-grid','');
  grid.append(
    lifeCard('성격 · 나다운 방식',`일간 ${sKo[stems.indexOf(stem)]}(${stem}), 월지 ${bKo[branches.indexOf(monthBranch)]}(${monthBranch})`,`일간은 ${p[0]}에 비유합니다. ${p[1]} ${seasonSentence}`,p[2]),
    lifeCard('금전·재물운 · 돈을 다루는 습관',`일간 ${names[day]}이(가) 극하는 오행 ${names[wealth]}(재성의 기본 관계)`,`전통 명리에서 재성은 일간이 다루려는 대상의 기호입니다. ${abundance} 돈이 들어오고 나가는 실제 습관을 점검하는 계기로 읽어 주세요.`,'최근 한 달 지출에서 만족스러웠던 소비와 아쉬웠던 소비를 하나씩 적어 보세요.'),
    lifeCard('연애운 · 가까운 사람과의 거리',`일간 ${stemImages[stem]}, 일지 ${bKo[branches.indexOf(dayBranch)]}(${dayBranch})`,`일간은 나를 가리키고 일지는 나와 가까운 일상의 자리로 읽습니다. ${relation} 이 조합만으로 만남의 시기, 상대의 성격, 결혼 여부를 알 수는 없습니다.`,'가까운 사람에게 원하는 대화 방식과 혼자 쉬고 싶은 시간을 말해 보세요.'),
    lifeCard('일·사업운 · 일을 굴리는 방식',`일간 ${names[day]}, 표현의 방향 ${names[expression]}(식상의 기본 관계), 월지 ${names[monthEl]}`,`${names[day]}에서 ${names[expression]}으로 이어지는 관계를 아이디어나 결과물을 밖으로 표현하는 이미지로 읽습니다. 겉글자에 ${names[expression]}이(가) ${expressVisible}개 보이지만, 이것만으로 창업 성공이나 적합한 직업을 판단할 수는 없습니다. ${seasonSentence}`,'큰 결정을 하기 전에 아이디어를 작게 시험하고, 필요한 역할을 적어 보세요.'),
    lifeCard('건강운 · 몸과 마음의 리듬',`일간 ${names[day]}, 출생 계절 ${names[monthEl]}`,`전통적인 오행 이미지를 생활의 리듬을 돌아보는 소재로만 사용합니다. ${p[0]}에 몰입할 때 쉬는 시간은 충분한지 살펴보세요. 사주 글자로 질병이나 건강 위험을 알아낼 수는 없습니다.`,'이번 주 수면·활동·휴식 중 가장 먼저 챙길 한 가지를 정해 보세요.')
  );root.append(grid);
}
