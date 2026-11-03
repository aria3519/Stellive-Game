'use client';
import {useEffect,useRef,useState} from 'react';
import {Swords,Users,Map as MapIcon,RotateCcw,Save,Heart,Shield,Flame,Sparkles,ChevronRight,ChevronLeft,Trophy,House,ShoppingBag,Gift,Mail,Bell,Gem,Coins,Zap,Star,Check,X,Skull,Crown} from 'lucide-react';

type Kind='attack'|'heal'|'shield';
type Hero={id:number;name:string;job:string;gen:number;hp:number;atk:number;def:number;skill:string;ultimate:string;kind:Kind};
const HEROES:Hero[]=[
{id:1,name:'멤버 01',job:'성수술사',gen:1,hp:980,atk:120,def:70,skill:'성광의 파동',ultimate:'별빛의 축복',kind:'heal'},
{id:2,name:'멤버 02',job:'용언술사',gen:3,hp:920,atk:165,def:55,skill:'용의 숨결',ultimate:'천공의 포효',kind:'attack'},
{id:3,name:'멤버 03',job:'혈기사',gen:2,hp:1200,atk:155,def:90,skill:'혈월참',ultimate:'붉은 달의 맹세',kind:'attack'},
{id:4,name:'멤버 04',job:'음유시인',gen:2,hp:1020,atk:95,def:65,skill:'치유의 노래',ultimate:'별빛의 합창',kind:'heal'},
{id:5,name:'멤버 05',job:'그림자 도적',gen:2,hp:900,atk:175,def:45,skill:'그림자 습격',ultimate:'고양이의 일격',kind:'attack'},
{id:6,name:'멤버 06',job:'탐험가',gen:2,hp:1040,atk:145,def:65,skill:'약점 간파',ultimate:'보물 사냥',kind:'attack'},
{id:7,name:'멤버 07',job:'기계 사수',gen:3,hp:950,atk:160,def:60,skill:'정밀 사격',ultimate:'전탄 발사',kind:'attack'},
{id:8,name:'멤버 08',job:'신술사',gen:3,hp:970,atk:150,def:65,skill:'여우불',ultimate:'천년의 신역',kind:'shield'},
{id:9,name:'멤버 09',job:'전투 메이드',gen:3,hp:1100,atk:135,def:85,skill:'완벽한 정리',ultimate:'메이드의 결의',kind:'shield'},
{id:10,name:'멤버 10',job:'저격수',gen:3,hp:890,atk:185,def:45,skill:'약점 조준',ultimate:'필중의 탄환',kind:'attack'},
{id:11,name:'멤버 11',job:'용사',gen:3,hp:1150,atk:160,def:80,skill:'용사의 일격',ultimate:'되찾은 성검',kind:'attack'}];
const CHAPTERS=[{title:'프롤로그 · 별이 사라진 밤',text:'별빛이 사라진 밤, 오래된 성역에서 불길한 균열이 발견되었다. 세 명의 동료가 균열의 원인을 찾아 길을 나선다.',npc:'수호자',line:'“성역 깊은 곳에 잠든 그림자가 깨어나고 있습니다. 부디 조심하세요.”'},{title:'제1장 · 잊힌 숲',text:'안개가 내려앉은 숲길. 낯선 발자국과 부서진 수정 조각이 이어진다. 동료들은 조용히 무기를 꺼내 든다.',npc:'숲의 안내인',line:'“이 앞에는 그림자 수호자가 있습니다. 승리해야 다음 길이 열릴 거예요.”'},{title:'제2장 · 심연의 성역',text:'수호자를 물리치자 봉인된 성역의 문이 열렸다. 검은 빛이 새어 나오고, 최후의 적이 기다린다.',npc:'고대의 기록자',line:'“여기까지 온 자들이여, 마지막 시련을 이겨 내십시오.”'}];
const KIND={attack:{label:'딜러',Icon:Swords},heal:{label:'힐러',Icon:Heart},shield:{label:'수호',Icon:Shield}};
const GEN_COLOR=['','#ffd36b','#c29bff','#7cc4ff'];

