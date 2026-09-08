if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

const $ = id => document.getElementById(id);

const roleMap = {
  "사무행정": ["문서", "자료", "엑셀", "일정", "협업", "행정"],
  "회계·경리": ["회계", "정산", "증빙", "세금", "엑셀", "정확"],
  "영업·마케팅": ["고객", "매출", "홍보", "분석", "기획", "소통"],
  "IT·개발": ["개발", "프로젝트", "데이터", "기술", "협업", "문제"],
  "디자인": ["디자인", "콘텐츠", "사용자", "기획", "포트폴리오", "협업"],
  "서비스·고객응대": ["고객", "응대", "예약", "문제", "소통", "서비스"],
  "기타": ["협업", "문제", "기획", "소통", "성과", "경험"]
};

const words = t => (t.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) || []);
const unique = a => [...new Set(a)];

let page = 1;
const mode = () => document.querySelector('input[name="mode"]:checked')?.value || 'basic';

function show(n) {
  page = n;
  document.querySelectorAll('.form-step').forEach(x => {
    x.classList.toggle('current', +x.dataset.page === n);
  });
  document.querySelectorAll('.progress .step').forEach(x => {
    const isCurrent = +x.dataset.step === n;
    if (x.tagName === 'B') x.classList.toggle('current-dot', isCurrent);
    if (x.tagName === 'SPAN') x.classList.toggle('current-label', isCurrent);
  });

  if (n === 3) {
    $('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function list(id, a) {
  const el = $(id);
  if (el) el.innerHTML = a.map(x => `<li>${x}</li>`).join('');
}

// PDF 텍스트 추출 함수
async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tokenized = await page.getTextContent();
    const pageText = tokenized.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

// PDF 업로드 처리
async function handlePdfUpload(fileInputId, statusId, targetHiddenId) {
  const fileInput = $(fileInputId);
  const statusEl = $(statusId);
  if (!fileInput || !fileInput.files.length) return;

  const file = fileInput.files[0];
  statusEl.textContent = 'PDF 읽는 중...';

  try {
    const text = await extractTextFromPdf(file);
    $(targetHiddenId).value += `\n[${file.name}]\n` + text;
    statusEl.textContent = '✓ 추출 완료';
  } catch (err) {
    console.error(err);
    statusEl.textContent = '❌ 파일 읽기 실패';
  }
}

$('resumePdf')?.addEventListener('change', () => handlePdfUpload('resumePdf', 'resumeStatus', 'extractedPdfText'));
$('letterPdf')?.addEventListener('change', () => handlePdfUpload('letterPdf', 'letterStatus', 'extractedPdfText'));
$('postingPdf')?.addEventListener('change', () => handlePdfUpload('postingPdf', 'postingStatus', 'extractedPostPdfText'));

// UI 탭 전환 (경험 입력)
$('tabTextBtn')?.addEventListener('click', () => {
  $('textInputArea').classList.remove('hide');
  $('pdfInputArea').classList.add('hide');
  $('tabTextBtn').className = 'primary';
  $('tabPdfBtn').className = 'sample';
});

$('tabPdfBtn')?.addEventListener('click', () => {
  $('textInputArea').classList.add('hide');
  $('pdfInputArea').classList.remove('hide');
  $('tabTextBtn').className = 'sample';
  $('tabPdfBtn').className = 'primary';
});

// UI 탭 전환 (채용공고 입력)
$('postTextBtn')?.addEventListener('click', () => {
  $('postTextArea').classList.remove('hide');
  $('postPdfArea').classList.add('hide');
});

$('postPdfBtn')?.addEventListener('click', () => {
  $('postTextArea').classList.add('hide');
  $('postPdfArea').classList.remove('hide');
});

// 모드 전환
document.querySelectorAll('input[name="mode"]').forEach(x => {
  x.addEventListener('change', () => {
    document.querySelectorAll('.mode-card').forEach(c => {
      c.classList.toggle('selected', c.querySelector('input').checked);
    });
    $('postingWrap')?.classList.toggle('hide', mode() !== 'match');
  });
});

document.querySelectorAll('[data-next]').forEach(b => {
  b.addEventListener('click', () => {
    const currentMode = mode();
    const postText = ($('posting').value + $('extractedPostPdfText').value).trim();
    if (currentMode === 'match' && !postText) {
      alert('채용공고 내용을 입력하거나 PDF를 첨부해 주세요.');
      return;
    }
    show(+b.dataset.next);
  });
});

document.querySelectorAll('[data-back]').forEach(b => {
  b.addEventListener('click', () => show(+b.dataset.back));
});

// 샘플 체험하기
$('sampleButton')?.addEventListener('click', () => {
  $('role').value = '사무행정';
  const matchRadio = document.querySelector('input[value="match"]');
  if (matchRadio) {
    matchRadio.checked = true;
    matchRadio.dispatchEvent(new Event('change'));
  }
  $('posting').value = '담당업무: 교육과정 운영 지원, 문서 작성 및 자료 관리, 수강생 안내. 자격요건: 엑셀 활용 능력, 정확한 행정 처리, 원활한 소통 능력.';
  $('resume').value = '교육 운영 보조 경험\n- 수강생 35명의 출결 자료를 엑셀로 관리하고 매일 누락 여부를 점검\n- 안내 문자를 작성·발송하고 문의사항을 응대\n- 컴퓨터활용능력 2급 보유';
  $('letter').value = '교육 프로그램 운영을 보조하며 정확한 자료 관리가 참여자의 만족도와 연결된다는 점을 배웠습니다.';
  $('evidence').value = '교육생 35명의 출결 자료를 매일 엑셀로 정리해 누락 0건으로 관리했습니다.';
  show(2);
});

// 자동 서류 생성 함수
function generateDrafts(currentMode, role, level, evidence, mainText, postText) {
  const baseExperience = evidence || (mainText.length > 20 ? mainText.slice(0, 100) + '...' : '직무 관련 기본 과업 및 수행 보조');
  const isMatch = currentMode === 'match';

  // 이력서 초안 생성
  const autoResume = `[지원 직무] ${role} (${level})
[주요 역량] ${roleMap[role] ? roleMap[role].slice(0, 4).join(', ') : '기본 실무, 협업'}
${isMatch && postText ? `[맞춤 지원 목표] 공고 요구사항에 맞춰 ${roleMap[role][0]} 및 실행 역량을 중점 발휘` : ''}

[경력 및 경험 상세]
• 핵심 수행 내용: ${baseExperience}
• 과업 이행 성과: 누락 방지 및 정확한 데이터/문서 관리 수행
• 업무 태도: 정확한 업무 처리 능력과 원활한 조직 내 소통`;

  // 자기소개서 초안 생성
  const autoLetter = isMatch ? 
`[지원 동기 및 맞춤 역량]
${role} 직무 공고에서 요구하는 핵심역량을 갖추기 위해 다양한 실무 경험을 쌓아왔습니다. 특히 "${baseExperience}" 사례에서 입증했듯, 정확한 과업 실행력과 책임감을 보유하고 있습니다.

[입사 후 목표]
지원한 조직의 방향성에 맞춰 부여된 과업을 완벽히 이행하고, 팀 내 구성원들과의 긴밀한 협업을 통해 실질적인 조직 성과에 기여하겠습니다.`
:
`[직무 수행 역량 및 경험]
${role} 직무 수행의 핵심은 꼼꼼한 관리와 신뢰성 높은 업무 처리라 생각합니다.
저는 "${baseExperience}" 경험을 바탕으로 직무에 필요한 기본기 및 문제 해결력을 길러왔습니다.

[향후 발전 계획]
신속 정확한 실무 지원을 통해 조직의 효율성을 높이고, 지속적인 역량 개발로 직무 전문가로 성장하겠습니다.`;

  $('autoResumeDraft').textContent = autoResume;
  $('autoLetterDraft').textContent = autoLetter;
}

// 전체 결과 렌더링
function render() {
  const currentMode = mode();
  const role = $('role').value;
  const level = $('level').value;
  
  const postText = ($('posting').value + ' ' + $('extractedPostPdfText').value).trim();
  const resumeText = $('resume').value.trim();
  const letterText = $('letter').value.trim();
  const pdfText = $('extractedPdfText').value.trim();
  const evidence = $('evidence').value.trim();

  const mainText = `${resumeText} ${letterText} ${pdfText}`.trim();
  const all = `${mainText} ${evidence}`;

  // 서류 초안 자동 출력
  generateDrafts(currentMode, role, level, evidence, mainText, postText);

  const keys = roleMap[role] || roleMap['기타'];
  const postWords = unique(words(postText));
  
  // 모드별 분석 차별화
  const found = (currentMode === 'match' && postText)
    ? unique([...postWords.filter(w => all.includes(w)), ...keys.filter(w => postText.includes(w))]).slice(0, 6)
    : keys.slice(0, 5);

  const match = found.filter(w => all.includes(w));
  const nums = (all.match(/\d+[.,]?\d*\s*(%|명|건|회|개월|시간|원|개)/g) || []).length;
  const verbs = (all.match(/(기획|관리|개선|분석|운영|협업|제작|지원|해결|달성|조율|작성|정리|점검)/g) || []).length;

  const score = Math.max(45, Math.min(95, Math.round(
    48 + (currentMode === 'match' ? match.length * 8 : keys.filter(w => all.includes(w)).length * 6) + nums * 5 + verbs * 2
  )));

  $('roleLabel').textContent = role;
  $('matchScore').textContent = score;

  const ring = document.querySelector('.ring');
  if (ring) {
    ring.style.background = `conic-gradient(var(--blue) ${score * 3.6}deg, #d5e0f5 0deg)`;
  }

  $('resultSummary').textContent = currentMode === 'match'
    ? '채용공고 요구사항 분석에 기반한 맞춤형 합격 전략입니다.'
    : '희망 직무 표준 역량을 기준으로 분석된 서류 결과입니다.';

  $('mainAction').textContent = nums < 1
    ? '경험 성과를 정량적 수치(건수, 비율, 기간)로 명시하세요.'
    : currentMode === 'match' && match.length < 2
    ? '채용공고 주요 키워드를 자소서 첫 문단에 녹여내세요.'
    : '추천된 자소서 초안을 바탕으로 본인의 구체적 에피소드를 보완하세요.';

  $('scoreCaption').textContent = (currentMode === 'match' && postText)
    ? `공고 핵심 키워드 ${found.length}개 중 ${match.length}개가 지원서에서 매칭되었습니다.`
    : `${role} 직무 표준 역량 항목을 기준으로 서류를 진단했습니다.`;

  $('keywords').innerHTML = found.map(x => `<span>${x}</span>`).join('');
  $('keywordNote').textContent = currentMode === 'match'
    ? '공고에 명시된 핵심 표현을 이력서 및 자기소개서 항목에 직접 적용하세요.'
    : '채용공고 맞춤 모드를 선택하시면 타겟 공고 기준의 매칭 진단을 받을 수 있습니다.';

  const strengths = [];
  if (nums) strengths.push(`구체적 수치 및 성과 표현 ${nums}개가 확인되어 신뢰도가 높습니다.`);
  if (verbs >= 2) strengths.push('직접 수행한 행동 동사가 명확히 나타나 주도성이 보입니다.');
  if (match.length >= 1) strengths.push(`‘${match.slice(0, 3).join('’, ‘')}’ 관련 직무 근거가 양호하게 배치되었습니다.`);
  list('strengths', (strengths.length ? strengths : ['핵심 과업의 성과 수치를 한 줄 더 보완해 보세요.']).slice(0, 3));

  const improve = [];
  if (currentMode === 'match' && match.length < 2) {
    improve.push(`공고 요구역량과 연결되는 직접적 경험이 적습니다. ${found.slice(0, 3).join('·')} 연관 사례를 추가하세요.`);
  }
  if (nums < 1) improve.push('숫자, 대상, 인원, 정확도 등 정량적 성과 지표를 보완하세요.');
  list('priorities', (improve.length ? improve : ['전반적인 직무 경험 연결이 양호합니다. 생성된 초안을 다듬어 활용해 보세요.']).slice(0, 3));

  const key = found[0] || keys[0];
  $('rewriteGuide').innerHTML = `<b>문장 작성 공식</b> · 상황/목표 → 본인의 행동 → 구체적 성과 → ${role} 직무 적용<br><br><b>수정 예시</b> · “${key} 관련 업무를 처리함” ➔ “○○ 상황에서 ${key} 과업을 직접 총괄하여, 오류율 0% 달성 및 업무 효율 개선”`;

  list('questions', [
    '해당 경험에서 본인이 직접 결정하거나 주도한 구체적 과업은 무엇인가요?',
    '성과나 결과를 증명할 수 있는 정량적 지표가 더 있나요?',
    currentMode === 'match' ? `채용공고의 ‘${found[0] || '핵심역량'}’을 면접 시 어떻게 입증할 수 있나요?` : '희망 직무 입사 후 이 경험을 어떻게 활용할 것인가요?'
  ]);
}

// 분석 실행
$('analyzeButton')?.addEventListener('click', () => {
  const allText = `${$('resume').value}${$('letter').value}${$('extractedPdfText').value}${$('evidence').value}`.trim();
  if (!allText) {
    alert('경험 내용을 작성하시거나 PDF를 첨부해 주세요.');
    return;
  }
  show(3);
  $('feedback').hidden = true;
  $('loading').hidden = false;

  let i = 0;
  const messages = [
    'PDF 및 입력 데이터 분석 중...',
    '채용공고 및 직무 키워드 매칭 중...',
    '맞춤 이력서 및 자기소개서 초안 작성 중...'
  ];

  const timer = setInterval(() => {
    $('loadText').textContent = messages[i++ % messages.length];
  }, 500);

  setTimeout(() => {
    clearInterval(timer);
    render();
    $('loading').hidden = true;
    $('feedback').hidden = false;
  }, 1300);
});

// 새로 시작
$('restartButton')?.addEventListener('click', () => {
  show(1);
  $('start')?.scrollIntoView({ behavior: 'smooth' });
});

// 복사
$('copyButton')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('feedback').innerText);
    $('copyButton').textContent = '복사 완료';
    setTimeout(() => { $('copyButton').textContent = '결과 전체 복사'; }, 1500);
  } catch {
    alert('결과를 직접 선택해 복사해 주세요.');
  }
});