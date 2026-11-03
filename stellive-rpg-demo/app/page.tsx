'use client';
import {useEffect,useRef,useState} from 'react';
import {Swords,Users,Map as MapIcon,RotateCcw,Save,Heart,Shield,Flame,Sparkles,ChevronRight,ChevronLeft,Trophy,House,ShoppingBag,Gift,Mail,Bell,Gem,Coins,Zap,Star,Check,X,Skull,Crown,Crosshair,Lock} from 'lucide-react';

type Kind='attack'|'heal'|'shield';
type Hero={id:number;name:string;job:string;gen:number;hp:number;atk:number;def:number;skill:string;ultimate:string;kind:Kind;bio:string};
const HEROES:Hero[]=[
// id = public/portraits/{id}.png
{id:1,name:'강지',job:'샤쵸',gen:1,hp:1080,atk:130,def:85,skill:'긴급 사내 회의',ultimate:'샤쵸의 결재',kind:'shield',bio:'스텔라이브를 이끄는 샤쵸. 멤버들 곁에서 든든하게 뒤를 받쳐 준다.'},
{id:2,name:'아야츠노 유니',job:'유니콘',gen:1,hp:980,atk:120,def:70,skill:'유니콘의 뿔빛',ultimate:'최후의 유니콘',kind:'heal',bio:'다른 유니콘들이 멸종할 때 봉인되었다가 지구에서 깨어난 마지막 유니콘. 보호를 받기 위해 스텔라이브에 합류했다.'},
{id:3,name:'사키하네 후야',job:'고룡',gen:1,hp:1120,atk:165,def:75,skill:'고룡의 숨결',ultimate:'떨어진 별의 포효',kind:'attack',bio:'용의 혈통을 이은 고룡이자 한때 별이었던 존재. 이름을 잊었지만, 자신을 부르는 유니의 목소리를 따라 스텔라이브에 왔다.'},
{id:4,name:'시라유키 히나',job:'아이돌',gen:2,hp:1020,atk:95,def:65,skill:'용기의 노래',ultimate:'다시 오른 무대',kind:'heal',bio:'소심한 성격 탓에 아이돌의 꿈을 포기했지만, 친구의 권유로 올린 노래 영상을 계기로 아이돌 회사에 들어왔다.'},
{id:5,name:'네네코 마시로',job:'고양이',gen:2,hp:900,atk:175,def:45,skill:'냥냥 탐지 스캔',ultimate:'고양이 행성의 부름',kind:'attack',bio:'고향 행성의 고양이 동료들을 찾아 지구에 왔다가 탐지기를 잃어버리고 스텔라이브에 오게 되었다.'},
{id:6,name:'아카네 리제',job:'천마',gen:2,hp:1200,atk:155,def:90,skill:'핏빛 선율',ultimate:'붉은 달의 세레나데',kind:'attack',bio:'아이돌을 동경해 피를 거의 마시지 않는 반뱀파이어. 흡혈보다 음악을 사랑하다 성에서 쫓겨났다.'},
{id:7,name:'아라하시 타비',job:'타비',gen:2,hp:1040,atk:145,def:65,skill:'보물 감정안',ultimate:'하늘 도시의 대도',kind:'attack',bio:'다른 차원에서 온 보물 사냥꾼. 하늘 도시의 보물을 훔쳐 달아나다 길을 잃고 이 세계로 떨어졌다.'},
{id:8,name:'텐코 시부키',job:'여우신',gen:3,hp:970,atk:150,def:65,skill:'여우불',ultimate:'천년 신사의 결계',kind:'shield',bio:'천 년을 산 여우신. 신사에 버려진 게임기 때문에 게임 폐인이 되었지만, 찾아오는 이들을 외면하지 못하다 스텔라이브를 만났다.'},
{id:9,name:'아오쿠모 린',job:'뇨봇',gen:3,hp:1100,atk:135,def:85,skill:'진심의 봉사',ultimate:'완벽한 티타임',kind:'shield',bio:'메이드 컨셉 지하 아이돌 출신. 컨셉을 소화하지 못해 그룹이 해체되자, 진심 어린 봉사를 배우러 왔다.'},
{id:10,name:'하나코 나나',job:'비밀요원',gen:3,hp:890,atk:185,def:45,skill:'잠입 저격',ultimate:'코드네임 해제',kind:'attack',bio:'임무를 망치고 도망 중인 전직 비밀 요원. 정체를 숨긴 채 스텔라이브에 합류했다.'},
{id:11,name:'유즈하 리코',job:'용사',gen:3,hp:1150,atk:160,def:80,skill:'용사의 일격',ultimate:'되찾은 성검',kind:'attack',bio:'마왕을 쓰러뜨린 용사. 소원의 보상으로 이 세계에 왔지만 아무도 자신을 기억하지 못해 힘이 약해졌고, 다시 용사가 되기 위해 합류했다.'}];
const CHAPTERS=[{title:'프롤로그 · 별이 사라진 밤',text:'별빛이 사라진 밤, 오래된 성역에서 불길한 균열이 발견되었다. 세 명의 동료가 균열의 원인을 찾아 길을 나선다.',npc:'수호자',line:'“성역 깊은 곳에 잠든 그림자가 깨어나고 있습니다. 부디 조심하세요.”'},{title:'제1장 · 잊힌 숲',text:'안개가 내려앉은 숲길. 낯선 발자국과 부서진 수정 조각이 이어진다. 동료들은 조용히 무기를 꺼내 든다.',npc:'숲의 안내인',line:'“이 앞에는 그림자 수호자가 있습니다. 승리해야 다음 길이 열릴 거예요.”'},{title:'제2장 · 심연의 성역',text:'수호자를 물리치자 봉인된 성역의 문이 열렸다. 검은 빛이 새어 나오고, 최후의 적이 기다린다.',npc:'고대의 기록자',line:'“여기까지 온 자들이여, 마지막 시련을 이겨 내십시오.”'}];
const KIND={attack:{label:'딜러',Icon:Swords},heal:{label:'힐러',Icon:Heart},shield:{label:'수호',Icon:Shield}};
const GEN_COLOR=['','#ffd36b','#c29bff','#7cc4ff'];
const UNIT=['','에버리스','유니버스','클리셰'];

type Screen='lobby'|'chars'|'story'|'map'|'shop'|'battle'|'victory'|'defeat';
type Game={party:number[];lead:number;chapter:number;diamonds:number;owned:number[];history:Pull[];shards:Record<number,number>;pity:Record<number,number>;stars:Record<number,number>;enemyHp:number;hp:Record<number,number>;sp:number;energy:Record<number,number>;used:number[];turn:number;shield:number;intent:'aoe'|'smash';target:number;screen:Screen};
type Float={id:number;text:string;kind:string;x:number;y:number};