type Screen='lobby'|'chars'|'story'|'map'|'battle'|'victory'|'defeat';
type Game={party:number[];lead:number;chapter:number;gold:number;enemyHp:number;hp:Record<number,number>;sp:number;energy:Record<number,number>;used:number[];turn:number;shield:number;intent:'aoe'|'smash';screen:Screen};
type Float={id:number;text:string;kind:string;x:number;y:number};

const H=(id:number)=>HEROES.find(h=>h.id===id)!;
const fill=(f:(h:Hero)=>number)=>Object.fromEntries(HEROES.map(h=>[h.id,f(h)]));
// images in public/monsters (copied from crpg-studio _default_monsters/fantasy)
const BOSSES=[{name:'심연의 하수인',hp:1800,base:155},{name:'숲 트롤',hp:1800,base:155},{name:'마왕',hp:3200,base:260}];
const bossOf=(c:number)=>BOSSES[Math.min(c,2)];
const initial=():Game=>({party:[3,5,4],lead:3,chapter:0,gold:1200,enemyHp:1800,hp:fill(h=>h.hp),sp:5,energy:fill(()=>0),used:[],turn:1,shield:0,intent:'aoe',screen:'lobby'});
const synergyOf=(ids:number[])=>{const n=Math.max(...[1,2,3].map(gen=>ids.filter(id=>H(id).gen===gen).length));return n>=3?3:n>=2?2:0};
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const SHAKE:Keyframe[]=[{transform:'none'},{transform:'translate(-9px,5px)'},{transform:'translate(8px,-6px)'},{transform:'translate(-6px,3px)'},{transform:'translate(4px,-2px)'},{transform:'none'}];
const anim=(el:Element|null|undefined,k:Keyframe[],ms:number)=>{el?.animate(k,{duration:ms,easing:'ease-out'})};
let floatId=0;

function Portrait({id,className}:{id:number;className?:string}){return <img className={className} src={`/portraits/${id}.png`} alt={`${H(id).name} 이미지`} draggable={false}/>}

export default function Page(){
const [g,setG]=useState<Game>(initial);
const gRef=useRef(g);gRef.current=g;
const [sel,setSel]=useState(3);
const [detail,setDetail]=useState<number|null>(null);
const [genTab,setGenTab]=useState(0);
const [floats,setFloats]=useState<Float[]>([]);
const [cutin,setCutin]=useState<Hero|null>(null);
const [banner,setBanner]=useState('');
const [busy,setBusy]=useState(false);
const [combo,setCombo]=useState(0);
const [slash,setSlash]=useState({key:0,type:'basic'});
const [toast,setToast]=useState('');
const [bubble,setBubble]=useState('');
const arenaRef=useRef<HTMLDivElement>(null);const bossRef=useRef<HTMLDivElement>(null);const heroRefs=useRef<Record<number,HTMLElement|null>>({});

useEffect(()=>{try{const x=localStorage.getItem('stellar-quest-save');if(x)setG({...initial(),...JSON.parse(x),screen:'lobby'})}catch{}},[]);

const go=(screen:Screen)=>setG(v=>({...v,screen}));
const say=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1400)};
const save=()=>{try{localStorage.setItem('stellar-quest-save',JSON.stringify(g));say('저장 완료!')}catch{say('저장 실패')}};
const reset=()=>{if(confirm('모든 진행 상황을 초기화할까요?')){try{localStorage.removeItem('stellar-quest-save')}catch{}setG(initial())}};
const togglePartyMember=(id:number)=>{if(!g.party.includes(id)&&g.party.length>=3)return say('파티는 최대 3명입니다');setG(v=>({...v,party:v.party.includes(id)?v.party.filter(x=>x!==id):[...v.party,id]}))};
const adventure=()=>g.party.length===3?go('story'):(say('파티 3명을 편성하세요'),go('chars'));
const pop=(text:string,kind:string,target:'boss'|number)=>{const id=++floatId;const x=target==='boss'?50+(Math.random()*24-12):18+32*target;const y=target==='boss'?24+(Math.random()*10-5):62;setFloats(f=>[...f,{id,text,kind,x,y}]);setTimeout(()=>setFloats(f=>f.filter(p=>p.id!==id)),1000)};
const flashBanner=async(t:string,ms=750)=>{setBanner(t);await wait(ms);setBanner('')};

