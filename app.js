const $ = (id) => document.getElementById(id);
const cleanWords = (text) => (text.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) || []);
const unique = (items) => [...new Set(items)];

const roleHints = {
  "사무행정": ["문서", "자료", "엑셀", "일정", "협업", "행정"],
  "회계·경리": ["회계", "정산", "세금", "엑셀", "증빙", "정확"],
  "영업·마케팅": ["고객", "매출", "홍보", "분석", "기획", "소통"],
  "IT·개발": ["개발", "프로젝트", "데이터", "기술", "협업", "문제"],
  "디자인": ["디자인", "콘텐츠", "사용자", "기획", "포트폴리오", "협업"],
  "서비스·고객응대": ["고객", "응대", "예약", "문제", "소통", "서비스"],
  "기타": ["협업", "문제", "기획", "소통", "성과", "경험"]
};

function score(value) { return Math.max(42, Math.min(96, value)); }
function list(id, items) { $(id).innerHTML = items.map(x => `<li>${x}</li>`).join(""); }
function analyze() {
  const role = $("role").value, posting = $("posting").value.trim(), resume = $("resume").value.trim(), letter = $("letter").value.trim();
  if (!resume && !letter) { $("formHint").textContent = "이력서 또는 자기소개서를 한 항목 이상 입력해 주세요."; $("formHint").style.color = "#d35244"; return; }
  $("formHint").style.color = "";
  const all = `${resume} ${letter}`, words = cleanWords(all), postingWords = unique(cleanWords(posting));
  const hints = roleHints[role];
  const matched = unique(postingWords.filter(w => words.includes(w)));
  const roleMatched = unique(hints.filter(w => all.includes(w)));
  const numbers = (all.match(/\d+[.,]?\d*\s*(%|명|건|회|개월|시간|원|개)/g) || []).length;
  const actionWords = (all.match(/(기획|관리|개선|분석|운영|협업|제작|지원|해결|달성|조율|작성)/g) || []).length;
  const sentences = letter.split(/[.!?。\n]+/).filter(x => x.trim().length > 8);
  const average = sentences.length ? Math.round(letter.replace(/\s/g, "").length / sentences.length) : 0;
  const matchScore = posting ? score(48 + matched.length * 8 + roleMatched.length * 4) : score(54 + roleMatched.length * 6);
  const detailScore = score(42 + numbers * 10 + actionWords * 3 + (resume.length > 300 ? 8 : 0));
  const clarityScore = score(82 - (average > 110 ? 15 : 0) - (average && average < 25 ? 8 : 0) + (sentences.length > 3 ? 4 : 0));
  $("roleLabel").textContent = role; $("matchScore").innerHTML = `${matchScore}<small>점</small>`; $("detailScore").innerHTML = `${detailScore}<small>점</small>`; $("clarityScore").innerHTML = `${clarityScore}<small>점</small>`;
  $("matchCaption").textContent = posting ? `${matched.length}개의 공고 핵심어가 반영됐어요` : "직무 핵심어 기준으로 확인했어요";
  $("detailCaption").textContent = numbers ? `성과를 보여 주는 수치 ${numbers}개를 찾았어요` : "수치·기간·대상을 더해 보세요";
  $("clarityCaption").textContent = average > 110 ? "긴 문장을 나누면 더 읽기 쉬워요" : "읽기 좋은 문장 흐름이에요";
  $("summary").textContent = `${$("level").value} ${role} 지원자를 위한 우선 수정 방향입니다.`;
  const priorities = [];
  if (!posting) priorities.push("채용공고의 담당업무와 자격요건을 붙여 넣으면 훨씬 구체적인 맞춤 피드백을 받을 수 있어요.");
  if (numbers < 2) priorities.push("경험의 결과를 수치로 보여 주세요. 예: ‘참여했다’ 대신 ‘20명의 자료를 정리해 오류 0건으로 관리했다’처럼 작성합니다.");
  if (roleMatched.length < 2) priorities.push(`지원 직무와 연결되는 역량을 명시해 보세요. ${hints.slice(0,3).join("·")} 관련 경험을 우선 배치하면 좋습니다.`);
  if (average > 110) priorities.push("자기소개서에 긴 문장이 있습니다. 한 문장에는 하나의 행동과 결과만 남기고 2문장으로 나눠 보세요.");
  if (!letter) priorities.push("자기소개서도 함께 입력하면 경험의 맥락과 직무 연결성을 더 정확히 점검할 수 있어요.");
  if (!priorities.length) priorities.push("지원 직무와 연결된 경험이 잘 드러납니다. 이제 각 경험의 역할·과정·결과를 한 번 더 검토해 보세요.");
  list("priorities", priorities.slice(0,4));
  const strengths = [];
  if (numbers) strengths.push("경험을 객관화하는 수치 또는 기간이 포함되어 있어 설득력을 높여 줍니다.");
  if (actionWords >= 2) strengths.push("직접 수행한 행동이 드러나, 단순 참여보다 주도적인 인상을 줍니다.");
  if (matched.length >= 2) strengths.push(`채용공고의 표현 중 ‘${matched.slice(0,3).join("’, ‘")}’을(를) 지원서에 자연스럽게 반영했습니다.`);
  if (letter.length >= 350) strengths.push("자기소개서에 경험의 맥락이 비교적 충분히 담겨 있습니다.");
  if (!strengths.length) strengths.push("입력한 내용을 바탕으로 핵심 경험을 정리 중입니다. 역할과 결과를 구체화하면 강점이 더 선명해집니다.");
  list("strengths", strengths.slice(0,4));
  const example = role === "사무행정" ? "‘문서 관리 업무를 수행했습니다.’ → ‘교육 운영 자료 45건을 엑셀로 분류·관리하고, 누락 항목을 점검해 담당자의 확인 시간을 줄였습니다.’" : `‘${role} 업무에 관심이 있습니다.’ → ‘관련 과제에서 맡은 역할, 사용한 방법, 확인 가능한 결과를 순서대로 제시해 직무 준비도를 보여 주세요.’`;
  $("rewriteGuide").innerHTML = `<strong>경험 문장 공식</strong> · 상황/목표 → 내가 한 행동 → 결과 → 지원 직무와의 연결<br><br>${example}`;
  list("questions", ["이 경험에서 본인이 혼자 결정하거나 책임진 부분은 무엇인가요?", "지원 직무에서 이 경험을 어떻게 활용할 수 있나요?", "결과를 확인할 수 있는 수치·기간·대상은 더 없나요?"]);
  $("result").hidden = false; $("result").scrollIntoView({behavior:"smooth", block:"start"});
}
$("analyzeButton").addEventListener("click", analyze);
$("restartButton").addEventListener("click", () => $("form").scrollIntoView({behavior:"smooth"}));
$("sampleButton").addEventListener("click", () => { $("role").value="사무행정"; $("posting").value="담당업무: 교육과정 운영 지원, 문서 작성 및 자료 관리, 수강생 안내. 자격요건: 엑셀 활용 능력, 정확한 행정 처리, 원활한 소통 능력."; $("resume").value="교육 운영 보조 경험\n- 수강생 35명의 출결 자료를 엑셀로 관리하고 매일 누락 여부를 점검\n- 안내 문자를 작성·발송하고 문의사항을 응대\n- 컴퓨터활용능력 2급 보유"; $("letter").value="교육 프로그램 운영을 보조하며 정확한 자료 관리가 참여자의 만족도와 직결된다는 점을 배웠습니다. 저는 매일 출결 자료를 확인하고 누락 정보를 담당자에게 공유했습니다. 특히 문의가 반복되는 항목을 정리해 안내문을 개선했고, 수강생이 일정 정보를 쉽게 확인하도록 도왔습니다. 이 경험을 바탕으로 꼼꼼한 행정 지원과 원활한 소통을 실천하겠습니다."; $("formHint").textContent="예시 자료가 입력되었습니다. ‘맞춤 피드백 받기’를 눌러 보세요."; });
$("copyButton").addEventListener("click", async () => { const text = $("result").innerText; try { await navigator.clipboard.writeText(text); $("copyButton").textContent="복사 완료"; setTimeout(()=>$("copyButton").textContent="결과 복사",1600); } catch { alert("결과를 직접 선택해 복사해 주세요."); } });
