document.addEventListener('DOMContentLoaded', () => {
  // PDF.js CORS 및 도메인 차단 문제를 완벽 차단하는 Blob Worker 설정
  if (window.pdfjsLib) {
    const workerCode = `
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js');
    `;
    const blob = new Blob([workerCode], { type: 'text/javascript' });
    pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
  }

  const $ = id => document.getElementById(id);

  const roleMap = {
    "사무행정": ["문서관리", "자료분석", "엑셀활용", "일정관리", "행정지원", "조직소통"],
    "회계·경리": ["전표처리", "결산지원", "세무증빙", "회계프로그램", "자금관리", "정확성"],
    "영업·마케팅": ["고객발굴", "매출관리", "시장조사", "콘텐츠기획", "커뮤니케이션", "성과달성"],
    "IT·개발": ["시스템개발", "프로그래밍", "DB관리", "디버깅", "프로젝트협업", "문제해결"],
    "디자인": ["UI/UX디자인", "포토샵·일러스트", "시각화", "브랜드콘텐츠", "포트폴리오", "협업"],
    "서비스·고객응대": ["고객상담", "컴플레인처리", "서비스개선", "예약관리", "친절응대", "소통"],
    "기타": ["기획지원", "과업관리", "협업역량", "데이터정리", "원활한소통", "문제해결"]
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

  // PDF 텍스트 파싱 안정화 엔진
  async function extractTextFromPdf(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const pdfPage = await pdf.getPage(i);
        const tokenized = await pdfPage.getTextContent();
        const pageText = tokenized.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      return fullText.trim();
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      throw err;
    }
  }

  async function handlePdfUpload(fileInputId, statusId, targetHiddenId) {
    const fileInput = $(fileInputId);
    const statusEl = $(statusId);
    if (!fileInput || !fileInput.files.length) return;

    const file = fileInput.files[0];
    statusEl.textContent = '⏳ PDF 텍스트 추출 중...';
    statusEl.style.color = 'var(--blue)';

    try {
      const text = await extractTextFromPdf(file);
      if (!text) {
        statusEl.textContent = '⚠️ 텍스트를 읽을 수 없는 이미지형 PDF입니다.';
        statusEl.style.color = '#E11D48';
        return;
      }
      $(targetHiddenId).value += `\n[${file.name}]\n` + text;
      statusEl.textContent = `✓ ${file.name} (텍스트 추출 완료)`;
      statusEl.style.color = 'var(--blue)';
    } catch (err) {
      statusEl.textContent = '❌ 파일 처리 실패 (다른 PDF로 시도해 주세요)';
      statusEl.style.color = '#E11D48';
    }
  }

  // PDF 파일 업로드 이벤트 연결
  $('resumePdf')?.addEventListener('change', () => handlePdfUpload('resumePdf', 'resumeStatus', 'extractedPdfText'));
  $('letterPdf')?.addEventListener('change', () => handlePdfUpload('letterPdf', 'letterStatus', 'extractedPdfText'));
  $('postingPdf')?.addEventListener('change', () => handlePdfUpload('postingPdf', 'postingStatus', 'extractedPostPdfText'));

  // 탭 제어
  $('tabTextBtn')?.addEventListener('click', () => {
    $('textInputArea').classList.remove('hide');
    $('pdfInputArea').classList.add('hide');
    $('tabTextBtn').classList.add('active');
    $('tabPdfBtn').classList.remove('active');
  });

  $('tabPdfBtn')?.addEventListener('click', () => {
    $('textInputArea').classList.add('hide');
    $('pdfInputArea').classList.remove('hide');
    $('tabPdfBtn').classList.add('active');
    $('tabTextBtn').classList.remove('active');
  });

  $('postTextBtn')?.addEventListener('click', () => {
    $('postTextArea').classList.remove('hide');
    $('postPdfArea').classList.add('hide');
    $('postTextBtn').classList.add('active');
    $('postPdfBtn').classList.remove('active');
  });

  $('postPdfBtn')?.addEventListener('click', () => {
    $('postTextArea').classList.add('hide');
    $('postPdfArea').classList.remove('hide');
    $('postPdfBtn').classList.add('active');
    $('postTextBtn').classList.remove('active');
  });

  // 라디오 모드 제어
  document.querySelectorAll('input[name="mode"]').forEach(x => {
    x.addEventListener('change', () => {
      document.querySelectorAll('.mode-card').forEach(c => {
        c.classList.toggle('selected', c.querySelector('input').checked);
      });
      $('postingWrap')?.classList.toggle('hide', mode() !== 'match');
    });
  });

  // 버튼 이동 제어
  document.querySelectorAll('[data-next]').forEach(b => {
    b.addEventListener('click', () => {
      const currentMode = mode();
      const postText = ($('posting').value + $('extractedPostPdfText').value).trim();
      if (currentMode === 'match' && !postText) {
        alert('채용공고 텍스트를 입력하시거나 PDF 파일을 업로드해 주세요.');
        return;
      }
      show(+b.dataset.next);
    });
  });

  document.querySelectorAll('[data-back]').forEach(b => {
    b.addEventListener('click', () => show(+b.dataset.back));
  });

  // 예시 채우기
  $('sampleButton')?.addEventListener('click', () => {
    $('role').value = '사무행정';
    const matchRadio = document.querySelector('input[value="match"]');
    if (matchRadio) {
      matchRadio.checked = true;
      matchRadio.dispatchEvent(new Event('change'));
    }
    $('posting').value = '담당업무: 교육과정 운영 지원, 행정 문서 작성, 수강생 출결 데이터 관리. 자격요건: 엑셀 데이터 관리 능력, 원활한 커뮤니케이션.';
    $('resume').value = '교육기관 행정 보조 근무\n- 훈련생 35명 출결 엑셀 데이터 일별 업데이트 및 검증\n- 행정 안내 서식 모듈화로 전산 등록 시간 단축';
    $('letter').value = '행정 지원 업무는 정확성이 최우선이라 생각합니다. 엑셀을 활용한 관리 경험으로 업무 오류를 최소화했습니다.';
    $('evidence').value = '훈련생 35명의 출결 자료를 엑셀로 일별 관리하여 데이터 누락률 0%를 유지함';
    show(2);
  });

  function generateDrafts(currentMode, role, level, evidence, mainText, postText) {
    const baseExp = evidence || (mainText.length > 10 ? mainText.slice(0, 120) : '지원 직무 관련 핵심 과업 수행 경험 보유');
    const isMatch = currentMode === 'match';

    const autoResume = `[지원 정보] 대한상공회의소 추천 서류 / ${role} (${level})
[주요 역량] ${roleMap[role] ? roleMap[role].slice(0, 4).join(', ') : '실무 역량, 협업'}
${isMatch && postText ? `[공고 타겟] 채용공고 우대사항 연관 역량 수립 완료` : ''}

[핵심 경력 및 과업 성과]
• 주요 수행 과업: ${baseExp}
• 직무 적용 성과: 데이터 정확성 확보, 행정 업무 프로세스 효율화
• 조직 기여 태도: 책임감 있는 자세와 구성원 간 원활한 커뮤니케이션`;

    const autoLetter = isMatch ? 
`[지원동기 및 맞춤 역량]
${role} 직무 공고에서 요구하는 주요 역량을 충족하기 위해 실무 중심의 경험을 축적해왔습니다. 특히 "${baseExp}" 경험을 통해 공고에서 명시한 핵심 과업을 신속하고 정확하게 수행할 수 있는 실무 기준을 확립했습니다.

[입사 후 포부 및 성과 창출 계획]
대한상공회의소의 체계적인 지원 체계에 맞춰 맡은 바 과업을 안정적으로 이행하고, 팀 내 협업을 강화하여 신뢰받는 ${role} 담당자로 성장하겠습니다.`
:
`[직무 수행 역량]
${role} 직무 수행에서 가장 중요한 가치는 정확한 업무 처리와 책임감이라고 확신합니다.
저는 "${baseExp}" 경험을 바탕으로 해당 직무에 필요한 기본기와 실무 문제 해결 능력을 다졌습니다.

[향후 계획]
주어진 업무 체계를 완벽히 숙지하여 조직 목표 달성에 직접적으로 기여하는 인재가 되겠습니다.`;

    $('autoResumeDraft').textContent = autoResume;
    $('autoLetterDraft').textContent = autoLetter;
  }

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

    generateDrafts(currentMode, role, level, evidence, mainText, postText);

    const keys = roleMap[role] || roleMap['기타'];
    const postWords = unique(words(postText));
    
    const found = (currentMode === 'match' && postText)
      ? unique([...postWords.filter(w => all.includes(w)), ...keys.filter(w => postText.includes(w))]).slice(0, 6)
      : keys.slice(0, 5);

    const match = found.filter(w => all.includes(w));
    const nums = (all.match(/\d+[.,]?\d*\s*(%|명|건|회|개월|시간|원|개)/g) || []).length;
    const verbs = (all.match(/(기획|관리|개선|분석|운영|협업|제작|지원|해결|달성|조율|작성|정리|점검)/g) || []).length;

    const score = Math.max(50, Math.min(98, Math.round(
      52 + (currentMode === 'match' ? match.length * 9 : keys.filter(w => all.includes(w)).length * 7) + nums * 4 + verbs * 2
    )));

    $('roleLabel').textContent = role;
    $('matchScore').textContent = score;

    const ring = document.querySelector('.ring');
    if (ring) {
      ring.style.background = `conic-gradient(#66B2FF ${score * 3.6}deg, #001122 0deg)`;
    }

    $('resultSummary').textContent = currentMode === 'match'
      ? '목표 채용공고의 요구역량을 바탕으로 도출된 맞춤 합격 전략입니다.'
      : '대한상공회의소 희망 직무 표준 기준으로 분석된 결과입니다.';

    $('mainAction').textContent = nums < 1
      ? '실무 성과에 정량적 수치(건수, 비율, 대상)를 추가해 보세요.'
      : currentMode === 'match' && match.length < 2
      ? '공고의 주요 핵심 키워드를 자소서 서두에 전면 배치하세요.'
      : '자동 생성된 초안을 바탕으로 세부 에피소드를 다듬어 보세요.';

    $('scoreCaption').textContent = (currentMode === 'match' && postText)
      ? `목표 공고 키워드 ${found.length}개 중 ${match.length}개가 지원서에 반영되어 있습니다.`
      : `${role} 직무 표준 핵심 역량 항목을 바탕으로 평가되었습니다.`;

    $('keywords').innerHTML = found.map(x => `<span>${x}</span>`).join('');
    $('keywordNote').textContent = currentMode === 'match'
      ? '공고에 쓰인 직무 단어를 이력서 항목에 동일하게 활용하는 것이 유리합니다.'
      : '채용공고 맞춤 모드를 활용하시면 특정 기업 공고 기준의 분석이 가능합니다.';

    const strengths = [];
    if (nums) strengths.push(`정량적 수치 표현 ${nums}개가 확인되어 객관적 신뢰도가 높습니다.`);
    if (verbs >= 2) strengths.push('주도적인 행동 동사가 잘 드러나 실무 실행력이 향상되어 보입니다.');
    if (match.length >= 1) strengths.push(`‘${match.slice(0, 2).join('’, ‘')}’ 관련 핵심 직무 경험이 선명합니다.`);
    list('strengths', (strengths.length ? strengths : ['수치 성과를 추가하시면 경험의 가치가 높아집니다.']).slice(0, 3));

    const improve = [];
    if (currentMode === 'match' && match.length < 2) {
      improve.push(`공고 연관 키워드가 부족합니다. ${found.slice(0, 3).join('·')} 관련 사례를 작성해 보세요.`);
    }
    if (nums < 1) improve.push('숫자, 비율, 기간, 구체적 결과 단위를 보완하세요.');
    list('priorities', (improve.length ? improve : ['전반적인 구성이 양호합니다. 생성된 서류 초안을 직접 활용하세요.']).slice(0, 3));

    const key = found[0] || keys[0];
    $('rewriteGuide').innerHTML = `<b>문장 작성 공식</b> · [구체적 상황] ➔ [본인의 주도적 행동] ➔ [정량적 성과] ➔ [직무 기여점]<br><br><b>개선 예시</b> · “${key} 업무를 담당함” ➔ “○○ 프로젝트에서 ${key} 과업을 담당하여, 처리 시간을 20% 단축하고 오류 발생률 0% 달성”`;

    list('questions', [
      '해당 경험에서 본인이 직접 문제 상황을 해결한 구체적인 계기는 무엇인가요?',
      '성과를 증명할 수 있는 정량적 수치 지표가 더 존재하나요?',
      currentMode === 'match' ? `공고의 핵심역량인 ‘${found[0] || '직무역량'}’을 실제 업무에서 어떻게 발휘할 계획인가요?` : '입사 후 해당 경험을 어떻게 적용할 것인가요?'
    ]);
  }

  $('analyzeButton')?.addEventListener('click', () => {
    const allText = `${$('resume').value}${$('letter').value}${$('extractedPdfText').value}${$('evidence').value}`.trim();
    if (!allText) {
      alert('경험 내용을 입력하시거나 PDF 문서를 첨부해 주세요.');
      return;
    }
    show(3);
    $('feedback').hidden = true;
    $('loading').hidden = false;

    let i = 0;
    const messages = [
      '대한상공회의소 AI가 PDF 및 입력 데이터를 파싱 중입니다...',
      '채용공고 요구 역량 매칭 진단 중...',
      '맞춤형 이력서 및 자기소개서 초안 생성 완료 중...'
    ];

    const timer = setInterval(() => {
      $('loadText').textContent = messages[i++ % messages.length];
    }, 500);

    setTimeout(() => {
      clearInterval(timer);
      render();
      $('loading').hidden = true;
      $('feedback').hidden = false;
    }, 1400);
  });

  $('restartButton')?.addEventListener('click', () => {
    show(1);
    $('start')?.scrollIntoView({ behavior: 'smooth' });
  });

  $('copyButton')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('feedback').innerText);
      $('copyButton').textContent = '✓ 복사 완료';
      setTimeout(() => { $('copyButton').textContent = '📋 전체 결과 복사'; }, 1500);
    } catch {
      alert('결과를 선택해 복사해 주세요.');
    }
  });
});