if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
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

// 탭 전환 이벤트 (직접 입력 VS PDF 업로드)
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

async function handlePdfUpload(fileInputId, statusId) {
  const fileInput = $(fileInputId);
  const statusEl = $(statusId);
  if (!fileInput || !fileInput.files.length) return;

  const file = fileInput.files[0];
  statusEl.textContent = 'PDF 읽는 중...';

  try {
    const text = await extractTextFromPdf(file);
    $('extractedPdfText').value += `\n[${file.name}]\n` + text;
    statusEl.textContent = '✓ 추출 완료';
  } catch (err) {
    console.error(err);
    statusEl.textContent = '❌ 파일 읽기 실패';
  }
}

$('resumePdf')?.addEventListener('change', () => handlePdfUpload('resumePdf', 'resumeStatus'));
$('letterPdf')?.addEventListener('change', () => handlePdfUpload('letterPdf', 'letterStatus'));

// 모드 및 경로 제어
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
    if (mode() === 'match' && !$('posting').value.trim()) {
      $('posting').focus();
      return;
    }
    show(+b.dataset.next);
  });
});

document.querySelectorAll('[data-back]').forEach(b => {
  b.addEventListener('click', () => show(+b.dataset.back));
});

// 샘플 입력
$('sampleButton')?.addEventListener('click', () => {
  $('role').value = '사무행정';
  const matchRadio = document.querySelector('input[value="match"]');
  if (matchRadio) {
    matchRadio.checked = true;
    matchRadio.dispatchEvent(new Event('change'));
  }
  $('posting').value = '담당업무: 교육과정 운영 지원, 문서 작성 및 자료 관리, 수강생 안내. 자격요건: 엑셀 활용 능력, 정확한 행정 처리, 원활한 소통 능력.';
  $('resume').value = '교육 운영 보조 경험\n- 수강생 35명의 출결 자료를 엑셀로 관리하고 매일 누락 여부를 점검\n- 안내 문자를 작성·발송하고 문의사항을 응대\n- 컴퓨터활용능력 2급 보유';
  $('letter').value = '교육 프로그램 운영을 보조하며 정확한 자료 관리가 참여자의 만족도와 연결된다는 점을 배웠습니다. 매일 출결 자료를 확인하고 누락 정보를 담당자에게 공유했습니다.';
  $('evidence').value = '교육생 35명의 출결 자료를 매일 엑셀로 정리해 누락 0건으로 관리했습니다.';
  show(2);
});

// 이력서 & 자기소개서 자동 작성 엔진
function generateDrafts(role, level, evidence, mainText) {
  const baseExperience = evidence || mainText || '직무 관련 기본 과업 및 운영 보조 수행';
  
  // 자동 이력서 초안
  const autoResume = `• 지원 직무: ${role} (${level})
• 핵심 역량: ${roleMap[role] ? roleMap[role].slice(0, 3).join(', ') : '협업, 문제해결'}
• 주요 경력 및 경험:
  - ${baseExperience}
  - 직무 관련 서류 및 시스템 데이터 정확 관리
  - 원활한 구성원 간 소통 및 행정 업무 지원`;

  // 자동 자기소개서 초안
  const autoLetter = `[지원 동기 및 직무 역량]
${role} 직무에서 가장 중요한 요소는 정확하고 책임감 있는 과업 수행이라고 생각합니다. 
저는 과거 경험을 통해 "${baseExperience}" 과정에서 체계적인 관리와 소통의 중요성을 다졌습니다.

[입사 후 포부]
${role} 담당자로서 부여된 과업을 신속하고 정확하게 처리하며, 팀 내 활발한 협업을 통해 성과 창출에 기여하겠습니다.`;

  $('autoResumeDraft').textContent = autoResume;
  $('autoLetterDraft').textContent = autoLetter;
}