const H=(id:number)=>HEROES.find(h=>h.id===id)!;
const fill=(f:(h:Hero)=>number)=>Object.fromEntries(HEROES.map(h=>[h.id,f(h)]));
// images in public/monsters (copied from crpg-studio _default_monsters/fantasy)
// `chapter` in the save is the index into STAGES (regions are derived from it)
const REGION_MAP=[{name:'별빛 마을',icon:'⌂'},{name:'잊힌 숲',icon:'♣'},{name:'심연의 성역',icon:'✦'}];
type Rank='normal'|'elite'|'boss';
const STAGE_LIST:[number,string,Rank][]=[
[0,'뒷골목 불량배','normal'],[0,'고블린 약탈대','normal'],[0,'굶주린 늑대 무리','normal'],[0,'청부 암살자','normal'],[0,'다이어울프 우두머리','elite'],[0,'심연의 하수인','boss'],
[1,'거대 거미','normal'],[1,'구울','normal'],[1,'해골 병사','normal'],[1,'머맨 약탈자','normal'],[1,'바다뱀','normal'],[1,'와이번','elite'],[1,'숲 트롤','boss'],
[2,'망령 기사','normal'],[2,'촉수 마물','normal'],[2,'심연의 사도 광신도','normal'],[2,'고대 고룡','elite'],[2,'홍염의 패왕','elite'],[2,'마왕','boss']];
// enemies scale with stage index; elites and bosses get extra HP and attack
const STAGES=STAGE_LIST.map(([region,name,rank],i)=>{const n=STAGE_LIST.slice(0,i+1).filter(s=>s[0]===region).length;
const hm=rank==='boss'?1.4:rank==='elite'?1.2:1;return {name,region,rank,no:`${region+1}-${n}`,hp:Math.round((1100+i*120)*hm/10)*10,base:105+i*6+(rank==='boss'?30:rank==='elite'?15:0)}});
const LAST=STAGES.length;
const bossOf=(c:number)=>STAGES[Math.min(c,LAST-1)];
const rewardOf=(c:number)=>bossOf(c).rank==='boss'?800:bossOf(c).rank==='elite'?500:300;
const STARTERS=[2,11,8]; // 유니 · 리코 · 시부키
const TEST_DIAMONDS=100000; // gacha testing: starting diamonds, and what the shop's + button tops up
const initial=():Game=>({party:[...STARTERS],lead:2,chapter:0,diamonds:TEST_DIAMONDS,owned:[...STARTERS],history:[],shards:{},pity:{},stars:{},enemyHp:1800,hp:fill(h=>h.hp),sp:5,energy:fill(()=>0),used:[],turn:1,shield:0,intent:'aoe',target:2,screen:'lobby'});
const pick=<T,>(a:T[])=>a[Math.floor(Math.random()*a.length)];
// fills in fields added in later versions (old saves, or state kept across a hot reload)
const migrate=(raw:Partial<Game>):Game=>{const s={...initial(),...raw} as Game;
s.owned=(Array.isArray(s.owned)?s.owned:STARTERS).filter(id=>HEROES.some(h=>h.id===id));if(!s.owned.length)s.owned=[...STARTERS];
s.history=(Array.isArray(s.history)?s.history:[]).filter(p=>p&&typeof p==='object'&&(p.kind==='stone'||HEROES.some(h=>h.id===p.id)));
s.shards=s.shards||{};s.pity=s.pity||{};s.stars=s.stars||{};if(typeof s.diamonds!=='number')s.diamonds=initial().diamonds;
s.party=s.party.filter(id=>s.owned.includes(id));if(!s.owned.includes(s.lead))s.lead=s.party[0]??s.owned[0];
s.hp={...initial().hp,...s.hp};s.energy={...initial().energy,...s.energy};return s};
const isCurrent=(s:Game)=>Array.isArray(s.owned)&&!!s.pity&&!!s.shards&&!!s.stars&&typeof s.diamonds==='number'&&Array.isArray(s.history)&&s.history.every(p=>typeof p==='object');
// gacha, tuned like a typical mobile limited banner:
// member 2% (half of it a pack member), member shards 18%, plain stone (miss) 80%, pity at 70 pulls
const PULL_COST=160,CHAR_RATE=.02,SHARD_RATE=.18,PACK_SHARE=.5,PITY=70;
const SHARD_DROP=5,DUP_SHARDS=25,SHARD_UNLOCK=50;
// breakthrough (돌파) 0–6: a duplicate member is an instant +1, or spend that member's shards.
// every level is +8% HP/ATK/DEF; levels 2/4/6 add a perk
const MAX_STARS=6,STAR_STAT=.08,BT_COST=[20,30,40,50,60,80];
// common effect per level (all levels also +8% stats); 2/4/6 are the big ones
const STAR_EFFECT=['','능력치 +8%','스킬 위력 +15%','능력치 +8%','전투 시작 시 궁극기 게이지 +50%','능력치 +8%','궁극기 위력 +30%'];
// RP-flavoured name for each breakthrough level, per member
const RP_STARS:Record<number,string[]>={
1:['첫 결재','사내 공지','긴급 회의','예산 승인','전사 워크숍','샤쵸의 결단'],
2:['봉인의 균열','뿔빛의 각성','되찾은 날개','별빛 갈기','유니콘의 맹세','전설의 유니콘'],
3:['떠오른 기억','용의 비늘','고룡의 혈통','별의 잔광','되찾은 이름','다시 빛나는 별'],
4:['작은 용기','첫 노래 영상','데뷔 무대','팬들의 응원','센터의 자리','꿈의 아이돌'],
5:['수상한 신호','탐지기 수리','동료의 흔적','고양이 네트워크','행성 교신','귀향의 별빛'],
6:['갈증의 억제','피보다 음악','성의 기억','붉은 달의 각성','천마의 위엄','혈월의 여왕'],
7:['첫 번째 보물','차원 지도','하늘 도시 잠입','전설의 금고','차원 도약','대도의 이름'],
8:['게임기 부팅','신사의 불빛','여우불 각성','천 년의 지혜','아홉 꼬리','신역의 주인'],
9:['기동 확인','봉사 프로토콜','진심 모듈','완벽한 서빙','감정 회로','진정한 뇨봇'],
10:['위장 신분','잠입 성공','코드 해독','추적자 따돌리기','기밀 접근','전설의 요원'],
11:['녹슨 검','되찾은 기억','용사의 문장','동료의 이름','성검의 부름','다시 태어난 용사']};
// damage coefficient (× ATK) per action; healers/guardians deal reduced damage on skill/ultimate
type Act='basic'|'skill'|'ultimate';
const ACT_MUL:Record<Act,number>={basic:1,skill:2.05,ultimate:3.8},SUPPORT_MUL=.35;
const coefOf=(kind:Kind,type:Act,stars:number)=>ACT_MUL[type]*(kind!=='attack'&&type!=='basic'?SUPPORT_MUL:1)*(type==='skill'&&stars>=2?1.15:type==='ultimate'&&stars>=6?1.3:1);
const pct=(x:number)=>`${Math.round(x*100)}%`;
const starName=(id:number,s:number)=>RP_STARS[id]?.[s-1]??`${s}단계`;
const statOf=(v:{stars?:Record<number,number>},id:number)=>{const h=H(id);const s=v.stars?.[id]||0;const m=1+STAR_STAT*s;return {hp:Math.round(h.hp*m),atk:Math.round(h.atk*m),def:Math.round(h.def*m),s}};
// one pack per unit; the starting members are left out of their pack
type Banner={title:string;tag:string;remain:string;pack:number[];color:string;art:string|null};
const unitPack=(gen:number)=>HEROES.filter(h=>h.gen===gen&&!STARTERS.includes(h.id)).map(h=>h.id);
const BANNERS:Banner[]=[
{title:'에버리스',tag:'1기 팩',remain:'21일 16시간',pack:unitPack(1),color:GEN_COLOR[1],art:'/Pack_1.png'},
{title:'유니버스',tag:'2기 팩',remain:'21일 16시간',pack:unitPack(2),color:GEN_COLOR[2],art:'/Pack_2.jpg'},
{title:'클리셰',tag:'3기 팩',remain:'21일 16시간',pack:unitPack(3),color:GEN_COLOR[3],art:'/Pack_3.jpg'}];
type Pull={kind:'stone'|'shard'|'char';id:number;isNew?:boolean;star?:number};
const inPack=(b:Banner,id:number)=>b.pack.includes(id);
const memberOf=(b:Banner)=>b.pack.length&&Math.random()<PACK_SHARE?pick(b.pack):pick(HEROES.filter(h=>!inPack(b,h.id))).id;
// one pull; `count` is pulls since the last pack member (any member on the standard banner)
const rollOne=(b:Banner,count:number):Pull=>{
if(count+1>=PITY)return {kind:'char',id:b.pack.length?pick(b.pack):pick(HEROES).id};
const r=Math.random();
return r<CHAR_RATE?{kind:'char',id:memberOf(b)}:r<CHAR_RATE+SHARD_RATE?{kind:'shard',id:memberOf(b)}:{kind:'stone',id:0}};
// the enemy's next move is decided in advance so the UI can preview exactly what it will do
const enemyHits=(v:Game)=>{const b=bossOf(v.chapter);const enraged=v.enemyHp<b.hp/2;const alive=v.party.filter(id=>v.hp[id]>0);
const targets=v.intent==='aoe'?alive:alive.includes(v.target)?[v.target]:alive.slice(0,1);
let shield=v.shield;const hits:Record<number,{dmg:number;blocked:number}>={};
for(const id of targets){const raw=Math.round((v.intent==='aoe'?b.base:b.base*2.2)*(enraged?1.3:1));const dmg=Math.max(30,raw-statOf(v,id).def);const blocked=Math.min(shield,dmg);shield-=blocked;hits[id]={dmg,blocked}}
return {hits,shield}};
const synergyOf=(ids:number[])=>{const n=Math.max(...[1,2,3].map(gen=>ids.filter(id=>H(id).gen===gen).length));return n>=3?3:n>=2?2:0};
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const SHAKE:Keyframe[]=[{transform:'none'},{transform:'translate(-9px,5px)'},{transform:'translate(8px,-6px)'},{transform:'translate(-6px,3px)'},{transform:'translate(4px,-2px)'},{transform:'none'}];
const anim=(el:Element|null|undefined,k:Keyframe[],ms:number)=>{el?.animate(k,{duration:ms,easing:'ease-out'})};
let floatId=0;
const LOADINGS=['/Loading.png'];
const TIPS=['같은 유닛 멤버를 2명 이상 편성하면 공격력이 올라갑니다.','적의 다음 행동을 확인하고 보호막과 회복으로 대비하세요.','궁극기 게이지는 공격할 때마다 차오릅니다.','기본 공격은 SP를 1 회복합니다. 스킬과 번갈아 쓰세요.','보스의 체력이 절반 아래로 내려가면 광폭화합니다.'];
// story backgrounds per chapter — one shared region image until each region gets its own
const STORY_BG=['/Region.webp','/Region.webp','/Region.webp'];
// battle backgrounds per region (null = plain gradient until the art exists)
const BATTLE_BG:(string|null)[]=[`/${encodeURIComponent('프롤로그_배경')}.png`,null,null];
const TILE_COLS=18,TILE_ROWS=9,TILE_IN_MS=720,TILE_OUT_MS=720,LOAD_MS=1700;
const sectionOf=(s:string)=>['battle','victory','defeat'].includes(s)?'battle':s;

function Portrait({id,className}:{id:number;className?:string}){return <img className={className} src={`/portraits/${id}.png`} alt={`${H(id).name} 이미지`} draggable={false}/>}
// battle art: public/battle/{이름}_전투.png — falls back to 리제 until the file exists
const DEFAULT_ART=6;
const artSrc=(id:number)=>`/battle/${encodeURIComponent(`${H(id).name.split(' ').pop()}_전투`)}.png`;
// gacha reveal art: public/gacha/{이름}_뽑기.png (full-scene illustration) — falls back to the battle cutout when missing
// where the face sits in each gacha illustration (x%, y%), used to crop it into a character card
const ART_FOCUS:Record<number,[number,number]>={1:[56,20],2:[54,24],3:[60,32],4:[57,19],5:[57,18],6:[57,33],7:[57,24],8:[74,24],9:[56,20],10:[63,23],11:[35,24]};
// object-position puts the face at (fx%,fy%) of the card; zooming around origin O moves it to O+s(f-O),
// so pick O to land the face at (50%,40%) — below the unit tag
const CARD_ZOOM=1.9;
const cardCrop=(id:number):React.CSSProperties=>{const [fx,fy]=ART_FOCUS[id]??[50,25];const o=(t:number,f:number)=>Math.max(0,Math.min(100,(t-CARD_ZOOM*f)/(1-CARD_ZOOM)));
return {objectPosition:`${fx}% ${fy}%`,transformOrigin:`${o(50,fx)}% ${o(40,fy)}%`}};
const gachaSrc=(id:number)=>`/gacha/${encodeURIComponent(`${H(id).name.split(' ').pop()}_뽑기`)}.png`;
function BattleArt({id,className}:{id:number;className?:string}){return <img key={id} className={className} src={artSrc(id)} alt="" draggable={false} onError={e=>{const t=e.currentTarget;if(!t.dataset.fb){t.dataset.fb='1';t.src=artSrc(DEFAULT_ART)}}}/>}

// sparkle debris shed along the comet's path (top-left → centre), timed to when the head passes
// (the comet eases in, so it reaches fraction t of the path at roughly t^0.6 of its flight time)
const DEBRIS=Array.from({length:18},(_,i)=>{const t=(i+1)/19;return {x:-8+58*t+((i*13)%7-3),y:8+42*t+((i*29)%9-4),t:.6+.9*Math.pow(t,.6),dx:-30-(i*17)%50,dy:10+(i*23)%40}});
// card timing for the face-down → flip sequence (members wait a beat longer, behind a light pillar)
const flipAt=(pulls:Pull[],i:number)=>700+i*150+pulls.slice(0,i+1).filter(p=>p.kind==='char').length*450;
function PullCard({p,i,flip}:{p:Pull;i:number;flip:number}){
const c=p.kind==='stone'?'#6b7390':GEN_COLOR[H(p.id).gen];
return <div className={`pullCard ${p.kind}`} style={{'--c':c,'--i':i,'--d':`${flip}ms`} as React.CSSProperties}>
{p.kind==='char'&&<i className="beam"/>}{p.kind==='char'&&<i className="pillar"/>}<div className="cardFace">
{p.kind==='stone'?<><i className="stoneIcon"/><b>평범한 돌</b></>
:p.kind==='shard'?<><Portrait id={p.id}/><i className="shardFrame"/><em className="shardTag">조각 ×{SHARD_DROP}</em><b>{H(p.id).name.split(' ').pop()}</b></>
:<><Portrait id={p.id}/>{p.isNew?<em className="newTag">NEW</em>:p.star?<em className="dupTag star">★{p.star}돌파</em>:<em className="dupTag">조각 ×{DUP_SHARDS}</em>}<b>{H(p.id).name.split(' ').pop()}</b></>}
</div><i className="cardBack"><i className="corners"/><svg className="star4" viewBox="-10 -10 20 20" aria-hidden="true"><path d="M0-10Q1.2-1.2 10 0Q1.2 1.2 0 10Q-1.2 1.2-10 0Q-1.2-1.2 0-10Z"/></svg></i></div>}

