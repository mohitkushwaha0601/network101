'use strict';
const paths={
overview:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
roadmap:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',
map:'<path d="M12 8v4m-7 5v-5h14v5"/><rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="4" rx="1"/><rect x="16" y="17" width="6" height="4" rx="1"/>',
labs:'<path d="M9 3h6m-5 0v7l-6 9a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3M8 15h8"/>',
quizzes:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m8 9 2 2 4-4m-6 9h8"/>',
review:'<path d="M3 11a9 9 0 1 1 2 7M3 6v5h5m4-4v5l3 2"/>',
notes:'<path d="M5 3h10l4 4v14H5zM15 3v5h4M8 12h8m-8 4h8"/>',
progress:'<path d="M4 20h17M7 16v-5m5 5V7m5 9V3"/>',
arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>'
};
const navigation=[['overview','Overview'],['roadmap','Roadmap'],['map','Dependency map'],['labs','Labs'],['quizzes','Quizzes'],['review','Spaced review'],['notes','Notes'],['progress','Progress']];
const key='network-atlas-v1';
let state={};
try {state=JSON.parse(localStorage.getItem(key))||{}} catch {}
for(const field of ['lesson','lab','quiz','review','notes']) state[field] ||= {};
let storageError=false;
const app=document.querySelector('#app');
const byId=Object.fromEntries(topics.map(t=>[t[0],t]));
const icon=n=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+paths[n]+'</svg>';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=(n,d)=>d?Math.round(100*n/d):0;
const href=(id,tab='lesson')=>'#topic/'+id+'/'+tab;
const link=(id,tab)=>'<a href="'+href(id,tab)+'">'+esc(byId[id][1])+'</a>';
const mark=(n)=>'<div class="bar" role="progressbar" aria-label="Completion" aria-valuenow="'+n+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+n+'%"></i></div>';
const button=(label,url,primary=false)=>'<a class="button '+(primary?'primary':'')+'" href="'+url+'">'+label+'</a>';
const page=(title,desc)=>'<div class="page-head"><h1>'+title+'</h1><p>'+desc+'</p></div>';
const total=field=>topics.filter(t=>state[field][t[0]]).length;
const localDay=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()};
const due=()=>topics.filter(t=>state.review[t[0]]?.date<=localDay());
const dateLabel=value=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(value);
const stat=(name,value,label)=>'<div class="stat"><span class="stat-icon">'+icon(name)+'</span><div><strong>'+value+'</strong><small>'+label+'</small></div></div>';
function save(){
  try {localStorage.setItem(key,JSON.stringify(state));storageError=false}
  catch {storageError=true}
}
function enroll(id){
  state.review[id] ||= {level:0,date:localDay()};
}
function phaseStats(i){
  const list=topics.filter(t=>t[2]===i);
  return [list.filter(t=>state.lesson[t[0]]).length,list.length];
}
const chart='<svg class="hero-art" viewBox="0 0 475 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#61e6c1" opacity=".26" stroke="none"/></pattern></defs><path d="M0 0H475V250H0z" fill="url(#dots)" stroke="none"/><g stroke="#4ba998" opacity=".65"><path d="M45 123H425M125 123l94-75h125m-94 75-31 76h125m31-76 50-75m-50 75 50 76" stroke-dasharray="4 5"/><circle cx="250" cy="123" r="53"/><circle cx="250" cy="123" r="67" opacity=".28"/></g><g fill="#113036"><rect x="88" y="106" width="72" height="34" rx="6"/><rect x="216" y="106" width="68" height="34" rx="6"/><rect x="340" y="106" width="72" height="34" rx="6"/><rect x="312" y="34" width="63" height="28" rx="6"/><rect x="312" y="185" width="63" height="28" rx="6"/></g><g fill="#a5fee7" stroke="none" font-family="monospace" text-anchor="middle" font-size="11"><text x="124" y="127">CLIENT</text><text x="250" y="127">EDGE</text><text x="376" y="127">ORIGIN</text><text x="344" y="52">DNS</text><text x="344" y="203">CI/CD</text></g></svg>';
function dashboard(){
  const next=topics.find(t=>!state.lesson[t[0]])||topics[topics.length-1];
  const active=total('lesson')>0;
  return '<section class="hero">'+chart+'<div class="herocopy"><span class="eyebrow">Cloud & deployment engineering</span><h1>Networking mastery</h1><p>Follow a request from the browser to a private workload. Build the fundamentals behind AWS, Azure, and GitHub Actions deployments.</p><div class="hero-actions">'+button((active?'Continue learning':'Start learning')+' '+icon('arrow'),href(next[0]),true)+button('Explore dependency map','#map')+'</div></div></section>'+
  '<div class="grid stats">'+stat('roadmap',total('lesson')+'/'+topics.length,'Lessons complete')+stat('labs',total('lab')+'/'+topics.length,'Labs complete')+stat('quizzes',total('quiz')+'/'+topics.length,'Quizzes passed')+stat('review',due().length,'Reviews due')+'</div>'+
  '<div class="grid split"><section><div class="section-h"><h2>Learning roadmap</h2><a href="#roadmap">View full roadmap →</a></div><div class="phase-list">'+phases.map((p,i)=>{const [n,d]=phaseStats(i);return '<a class="phase" href="#roadmap/p'+i+'"><span class="phase-icon '+p[2]+'">0'+(i+1)+'</span><div class="phase-info"><h3>'+p[0]+'</h3><p class="small">'+p[1]+'</p></div><div class="phase-meta">'+mark(pct(n,d))+n+'/'+d+' '+icon('arrow')+'</div></a>'}).join('')+'</div></section>'+
  '<aside class="stack"><div class="section-h" style="margin-bottom:0"><h2>Study queue</h2></div><div class="card"><span class="tag good">'+(active?'Up next':'First lesson')+'</span><h3 class="padtop">'+next[1]+'</h3><p>'+phases[next[2]][0]+'</p><div class="actions">'+button('Open lesson '+icon('arrow'),href(next[0]))+'</div></div><div class="card"><h3>Spaced review</h3><p>'+ (due().length?due().length+' topic(s) ready for recall.':'Finish a lesson or pass a quiz to add a topic to your queue.')+'</p><div class="actions">'+button('Open review queue','#review')+'</div></div></aside></div>';
}
function roadmap(selection){
  return page('Learning roadmap','Work through four phases, or jump directly to a topic you want to practise.')+
  '<label for="topic-filter" class="small">Filter topics</label><input id="topic-filter" class="filter" type="search" placeholder="Search DNS, routing, Linux…">'+
  '<div class="grid tiles">'+phases.map((p,i)=>'<section class="card" id="p'+i+'" '+(selection==='p'+i?'style="border-color:#4f948a"':'')+'><span class="eyebrow">Phase 0'+(i+1)+'</span><h2>'+p[0]+'</h2><p>'+p[1]+'</p>'+topics.filter(t=>t[2]===i).map(t=>'<div class="row topic-row" data-title="'+esc(t[1].toLowerCase())+'">'+link(t[0])+'<span class="tag '+(state.lesson[t[0]]?'good':'')+'">'+(state.lesson[t[0]]?'Complete':'Lesson')+'</span></div>').join('')+'</section>').join('')+'</div><p id="no-results" hidden>No matching topics.</p>';
}
function map(selected){
  const t=byId[selected]||topics[0], id=t[0];
  const downstream=topics.filter(other=>other[3].includes(id));
  const connections=(ids,empty)=>ids.length?ids.map(x=>'<a class="button" href="#map/'+x+'">'+esc(byId[x][1])+'</a>').join(''):'<p>'+empty+'</p>';
  return page('Dependency map','Select a topic to see what it builds on and which topics use it next. Prerequisites suggest a study order.')+
  '<div class="card map-results" aria-live="polite"><div class="section-h"><h2>'+esc(t[1])+'</h2>'+button('Open lesson '+icon('arrow'),href(id),true)+'</div><div class="grid tiles"><div><h3>Prerequisites →</h3>'+connections(t[3],'Start here. This topic has no prerequisites.')+'</div><div><h3>→ Builds toward</h3>'+connections(downstream.map(x=>x[0]),'This topic completes the roadmap.')+'</div></div></div>'+
  '<div class="map-group padtop">'+phases.map((p,i)=>'<section class="card"><span class="eyebrow">Phase 0'+(i+1)+'</span><h3>'+p[0]+'</h3>'+topics.filter(x=>x[2]===i).map(x=>'<a class="button node '+(x[0]===id?'selected':'')+'" '+(x[0]===id?'aria-current="true"':'')+' href="#map/'+x[0]+'">'+esc(x[1])+'</a>').join('')+'</section>').join('')+'</div>';
}
function listing(tab){
  const isLab=tab==='labs', dest=isLab?'lab':'quiz';
  return page(isLab?'Hands-on labs':'Topic quizzes',isLab?'Practise with local tools and design simulations. Each lab includes an expected result.':'Test a concept from each module. A correct answer records a pass and adds the topic to spaced review.')+
    '<div class="grid tiles">'+topics.map(t=>'<article class="card"><div class="section-h"><span class="eyebrow">'+phases[t[2]][0]+'</span><span class="tag '+(state[dest][t[0]]?'good':'')+'">'+(state[dest][t[0]]?'Complete':isLab?(t[11]?'Local terminal':t[0]==='subnet'?'Interactive':'Guided exercise'):'1 question')+'</span></div><h3><a class="tile-title" href="'+href(t[0],dest)+'">'+esc(t[1])+'</a></h3><p>'+esc(isLab?t[6][0]:t[8])+'</p><div class="actions">'+button(isLab?'Open lab':'Take quiz',href(t[0],dest))+'</div></article>').join('')+'</div>';
}
function subnet(){
  return '<form class="card padtop" id="subnet"><h3>IPv4 subnet sandbox</h3><div class="grid tiles"><label>Parent CIDR<input name="cidr" value="10.42.0.0/24" required></label><label>Child prefix<input name="prefix" type="number" value="26" min="0" max="32" required></label></div><div class="actions"><button type="submit">Split subnet</button></div><pre id="subnet-result" aria-live="polite">Enter a CIDR and a child prefix.</pre></form>';
}
function renderSubnet(form){
  const data=new FormData(form), match=String(data.get('cidr')).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  const out=document.querySelector('#subnet-result');
  const prefix=Number(data.get('prefix'));
  if(!match||match.slice(1,5).some(n=>Number(n)>255)||Number(match[5])>32||!Number.isInteger(prefix)||prefix<Number(match[5])||prefix>32){out.textContent='Enter a valid IPv4 CIDR and a child prefix between the parent prefix and 32.';return}
  const parent=Number(match[5]), size=2**(32-prefix), parentSize=2**(32-parent);
  const ip=match.slice(1,5).reduce((n,b)=>n*256+Number(b),0);
  if(ip%parentSize){out.textContent='Use the parent network address. The supplied address has host bits set.';return}
  const fmt=n=>[24,16,8,0].map(s=>(n>>>s)&255).join('.');
  const count=parentSize/size;
  out.textContent=count+' block(s), '+size+' total addresses each'+(count>16?' · showing the first 16':'')+'\n\n'+Array.from({length:Math.min(16,count)},(_,i)=>fmt(ip+i*size)+'/'+prefix+'  →  '+fmt(ip+(i+1)*size-1)).join('\n');
}
function quiz(t){
  const order=t[0].split('').reduce((n,c)=>n+c.charCodeAt(0),0)%3;
  const choices=t[9].map((_,i)=>(i+order)%3);
  return '<form id="quiz" class="card lesson" data-id="'+t[0]+'"><fieldset><legend>'+esc(t[8])+'</legend>'+choices.map(i=>'<label class="choice"><input type="radio" name="answer" value="'+i+'" required> '+esc(t[9][i])+'</label>').join('')+'</fieldset><button class="primary" type="submit">Check answer</button><p id="feedback" aria-live="polite">'+(state.quiz[t[0]]?'Previously passed.':'')+'</p></form>';
}
function notes(id='general'){
  if(id!=='general'&&!byId[id]) id='general';
  const options=[['general','General notes'],...topics.map(t=>[t[0],t[1]])];
  return '<section class="card panel"><label for="note-topic">Notebook</label><select id="note-topic">'+options.map(([key,title])=>'<option value="'+key+'" '+(key===id?'selected':'')+'>'+esc(title)+'</option>').join('')+'</select><label for="note" class="small">Write observations, commands, hypotheses, or questions to verify.</label><textarea id="note" data-id="'+id+'" placeholder="What did you observe? What would you verify next?">'+esc(state.notes[id])+'</textarea><div class="actions"><button data-action="save-note" class="primary">Save note</button><button data-action="export">Export notes</button></div><p id="note-status" role="status"></p></section>';
}
function moduleView(t,tab){
  const [id,title,phase,deps,lesson,scenario,steps,expected]=t;
  const tabs=['lesson','lab','quiz','notes'];
  const self='<span class="eyebrow">Phase 0'+(phase+1)+' · '+phases[phase][0]+'</span>'+page(esc(title),deps.length?'Suggested prerequisites · '+deps.map(x=>link(x)).join(' · '):'Start here, or revisit this lesson any time.');
  const header=self+'<div class="tabs" style="margin:-6px 0 15px">'+tabs.map(x=>'<a class="button" '+(tab===x?'aria-current="page"':'')+' href="'+href(id,x)+'">'+x[0].toUpperCase()+x.slice(1)+'</a>').join('')+'</div>';
  const toggle=(field,label)=>'<button class="'+(state[field][id]?'':'primary')+'" data-action="toggle" data-field="'+field+'" data-id="'+id+'">'+(state[field][id]?'✓ '+label+' complete · Undo':'Mark '+label.toLowerCase()+' complete')+'</button>';
  if(tab==='notes')return header+notes(id);
  if(tab==='quiz')return header+'<div class="panel">'+quiz(t)+'</div>';
  if(tab==='lab')return header+'<div class="panel stack"><section class="card lesson"><h2>Practice</h2><ol>'+steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>'+(t[11]?'<pre>'+esc(t[11])+'</pre>':'')+(id==='subnet'?subnet():'')+'<h3 class="padtop">Expected result</h3><p>'+esc(expected)+'</p><div class="actions">'+toggle('lab','Lab')+'</div></section></div>';
  return header+'<div class="panel stack"><section class="card lesson"><h2>Core concept</h2><p>'+esc(lesson)+'</p></section><section class="card lesson"><h2>Deployment scenario</h2><p>'+esc(scenario)+'</p><div class="padtop"><span class="tag warn">Verify in your environment</span><p class="padtop">Examples use sample topologies. Your DNS, routes, runner placement, cloud region and access rules are unverified.</p></div>'+(refs[id]?'<div class="padtop">'+refs[id].map(([label,url])=>'<p><a href="'+url+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a></p>').join('')+'</div>':'')+'<div class="actions">'+toggle('lesson','Lesson')+button('Open lab '+icon('arrow'),href(id,'lab'))+'</div></section></div>';
}
function review(){
  const pending=due();
  const later=topics.filter(t=>state.review[t[0]]?.date>localDay()).sort((a,b)=>state.review[a[0]].date-state.review[b[0]].date);
  return page('Spaced review','Recall the answer before revealing it. Successful recalls schedule a review in 1, 3, 7, 14, then 30 days. A missed recall resets to tomorrow.')+
    '<div class="stack panel"><h2>Due today · '+pending.length+'</h2>'+(pending.length?pending.map(t=>'<article class="card"><span class="eyebrow">'+esc(t[1])+'</span><h3>'+esc(t[8])+'</h3><details><summary>Reveal answer and rate recall</summary><p class="feedback">'+esc(t[9][0])+' · '+esc(t[10])+'</p><div class="actions"><button data-action="rate" data-id="'+t[0]+'" data-result="again">Again</button><button class="primary" data-action="rate" data-id="'+t[0]+'" data-result="good">Recalled</button></div></details></article>').join(''):'<div class="card"><p>You have no reviews due. Complete a lesson or pass a quiz to add it here.</p></div>')+
    '<section class="card"><h2>Upcoming · '+later.length+'</h2>'+(later.length?later.map(t=>'<div class="row">'+link(t[0])+'<time>'+dateLabel(state.review[t[0]].date)+'</time></div>').join(''):'<p>No reviews scheduled yet.</p>')+'</section></div>';
}
function progress(){
  return page('Progress dashboard','Track completed lessons and labs, quiz passes, and scheduled reviews.')+
  '<div class="grid stats">'+stat('roadmap',pct(total('lesson'),topics.length)+'%','Lessons complete')+stat('labs',total('lab')+'/'+topics.length,'Labs complete')+stat('quizzes',total('quiz')+'/'+topics.length,'Quizzes passed')+stat('review',due().length,'Reviews due')+'</div>'+
  '<div class="grid tiles">'+phases.map((p,i)=>{const [n,d]=phaseStats(i);return '<section class="card"><h2>'+p[0]+'</h2>'+mark(pct(n,d))+topics.filter(t=>t[2]===i).map(t=>'<div class="row">'+link(t[0])+'<span class="small">'+[['lesson','Lesson'],['lab','Lab'],['quiz','Quiz']].map(([field,label])=>(state[field][t[0]]?'✓ ':'○ ')+label).join(' · ')+'</span></div>').join('')+'</section>'}).join('')+'</div>';
}
function render(focus=true){
  const [view='overview',id,tab]=location.hash.slice(1).split('/'); 
  const screen=byId[id]&&view==='topic'?'topic':navigation.some(x=>x[0]===view)?view:'overview';
  const active=screen==='topic'?'roadmap':screen;
  document.querySelector('#nav').innerHTML=navigation.map(([name,label],i)=>(i===0?'<span class="nav-label">Learn</span>':i===5?'<span class="nav-label">Your practice</span>':'')+'<a class="nav-link" href="#'+name+'" '+(active===name?'aria-current="page"':'')+'>'+icon(name)+label+'</a>').join('');
  const label=screen==='topic'?byId[id][1]:navigation.find(x=>x[0]===screen)[1];
  document.querySelector('#crumb').textContent=label;
  document.title=label+' · Network Atlas';
  const views={overview:dashboard,roadmap:()=>roadmap(id),map:()=>map(id),labs:()=>listing('labs'),quizzes:()=>listing('quizzes'),review,progress,notes:()=>page('Study notes','Keep your deployment observations and open questions together.')+notes(id),topic:()=>moduleView(byId[id],tab||'lesson')};
  app.innerHTML=(storageError?'<p class="error">Browser storage is unavailable. Changes currently last only for this session.</p>':'')+views[screen]();
  if(focus){window.scrollTo(0,0);app.focus({preventScroll:true})}
  if(screen==='roadmap'&&/^p[0-3]$/.test(id))document.getElementById(id)?.scrollIntoView({block:'nearest'});
}
app.addEventListener('click',e=>{
  const target=e.target.closest('button[data-action]');
  if(!target)return;
  const {action,id,field,result}=target.dataset;
  if(action==='toggle'){
    if(state[field][id])delete state[field][id];
    else {state[field][id]=true;if(field==='lesson')enroll(id)}
    save();render(false);app.querySelector('button[data-action="toggle"]')?.focus();
  }
  if(action==='rate'){
    const item=state.review[id];
    if(!item||item.date>localDay())return;
    const intervals=[1,3,7,14,30];
    const level=Math.min(item.level,intervals.length-1);
    const date=new Date(localDay());
    date.setDate(date.getDate()+(result==='good'?intervals[level]:1));
    state.review[id]={level:result==='good'?level+1:0,date:date.getTime()};
    save();render(false);app.focus();
  }
  if(action==='save-note'){
    const area=document.querySelector('#note');
    state.notes[area.dataset.id]=area.value;save();
    document.querySelector('#note-status').textContent=storageError?'Saved for this session. Browser storage is unavailable.':'Note saved.';
  }
  if(action==='export'){
    const content=Object.entries(state.notes).filter(([,value])=>value.trim()).map(([noteId,value])=>'## '+(byId[noteId]?.[1]||'General notes')+'\n\n'+value).join('\n\n');
    if(!content){document.querySelector('#note-status').textContent='Save a note to include it in the export.';return}
    const url=URL.createObjectURL(new Blob(['# Network Atlas notes\n\n'+content+'\n'],{type:'text/markdown'}));
    const a=document.createElement('a');a.href=url;a.download='network-atlas-notes.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
});
app.addEventListener('submit',e=>{
  e.preventDefault();
  if(e.target.id==='subnet'){renderSubnet(e.target);return}
  if(e.target.id!=='quiz')return;
  const id=e.target.dataset.id, ok=new FormData(e.target).get('answer')==='0';
  if(ok){state.quiz[id]=true;enroll(id);save()}
  const feedback=document.querySelector('#feedback');
  feedback.className='feedback';
  feedback.textContent=(ok?'Correct. ':'Try again. ')+(ok?byId[id][10]:'Revisit the core concept and choose another answer.')+(storageError?' Progress is saved for this session only.':'');
});
app.addEventListener('input',e=>{
  if(e.target.id!=='topic-filter')return;
  const query=e.target.value.trim().toLowerCase();
  let count=0;
  app.querySelectorAll('.topic-row').forEach(row=>{row.hidden=!row.dataset.title.includes(query);if(!row.hidden)count++});
  document.querySelector('#no-results').hidden=count!==0;
});
app.addEventListener('change',e=>{
  if(e.target.id!=='note-topic')return;
  location.hash='#notes/'+e.target.value;
});
window.addEventListener('hashchange',()=>render());
render(false);