// 분석 및 출력 로직
function render() {
  const role = $('role').value;
  const level = $('level').value;
  const post = $('posting').value.trim();
  const resumeText = $('resume').value.trim();
  const letterText = $('letter').value.trim();
  const pdfText = $('extractedPdfText').value.trim();
  const evidence = $('evidence').value.trim();

  const mainText = `${resumeText} ${letterText} ${pdfText}`.trim();
  const all = `${mainText} ${evidence}`;

  // 이력서/자기소개서 자동 생성 호출
  generateDrafts(role, level, evidence, mainText);

  const keys = roleMap[role] || roleMap['기타'];
  const postWords = unique(words(post));
  const found = post
    ? unique([...postWords.filter(w => all.includes(w)), ...keys.filter(w => post.includes(w))]).slice(0, 6)
    : keys.slice(0, 5);

  const match = found.filter(w => all.includes(w));
  const nums = (all.match(/\d+[.,]?\d*\s*(%|명|건|회|개월|시간|원|개)/g) || []).length;
  const verbs = (all.match(/(기획|관리|개선|분석|운영|협업|제작|지원|해결|달성|조율|작성|정리|점검)/g) || []).length;
  const sentences = mainText.split(/[.!?。\n]+/).filter(x => x.trim().length > 8);
  const avg = sentences.length ? mainText.replace(/\s/g, '').length / sentences.length : 0;

  const score = Math.max(45, Math.min(95, Math.round(
    48 + (post ? match.length * 7 : keys.filter(w => all.includes(w)).length * 7) + nums * 5 + verbs * 2
  )));

  $('roleLabel').textContent = role;
  $('matchScore').textContent = score;

  const ring = document.querySelector('.ring');
  if (ring) {
    ring.style.background = `conic-gradient(var(--blue) ${score * 3.6}deg, #d5e0f5 0deg)`;
  }

  $('resultSummary').textContent = mode() === 'match'
    ? '채용공고와 입력된 데이터로 추출한 맞춤 작성 전략입니다.'
    : '희망 직무를 기준으로 생성된 서류 및 기본 점검 결과입니다.';

  $('mainAction').textContent = nums < 2
    ? '경험의 결과를 수치·기간·대상으로 구체화해 보세요.'
    : match.length < 2
    ? '지원 직무와 연결되는 경험을 첫 문장에 배치해 보세요.'
    : '찾은 경험 근거를 지원서 첫 문단에 우선 배치해 보세요.';

  $('scoreCaption').textContent = post
    ? `공고 핵심어 ${found.length}개 중 ${match.length}개가 지원서에서 확인됩니다.`
    : `${role} 직무의 핵심역량을 기준으로 지원서를 점검했습니다.`;

  $('keywords').innerHTML = found.map(x => `<span>${x}</span>`).join('');
  $('keywordNote').textContent = post
    ? '공고 표현을 그대로 나열하기보다, 본인의 실제 경험을 함께 제시하세요.'
    : '채용공고를 입력하면 해당 공고의 표현으로 더 정밀하게 점검할 수 있어요.';

  const strengths = [];
  if (nums) strengths.push(`성과를 보여 주는 수치·기간 표현 ${nums}개가 있어 경험의 신뢰도를 높입니다.`);
  if (verbs >= 2) strengths.push('직접 수행한 행동이 드러나, 단순 참여보다 주도적인 인상을 줍니다.');
  if (match.length >= 2) strengths.push(`‘${match.slice(0, 3).join('’, ‘')}’ 관련 근거가 지원서에서 확인됩니다.`);
  if (mainText.length > 280) strengths.push('지원서에 경험의 맥락이 비교적 충분히 담겨 있습니다.');
  list('strengths', (strengths.length ? strengths : ['역할과 결과를 한 줄씩 더하면 강점을 더 선명하게 보여 줄 수 있어요.']).slice(0, 3));

  const improve = [];
  if (mode() === 'match' && match.length < 2) {
    improve.push(`공고 요구역량과 직접 연결되는 경험이 적습니다. ${found.slice(0, 3).join('·')} 관련 역할을 찾아 추가해 보세요.`);
  }
  if (nums < 2) improve.push('대상·기간·횟수·결과를 넣어 경험을 검증 가능하게 표현하세요.');
  if (avg > 115) improve.push('긴 문장은 행동과 결과를 나누어 2문장으로 정리해 보세요.');
  list('priorities', (improve.length ? improve : ['지원 직무와 경험의 연결이 잘 보입니다. 각 사례에서 본인의 고유한 역할을 한 번 더 확인해 보세요.']).slice(0, 3));

  const key = found[0] || keys[0];
  $('rewriteGuide').innerHTML = `<b>문장 공식</b> · 상황/목표 → 나의 행동 → 결과 → ${role} 직무와의 연결<br><br><b>수정 방향 예시</b> · “${key} 업무를 도왔습니다”보다 “○○ 상황에서 △△를 직접 정리·관리했고, 그 결과 □□를 개선했습니다”처럼 역할과 결과를 함께 쓰세요.`;

  list('questions', [
    '이 경험에서 본인이 직접 결정하거나 책임진 부분은 무엇인가요?',
    '결과를 확인할 수 있는 수치, 기간, 대상 또는 사례가 더 있나요?',
    mode() === 'match' ? `공고의 ‘${found[0] || '핵심역량'}’과 연결되는 경험을 면접에서 어떻게 설명할 수 있나요?` : '희망 직무에서 이 경험을 어떻게 활용할 수 있나요?'
  ]);
}

// 분석 실행
$('analyzeButton')?.addEventListener('click', () => {
  const allText = `${$('resume').value}${$('letter').value}${$('extractedPdfText').value}${$('evidence').value}`.trim();
  if (!allText) {
    alert('경험 내용을 텍스트로 입력하거나, PDF를 첨부해 주세요.');
    return;
  }
  show(3);
  $('feedback').hidden = true;
  $('loading').hidden = false;

  let i = 0;
  const messages = [
    '직무와 연결되는 핵심 표현을 찾는 중입니다.',
    '경험 속 역할과 결과를 연결하는 중입니다.',
    '이력서 및 자기소개서 초안을 작성하고 있습니다.'
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

// 복사 기능
$('copyButton')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('feedback').innerText);
    $('copyButton').textContent = '복사 완료';
    setTimeout(() => { $('copyButton').textContent = '결과 전체 복사'; }, 1500);
  } catch {
    alert('결과를 직접 선택해 복사해 주세요.');
  }
});