export default function Page(){
const [rawG,setG]=useState<Game>(initial);
const g=isCurrent(rawG)?rawG:migrate(rawG);
const gRef=useRef(g);gRef.current=g;
const [sel,setSel]=useState(2);
const [bannerIdxRaw,setBannerIdx]=useState(0);const bannerIdx=Math.min(bannerIdxRaw,BANNERS.length-1);
const [shopModal,setShopModal]=useState<'rates'|'history'|'shards'|null>(null);
const [summon,setSummon]=useState<{key:number;pulls:Pull[];phase:'orb'|'char'|'reveal';tier:'stone'|'shard'|'char'}|null>(null);
const [detail,setDetail]=useState<number|null>(null);
// member detail is a full screen with two tabs; rpSel is the breakthrough node being inspected
const [detailTab,setDetailTab]=useState<'info'|'rp'>('info');
const [rpSel,setRpSel]=useState<number|null>(null);
const openDetail=(id:number)=>{setDetail(id);setDetailTab('info');setRpSel(null)};
const [genTab,setGenTab]=useState(0);
const [floats,setFloats]=useState<Float[]>([]);
const [cutin,setCutin]=useState<Hero|null>(null);
const [banner,setBanner]=useState('');
const [busy,setBusy]=useState(false);
const [combo,setCombo]=useState(0);
// first tap on a skill shows its details; the action runs from the "사용" button (or a second tap)
const [picked,setPick]=useState<{id:number;type:Act}|null>(null);
const isPick=(id:number,type:Act)=>picked?.id===id&&picked.type===type;
const choose=(type:Act,id:number)=>{if(isPick(id,type)){if(canUse(type,id)){setPick(null);act(type,id)}return}setPick({id,type});if(id!==sel)setSel(id)};
const canUse=(type:Act,id:number)=>{const v=gRef.current;return v.screen==='battle'&&!v.used.includes(id)&&v.hp[id]>0&&(type!=='skill'||v.sp>=2)&&(type!=='ultimate'||(v.energy[id]||0)>=100)};
const [btFx,setBtFx]=useState<{id:number;s:number;key:number}|null>(null);
const [noGachaArt,setNoGachaArt]=useState<Record<number,boolean>>({});
const [shieldFx,setShieldFx]=useState<{key:number;type:'up'|'big'|'hit'|'break'}|null>(null);
const barrier=(type:'up'|'big'|'hit'|'break')=>{const key=Date.now();setShieldFx({key,type});setTimeout(()=>setShieldFx(s=>s&&s.key===key?null:s),1100)};
const [slash,setSlash]=useState({key:0,type:'basic'});
const [toast,setToast]=useState('');
const [art,setArt]=useState<{cur:number;prev:number|null;n:number}>({cur:2,prev:null,n:0});
useEffect(()=>{setArt(a=>a.cur===sel?a:{cur:sel,prev:a.cur,n:a.n+1})},[sel]);
const artRef=useRef<HTMLDivElement>(null);
const [tiles,setTiles]=useState<'in'|'out'|null>(null);
const [loading,setLoading]=useState<{img:string;tip:string}|null>(null);
const moving=useRef(false);const tileDelays=useRef<{in:number;out:number}[]>([]);
useEffect(()=>{[...LOADINGS,...STORY_BG,...BANNERS.flatMap(b=>b.art?[b.art]:[])].forEach(src=>{const i=new Image();i.src=src})},[]);
const arenaRef=useRef<HTMLDivElement>(null);const bossRef=useRef<HTMLDivElement>(null);const heroRefs=useRef<Record<number,HTMLElement|null>>({});

useEffect(()=>{try{const x=localStorage.getItem('stellar-quest-save');if(x)setG(migrate({...JSON.parse(x),screen:'lobby'}))}catch{}},[]);

// white diamonds sweep in from the right to cover the old screen, then shrink away from the
// bottom-right to reveal the new one; withLoading holds on a random loading illustration in the middle
const coverTiles=async()=>{tileDelays.current=Array.from({length:TILE_COLS*TILE_ROWS},(_,i)=>{const c=TILE_COLS-1-i%TILE_COLS,r=Math.floor(i/TILE_COLS);
return {in:c*16+r*8+Math.random()*50,out:(c+TILE_ROWS-1-r)*13+Math.random()*50}});setTiles('in');await wait(TILE_IN_MS)};
const transit=async(apply:()=>void,withLoading=false)=>{if(moving.current)return;moving.current=true;
await coverTiles();apply();
if(withLoading){setLoading({img:pick(LOADINGS),tip:pick(TIPS)});setTiles('out');await wait(TILE_OUT_MS+LOAD_MS);await coverTiles();setLoading(null)}
setTiles('out');await wait(TILE_OUT_MS);setTiles(null);moving.current=false};
const go=(screen:Screen,withLoading=false)=>{const set=()=>setG(v=>({...v,screen}));sectionOf(screen)===sectionOf(gRef.current.screen)?set():transit(set,withLoading)};
const say=(t:string)=>{setToast(t);setTimeout(()=>setToast(''),1400)};
const save=()=>{try{localStorage.setItem('stellar-quest-save',JSON.stringify(g));say('저장 완료!')}catch{say('저장 실패')}};
const reset=()=>{if(confirm('모든 진행 상황을 초기화할까요?')){try{localStorage.removeItem('stellar-quest-save')}catch{}setG(initial())}};
const pull=(n:number)=>{const v=gRef.current;const cost=PULL_COST*n;if(v.diamonds<cost)return say('다이아가 부족합니다');
const b=BANNERS[bannerIdx];const owned=new Set(v.owned);const shards={...v.shards};const stars={...v.stars};let count=v.pity[bannerIdx]||0;const pulls:Pull[]=[];
for(let i=0;i<n;i++){const p=rollOne(b,count);count++;
if(p.kind==='char'){p.isNew=!owned.has(p.id);const cur=stars[p.id]||0;
if(p.isNew)owned.add(p.id);else if(cur<MAX_STARS){stars[p.id]=cur+1;p.star=cur+1}else shards[p.id]=(shards[p.id]||0)+DUP_SHARDS;if(!b.pack.length||inPack(b,p.id))count=0}
if(p.kind==='shard')shards[p.id]=(shards[p.id]||0)+SHARD_DROP;
pulls.push(p)}
setG({...v,diamonds:v.diamonds-cost,owned:[...owned],shards,stars,pity:{...v.pity,[bannerIdx]:count},history:[...[...pulls].reverse(),...v.history].slice(0,50)});
const tier=pulls.some(p=>p.kind==='char')?'char':pulls.some(p=>p.kind==='shard')?'shard':'stone';
const key=Date.now();pulls.forEach(p=>{if(p.kind==='char'){const i=new Image();i.src=artSrc(p.id);const j=new Image();j.src=gachaSrc(p.id)}});
setSummon({key,pulls,tier,phase:'orb'});setTimeout(()=>setSummon(s=>s&&s.key===key&&s.phase==='orb'?{...s,phase:tier==='char'?'char':'reveal'}:s),3000)};
const breakthrough=(id:number)=>{const v=gRef.current;const s=v.stars[id]||0;if(s>=MAX_STARS||!v.owned.includes(id))return;const cost=BT_COST[s];
if((v.shards[id]||0)<cost)return say(`조각이 ${cost-(v.shards[id]||0)}개 부족합니다`);
setG({...v,stars:{...v.stars,[id]:s+1},shards:{...v.shards,[id]:v.shards[id]-cost}});const key=Date.now();setBtFx({id,s:s+1,key});setTimeout(()=>setBtFx(f=>f&&f.key===key?null:f),2400)};
const unlockByShards=(id:number)=>{const v=gRef.current;if((v.shards[id]||0)<SHARD_UNLOCK||v.owned.includes(id))return;
setG({...v,owned:[...v.owned,id],shards:{...v.shards,[id]:v.shards[id]-SHARD_UNLOCK}});say(`${H(id).name} 합류!`)};
const togglePartyMember=(id:number)=>{if(!g.owned.includes(id))return say('보유하지 않은 멤버입니다');if(!g.party.includes(id)&&g.party.length>=3)return say('파티는 최대 3명입니다');setG(v=>({...v,party:v.party.includes(id)?v.party.filter(x=>x!==id):[...v.party,id]}))};
const adventure=()=>g.party.length===3?go('story',true):(say('파티 3명을 편성하세요'),go('chars'));
const pop=(text:string,kind:string,target:'boss'|number)=>{const id=++floatId;const x=target==='boss'?64+(Math.random()*14-7):17.5+32.5*target;const y=target==='boss'?36+(Math.random()*12-6):66;setFloats(f=>[...f,{id,text,kind,x,y}]);setTimeout(()=>setFloats(f=>f.filter(p=>p.id!==id)),1000)};
const flashBanner=async(t:string,ms=750)=>{setBanner(t);await wait(ms);setBanner('')};

const syn=synergyOf(g.party);const buff=syn===3?1.13:syn===2?1.07:1;
const boss=bossOf(g.chapter);const rage=g.enemyHp<boss.hp/2;
const preview=enemyHits(g);
// preview of the picked action: expected damage on the enemy bar, heal/shield on the party bars
const pv=(()=>{if(!picked||g.screen!=='battle'||busy)return null;const h=H(picked.id);const st=statOf(g,picked.id);const support=h.kind!=='attack'&&picked.type!=='basic';
const amt=picked.type==='ultimate'?(h.kind==='heal'?350:420):190;
return {dmg:Math.round(st.atk*coefOf(h.kind,picked.type,st.s)*buff),heal:support&&h.kind==='heal'?amt:0,shield:support&&h.kind==='shield'?amt:0}})();

const startBattle=()=>{if(gRef.current.party.length===3)transit(beginBattle)};
const beginBattle=()=>{const v=gRef.current;const b=bossOf(v.chapter);
setG({...v,screen:'battle',enemyHp:b.hp,used:[],turn:1,sp:5,shield:0,intent:'aoe',target:pick(v.party),energy:fill(h=>statOf(v,h.id).s>=4?50:0),hp:{...v.hp,...Object.fromEntries(v.party.map(id=>[id,statOf(v,id).hp]))}});
v.party.forEach(id=>{const i=new Image();i.src=artSrc(id)});
setSel(v.party[0]);setArt(a=>({cur:v.party[0],prev:null,n:a.n+1}));setCombo(0);setFloats([]);setBusy(false);setTimeout(()=>flashBanner('BATTLE START',900),TILE_OUT_MS)};

const enemyTurn=async()=>{
const v=gRef.current;
setCombo(0);setPick(null);await flashBanner('ENEMY TURN',700);
anim(bossRef.current,[{transform:'none'},{transform:'scale(1.18) translateY(36px)'},{transform:'none'}],450);
await wait(230);anim(arenaRef.current,SHAKE,450);
anim(artRef.current,[{filter:'brightness(1.6) sepia(1) hue-rotate(-50deg) saturate(5)',transform:'translateX(-6%)'},{transform:'translateX(2%)'},{filter:'none',transform:'none'}],450);
const {hits,shield}=enemyHits(v);const hp={...v.hp};
if(v.shield>0&&shield<v.shield)barrier(shield<=0?'break':'hit');
for(const [k,{dmg,blocked}] of Object.entries(hits)){const id=+k;hp[id]=Math.max(0,hp[id]-dmg+blocked);
pop(blocked?`-${dmg-blocked}\n🛡${blocked}`:`-${dmg}`,'hurt',v.party.indexOf(id));
anim(heroRefs.current[id],[{filter:'brightness(1.8) sepia(1) hue-rotate(-50deg) saturate(6)',transform:'translateX(-7px)'},{transform:'translateX(6px)'},{filter:'none',transform:'none'}],420)}
const lost=v.party.every(id=>hp[id]<=0);
const survivors=v.party.filter(id=>hp[id]>0);
setG({...v,hp,shield,turn:v.turn+1,sp:Math.min(6,v.sp+3),used:[],intent:Math.random()<.5?'aoe':'smash',target:survivors.length?pick(survivors):v.target,screen:lost?'defeat':'battle'});
if(lost)return;
await wait(450);setSel(v.party.find(id=>hp[id]>0)!);await flashBanner(`TURN ${v.turn+1}`,650)};

const act=async(type:'basic'|'skill'|'ultimate',who:number)=>{
const v=gRef.current;const hero=H(who);
if(busy||v.screen!=='battle'||v.used.includes(who)||v.hp[who]<=0)return;
if(type==='skill'&&v.sp<2)return;if(type==='ultimate'&&v.energy[who]<100)return;
setBusy(true);
if(who!==sel){setSel(who);await wait(450)}
if(type==='ultimate'){setCutin(hero);await wait(1100);setCutin(null)}
anim(heroRefs.current[who],[{transform:'none'},{transform:'translateY(-14px) scale(1.04)'},{transform:'none'}],340);
anim(artRef.current,[{transform:'none'},{transform:'translateX(12%) scale(1.06)',filter:'brightness(1.35)'},{transform:'none',filter:'none'}],type==='basic'?380:480);
await wait(170);
const support=hero.kind!=='attack'&&type!=='basic';
const crit=!support&&Math.random()<.2;
const st=statOf(v,who);
const dmg=Math.round(st.atk*coefOf(hero.kind,type,st.s)*buff*(crit?1.6:1)*(.92+Math.random()*.16));
anim(bossRef.current,[{filter:'brightness(3)',transform:'translateX(12px)'},{filter:'brightness(1)',transform:'none'}],320);
if(type!=='basic'||crit)anim(arenaRef.current,SHAKE,type==='ultimate'?520:300);
setSlash(s=>({key:s.key+1,type}));
pop(crit?`CRITICAL\n${dmg}`:`${dmg}`,crit?'crit':type==='ultimate'?'crit':'dmg','boss');
setCombo(c=>c+1);
const hp={...v.hp};let shield=v.shield;
if(support&&hero.kind==='heal'){const amt=type==='ultimate'?350:190;v.party.forEach((id,i)=>{if(hp[id]>0){hp[id]=Math.min(statOf(v,id).hp,hp[id]+amt);pop(`+${amt}`,'heal',i)}})}
if(support&&hero.kind==='shield'){const amt=type==='ultimate'?420:190;shield+=amt;barrier(type==='ultimate'?'big':'up');v.party.forEach((id,i)=>hp[id]>0&&pop(`🛡+${amt}`,'shield',i))}
const enemyHp=Math.max(0,v.enemyHp-dmg);const used=[...v.used,who];
setG({...v,hp,shield,enemyHp,used,sp:Math.min(6,v.sp-(type==='skill'?2:0)+(type==='basic'?1:0)),energy:{...v.energy,[who]:type==='ultimate'?0:Math.min(100,v.energy[who]+(type==='basic'?35:25))}});
if(enemyHp===0){anim(bossRef.current,[{opacity:1,filter:'brightness(1)'},{opacity:0,filter:'brightness(4)',transform:'scale(1.3)'}],700);await wait(800);go('victory');setBusy(false);return}
const next=v.party.find(id=>!used.includes(id)&&hp[id]>0);
if(next){await wait(250);setSel(next);setBusy(false);return}
await wait(550);await enemyTurn();setBusy(false)};

const finish=()=>transit(()=>setG(v=>({...v,chapter:Math.min(LAST,v.chapter+1),diamonds:v.diamonds+rewardOf(v.chapter),screen:v.chapter>=LAST-1?'lobby':'story'})));
const stage=bossOf(g.chapter);const done=g.chapter>=LAST;
const regionStages=STAGES.map((s,i)=>({...s,i})).filter(s=>s.region===stage.region);
const firstOfRegion=regionStages[0].i===Math.min(g.chapter,LAST-1);
const stars=g.turn<=4?3:g.turn<=7?2:1;
const chapterInfo=CHAPTERS[stage.region];

const NavBar=()=><nav className="navBar">{([['lobby','로비',House],['chars','캐릭터',Users],['map','지도',MapIcon]] as const).map(([s,l,Icon])=><button key={s} className={g.screen===s?'on':''} onClick={()=>go(s)}><Icon size={22}/>{l}</button>)}<button onClick={()=>go('shop')}><ShoppingBag size={22}/>상점</button></nav>;
const Diamonds=()=><span className="currency"><Gem size={14} color="#ff8ad8"/>{g.diamonds.toLocaleString()}</span>;
const TopBack=({title}:{title:string})=><header className="topBack"><button className="iconRound" onClick={()=>go('lobby')} aria-label="로비로"><ChevronLeft size={22}/></button><b>{title}</b><Diamonds/></header>;
const bn=BANNERS[bannerIdx];

const shown=HEROES.filter(h=>!genTab||h.gen===genTab);
const d=detail?H(detail):null;

return <main className="phone">
{g.screen==='lobby'&&<section className="screen lobby">
<div className="lobbyBg"/>
<header className="hud">
<div className="profile"><Portrait id={g.lead}/><div><b>Lv.{12+g.chapter} 마스터</b><small>{done?'데모 클리어':`스테이지 ${stage.no} 진행 중`}</small></div></div>
<Diamonds/>
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
<div className="lobbyActions">
<button className="partyBtn" onClick={()=>go('chars')}><div className="partyFaces">{g.party.map(id=><Portrait key={id} id={id}/>)}</div><span>파티 편성</span></button>
<button className="adventure" onClick={adventure}><small>{done?'데모 완료 · 다시 도전':`${stage.no} · ${stage.name}`}</small><b>모험 시작</b><Swords size={26} className="advIcon"/></button>
</div>
{done&&<div className="clearBadge"><Crown size={14}/> 데모 스토리 완료!</div>}
<NavBar/>
</section>}

{g.screen==='chars'&&<section className="screen chars">
<TopBack title="캐릭터"/>
<div className="partyRow">{[0,1,2].map(i=>{const id=g.party[i];return <button key={i} className="slot" onClick={()=>id&&openDetail(id)}>{id?<><Portrait id={id}/>{id===g.lead&&<Crown size={14} className="crown"/>}</>:<span>+</span>}</button>})}
<div className={`synergy s${syn}`}><Sparkles size={16}/><div><b>{syn?`유닛 ${syn}인 시너지`:'시너지 없음'}</b><small>{syn===3?'공격력 +13%':syn===2?'공격력 +7%':'같은 유닛 2명 이상 편성'}</small></div></div>
</div>
<div className="tabs">{['전체',...UNIT.slice(1)].map((t,i)=><button key={t} className={genTab===i?'on':''} onClick={()=>setGenTab(i)}>{t}</button>)}</div>
<div className="grid">{shown.map(h=>{const K=KIND[h.kind].Icon;const inParty=g.party.includes(h.id);const locked=!g.owned.includes(h.id);return <button key={h.id} className={`card ${inParty?'picked':''} ${locked?'locked':''}`} style={{'--c':GEN_COLOR[h.gen]} as React.CSSProperties} onClick={()=>openDetail(h.id)}>
{noGachaArt[h.id]?<Portrait id={h.id}/>:<img className="cardArt" src={gachaSrc(h.id)} alt={`${h.name} 이미지`} draggable={false} loading="lazy" style={cardCrop(h.id)} onError={()=>setNoGachaArt(m=>({...m,[h.id]:true}))}/>}<span className="genTag">{UNIT[h.gen]}</span>{(g.stars[h.id]||0)>0&&<span className="cardStars">{'★'.repeat(g.stars[h.id])}</span>}{inParty&&<span className="checkTag"><Check size={12}/>{g.party.indexOf(h.id)+1}</span>}
{locked&&<span className="lockTag"><Lock size={22}/><small>미보유</small></span>}
<div className="cardInfo"><K size={12}/><b>{h.name}</b><small>{h.job}</small></div></button>})}</div>
<div className="ctaBar"><button className="primary" disabled={g.party.length!==3} onClick={()=>go('story',true)}>{g.party.length===3?'편성 완료 · 모험으로':`${3-g.party.length}명 더 선택하세요`}<ChevronRight size={18}/></button></div>
</section>}

{g.screen==='shop'&&<section className="screen shop" style={{'--bc':bn.color} as React.CSSProperties}>
<div className="shopBg"/>
{bn.art&&<div className="packArt" key={'a'+bannerIdx}><div className="loadBlur" style={{backgroundImage:`url(${bn.art})`}}/><div className="packImg" style={{backgroundImage:`url(${bn.art})`}}/></div>}
<header className="shopTop">
<button className="iconRound" onClick={()=>go('lobby')} aria-label="뒤로"><ChevronLeft size={22}/></button>
<div className="shopTitle"><Sparkles size={15}/>멤버 모집</div>
<button className="iconRound" onClick={()=>go('lobby')} aria-label="로비로"><House size={18}/></button>
<span className="spacer"/>
<span className="currency big"><Gem size={15} color="#ff8ad8"/>{g.diamonds.toLocaleString()}<button className="plus" onClick={()=>{setG(v=>({...gRef.current,diamonds:gRef.current.diamonds+TEST_DIAMONDS}));say(`테스트 다이아 +${TEST_DIAMONDS.toLocaleString()}`)}} aria-label="다이아 충전">+</button></span>
</header>
<nav className="bannerList">{BANNERS.map((b,i)=><button key={b.title} className={`bannerCard ${i===bannerIdx?'on':''}`} style={{'--bc':b.color,backgroundImage:b.art?`linear-gradient(90deg,#0b1020e6 30%,#0b102055),url(${b.art})`:undefined} as React.CSSProperties} onClick={()=>setBannerIdx(i)}>
{b.pack.length?<span className="packFaces">{b.pack.map(id=><Portrait key={id} id={id}/>)}</span>:<span className="allIcon"><Users size={22}/></span>}<div><b>{b.title}</b><small>{b.pack.length?`${b.tag} · ${b.pack.length}명`:'전체 멤버 모집'}</small></div></button>)}</nav>
<div className="bannerHead" key={'h'+bannerIdx}>
<h2>{bn.title}</h2>
<div className="bannerMeta"><em className={bn.pack.length?'limited':'always'}>{bn.tag}</em>{bn.remain&&<span><Bell size={12}/>남은 시간 <b>{bn.remain}</b></span>}</div>
</div>
{bn.pack.length>0&&<div className="getTouch" key={'t'+bannerIdx}><span>획득 터치</span>{bn.pack.map(id=><button key={id} onClick={()=>openDetail(id)} aria-label={H(id).name}><Portrait id={id}/></button>)}</div>}
<div className="pityBox" key={'y'+bannerIdx}><small>천장까지</small><b>{PITY-(g.pity[bannerIdx]||0)}</b><small>회</small><div className="pityBar"><i style={{width:`${100*(g.pity[bannerIdx]||0)/PITY}%`}}/></div></div>
<div className="pickupBox" key={'p'+bannerIdx}>
{bn.pack.length>0?<><div className="pickupRow">{bn.pack.map(id=><button key={id} className="pickFace" style={{'--c':GEN_COLOR[H(id).gen]} as React.CSSProperties} onClick={()=>openDetail(id)}><Portrait id={id}/>{!g.owned.includes(id)&&<i>NEW</i>}</button>)}
<div className="pickName"><span className="starRow">{[0,1,2,3,4].map(i=><Star key={i} size={11}/>)}</span><b>{bn.pack.length<=2?bn.pack.map(id=>`「${H(id).name.split(' ').pop()}」`).join(' '):`${bn.title} ${bn.pack.length}인`}</b></div></div>
<p className="rateUp">{bn.title} 멤버 획득 확률 UP!!</p></>:<p className="rateUp">전체 멤버 모집</p>}
<div className="shopBtns"><button onClick={()=>setShopModal('rates')}>상세 정보</button><button onClick={()=>setShopModal('history')}>모집 기록</button><button onClick={()=>setShopModal('shards')}>조각 교환</button></div>
</div>
<div className="pullBox">
<p className="pullNote">{PITY}회 모집 시 {bn.pack.length?`${bn.title} 멤버`:'멤버'} 확정 획득</p>
<div className="pullBtns">
<button className="pullBtn" onClick={()=>pull(1)}><b>모집 1회</b><span><Gem size={13}/>{PULL_COST}</span></button>
<button className="pullBtn ten" onClick={()=>pull(10)}><b>모집 10회</b><span><Gem size={13}/>{PULL_COST*10}</span></button>
</div></div>
{shopModal&&<div className="sheetBg" onClick={()=>setShopModal(null)}><div className="shopModal" onClick={e=>e.stopPropagation()}>
<button className="iconRound close" onClick={()=>setShopModal(null)} aria-label="닫기"><X size={20}/></button>
{shopModal==='rates'?<><h3>{bn.title} · 획득 확률</h3>
<div className="rateTable">
<div className="tier char"><b>멤버</b><span>{(CHAR_RATE*100).toFixed(1)}%</span><small>{bn.pack.length?`${bn.title} 팩 ${(CHAR_RATE*PACK_SHARE*100).toFixed(1)}% (${bn.pack.map(id=>H(id).name.split(' ').pop()).join('·')} 균등) · 그 외 멤버 ${(CHAR_RATE*(1-PACK_SHARE)*100).toFixed(1)}%`:'전체 멤버 균등'}</small></div>
<div className="tier shard"><b>멤버 조각 ×{SHARD_DROP}</b><span>{(SHARD_RATE*100).toFixed(1)}%</span><small>{bn.pack.length?`${bn.title} 멤버 조각 ${(SHARD_RATE*PACK_SHARE*100).toFixed(1)}%`:'전체 멤버 균등'} · 조각 {SHARD_UNLOCK}개로 멤버 교환</small></div>
<div className="tier stone"><b>평범한 돌 (꽝)</b><span>{((1-CHAR_RATE-SHARD_RATE)*100).toFixed(1)}%</span><small>아무 효과 없음</small></div>
</div>
<p className="modalNote">천장: {PITY}회째 모집에서 {bn.pack.length?`${bn.title} 멤버`:'멤버'} 확정 (획득 시 초기화) · 보유 멤버 중복 시 1돌파 (6돌파 이후 조각 ×{DUP_SHARDS}) · 1회 <Gem size={11}/>{PULL_COST} · 스테이지 클리어 <Gem size={11}/>300 (정예 500 · 보스 800)</p></>
:shopModal==='history'?<><h3>모집 기록 <small>최근 {g.history.length}회</small></h3>{g.history.length?<div className="historyList">{g.history.map((p,i)=><div key={i} className={p.kind} style={{'--c':p.kind==='stone'?'#6b7390':GEN_COLOR[H(p.id).gen]} as React.CSSProperties}>{p.kind==='stone'?<i className="stoneIcon"/>:<Portrait id={p.id}/>}<span>{p.kind==='stone'?'돌':p.kind==='shard'?`${H(p.id).name.split(' ').pop()} 조각`:H(p.id).name.split(' ').pop()}</span></div>)}</div>:<p className="modalNote">아직 모집 기록이 없습니다.</p>}</>
:<><h3>조각 교환 <small>조각 {SHARD_UNLOCK}개 → 멤버 합류</small></h3><div className="shardList">{HEROES.map(h=>{const n=g.shards[h.id]||0;const own=g.owned.includes(h.id);return <div key={h.id} className={own?'own':''} style={{'--c':GEN_COLOR[h.gen]} as React.CSSProperties}>
<Portrait id={h.id}/><div className="shardInfo"><b>{h.name}</b><div className="statBar"><i style={{width:`${Math.min(100,100*n/SHARD_UNLOCK)}%`}}/></div><small>{n} / {SHARD_UNLOCK}</small></div>
{own?<span className="ownTag">보유</span>:<button className="primary mini" disabled={n<SHARD_UNLOCK} onClick={()=>unlockByShards(h.id)}>교환</button>}</div>})}</div></>}
</div></div>}
</section>}

{d&&<section className={`heroView tab-${detailTab}`} key={'hv'+d.id} style={{'--c':GEN_COLOR[d.gen]} as React.CSSProperties}>
<div className="hvSky"/>
<div className={`hvArt ${noGachaArt[d.id]?'cutout':''}`} key={'art'+detailTab}>{noGachaArt[d.id]?<BattleArt id={d.id}/>:<img src={gachaSrc(d.id)} alt="" draggable={false} onError={()=>setNoGachaArt(m=>({...m,[d.id]:true}))}/>}</div>
<header className="hvTop">
<button className="iconRound" onClick={()=>setDetail(null)} aria-label="뒤로"><ChevronLeft size={22}/></button>
<div className="hvName"><span className="genTag big">{UNIT[d.gen]}</span><b>{d.name}</b><small>{d.job} · {KIND[d.kind].label}</small></div>
<nav className="hvTabs">{([['info','정보'],['rp','RP 강화']] as const).map(([t,l])=><button key={t} className={detailTab===t?'on':''} onClick={()=>setDetailTab(t)}>{l}</button>)}</nav>
<Diamonds/>
</header>
{detailTab==='rp'?(()=>{const s=g.stars[d.id]||0;const own=g.owned.includes(d.id);const have=g.shards[d.id]||0;const cost=BT_COST[s];
const lvSel=rpSel??Math.min(s+1,MAX_STARS);
// six nodes on a quarter arc (top-right → bottom-left), like an eidolon chart; square box so the curve stays round
const ANG=Array.from({length:MAX_STARS},(_,i)=>(6+i*14.5)*Math.PI/180);
const pt=(a:number)=>[8+82*Math.cos(a),6+82*Math.sin(a)];
const arc=(a0:number,a1:number)=>{const[x0,y0]=pt(a0),[x1,y1]=pt(a1);return `M${x0} ${y0}A82 82 0 0 1 ${x1} ${y1}`};
return <>
<div className="rpArc">
<svg viewBox="0 0 100 100"><path className="rail" d={arc(ANG[0]-.12,ANG[MAX_STARS-1]+.12)}/>{s>1&&<path className="lit" d={arc(ANG[0],ANG[s-1])}/>}</svg>
{ANG.map((a,i)=>{const lv=i+1;const[x,y]=pt(a);return <button key={lv} className={`rpNode ${lv<=s?'done':''} ${lv===s+1?'next':''} ${[2,4,6].includes(lv)?'big':''} ${lv===lvSel?'sel':''}`} style={{left:`${x}%`,top:`${y}%`}} onClick={()=>setRpSel(lv)} aria-label={`${lv}돌파`}><i>{lv<=s?<Star size={14}/>:lv===s+1?<Sparkles size={14}/>:<Lock size={12}/>}</i><span>{lv}</span></button>})}
</div>
<div className="rpCard" key={lvSel}>
<div className="rpStars">{Array.from({length:MAX_STARS},(_,i)=><Star key={i} size={13} className={i<s?'on':''}/>)}<small>RP 강화 {s}/{MAX_STARS} · 능력치 +{Math.round(STAR_STAT*s*100)}%</small></div>
<small className="rpLv">{lvSel}단계 · {lvSel<=s?'달성':lvSel===s+1?'다음 단계':'잠김'}</small>
<h3>{starName(d.id,lvSel)}</h3>
<p>{STAR_EFFECT[lvSel]}{lvSel%2===0?' · 능력치 +8%':''}</p>
{!own?<div className="btAction"><Lock size={13}/>멤버를 보유하면 RP 강화를 할 수 있습니다</div>
:s>=MAX_STARS?<div className="btAction max"><Crown size={14}/>최대 돌파 달성!</div>
:<div className="btAction"><span>{d.name.split(' ').pop()} 조각 <b className={have>=cost?'ok':''}>{have}</b> / {cost}</span><button className="primary mini" disabled={have<cost} onClick={()=>{breakthrough(d.id);setRpSel(null)}}><Sparkles size={13}/>{s+1}돌파 · {starName(d.id,s+1)}</button></div>}
<p className="btNote">중복 멤버를 뽑으면 자동으로 1돌파 · 6돌파 이후 중복은 조각 ×{DUP_SHARDS}</p>
</div></>})():<div className="hvPanel" key="info">
<p className="bio">{d.bio}</p>
{(()=>{const st=statOf(g,d.id);const top=1+STAR_STAT*MAX_STARS;return <div className="stats">{([['HP',st.hp,d.hp,1200],['공격',st.atk,d.atk,185],['방어',st.def,d.def,90]] as const).map(([l,val,base,max])=><div key={l}><span>{l}</span><div className="statBar"><i style={{width:`${100*val/(max*top)}%`}}/></div><b>{val}{val>base&&<small className="statUp">+{val-base}</small>}</b></div>)}</div>})()}
{(()=>{const s=g.stars[d.id]||0;return <button className="rpLink" onClick={()=>setDetailTab('rp')}><b>RP 강화</b><span className="btStars">{Array.from({length:MAX_STARS},(_,i)=><Star key={i} size={13} className={i<s?'on':''}/>)}</span><small>{s}/{MAX_STARS}</small><ChevronRight size={16}/></button>})()}
{(()=>{const s=g.stars[d.id]||0;const line=(type:Act,heal:number,shield:number)=>{const c=coefOf(d.kind,type,s),base=coefOf(d.kind,type,0);
const dmg=<>피해계수 <b className="coef">{pct(c)}</b>{c>base&&<small className="statUp">돌파 +{pct(c-base)}</small>}</>;
return d.kind==='attack'||type==='basic'?<>적에게 {dmg}</>:d.kind==='heal'?<>아군 전체 HP {heal} 회복 · {dmg}</>:<>파티 보호막 {shield} · {dmg}</>};
return <><div className="skillInfo basic"><Swords size={18}/><div><b>기본 공격 <small>SP +1</small></b><p>{line('basic',0,0)}</p></div></div>
<div className="skillInfo"><Flame size={18}/><div><b>{d.skill} <small>SP 2</small></b><p>{line('skill',190,190)}</p></div></div>
<div className="skillInfo ult"><Sparkles size={18}/><div><b>{d.ultimate} <small>궁극기</small></b><p>{line('ultimate',350,420)}</p></div></div></>})()}
{g.owned.includes(d.id)?<div className="sheetActions">
<button className="secondary" disabled={g.lead===d.id} onClick={()=>{setG(v=>({...v,lead:d.id}));say('대표 캐릭터로 설정했습니다')}}><Crown size={16}/>{g.lead===d.id?'대표 캐릭터':'대표로 설정'}</button>
{g.screen==='chars'&&<button className="primary" onClick={()=>{togglePartyMember(d.id);setDetail(null)}}>{g.party.includes(d.id)?'파티에서 해제':'파티 편성'}</button>}
</div>:<div className="sheetActions">
<button className="secondary" disabled><Lock size={16}/>미보유 멤버</button>
{g.screen!=='shop'&&<button className="primary" onClick={()=>{setDetail(null);go('shop')}}><ShoppingBag size={16}/>상점에서 모집</button>}
</div>}</div>}</section>}

{g.screen==='story'&&<section className="screen story">
<TopBack title={chapterInfo.title}/>
<div className="storyBg" key={stage.region}><div className="loadBlur" style={{backgroundImage:`url(${STORY_BG[stage.region]})`}}/><div className="loadImg" style={{backgroundImage:`url(${STORY_BG[stage.region]})`}}/></div>
<div className="stageStrip">{regionStages.map(s=><div key={s.i} className={`stageNode ${s.rank} ${s.i<g.chapter?'clear':''} ${s.i===Math.min(g.chapter,LAST-1)?'now':''}`}>
<img src={`/monsters/${encodeURIComponent(s.name)}.png`} alt="" draggable={false}/>{s.i<g.chapter&&<i className="clearMark"><Check size={12}/></i>}<small>{s.no}</small></div>)}</div>
<div className="storyScene"><div className="dialogue"><span className="speaker">{firstOfRegion?chapterInfo.npc:`STAGE ${stage.no}`}</span>
<p>{firstOfRegion?chapterInfo.line:stage.rank==='boss'?`“이 지역의 주인, ${stage.name}이(가) 모습을 드러냈다!”`:stage.rank==='elite'?`“강한 기운이 느껴진다… ${stage.name}이다!”`:`“${stage.name}이(가) 길을 막고 있다!”`}</p>
<small>{firstOfRegion?chapterInfo.text:`${stage.rank==='boss'?'보스':stage.rank==='elite'?'정예':'일반'} · HP ${stage.hp.toLocaleString()} · 클리어 보상 💎${rewardOf(g.chapter)}`}</small></div></div>
<div className="ctaBar row"><button className="secondary" onClick={()=>go('map')}><MapIcon size={16}/>지도</button><button className="primary" onClick={startBattle}><Swords size={18}/>{stage.rank==='boss'?(stage.region===2?'최종 보스 도전':'보스 도전'):'전투 시작'}</button></div>
</section>}

{g.screen==='map'&&<section className="screen map">
<TopBack title="별빛의 대륙"/>
<div className="mapPath">{REGION_MAP.map((x,i)=>{const list=STAGES.filter(s=>s.region===i);const cleared=STAGES.filter((s,k)=>s.region===i&&k<g.chapter).length;const open=stage.region>=i;
return <button key={x.name} className={`mapNode ${open?'open':''} ${!done&&stage.region===i?'now':''}`} disabled={!open} onClick={()=>go('story')}><span>{x.icon}</span><b>{x.name}</b><small>{!open?'잠김':cleared>=list.length?'클리어':`${cleared} / ${list.length} 스테이지`}</small></button>})}</div>
<NavBar/>
</section>}

{['battle','victory','defeat'].includes(g.screen)&&<section className={`screen battle ${stage.rank==='boss'?'final':''}`}>
{BATTLE_BG[stage.region]&&<div className="battleBg" style={{backgroundImage:`url(${BATTLE_BG[stage.region]})`}}/>}
<header className="bTop">
<div className="bLeft">
<button className="iconRound" disabled={busy} onClick={()=>confirm('전투를 포기하고 로비로 돌아갈까요?')&&go('lobby')} aria-label="전투 포기"><ChevronLeft size={20}/></button>
<div className="turnTag">TURN<b>{g.turn}</b></div>
<div className="spBox"><div className="spRow"><span>SP</span><div className="pips">{[0,1,2,3,4,5].map(i=><i key={i} className={i<g.sp?'on':''}/>)}</div></div>
<div className="spRow"><span className="shieldTxt"><Shield size={12}/>{g.shield}</span><span className="synTxt"><Sparkles size={12}/>{syn?`ATK +${syn===3?13:7}%`:'시너지 없음'}</span></div></div>
</div>
<div className="bRight">
<div className="stageTag">STAGE <b>{stage.no}</b></div>
<div className="bossBar"><div className="bossLabel"><i className={`bossTag ${stage.rank}`}>{stage.rank==='boss'?'BOSS':stage.rank==='elite'?'ELITE':'ENEMY'}</i><b>{boss.name}</b>{rage&&<em>광폭화</em>}{pv&&pv.dmg>0&&<em className="prevNum">예상 -{pv.dmg.toLocaleString()}</em>}<span>{g.enemyHp.toLocaleString()} / {boss.hp.toLocaleString()}</span></div>
<div className="bar"><i className="ghost" style={{width:`${100*g.enemyHp/boss.hp}%`}}/><i className="fill" style={{width:`${100*g.enemyHp/boss.hp}%`}}/>{pv&&pv.dmg>0&&<i className="dmgPrev" style={{left:`${100*Math.max(0,g.enemyHp-pv.dmg)/boss.hp}%`,width:`${100*Math.min(g.enemyHp,pv.dmg)/boss.hp}%`}}/>}</div></div>
<div className={`intent ${g.intent}`} key={`${g.turn}-${g.intent}-${g.target}`}>{g.intent==='aoe'?<Users size={13}/>:<Crosshair size={13}/>}<span>다음 행동</span><b>{g.intent==='aoe'?'광역 공격':'강타'}</b><ChevronRight size={12}/><b>{g.intent==='aoe'?'파티 전체':H(g.target).name}</b>{Object.keys(preview.hits).length>0&&<em>총 -{Object.values(preview.hits).reduce((s,x)=>s+x.dmg-x.blocked,0)}</em>}</div>
</div>
</header>
<div className="arena" ref={arenaRef}>
<div className={`bossBox ${rage?'rage':''}`}>
<div ref={bossRef}><img className="bossImg" src={`/monsters/${encodeURIComponent(boss.name)}.png`} alt={boss.name} draggable={false}/></div>
{slash.key>0&&<div key={slash.key} className={`slash ${slash.type}`}/>}
{slash.key>0&&<i key={'r'+slash.key} className={`impactRing ${slash.type}`}/>}</div>
<div className="artStage">
{art.prev!==null&&<div key={'p'+art.n} className="heroArt out" onAnimationEnd={e=>e.target===e.currentTarget&&setArt(a=>({...a,prev:null}))}><BattleArt id={art.prev}/></div>}
<div key={'c'+art.n} ref={artRef} className="heroArt in" style={{'--c':GEN_COLOR[H(art.cur).gen]} as React.CSSProperties}>
<i className="artGlow"/><i className="speedLines"/>
<BattleArt id={art.cur} className="ghost g1"/><BattleArt id={art.cur} className="ghost g2"/>
<div className="artIdle"><BattleArt id={art.cur}/></div>
</div>
<div key={'n'+art.n} className="artName" style={{'--c':GEN_COLOR[H(art.cur).gen]} as React.CSSProperties}><small>{UNIT[H(art.cur).gen]} · {H(art.cur).job}</small><b>{H(art.cur).name}</b></div>
</div>
{slash.key>0&&<svg key={'t'+slash.key} className={`trail ${slash.type}`} viewBox="0 0 100 100" preserveAspectRatio="none"><path pathLength={1} d="M40 40 Q52 -2 64 40"/></svg>}
{combo>1&&<div className="combo" key={combo}><b>{combo}</b> HIT</div>}
{floats.map(f=><div key={f.id} className={`float ${f.kind}`} style={{left:`${f.x}%`,top:`${f.y}%`}}>{f.text}</div>)}
{banner&&<div className="banner" key={banner}>{banner}</div>}
</div>
<div className="allyRow">{g.party.map(id=>{const h=H(id);const e=g.energy[id]||0;const off=busy||g.screen!=='battle'||g.used.includes(id)||g.hp[id]<=0;
const hit=g.screen==='battle'?preview.hits[id]:undefined;const loss=hit?Math.min(g.hp[id],hit.dmg-hit.blocked):0;const after=g.hp[id]-loss;const ko=!!hit&&after<=0;
return <div key={id} ref={el=>{heroRefs.current[id]=el}} className={`ally ${sel===id?'active':''} ${g.used.includes(id)?'acted':''} ${g.hp[id]<=0?'down':''} ${hit?'targeted':''} ${ko?'ko':''}`} style={{'--c':GEN_COLOR[h.gen]} as React.CSSProperties}>
<button className="allyFace" disabled={busy||g.hp[id]<=0} onClick={()=>setSel(id)} aria-label={`${h.name} 선택`}><Portrait id={id}/>{hit&&<i className="targetMark"><Crosshair size={14}/></i>}{g.used.includes(id)&&<i className="doneTag">행동 완료</i>}</button>
<div className="allyBody">
<div className="allyHead"><b>{h.name}</b>{g.shield>0&&g.hp[id]>0&&<em className="shieldPill"><Shield size={10}/>{g.shield}</em>}{pv&&pv.heal>0&&g.hp[id]>0&&g.hp[id]<statOf(g,id).hp&&<em className="gainPill">+{Math.min(pv.heal,statOf(g,id).hp-g.hp[id])}</em>}{pv&&pv.shield>0&&g.hp[id]>0&&<em className="shieldPill add"><Shield size={10}/>+{pv.shield}</em>}{hit&&<em className="dmgPreview">{ko?<><Skull size={10}/>전투불능 </>:''}{loss>0?`-${loss}`:'완전 방어'}{hit.blocked>0&&<small>🛡{hit.blocked}</small>}</em>}<span>{hit?<>{g.hp[id]}<ChevronRight size={9}/>{after}</>:g.hp[id]}</span></div>
{(()=>{const mx=statOf(g,id).hp;const cur=g.hp[id];const gain=pv&&pv.heal>0&&cur>0?Math.min(pv.heal,mx-cur):0;const sh=g.hp[id]>0?g.shield:0;const add=pv&&cur>0?pv.shield:0;
return <div className="hpWrap"><div className="hp"><i style={{width:`${100*after/mx}%`}}/>{loss>0&&<i className="loss" style={{left:`${100*after/mx}%`,width:`${100*loss/mx}%`}}/>}{gain>0&&<i className="gain" style={{left:`${100*cur/mx}%`,width:`${100*gain/mx}%`}}/>}</div>
{(sh>0||add>0||shieldFx?.type==="break")&&<div className={`shieldBar ${shieldFx?.type??""}`} key={shieldFx?.key??"s"}><i style={{width:`${Math.min(100,100*sh/mx)}%`}}/>{add>0&&<i className="add" style={{left:`${Math.min(100,100*sh/mx)}%`,width:`${Math.min(100-Math.min(100,100*sh/mx),100*add/mx)}%`}}/>}</div>}</div>})()}
<div className="allySkills">
<button className={`skillBtn ${isPick(id,'basic')?'picked':''}`} disabled={off} onClick={()=>choose('basic',id)}><Swords size={18}/><b>공격</b><small>SP +1</small></button>
<button className={`skillBtn ${isPick(id,'skill')?'picked':''} ${g.sp<2?'lack':''}`} disabled={off} onClick={()=>choose('skill',id)}><Flame size={18}/><b>{h.skill}</b><small>SP 2</small></button>
<button className={`skillBtn ult ${e>=100?'ready':''} ${isPick(id,'ultimate')?'picked':''} ${e<100?'lack':''}`} style={{'--p':e} as React.CSSProperties} disabled={off} onClick={()=>choose('ultimate',id)}><Sparkles size={18}/><b>{h.ultimate}</b><small>{e>=100?'발동!':`${e}%`}</small></button>
</div></div></div>})}</div>
{picked&&g.screen==='battle'&&!busy&&(()=>{const h=H(picked.id);const st=statOf(g,picked.id);const c=coefOf(h.kind,picked.type,st.s);
const est=Math.round(st.atk*c*buff);const ok=canUse(picked.type,picked.id);const e=g.energy[picked.id]||0;
const name=picked.type==='basic'?'기본 공격':picked.type==='skill'?h.skill:h.ultimate;
const Icon=picked.type==='basic'?Swords:picked.type==='skill'?Flame:Sparkles;
const support=h.kind!=='attack'&&picked.type!=='basic';const amt=picked.type==='ultimate'?(h.kind==='heal'?350:420):190;
const reason=g.used.includes(picked.id)?'이미 행동했습니다':picked.type==='skill'&&g.sp<2?`SP가 부족합니다 (${g.sp}/2)`:picked.type==='ultimate'&&e<100?`궁극기 게이지 ${e}%`:'';
return <div className={`skillPop ${picked.type} col${g.party.indexOf(picked.id)}`} key={picked.id+picked.type} style={{'--c':GEN_COLOR[h.gen]} as React.CSSProperties}>
<div className="spHead"><Icon size={18}/><div><b>{name}</b><small>{h.name.split(' ').pop()} · {picked.type==='basic'?'기본 공격':picked.type==='skill'?'스킬':'궁극기'}</small></div>
<em>{picked.type==='basic'?'SP +1':picked.type==='skill'?'SP -2':'게이지 100%'}</em></div>
<ul className="spBody">
<li><span>피해계수</span><b>{pct(c)}</b><small>예상 피해 약 {est.toLocaleString()}{syn?` (시너지 포함)`:''}</small></li>
{support&&h.kind==='heal'&&<li><span>회복</span><b>아군 전체 +{amt}</b></li>}
{support&&h.kind==='shield'&&<li><span>보호막</span><b>파티 +{amt}</b><small>현재 {g.shield}</small></li>}
<li><span>게이지</span><b>{picked.type==='ultimate'?'궁극기 게이지 소모':`궁극기 +${picked.type==='basic'?35:25}%`}</b></li>
</ul>
<div className="spActions"><button className="secondary" onClick={()=>setPick(null)}>취소</button>
<button className="primary" disabled={!ok} onClick={()=>{setPick(null);act(picked.type,picked.id)}}>{ok?<>사용<ChevronRight size={15}/></>:reason}</button></div>
</div>})()}
{cutin&&<div className="cutin"><div className="stripe"/><BattleArt id={cutin.id} className="cutArt"/><div className="cutText"><small>ULTIMATE</small><b>{cutin.ultimate}</b></div></div>}
{g.screen==='victory'&&<div className="result win"><div className="stars">{[1,2,3].map(i=><Star key={i} size={44} className={i<=stars?'on':''} style={{animationDelay:`${i*.18}s`}}/>)}</div><h2>VICTORY</h2><p>{g.turn}턴 클리어 · 보상 <Gem size={14} color="#ff8ad8"/> {rewardOf(g.chapter)}</p><button className="primary" onClick={finish}>{g.chapter>=LAST-1?'엔딩으로':stage.rank==='boss'?'다음 지역':'다음 스테이지'}<ChevronRight size={18}/></button></div>}
{g.screen==='defeat'&&<div className="result lose"><Skull size={48}/><h2>DEFEAT</h2><p>파티가 전멸했습니다.</p><div className="row"><button className="secondary" onClick={()=>go('lobby')}>로비로</button><button className="primary" onClick={startBattle}><RotateCcw size={16}/>재도전</button></div></div>}
</section>}

{summon&&(()=>{const multi=summon.pulls.length>1;const best=summon.pulls.find(p=>p.kind==='char'&&inPack(bn,p.id))??summon.pulls.find(p=>p.kind==='char');
const actionBtns=<><button className="secondary" onClick={()=>setSummon(null)}>확인</button>
<button className="primary" onClick={()=>{const n=summon.pulls.length;setSummon(null);pull(n)}}><Gem size={14}/>{PULL_COST*summon.pulls.length} · 한 번 더</button></>;
const actions=<div className="summonActions">{actionBtns}</div>;
return <div className={`summon ph-${summon.phase} tier-${summon.tier}`} key={summon.key+summon.phase}>
{summon.phase==='orb'&&<button className="orbStage" onClick={()=>setSummon(s=>s&&{...s,phase:s.tier==='char'?'char':'reveal'})} aria-label="건너뛰기">
<div className="skyFx"><i className="clouds"/><i className="clouds c2"/></div>
<svg className="circleFx" viewBox="-100 -100 200 200" aria-hidden="true"><circle r="92" className="ring r1"/><circle r="76" className="ring r2"/><circle r="60" className="ring r3"/>
<polygon className="hexa" points="0,-58 50,29 -50,29"/><polygon className="hexa" points="0,58 50,-29 -50,-29"/></svg>
<i className="rays"/>
<div className="comet"><i className="tail"/><i className="tail t2"/><i className="tail t3"/><i className="head"/><i className="arc"/></div>
{DEBRIS.map((d,i)=><i key={i} className="debris" style={{left:`${d.x}%`,top:`${d.y}%`,'--t':`${d.t}s`,'--dx':`${d.dx}px`,'--dy':`${d.dy}px`} as React.CSSProperties}/>)}
<i className="impactFx"/><i className="flare"/><i className="orb"/><i className="upgrade"/>{[0,1,2,3,4,5,6,7,8,9,10,11].map(i=><i key={i} className="spark" style={{'--a':`${i*30}deg`} as React.CSSProperties}/>)}
<span className="orbText">{summon.tier==='char'?'강한 빛이 느껴진다...!':'모집 중...'}</span><small className="skipHint">터치하여 건너뛰기</small></button>}
{summon.phase==='char'&&best&&(()=>{const h=H(best.id);const full=!noGachaArt[h.id];return <>
{full&&<div className="pullFull"><img src={gachaSrc(h.id)} alt="" draggable={false} onError={()=>setNoGachaArt(m=>({...m,[h.id]:true}))}/></div>}
<div className={`pullSingle ${full?'withFull':''}`} style={{'--c':GEN_COLOR[h.gen]} as React.CSSProperties}>
<i className="singleGlow"/><i className="burstRays"/><i className="streaks"/>
{Array.from({length:26},(_,i)=><i key={i} className="mote" style={{left:`${(i*37)%100}%`,'--t':`${(i*0.27)%2.4}s`,'--s':`${2+(i*7)%5}px`} as React.CSSProperties}/>)}
<BattleArt id={h.id} className="singleArt"/>
<div className="singleInfo">{inPack(bn,best.id)&&<em className="limitTag">{bn.title} 팩</em>}<span className="genTag big">{UNIT[h.gen]}</span>
<h2>{[...h.name].map((ch,i)=><span key={i} style={{'--k':i} as React.CSSProperties}>{ch}</span>)}</h2><p>{h.job}</p>
{best.isNew?<em className="stamp new">NEW!</em>:best.star?<em className="stamp new">★{best.star} 돌파!<small>{starName(best.id,best.star)}</small></em>:<em className="stamp dup">최대 돌파 · 조각 ×{DUP_SHARDS}</em>}</div></div>
{multi?<div className="summonActions late"><button className="primary" onClick={()=>setSummon(s=>s&&{...s,phase:'reveal'})}>결과 보기<ChevronRight size={16}/></button></div>:<div className="summonActions late">{actionBtns}</div>}</>})()}
{summon.phase==='reveal'&&(()=>{const done=flipAt(summon.pulls,summon.pulls.length-1)+500;return <>{multi?<div className="pullGrid">{summon.pulls.map((p,i)=><PullCard key={i} p={p} i={i} flip={flipAt(summon.pulls,i)}/>)}</div>
:<div className="pullOne"><PullCard p={summon.pulls[0]} i={0} flip={flipAt(summon.pulls,0)}/><p style={{animationDelay:`${done}ms`}}>{summon.pulls[0].kind==='stone'?'평범한 돌... 아쉽네요!':`${H(summon.pulls[0].id).name} 조각 ×${SHARD_DROP} 획득`}</p></div>}
<div className="summonActions" style={{animationDelay:`${done}ms`}}>{actionBtns}</div></>})()}
</div>})()}
{btFx&&<button className="btFx" key={btFx.key} style={{'--c':GEN_COLOR[H(btFx.id).gen]} as React.CSSProperties} onClick={()=>setBtFx(null)}>
<i className="btRays"/><BattleArt id={btFx.id} className="btArt"/>
<div className="btText"><span className="btStars">{Array.from({length:MAX_STARS},(_,i)=><Star key={i} size={20} className={i<btFx.s?'on':''} style={{'--k':i} as React.CSSProperties}/>)}</span>
<small>RP 강화 · {btFx.s}돌파</small><h2>{starName(btFx.id,btFx.s)}</h2><p>{STAR_EFFECT[btFx.s]}</p></div></button>}
{loading&&<div className="loadingScreen">
<div className="loadBlur" style={{backgroundImage:`url(${loading.img})`}}/><div className="loadImg" style={{backgroundImage:`url(${loading.img})`}}/>
<div className="loadBottom"><p className="loadTip"><b>TIP</b>{loading.tip}</p><div className="loadRow"><Sparkles size={16} className="loadSpin"/><span>NOW LOADING</span><div className="loadBar"><i/></div></div></div>
</div>}
{tiles&&<div key={tiles} className={`tiles ${tiles}`} aria-hidden="true">{tileDelays.current.map((d,i)=><i key={i} style={{'--d':`${tiles==='in'?d.in:d.out}ms`} as React.CSSProperties}/>)}
<div className="tileLogo"><div className="ring"><Sparkles size={38}/></div><span>STELLAR QUEST</span></div></div>}
{toast&&<div className="toast">{toast}</div>}
<div className="rotateHint"><RotateCcw size={40}/><b>휴대폰을 가로로 돌려 주세요</b><small>STELLAR QUEST는 가로 화면 전용입니다</small></div>
</main>}