const syn=synergyOf(g.party);const buff=syn===3?1.13:syn===2?1.07:1;
const boss=bossOf(g.chapter);const rage=g.enemyHp<boss.hp/2;
const lead=H(g.lead);

const startBattle=()=>{const v=gRef.current;if(v.party.length!==3)return;const b=bossOf(v.chapter);
setG({...v,screen:'battle',enemyHp:b.hp,used:[],turn:1,sp:5,shield:0,intent:'aoe',energy:fill(()=>0),hp:{...v.hp,...Object.fromEntries(v.party.map(id=>[id,H(id).hp]))}});
setSel(v.party[0]);setCombo(0);setFloats([]);setBusy(false);flashBanner('BATTLE START',900)};

const enemyTurn=async()=>{
const v=gRef.current;const b=bossOf(v.chapter);const enraged=v.enemyHp<b.hp/2;
setCombo(0);await flashBanner('ENEMY TURN',700);
anim(bossRef.current,[{transform:'none'},{transform:'scale(1.18) translateY(36px)'},{transform:'none'}],450);
await wait(230);anim(arenaRef.current,SHAKE,450);
const alive=v.party.filter(id=>v.hp[id]>0);
const targets=v.intent==='aoe'?alive:[alive[Math.floor(Math.random()*alive.length)]];
const hp={...v.hp};let shield=v.shield;
for(const id of targets){const raw=Math.round((v.intent==='aoe'?b.base:b.base*2.2)*(enraged?1.3:1));const dmg=Math.max(30,raw-H(id).def);const blocked=Math.min(shield,dmg);shield-=blocked;hp[id]=Math.max(0,hp[id]-dmg+blocked);
pop(blocked?`-${dmg-blocked}\n🛡${blocked}`:`-${dmg}`,'hurt',v.party.indexOf(id));
anim(heroRefs.current[id],[{filter:'brightness(1.8) sepia(1) hue-rotate(-50deg) saturate(6)',transform:'translateX(-7px)'},{transform:'translateX(6px)'},{filter:'none',transform:'none'}],420)}
const lost=v.party.every(id=>hp[id]<=0);
setG({...v,hp,shield,turn:v.turn+1,sp:Math.min(6,v.sp+3),used:[],intent:Math.random()<.5?'aoe':'smash',screen:lost?'defeat':'battle'});
if(lost)return;
await wait(450);setSel(v.party.find(id=>hp[id]>0)!);await flashBanner(`TURN ${v.turn+1}`,650)};

