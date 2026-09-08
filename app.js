:root {
  --navy: #003366;
  --blue: #0055B8;
  --sky: #EBF3FC;
  --light-bg: #F4F7FA;
  --white: #FFFFFF;
  --ink: #1E293B;
  --gray: #64748B;
  --line: #CBD5E1;
  --shadow: 0 10px 25px -5px rgba(0, 51, 102, 0.1), 0 8px 10px -6px rgba(0, 51, 102, 0.05);
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; }
body { background: var(--light-bg); color: var(--ink); line-height: 1.6; }
a.skip { position: absolute; top: -100px; }

/* 헤더 & 로고 */
.site-header { background: var(--white); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
.header-inner { max-width: 1100px; margin: 0 auto; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.brand-text { display: flex; flex-direction: column; }
.korcham-title { font-size: 11px; font-weight: 700; color: var(--navy); letter-spacing: 0.5px; }
.service-title { font-size: 17px; font-weight: 800; color: var(--blue); }
nav a { text-decoration: none; color: var(--gray); font-size: 14px; font-weight: 600; margin-left: 20px; }
.dept-badge { background: var(--sky); color: var(--blue); font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }

/* 히어로 타이틀 */
.title-band { background: linear-gradient(135deg, var(--navy) 0%, #001F3F 100%); color: var(--white); padding: 50px 20px; text-align: center; }
.hero-tag { background: rgba(255,255,255,0.15); color: #80C4FF; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 12px; display: inline-block; margin-bottom: 12px; }
.title-band h1 { font-size: 28px; font-weight: 400; line-height: 1.4; }
.title-band h1 b { color: #66B2FF; font-weight: 800; }
.title-band p { font-size: 14px; color: #D0E4FF; margin-top: 10px; }

.notice { max-width: 1000px; margin: -20px auto 30px; background: var(--white); border-radius: 10px; padding: 15px 20px; display: flex; align-items: center; gap: 15px; box-shadow: var(--shadow); border-left: 5px solid var(--blue); }
.notice-icon { font-size: 20px; }
.notice b { display: block; font-size: 14px; color: var(--navy); }
.notice span { font-size: 12px; color: var(--gray); }

/* 메인 영역 및 모드 선택 */
.service { max-width: 1000px; margin: 0 auto 50px; padding: 0 20px; }
.section-heading { text-align: center; margin-bottom: 25px; }
.section-heading p { font-size: 12px; font-weight: 800; color: var(--blue); }
.section-heading h2 { font-size: 22px; color: var(--navy); }
.section-heading span { font-size: 13px; color: var(--gray); }

.mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
.mode-card { background: var(--white); border: 2px solid #E2E8F0; border-radius: 12px; padding: 20px; cursor: pointer; display: flex; align-items: flex-start; gap: 15px; position: relative; transition: all 0.2s ease; }
.mode-card:hover { border-color: var(--blue); transform: translateY(-3px); box-shadow: var(--shadow); }
.mode-card.selected { border-color: var(--blue); background: #F0F7FF; }
.mode-card input { position: absolute; opacity: 0; }
.card-badge { background: var(--navy); color: var(--white); font-weight: 800; font-size: 12px; padding: 4px 8px; border-radius: 6px; }
.mode-card.selected .card-badge { background: var(--blue); }
.card-content b { display: block; font-size: 16px; color: var(--navy); margin-bottom: 4px; }
.card-content small { font-size: 12px; color: var(--gray); display: block; }
.arrow-icon { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 700; color: var(--blue); }

/* 프로그레스 & 워크스페이스 */
.workspace { background: var(--white); border-radius: 16px; box-shadow: var(--shadow); border: 1px solid var(--line); overflow: hidden; }
.progress { display: flex; align-items: center; justify-content: center; background: #F8FAFC; padding: 20px; border-bottom: 1px solid var(--line); gap: 10px; }
.progress b.step { background: #CBD5E1; color: var(--white); width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.progress b.current-dot { background: var(--blue); }
.progress span.step { font-size: 14px; font-weight: 600; color: var(--gray); }
.progress span.current-label { color: var(--navy); font-weight: 800; }
.progress i { width: 30px; height: 2px; background: var(--line); }

.work-panel { padding: 35px; }
.form-step { display: none; }
.form-step.current { display: block; }
.form-heading { margin-bottom: 25px; }
.form-heading p { font-size: 12px; font-weight: 800; color: var(--blue); }
.form-heading h2 { font-size: 20px; color: var(--navy); }

/* 입력 폼 공통 */
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
label { display: block; font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 15px; }
select, textarea, input[type="file"] { width: 100%; margin-top: 6px; padding: 12px; border: 1px solid var(--line); border-radius: 8px; font-size: 13px; }
textarea { resize: vertical; line-height: 1.5; }
textarea:focus, select:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(0,85,184,0.1); }

/* 탭 및 버튼 UI */
.btn-tab { padding: 8px 16px; font-size: 13px; font-weight: 700; border: 1px solid var(--line); background: var(--light-bg); border-radius: 6px; cursor: pointer; }
.btn-tab.active { background: var(--navy); color: var(--white); border-color: var(--navy); }
.main-tabs { margin-bottom: 15px; }

.posting-box, .input-card, .evidence-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
.box-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.req { color: #E11D48; }

.pdf-upload-zone { background: var(--white); border: 2px dashed var(--line); padding: 20px; border-radius: 8px; text-align: center; }
.file-hint { font-size: 11px; color: var(--gray); margin-top: 5px; }
.status-msg { font-size: 12px; font-weight: 700; color: var(--blue); margin-top: 6px; }

.action-row { display: flex; justify-content: space-between; margin-top: 30px; }
.btn-primary { background: linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%); color: var(--white); border: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; cursor: pointer; }
.btn-secondary { background: var(--white); color: var(--ink); border: 1px solid var(--line); padding: 14px 24px; font-size: 14px; font-weight: 700; border-radius: 8px; cursor: pointer; }
.btn-primary:hover { opacity: 0.95; box-shadow: 0 4px 12px rgba(0,51,102,0.2); }

/* 결과 화면 UI */
.loading { text-align: center; padding: 60px 20px; }
.spinner { width: 45px; height: 45px; border: 4px solid var(--sky); border-top-color: var(--blue); border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 20px; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.result-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
.tag-accent { background: var(--sky); color: var(--blue); font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
.result-head h2 { font-size: 24px; color: var(--navy); margin-top: 4px; }
.btn-copy { background: var(--navy); color: var(--white); border: none; padding: 10px 18px; font-size: 12px; font-weight: 700; border-radius: 6px; cursor: pointer; }

.score-card { background: linear-gradient(135deg, #002244 0%, #004488 100%); color: var(--white); padding: 25px; border-radius: 12px; display: flex; align-items: center; gap: 25px; margin-bottom: 25px; }
.score.ring { width: 80px; height: 80px; border-radius: 50%; background: #001122; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px solid #66B2FF; }
.score.ring b { font-size: 26px; line-height: 1; }
.score.ring span { font-size: 10px; opacity: 0.8; }
.score-info .label { font-size: 12px; color: #80C4FF; }
.score-info h3 { font-size: 18px; margin: 2px 0; }

/* AI 생성 서류 출력 영역 */
.draft-container { background: #FFFFFF; border: 2px solid var(--navy); border-radius: 12px; padding: 25px; margin-bottom: 25px; box-shadow: var(--shadow); }
.draft-header { border-bottom: 2px solid var(--sky); padding-bottom: 12px; margin-bottom: 15px; }
.draft-header h3 { font-size: 16px; color: var(--navy); }
.draft-header span { font-size: 12px; color: var(--gray); }
.draft-section { margin-bottom: 20px; }
.draft-section h4 { font-size: 13px; color: var(--blue); margin-bottom: 6px; }
.draft-body { background: #F8FAFC; border: 1px solid var(--line); border-radius: 8px; padding: 15px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; color: #0F172A; }

.result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.grid-card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 10px; }
.alert-card { background: #FFF5F5; border-color: #FED7D7; }
.wide-card { grid-column: span 2; }
.card-title { font-size: 14px; font-weight: 800; color: var(--navy); margin-bottom: 10px; }

.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.chips span { background: var(--blue); color: var(--white); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px; }
.grid-card ul { padding-left: 18px; font-size: 13px; color: var(--ink); }
.grid-card li { margin-bottom: 6px; }

.hide { display: none !important; }
footer { background: var(--navy); color: var(--white); padding: 30px 20px; text-align: center; font-size: 12px; opacity: 0.9; margin-top: 50px; }
.footer-inner { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }