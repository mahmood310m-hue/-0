import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const initialStudents=[
 {id:1,name:'زهراء أحمد',grade:'الصف السادس',score:98,award:'المركز الأول'},
 {id:2,name:'علي محمد',grade:'الصف الخامس',score:96,award:'تميز دراسي'},
 {id:3,name:'مريم حسن',grade:'الصف الرابع',score:95,award:'تفوق مستمر'},
 {id:4,name:'حسين كريم',grade:'الصف السادس',score:94,award:'المركز الثالث'}
];
const menu=[
 ['⌂','الرئيسية'],['★','المتفوقون'],['▤','الدرجات'],['◷','الحضور'],['✎','الواجبات'],['▦','الجدول'],['▣','الإعلانات'],['☎','التواصل']
];
function App(){
 const [page,setPage]=useState('الرئيسية');
 const [students]=useState(()=>JSON.parse(localStorage.getItem('kauthar-students')||'null')||initialStudents);
 const [notice,setNotice]=useState('');
 const [search,setSearch]=useState('');
 const [tab,setTab]=useState('الكل');
 const [showNotice,setShowNotice]=useState(false);
 const [notices,setNotices]=useState(()=>JSON.parse(localStorage.getItem('kauthar-notices')||'null')||['بدء استقبال طلبات التسجيل للعام الدراسي الجديد','تهنئة لطلابنا المتفوقين بنتائجهم المميزة','يرجى متابعة الواجبات والجدول الدراسي بشكل يومي']);
 const addNotice=()=>{if(!notice.trim())return;const next=[notice,...notices];setNotices(next);localStorage.setItem('kauthar-notices',JSON.stringify(next));setNotice('');setShowNotice(false)};
 const filtered=students.filter(s=>s.name.includes(search)||s.grade.includes(search));
 const heading=page==='الرئيسية'?'مرحباً بكم في مدرسة كوثر':page;
 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><div className="logo">ك</div><div><b>مدرسة كوثر</b><small>الأهلية المختلطة</small></div></div>
   <div className="side-label">القائمة الرئيسية</div>
   {menu.map(([ic,label])=><button key={label} className={'nav '+(page===label?'active':'')} onClick={()=>setPage(label)}><span>{ic}</span>{label}</button>)}
   <div className="side-bottom"><div className="mini-seal">✦</div><b>نرتقي بالعلم والقيم</b><small>معاً نحو مستقبل أفضل</small></div>
  </aside>
  <main className="main">
   <header className="topbar"><div className="mobile-brand"><div className="logo">ك</div><b>مدرسة كوثر</b></div><div className="crumb">مدرسة كوثر <span>/</span> {page}</div><div className="top-actions"><span className="year">العام الدراسي ٢٠٢٦ – ٢٠٢٧</span><button className="bell" onClick={()=>setPage('الإعلانات')}>♧</button></div></header>
   <section className="content">
    <div className="welcome"><div><span className="eyebrow">مدرستنا • بيت العلم والإبداع</span><h1>{heading}</h1><p>{page==='الرئيسية'?'بيئة تعليمية آمنة ومحفزة، نؤمن أن لكل طالب موهبة تستحق الرعاية.':'تابع المعلومات والخدمات المدرسية بسهولة من مكان واحد.'}</p></div><div className="welcome-art"><div className="sun"></div><div className="book">▱</div><div className="plant">✿</div></div></div>
    {page==='الرئيسية'&&<><div className="stats">
      <Stat icon="♙" label="الطلاب" value="—" note="يضاف العدد من الإدارة"/>
      <Stat icon="★" label="المتفوقون" value={students.length} note="نماذج من لوحة الشرف"/>
      <Stat icon="▣" label="الإعلانات" value={notices.length} note="إعلانات المدرسة"/>
      <Stat icon="◷" label="العام الدراسي" value="٢٠٢٦" note="٢٠٢٦ – ٢٠٢٧"/>
     </div><div className="section-head"><div><h2>أخبار وإعلانات المدرسة</h2><p>آخر المستجدات والنشاطات</p></div><button className="text-btn" onClick={()=>setPage('الإعلانات')}>عرض الكل ←</button></div><div className="notice-grid">{notices.slice(0,3).map((n,i)=><article className="notice" key={i}><span className="notice-icon">✦</span><small>إعلان مدرسي</small><h3>{n}</h3><span className="muted">مدرسة كوثر الأهلية</span></article>)}</div><div className="section-head"><div><h2>نجوم كوثر</h2><p>نفخر بإنجازات طلابنا</p></div><button className="text-btn" onClick={()=>setPage('المتفوقون')}>لوحة الشرف ←</button></div><StudentTable students={students.slice(0,3)}/></>}
    {page==='المتفوقون'&&<><div className="section-head"><div><h2>لوحة شرف المتفوقين</h2><p>نحتفي بالاجتهاد والتميز والإبداع</p></div><span className="pill">⭐ نجوم كوثر</span></div><div className="filters"><input placeholder="ابحث عن اسم الطالب أو الصف..." value={search} onChange={e=>setSearch(e.target.value)}/><span>{filtered.length} طلاب</span></div><StudentTable students={filtered}/></>}
    {page==='الدرجات'&&<InfoPanel title="متابعة الدرجات والنتائج" desc="يمكن للإدارة إضافة درجات الطلاب بعد ربط التطبيق بنظام بيانات آمن." icon="▤" items={['نتائج الامتحانات الشهرية','نتائج نصف السنة','النتائج النهائية','تقارير المستوى الدراسي']}/>}
    {page==='الحضور'&&<InfoPanel title="الحضور والغياب" desc="خدمة متابعة دوام الطلاب وتسجيل حالات الحضور والغياب." icon="◷" items={['سجل الحضور اليومي','إشعارات الغياب','ملخص الحضور الأسبوعي']}/>}
    {page==='الواجبات'&&<InfoPanel title="الواجبات والأنشطة" desc="مساحة لمتابعة الواجبات والأنشطة الصفية." icon="✎" items={['الواجبات اليومية','الأنشطة المدرسية','المشاريع والمسابقات']}/>}
    {page==='الجدول'&&<InfoPanel title="الجدول الدراسي" desc="الجداول الأسبوعية لكل صف دراسي." icon="▦" items={['الصفوف الابتدائية','الصفوف المتوسطة','الصفوف الإعدادية']}/>}
    {page==='الإعلانات'&&<><div className="section-head"><div><h2>الإعلانات والأخبار</h2><p>كل ما هو جديد في مدرستنا</p></div><button className="primary" onClick={()=>setShowNotice(true)}>＋ إضافة إعلان</button></div><div className="notice-list">{notices.map((n,i)=><article className="notice-row" key={i}><span className="notice-icon">✦</span><div><b>{n}</b><small>إعلان مدرسي • مدرسة كوثر</small></div></article>)}</div>{showNotice&&<div className="modal-back"><div className="modal"><button className="close" onClick={()=>setShowNotice(false)}>×</button><h2>إضافة إعلان</h2><textarea value={notice} onChange={e=>setNotice(e.target.value)} placeholder="اكتب نص الإعلان هنا..."/><button className="primary full" onClick={addNotice}>نشر الإعلان</button></div></div>}</>}
    {page==='التواصل'&&<InfoPanel title="تواصل مع إدارة المدرسة" desc="يسعدنا استقبال استفساراتكم ومقترحاتكم." icon="☎" items={['إدارة المدرسة','شؤون الطلبة','الدعم والاستفسارات']}/>}
    <footer>© ٢٠٢٦ مدرسة كوثر الأهلية المختلطة <span>التعليم رسالة وبناء</span></footer>
   </section>
  </main>
 </div>
}
function Stat({icon,label,value,note}){return <div className="stat"><div className="stat-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong><em>{note}</em></div></div>}
function StudentTable({students}){return <div className="table-wrap"><table><thead><tr><th>الطالب</th><th>الصف</th><th>المعدل</th><th>التكريم</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td><span className="avatar">{s.name[0]}</span>{s.name}</td><td>{s.grade}</td><td><b className="score">{s.score}%</b></td><td><span className="award">✦ {s.award}</span></td></tr>)}</tbody></table>{students.length===0&&<p className="empty">لا توجد نتائج مطابقة.</p>}</div>}
function InfoPanel({title,desc,icon,items}){return <div className="info-panel"><div className="info-icon">{icon}</div><h2>{title}</h2><p>{desc}</p><div className="info-items">{items.map((x,i)=><div key={i}><span>◇</span>{x}<b>قريباً</b></div>)}</div><small className="hint">هذه واجهة أولية؛ تفعيل البيانات الفعلية يتطلب لوحة إدارة وقاعدة بيانات.</small></div>}
createRoot(document.getElementById('root')).render(<App/>);