const act=async(type:'basic'|'skill'|'ultimate')=>{
const v=gRef.current;const hero=H(sel);
if(busy||v.screen!=='battle'||v.used.includes(sel)||v.hp[sel]<=0)return;
if(type==='skill'&&v.sp<2)return;if(type==='ultimate'&&v.energy[sel]<100)return;
setBusy(true);
if(type==='ultimate'){setCutin(hero);await wait(1100);setCutin(null)}
anim(heroRefs.current[sel],[{transform:'none'},{transform:'translateY(-46px) scale(1.1)'},{transform:'none'}],340);
await wait(170);
const support=hero.kind!=='attack'&&type!=='basic';
const crit=!support&&Math.random()<.2;
const dmg=Math.round(hero.atk*(type==='basic'?1:type==='skill'?2.05:3.8)*buff*(crit?1.6:1)*(support?.35:1)*(.92+Math.random()*.16));
anim(bossRef.current,[{filter:'brightness(3)',transform:'translateX(12px)'},{filter:'brightness(1)',transform:'none'}],320);
if(type!=='basic'||crit)anim(arenaRef.current,SHAKE,type==='ultimate'?520:300);
setSlash(s=>({key:s.key+1,type}));
pop(crit?`CRITICAL\n${dmg}`:`${dmg}`,crit?'crit':type==='ultimate'?'crit':'dmg','boss');
setCombo(c=>c+1);
const hp={...v.hp};let shield=v.shield;
if(support&&hero.kind==='heal'){const amt=type==='ultimate'?350:190;v.party.forEach((id,i)=>{if(hp[id]>0){hp[id]=Math.min(H(id).hp,hp[id]+amt);pop(`+${amt}`,'heal',i)}})}
if(support&&hero.kind==='shield'){const amt=type==='ultimate'?420:190;shield+=amt;v.party.forEach((id,i)=>hp[id]>0&&pop(`🛡+${amt}`,'shield',i))}
const enemyHp=Math.max(0,v.enemyHp-dmg);const used=[...v.used,sel];
setG({...v,hp,shield,enemyHp,used,sp:Math.min(6,v.sp-(type==='skill'?2:0)+(type==='basic'?1:0)),energy:{...v.energy,[sel]:type==='ultimate'?0:Math.min(100,v.energy[sel]+(type==='basic'?35:25))}});
if(enemyHp===0){anim(bossRef.current,[{opacity:1,filter:'brightness(1)'},{opacity:0,filter:'brightness(4)',transform:'scale(1.3)'}],700);await wait(800);go('victory');setBusy(false);return}
const next=v.party.find(id=>!used.includes(id)&&hp[id]>0);
if(next){await wait(250);setSel(next);setBusy(false);return}
await wait(550);await enemyTurn();setBusy(false)};

const finish=()=>setG(v=>({...v,chapter:Math.min(3,v.chapter+1),gold:v.gold+500,screen:v.chapter>=2?'lobby':'story'}));
const stars=g.turn<=4?3:g.turn<=7?2:1;
const chapterInfo=CHAPTERS[Math.min(g.chapter,2)];

const NavBar=()=><nav className="navBar">{([['lobby','로비',House],['chars','캐릭터',Users],['map','지도',MapIcon]] as const).map(([s,l,Icon])=><button key={s} className={g.screen===s?'on':''} onClick={()=>go(s)}><Icon size={22}/>{l}</button>)}<button onClick={()=>say('상점은 준비 중입니다')}><ShoppingBag size={22}/>상점</button></nav>;
const TopBack=({title}:{title:string})=><header className="topBack"><button className="iconRound" onClick={()=>go('lobby')} aria-label="로비로"><ChevronLeft size={22}/></button><b>{title}</b><span className="currency"><Coins size={14} color="#ffd36b"/>{g.gold.toLocaleString()}</span></header>;

const shown=HEROES.filter(h=>!genTab||h.gen===genTab);
const d=detail?H(detail):null;

return <main className="phone">
{g.screen==='lobby'&&<section className="screen lobby">
<div className="starfield"/>
<header className="hud">
<div className="profile"><Portrait id={g.lead}/><div><b>Lv.{12+g.chapter*3} 마스터</b><small>챕터 {Math.min(g.chapter+1,3)} 진행 중</small></div></div>
<span className="currency"><Zap size={14} color="#7cf0c0"/>120/120</span>
<span className="currency"><Gem size={14} color="#ff8ad8"/>3,200</span>
<span className="currency"><Coins size={14} color="#ffd36b"/>{g.gold.toLocaleString()}</span>
</header>
<div className="sideMenu">
<button className="iconBtn" onClick={()=>say('공지사항은 준비 중입니다')}><Bell size={20}/>공지<i className="dot"/></button>
<button className="iconBtn" onClick={()=>say('이벤트는 준비 중입니다')}><Gift size={20}/>이벤트<i className="dot"/></button>
<button className="iconBtn" onClick={()=>say('우편함이 비어 있습니다')}><Mail size={20}/>우편</button>
</div>
<div className="sideMenu right">
<button className="iconBtn" onClick={save}><Save size={20}/>저장</button>
<button className="iconBtn" onClick={reset}><RotateCcw size={20}/>새 게임</button>
</div>
<button className="leadWrap" onClick={()=>{const lines=['오늘도 모험 가 볼까요?','파티 편성은 끝났어요?',`${lead.skill}, 보여 줄게요!`,'별빛이 우리를 지켜 줄 거예요.','조금 쉬었다 갈까요?'];setBubble(lines[Math.floor(Math.random()*lines.length)])}} aria-label="대표 캐릭터 터치">
<div className="leadGlow"/><Portrait id={g.lead} className="lead"/>
</button>
{bubble&&<div className="bubble" key={bubble} onAnimationEnd={e=>e.animationName==='bubbleOut'&&setBubble('')}>{bubble}</div>}
<div className="leadName"><small style={{color:GEN_COLOR[lead.gen]}}>{lead.gen}기 · {lead.job}</small><b>{lead.name}</b></div>
<div className="lobbyActions">
<button className="partyBtn" onClick={()=>go('chars')}><div className="partyFaces">{g.party.map(id=><Portrait key={id} id={id}/>)}</div><span>파티 편성</span></button>
<button className="adventure" onClick={adventure}><small>{g.chapter>=3?'데모 완료 · 다시 도전':chapterInfo.title}</small><b>모험 시작</b><Swords size={26} className="advIcon"/></button>
</div>
{g.chapter>=3&&<div className="clearBadge"><Crown size={14}/> 데모 스토리 완료!</div>}
<NavBar/>
</section>}

{g.screen==='chars'&&<section className="screen chars">
<TopBack title="캐릭터"/>
<div className="partyRow">{[0,1,2].map(i=>{const id=g.party[i];return <button key={i} className="slot" onClick={()=>id&&setDetail(id)}>{id?<><Portrait id={id}/>{id===g.lead&&<Crown size={14} className="crown"/>}</>:<span>+</span>}</button>})}
<div className={`synergy s${syn}`}><Sparkles size={16}/><div><b>{syn?`동기 ${syn}인 시너지`:'시너지 없음'}</b><small>{syn===3?'공격력 +13%':syn===2?'공격력 +7%':'같은 기수 2명 이상 편성'}</small></div></div>
</div>
<div className="tabs">{['전체','1기','2기','3기'].map((t,i)=><button key={t} className={genTab===i?'on':''} onClick={()=>setGenTab(i)}>{t}</button>)}</div>
<div className="grid">{shown.map(h=>{const K=KIND[h.kind].Icon;const inParty=g.party.includes(h.id);return <button key={h.id} className={`card ${inParty?'picked':''}`} style={{'--c':GEN_COLOR[h.gen]} as React.CSSProperties} onClick={()=>setDetail(h.id)}>
<Portrait id={h.id}/><span className="genTag">{h.gen}기</span>{inParty&&<span className="checkTag"><Check size={12}/>{g.party.indexOf(h.id)+1}</span>}
<div className="cardInfo"><K size={12}/><b>{h.name}</b><small>{h.job}</small></div></button>})}</div>
<div className="ctaBar"><button className="primary" disabled={g.party.length!==3} onClick={()=>go('story')}>{g.party.length===3?'편성 완료 · 모험으로':`${3-g.party.length}명 더 선택하세요`}<ChevronRight size={18}/></button></div>
{d&&<div className="sheetBg" onClick={()=>setDetail(null)}><div className="sheet" onClick={e=>e.stopPropagation()}>
<button className="iconRound close" onClick={()=>setDetail(null)} aria-label="닫기"><X size={20}/></button>
<div className="sheetArt" style={{'--c':GEN_COLOR[d.gen]} as React.CSSProperties}><Portrait id={d.id}/><div><span className="genTag big">{d.gen}기</span><h2>{d.name}</h2><p>{d.job} · {KIND[d.kind].label}</p></div></div>
<div className="stats">{([['HP',d.hp,1200],['공격',d.atk,185],['방어',d.def,90]] as const).map(([l,val,max])=><div key={l}><span>{l}</span><div className="statBar"><i style={{width:`${100*val/max}%`}}/></div><b>{val}</b></div>)}</div>
<div className="skillInfo"><Flame size={18}/><div><b>{d.skill} <small>SP 2</small></b><p>{d.kind==='attack'?'공격력의 205% 피해':d.kind==='heal'?'아군 전체 HP 190 회복 + 약한 피해':'보호막 190 획득 + 약한 피해'}</p></div></div>
<div className="skillInfo ult"><Sparkles size={18}/><div><b>{d.ultimate} <small>궁극기</small></b><p>{d.kind==='attack'?'공격력의 380% 피해':d.kind==='heal'?'아군 전체 HP 350 회복 + 피해':'보호막 420 획득 + 피해'}</p></div></div>
<div className="sheetActions">
<button className="secondary" disabled={g.lead===d.id} onClick={()=>{setG(v=>({...v,lead:d.id}));say('대표 캐릭터로 설정했습니다')}}><Crown size={16}/>{g.lead===d.id?'대표 캐릭터':'대표로 설정'}</button>
<button className="primary" onClick={()=>{togglePartyMember(d.id);setDetail(null)}}>{g.party.includes(d.id)?'파티에서 해제':'파티 편성'}</button>
</div></div></div>}
</section>}

{g.screen==='story'&&<section className="screen story">
<TopBack title={chapterInfo.title}/>
<div className="storyScene"><div className="moon">☾</div><div className="storyChars">{g.party.map(id=><Portrait key={id} id={id} className="storyPortrait"/>)}</div>
<div className="dialogue"><span className="speaker">{chapterInfo.npc}</span><p>{chapterInfo.line}</p><small>{chapterInfo.text}</small></div></div>
<div className="ctaBar row"><button className="secondary" onClick={()=>go('map')}><MapIcon size={16}/>지도</button><button className="primary" onClick={startBattle}><Swords size={18}/>{g.chapter>=2?'최종 보스 도전':'전투 시작'}</button></div>
</section>}

{g.screen==='map'&&<section className="screen map">
<TopBack title="별빛의 대륙"/>
<div className="mapPath">{['별빛 마을','잊힌 숲','심연의 성역'].map((x,i)=><button key={x} className={`mapNode ${g.chapter>=i?'open':''} ${Math.min(g.chapter,2)===i?'now':''}`} disabled={g.chapter<i} onClick={()=>go('story')}><span>{i===0?'⌂':i===1?'♣':'✦'}</span><b>{x}</b><small>{g.chapter>i?'클리어':g.chapter===i?'진행 중':g.chapter>=i?'입장 가능':'잠김'}</small></button>)}</div>
<NavBar/>
</section>}

{['battle','victory','defeat'].includes(g.screen)&&<section className={`screen battle ${g.chapter>=2?'final':''}`}>
<header className="bTop">
<button className="iconRound" disabled={busy} onClick={()=>confirm('전투를 포기하고 로비로 돌아갈까요?')&&go('lobby')} aria-label="전투 포기"><ChevronLeft size={20}/></button>
<div className="bossBar"><div className="bossLabel"><b>{boss.name}</b>{rage&&<em>광폭화</em>}<span>{g.enemyHp.toLocaleString()} / {boss.hp.toLocaleString()}</span></div>
<div className="bar"><i className="ghost" style={{width:`${100*g.enemyHp/boss.hp}%`}}/><i className="fill" style={{width:`${100*g.enemyHp/boss.hp}%`}}/></div></div>
<div className="turnTag">TURN<b>{g.turn}</b></div>
</header>
<div className="intent">{g.intent==='aoe'?<><Users size={13}/> 다음 적 행동: 광역 공격</>:<><Skull size={13}/> 다음 적 행동: 강타 (단일 대상 · 큰 피해)</>}</div>
<div className="arena" ref={arenaRef}>
<div className={`bossBox ${rage?'rage':''}`}><div ref={bossRef}><img className="bossImg" src={`/monsters/${encodeURIComponent(boss.name)}.png`} alt={boss.name} draggable={false}/></div>
{slash.key>0&&<div key={slash.key} className={`slash ${slash.type}`}/>}</div>
{combo>1&&<div className="combo" key={combo}><b>{combo}</b> HIT</div>}
<div className="allyRow">{g.party.map(id=>{const h=H(id);const e=g.energy[id]||0;return <button key={id} ref={el=>{heroRefs.current[id]=el}} className={`ally ${sel===id?'active':''} ${g.used.includes(id)?'acted':''} ${g.hp[id]<=0?'down':''}`} onClick={()=>!busy&&g.hp[id]>0&&setSel(id)}>
<Portrait id={id}/>{g.shield>0&&g.hp[id]>0&&<i className="shieldAura"/>}{e>=100&&<i className="ultReady">ULT</i>}
<div className="allyInfo"><b>{h.name}</b><div className="hp"><i style={{width:`${100*g.hp[id]/h.hp}%`}}/></div><div className="en"><i style={{width:`${e}%`}}/></div></div></button>})}</div>
{floats.map(f=><div key={f.id} className={`float ${f.kind}`} style={{left:`${f.x}%`,top:`${f.y}%`}}>{f.text}</div>)}
{banner&&<div className="banner" key={banner}>{banner}</div>}
</div>
<div className="controls">
<div className="spRow"><span>SP</span><div className="pips">{[0,1,2,3,4,5].map(i=><i key={i} className={i<g.sp?'on':''}/>)}</div><span className="shieldTxt"><Shield size={13}/>{g.shield}</span><span className="synTxt"><Sparkles size={13}/>{syn?`ATK +${syn===3?13:7}%`:'시너지 없음'}</span></div>
<div className="skills">{(()=>{const h=H(sel);const off=busy||g.screen!=='battle'||g.used.includes(sel)||g.hp[sel]<=0;const e=g.energy[sel]||0;return <>
<button className="skillBtn" disabled={off} onClick={()=>act('basic')}><Swords size={22}/><b>기본 공격</b><small>SP +1</small></button>
<button className="skillBtn" disabled={off||g.sp<2} onClick={()=>act('skill')}><Flame size={22}/><b>{h.skill}</b><small>SP 2</small></button>
<button className={`skillBtn ult ${e>=100?'ready':''}`} style={{'--p':e} as React.CSSProperties} disabled={off||e<100} onClick={()=>act('ultimate')}><Sparkles size={24}/><b>{h.ultimate}</b><small>{e>=100?'발동 가능!':`${e}%`}</small></button></>})()}</div>
</div>
{cutin&&<div className="cutin"><div className="stripe"/><Portrait id={cutin.id}/><div className="cutText"><small>ULTIMATE</small><b>{cutin.ultimate}</b></div></div>}
{g.screen==='victory'&&<div className="result win"><div className="stars">{[1,2,3].map(i=><Star key={i} size={44} className={i<=stars?'on':''} style={{animationDelay:`${i*.18}s`}}/>)}</div><h2>VICTORY</h2><p>{g.turn}턴 클리어 · 보상 <Coins size={14} color="#ffd36b"/> 500</p><button className="primary" onClick={finish}>{g.chapter>=2?'엔딩으로':'다음 챕터'}<ChevronRight size={18}/></button></div>}
{g.screen==='defeat'&&<div className="result lose"><Skull size={48}/><h2>DEFEAT</h2><p>파티가 전멸했습니다.</p><div className="row"><button className="secondary" onClick={()=>go('lobby')}>로비로</button><button className="primary" onClick={startBattle}><RotateCcw size={16}/>재도전</button></div></div>}
</section>}

{toast&&<div className="toast">{toast}</div>}
</main>}
