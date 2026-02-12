let uploadedImage = null;
let selectedTemplate = null;

// === CARD DEFINITIONS ===
const cardDefs = [
  { id:'flight-log', title:'Flight Log', desc:'Passenger manifest from the Lolita Express. First class, naturally.', badge:'Aviation Records', badgeClass:'badge-flight', tags:['CLASSIFIED','NOFORN','BOEING 727'], previewClass:'preview-flight',
    previewHTML:'<div class="mini-doc"><div class="mini-header">Federal Bureau of Investigation</div><div class="mini-title">Flight Manifest Extract</div><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-stamp">CLASSIFIED</div></div>' },
  { id:'island-guest', title:'Island Guest List', desc:'VIP visitor at Little St. James. The cabana was lovely, allegedly.', badge:'Recovered Evidence', badgeClass:'badge-island', tags:['TOP SECRET','RECOVERED','GUEST LEDGER'], previewClass:'preview-island',
    previewHTML:'<div class="mini-doc"><div class="mini-header">Visitor Registry — Little St. James</div><div class="mini-entry">Guest: ████████<br>Villa: The Orchid<br>Notes: "Very important guest..."</div><div class="mini-stamp-green">DECLASSIFIED</div></div>' },
  { id:'fbi-memo', title:'FBI Surveillance Memo', desc:'A top-secret internal memorandum documenting your suspicious activities.', badge:'Law Enforcement', badgeClass:'badge-fbi', tags:['SECRET','EYES ONLY','ACTIVE'], previewClass:'preview-fbi',
    previewHTML:'<div class="mini-doc"><div class="fbi-seal">FBI</div><div class="mini-header">Internal Memorandum</div><div class="mini-bold-line">MEMORANDUM FOR THE RECORD</div><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div><div class="mini-stamp">CLASSIFIED</div></div>' },
  { id:'black-book', title:'Black Book Entry', desc:'Your name, number, and a cryptic note in the infamous contacts ledger.', badge:'Personal Effects', badgeClass:'badge-book', tags:['EVIDENCE','HANDWRITTEN','CIRCLED'], previewClass:'preview-book',
    previewHTML:'<div class="mini-doc"><div class="book-title">CONTACTS</div><div class="book-entry">████████<br>☎ ███-████<br>📝 "Knows about the<br>paintings..."<br><div class="book-star">⭐⭐⭐</div></div></div>' },
  { id:'deposition', title:'Court Deposition', desc:'Sworn testimony mentions you by name. Your lawyer is unavailable.', badge:'Court Records', badgeClass:'badge-depo', tags:['SEALED','UNDER OATH','TRANSCRIPT'], previewClass:'preview-depo',
    previewHTML:'<div class="mini-doc"><div class="line-nums">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8</div><div class="court-header"><div>U.S. District Court</div><div>Southern District of New York</div></div><div class="qa-line"><strong>Q:</strong> And your relationship—</div><div class="qa-line"><strong>A:</strong> I met them through ████</div><div class="qa-line"><strong>Q:</strong> What happened next?</div><div class="qa-line"><strong>A:</strong> They had an enormous...</div><div class="mini-seal">SEALED</div></div>' },
  { id:'financial', title:'Wire Transfer Records', desc:'Suspicious activity report. Payments to your "consulting firm."', badge:'Financial Crimes', badgeClass:'badge-finance', tags:['CONFIDENTIAL','SAR FILING','FLAGGED'], previewClass:'preview-finance',
    previewHTML:'<div class="mini-doc"><div class="fin-header">FinCEN — Suspicious Activity Report</div><div class="fin-row"><span>████ LLC → Subject</span><span class="fin-amount">$47,200</span></div><div class="fin-row"><span>████ LLC → Subject</span><span class="fin-amount">$23,800</span></div><div class="fin-row"><span>Unknown → Subject</span><span class="fin-amount">$69,420</span></div><div class="fin-row"><span>████ Corp → Subject</span><span class="fin-amount">$15,600</span></div><div class="fin-flag">⚠ FLAGGED</div></div>' },
  { id:'surveillance', title:'Surveillance Photos', desc:'Security camera stills and field agent photography. You were being watched.', badge:'Intelligence', badgeClass:'badge-surveillance', tags:['TOP SECRET','CCTV','FIELD OPS'], previewClass:'preview-surveillance',
    previewHTML:'<div class="mini-grid"><div class="mini-photo" style="background:#1a1a1a"><div class="ts">03:47:22 EST</div><div class="cam">● REC</div></div><div class="mini-photo" style="background:#222"><div class="ts">21:03:44 EST</div><div class="cam">CAM-04</div></div><div class="mini-photo" style="background:#1e1e1e"><div class="ts">14:22:11 EST</div><div class="cam">CAM-07</div></div><div class="mini-photo" style="background:#252525"><div class="ts">09:15:33 EST</div><div class="cam">● REC</div></div></div>' },
  { id:'newspaper', title:'Breaking News Article', desc:'Front page exposé in a major newspaper. Above the fold, no less.', badge:'Media Coverage', badgeClass:'badge-newspaper', tags:['FRONT PAGE','EXCLUSIVE','BREAKING'], previewClass:'preview-newspaper',
    previewHTML:'<div class="mini-doc"><div class="paper-name">The New York Herald</div><div class="paper-date">Late Edition — Final</div><div class="paper-headline">New Name Surfaces<br>In Epstein Files</div><div class="paper-cols"><div><div class="paper-col-line"></div><div class="paper-col-line" style="width:70%"></div><div class="paper-col-line"></div><div class="paper-col-line" style="width:80%"></div></div><div><div class="paper-col-line"></div><div class="paper-col-line" style="width:60%"></div><div class="paper-col-line"></div><div class="paper-col-line" style="width:75%"></div></div></div></div>' }
];

const icons = {'flight-log':'✈️','island-guest':'🏝️','fbi-memo':'🕵️','black-book':'📓','deposition':'⚖️','financial':'💰','surveillance':'📸','newspaper':'📰'};

// Build cards
const grid = document.getElementById('templateGrid');
cardDefs.forEach(c => {
  const card = document.createElement('div');
  card.className = 'template-card';
  card.dataset.template = c.id;
  card.onclick = () => selectTemplate(card);
  card.innerHTML = '<div class="card-check">✓</div><div class="card-preview '+c.previewClass+'">'+c.previewHTML+'</div><div class="card-info"><span class="card-type-badge '+c.badgeClass+'">'+c.badge+'</span><h3>'+icons[c.id]+' '+c.title+'</h3><p>'+c.desc+'</p><div class="card-tags">'+c.tags.map(t=>'<span class="card-tag">'+t+'</span>').join('')+'</div></div>';
  grid.appendChild(card);
});

// Core functions
function handleFileUpload(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    uploadedImage = ev.target.result;
    var p = document.getElementById('photoPreview');
    p.src = uploadedImage; p.style.display = 'block';
    var z = document.getElementById('uploadZone');
    z.classList.add('has-image');
    z.querySelector('.drop-icon').style.display = 'none';
    z.querySelector('.drop-text').style.display = 'none';
    z.querySelector('.drop-hint').style.display = 'none';
    checkReady();
  };
  reader.readAsDataURL(file);
}

var zone = document.getElementById('uploadZone');
zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.style.borderColor = 'rgba(245,240,225,0.3)'; });
zone.addEventListener('dragleave', function() { zone.style.borderColor = ''; });
zone.addEventListener('drop', function(e) {
  e.preventDefault(); zone.style.borderColor = '';
  var file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    document.getElementById('fileInput').files = e.dataTransfer.files;
    handleFileUpload({ target: { files: [file] } });
  }
});

function selectTemplate(el) {
  document.querySelectorAll('.template-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  selectedTemplate = el.dataset.template;
  checkReady();
}

function checkReady() {
  document.getElementById('generateBtn').disabled = !(uploadedImage && selectedTemplate);
}

// Helpers
function rDate() {
  var y=1999+Math.floor(Math.random()*20), m=String(1+Math.floor(Math.random()*12)).padStart(2,'0'), d=String(1+Math.floor(Math.random()*28)).padStart(2,'0');
  return m+'/'+d+'/'+y;
}
function rCase() { return 'SDNY-'+(2000+Math.floor(Math.random()*24))+'-CF-'+String(Math.floor(Math.random()*99999)).padStart(5,'0'); }
function rRef() { var r=''; for(var i=0;i<3;i++) r+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)]; return r+'-'+Math.floor(Math.random()*9000+1000); }
function R(n) { n=n||8; var s=''; for(var i=0;i<n;i++) s+='█'; return '<span class="redacted">'+s+'</span>'; }
function H(t) { return '<span class="highlight">'+t+'</span>'; }
function S(t) { return '<span class="subject-name">'+t+'</span>'; }
function rTime() { return String(Math.floor(Math.random()*24)).padStart(2,'0')+':'+String(Math.floor(Math.random()*60)).padStart(2,'0')+':'+String(Math.floor(Math.random()*60)).padStart(2,'0'); }
function rAmt() { return '$'+(Math.floor(Math.random()*900)+100).toLocaleString()+','+String(Math.floor(Math.random()*99)).padStart(2,'0'); }

// Generate standard doc layout
function stdLayout(tpl, name) {
  var metaHTML = '';
  for (var k in tpl.meta) metaHTML += '<span><strong>'+k+':</strong> '+tpl.meta[k]+'</span>';

  return '<div class="classified-stamp">'+tpl.stamp+'</div>'+
    (tpl.declassified ? '<div class="stamp-overlay stamp-declassified">DECLASSIFIED</div>' : '')+
    '<div class="stamp-overlay stamp-evidence">EXHIBIT</div>'+
    '<div class="handwritten-note">'+tpl.note+'</div>'+
    '<div class="doc-header"><div class="agency">'+tpl.agency+'</div><div class="doc-title">'+tpl.title+'</div><div class="doc-sub">'+tpl.sub+'</div></div>'+
    '<div class="doc-meta">'+metaHTML+'</div>'+
    '<div class="doc-photo-wrap"><img src="'+uploadedImage+'" alt="Subject" class="doc-photo"><div class="doc-photo-label">Subject: '+name+'</div></div>'+
    '<div class="doc-body">'+tpl.body+'</div>'+
    '<div class="doc-footer"><span>Page 1 of 1 — COPY #'+Math.floor(Math.random()*50+1)+' of '+Math.floor(Math.random()*100+50)+'</span><span>THIS IS A PARODY</span></div>';
}

// === TEMPLATE DATA ===
function getTemplate(id, name) {
  switch(id) {
    case 'flight-log': return {
      theme:'doc-standard', agency:'Federal Bureau of Investigation — Records Division', title:'Flight Manifest Extract',
      sub:'Case File '+rCase()+' · Exhibit '+Math.floor(Math.random()*200+1)+'-A', stamp:'CLASSIFIED', note:'check the shrimp receipts!!', declassified:true,
      meta:{'Subject':name,'Aircraft':'N908JE (Boeing 727-31)','Route':'Teterboro, NJ → St. Thomas, USVI','Date of Travel':rDate(),'Classification':'TOP SECRET // NOFORN','Filed By':'SA '+R(10),'Ref No.':rRef(),'Status':'UNDER REVIEW'},
      body:'<p>Per recovered flight manifest dated '+rDate()+', subject '+S(name)+' is listed as a passenger aboard aircraft N908JE, commonly known as the "'+H('Lolita Express')+'," departing from Teterboro Airport (TEB) at approximately '+R(5)+' hours EST with destination listed as Cyril E. King Airport (STT), St. Thomas, U.S. Virgin Islands.</p><p>Manifest notation indicates subject was seated in '+H('forward cabin, seat 3A')+', with meal preference listed as "lobster thermidor" — a detail investigators found '+R(14)+' given the circumstances. Co-passengers on this flight included '+R(10)+', '+R(8)+', and an individual identified only as "'+H('The Professor')+'".</p><p>Cabin crew notes recovered from '+R(8)+' indicate that '+S(name)+' requested "extra pillows and an unreasonable amount of shrimp cocktail." Subject also reportedly attempted to '+R(20)+' the in-flight karaoke system, performing what witnesses described as a "haunting rendition" of '+R(10)+'.</p><p>Upon arrival at STT, ground transportation records show subject was transferred via helicopter to '+H('Little St. James Island')+'. Further details regarding activities on the island remain '+R(24)+' pending ongoing investigation.</p><p>RECOMMENDATION: '+H('Continued surveillance authorized.')+' Subject classified as '+R(8)+' risk. All future travel of subject to be flagged in '+R(8)+' database.</p>'
    };
    case 'island-guest': return {
      theme:'doc-standard', agency:'U.S. Department of Justice — Criminal Division', title:'Island Visitor Registry',
      sub:'Little St. James — Recovered Document #'+Math.floor(Math.random()*500+100), stamp:'TOP SECRET', note:'who is Gerald???', declassified:true,
      meta:{'Guest Name':name,'Visit Dates':rDate()+' — '+rDate(),'Villa':'Cottage '+Math.floor(Math.random()*8+1)+' ("The '+['Orchid','Palm','Coral','Sapphire','Emerald','Pearl'][Math.floor(Math.random()*6)]+'")','Greeted By':R(8),'Classification':'TOP SECRET // SI // ORCON','Recovery Source':'Safe, Master Bedroom','Ref No.':rRef(),'Evidence Tag':'EV-'+Math.floor(Math.random()*9000+1000)},
      body:'<p>The following entry was recovered from a handwritten guest ledger found in a locked safe within the master residence of Little St. James Island on '+rDate()+' during execution of federal search warrant.</p><p>Entry reads: "'+S(name)+' — Arrived via '+R(8)+'. Very important guest. Ensure '+H('unlimited access to the pool area, tennis courts, and the underground')+' '+R(16)+'. Dietary requirements: '+H('exclusively truffle-based meals')+' and a specific brand of sparkling water that apparently doesn\'t exist in any known retail database."</p><p>Additional notation in margin (different handwriting, believed to be '+R(8)+'): "Make sure '+name+' gets the '+H('good towels')+'. NOT the regular towels. The GOOD ones. This is non-negotiable. Last time there was an incident with '+R(12)+' and I will NOT have a repeat."</p><p>Staff log from same period indicates subject '+S(name)+' complained about the '+R(8)+', requested a personal butler named specifically "'+H('Gerald')+'" (no staff member by this name was ever employed on the island), and was observed at 3:00 AM '+R(22)+' near the sundial.</p><p>Security camera footage from this visit is '+R(16)+'. Backup tapes were found '+H('mysteriously degaussed')+'.</p>'
    };
    case 'fbi-memo': return {
      theme:'doc-standard', agency:'Federal Bureau of Investigation — Counterintelligence Division', title:'Internal Surveillance Memorandum',
      sub:'PRIORITY: IMMEDIATE · REF: '+rCase(), stamp:'CLASSIFIED', note:'the cheese is KEY', declassified:false,
      meta:{'Subject':name,'Case Agent':R(12),'Date':rDate(),'Priority':'HIGH','Classification':'SECRET // NOFORN','Distribution':'EYES ONLY — Deputy Director','Ref No.':rRef(),'Status':'ACTIVE'},
      body:'<p><strong>MEMORANDUM FOR THE RECORD</strong></p><p>This memo documents surveillance findings related to subject '+S(name)+', who has been identified as a '+H('person of interest')+' in connection with Operation '+R(8)+', the ongoing investigation into the financial and social network of Jeffrey E. Epstein.</p><p>Surveillance of '+S(name)+' was initiated on '+rDate()+' following a tip from '+R(10)+'. Initial findings indicate subject maintains an '+H('unusually extensive collection of')+' '+R(14)+', a fact which field agents described as "deeply concerning" and "honestly, kind of impressive."</p><p>Phone intercepts reveal '+name+' placed '+Math.floor(Math.random()*40+5)+' calls to a number registered to '+R(10)+' between '+rDate()+' and '+rDate()+'. Conversations were '+R(22)+' but one notable exchange included the phrase: "'+H('bring the documents and the fancy cheese')+'".</p><p>Physical surveillance on '+rDate()+' observed subject entering the residence of '+R(8)+' at the Upper East Side at approximately 21:00 hours carrying what appeared to be '+R(8)+' and a '+H('suspiciously large duffel bag')+'. Subject departed at 03:47 hours without the bag. The bag has not been located.</p><p>RECOMMENDATION: Upgrade surveillance to '+R(8)+' level. Request FISA authorization for '+R(16)+'. Assign additional field agents. '+H('Do NOT lose the cheese lead.')+'</p>'
    };
    case 'black-book': return {
      theme:'doc-blackbook', agency:"U.S. Attorney's Office — Southern District of New York", title:'The Black Book',
      sub:'Exhibit '+Math.floor(Math.random()*300+50)+'-C · Recovered Personal Effects', stamp:'EVIDENCE', note:'what paintings??', declassified:true,
      meta:{'Entry Name':name,'Page':''+Math.floor(Math.random()*90+2),'Phone Numbers':Math.floor(Math.random()*5+1)+' (all redacted)','Notation':['Blue ink','Red ink','Pencil','Gold marker'][Math.floor(Math.random()*4)],'Classification':'SECRET','Recovery Date':rDate(),'Evidence Tag':'BB-'+Math.floor(Math.random()*900+100),'Custodian':R(8)},
      body:'<p>The following is a transcription of an entry found on page '+Math.floor(Math.random()*90+2)+' of the personal contact book (commonly referred to as the "'+H('Black Book')+'") recovered from the residence of Jeffrey E. Epstein at '+R(6)+' East '+R(4)+' Street, New York, NY.</p><div class="book-quote">'+S(name)+'<br>☎ '+R(10)+' (primary)<br>☎ '+R(10)+' ("burner")<br>✉ '+R(8)+'@'+R(4)+'.com<br><br>📝 "'+H('Knows about the paintings. Very discreet. Prefers window seats. Allergic to shellfish — IMPORTANT do not serve the crab again.')+'"<br><br>⭐ circled '+Math.floor(Math.random()*3+2)+' times (significance unknown)</div><p>Forensic analysis reveals the entry was written on at least '+Math.floor(Math.random()*3+2)+' separate occasions, with additional notes in a '+R(6)+' hand. The circling pattern matches similar markings found on entries for '+R(10)+' and '+R(8)+', both of whom are '+H('cooperating witnesses')+'.</p><p>A sticky note attached to this page reads: "Call '+name+' re: '+R(16)+' and the thing with the '+H('yacht')+'."</p>'
    };
    case 'deposition': return { theme:'doc-deposition' };
    case 'financial': return {
      theme:'doc-standard', agency:'Financial Crimes Enforcement Network (FinCEN)', title:'Suspicious Activity Report',
      sub:'SAR-'+Math.floor(Math.random()*900000+100000)+' · CONFIDENTIAL', stamp:'CONFIDENTIAL', note:'WHO IS GERALD', declassified:false,
      meta:{'Subject':name,'Filing Institution':R(8)+' Bank, N.A.','Report Date':rDate(),'Amount Flagged':'$'+Math.floor(Math.random()*9000+1000).toLocaleString(),'Classification':'CONFIDENTIAL // LEO','Analyst':R(8),'SAR ID':'SAR-'+Math.floor(Math.random()*900000+100000),'Priority':'ELEVATED'},
      body:'<p>This Suspicious Activity Report is filed pursuant to 31 U.S.C. § 5318(g) regarding financial transactions involving '+S(name)+' and entities linked to the Epstein network.</p><p>Between '+rDate()+' and '+rDate()+', a total of '+Math.floor(Math.random()*15+3)+' wire transfers were identified originating from accounts associated with '+R(10)+' LLC (a known Epstein-affiliated shell entity registered in the '+H('U.S. Virgin Islands')+') to an account held by '+S(name)+' at '+R(6)+' Bank under the reference memo: "'+H('consulting services — phase '+Math.floor(Math.random()*4+2))+'".</p><p>Total transfers: '+H(rAmt())+'. No corresponding invoices, contracts, or evidence of any actual consulting work have been identified. When contacted by compliance officers, '+name+' stated the payments were for "'+R(18)+'" and that all documentation was "with Gerald."</p><p>NOTE: A "Gerald" appears in '+Math.floor(Math.random()*5+2)+' other SARs connected to this investigation. '+H('No individual named Gerald has been identified in any corporate filing, tax return, or employment record')+' associated with any Epstein entity.</p><p>Additionally, '+name+'\'s account received a single transfer of exactly '+H('$69,420.00')+' from an account in '+R(8)+' on '+rDate()+' with the memo simply reading: "🍕." Compliance has flagged this for '+R(16)+'.</p><p>RECOMMENDATION: Refer to IRS-CI and FBI Financial Crimes Unit. '+H('Locate Gerald.')+'</p>'
    };
    case 'surveillance': return { theme:'doc-surveillance' };
    case 'newspaper': return { theme:'doc-newspaper' };
  }
}

function generateDocument() {
  var name = document.getElementById('nameInput').value.trim() || 'UNKNOWN SUBJECT';
  var page = document.getElementById('documentPage');

  // Remove old theme classes
  page.className = 'document-page';

  if (selectedTemplate === 'deposition') {
    page.classList.add('doc-deposition');
    var lineNums = ''; for(var i=1;i<=35;i++) lineNums += i+'<br>';
    page.innerHTML =
      '<div class="classified-stamp" style="color:var(--blue-ink);border-color:var(--blue-ink)">SEALED</div>'+
      '<div class="line-numbers">'+lineNums+'</div>'+
      '<div class="handwritten-note">subpoena pending</div>'+
      '<div class="doc-header"><div class="agency">United States District Court — Southern District of New York</div><div class="doc-title">Sealed Deposition Transcript</div><div class="doc-sub">'+rCase()+' · UNDER SEAL</div></div>'+
      '<div class="doc-meta"><span><strong>Witness:</strong> '+R(12)+'</span><span><strong>Subject Referenced:</strong> '+name+'</span><span><strong>Deposition Date:</strong> '+rDate()+'</span><span><strong>Location:</strong> SDNY, Courtroom '+R(2)+'</span><span><strong>Court Reporter:</strong> '+R(8)+'</span><span><strong>Attorney (Q):</strong> '+R(8)+', Esq.</span><span><strong>Case No.:</strong> '+rCase()+'</span><span><strong>Pages:</strong> '+Math.floor(Math.random()*200+47)+' of '+Math.floor(Math.random()*500+300)+'</span></div>'+
      '<div class="doc-photo-wrap"><img src="'+uploadedImage+'" alt="Subject" class="doc-photo"><div class="doc-photo-label">Subject: '+name+'</div></div>'+
      '<div class="doc-body">'+
      '<p style="font-variant:small-caps;letter-spacing:1px;margin-bottom:16px;font-size:12px;color:#888;">Excerpt from sealed deposition — '+rDate()+'</p>'+
      '<p class="qa-q"><strong>Q:</strong> Can you tell us about your relationship with '+S(name)+'?</p>'+
      '<p class="qa-a"><strong>A:</strong> Yes. I met '+name+' through '+R(8)+' at a '+H('fundraiser')+' in '+rDate().split('/')[2]+'. It was at the '+R(8)+' Hotel. They were introduced as a "'+H('close associate')+'" of Mr. Epstein.</p>'+
      '<p class="qa-q"><strong>Q:</strong> What happened at this fundraiser?</p>'+
      '<p class="qa-a"><strong>A:</strong> Well, '+name+' was '+R(22)+' and at one point told a very long story about '+R(10)+' that made everyone at the table extremely '+H('uncomfortable')+'. Except '+R(6)+', who laughed.</p>'+
      '<p class="qa-q"><strong>Q:</strong> Did you see '+S(name)+' on subsequent occasions?</p>'+
      '<p class="qa-a"><strong>A:</strong> Yes. At least '+Math.floor(Math.random()*8+3)+' times. Once on the island. Once at the New York townhouse. And several times at '+R(14)+'. They always arrived with '+H('an enormous briefcase')+' that they never opened. Nobody knew what was in it. I asked once and they said "'+R(16)+'." I didn\'t ask again.</p>'+
      '<p class="qa-q"><strong>Q:</strong> Anything else unusual about '+name+'\'s behavior?</p>'+
      '<p class="qa-a"><strong>A:</strong> They kept insisting everyone call them "'+H('The Ambassador')+'" despite holding no diplomatic title of any kind. Also, the '+R(28)+'. But honestly, by that point, nothing surprised me anymore.</p>'+
      '<p class="qa-q"><strong>Q:</strong> Did '+name+' ever mention anyone named Gerald?</p>'+
      '<p class="qa-a"><strong>A:</strong> [Long pause] I — yes. Once. But they became very '+H('agitated')+' when I asked who Gerald was and said "'+R(20)+'" and then left the room. I didn\'t bring it up again.</p>'+
      '<p style="color:#999;margin-top:18px;font-style:italic;">[REMAINDER OF TESTIMONY SEALED BY ORDER OF THE COURT]</p>'+
      '</div>'+
      '<div class="doc-footer"><span>Page '+Math.floor(Math.random()*200+47)+' of '+Math.floor(Math.random()*500+300)+' — SEALED TRANSCRIPT</span><span>THIS IS A PARODY</span></div>';
  }
  else if (selectedTemplate === 'surveillance') {
    page.classList.add('doc-surveillance');
    var times = [rTime(),rTime(),rTime(),rTime()];
    var cams = ['CAM-03','CAM-07','CAM-12','FIELD-02'];
    var locs = ['E 71st Street Entrance','Pool Area — South','Dining Pavilion','Helipad Approach'];
    var photoCards = '';
    for (var i=0;i<4;i++) {
      photoCards += '<div class="surv-photo-card"><img src="'+uploadedImage+'" alt="Surveillance '+i+'"><div class="surv-photo-overlay"><div class="rec"><div class="rec-dot"></div>REC</div><div class="cam-label">'+cams[i]+'</div><div class="ts">'+rDate()+' '+times[i]+' EST</div></div></div>';
    }
    page.innerHTML =
      '<div class="classified-stamp" style="color:#666;border-color:#666">TOP SECRET</div>'+
      '<div class="surv-header"><div class="agency">Federal Bureau of Investigation — Special Surveillance Unit</div><div class="doc-title" style="color:#eee">Surveillance Photography Log</div><div class="doc-sub" style="color:#555">Operation '+R(8)+' · Subject: '+name+'</div></div>'+
      '<div class="surv-meta"><span><strong>Subject:</strong> '+name+'</span><span><strong>Operation:</strong> '+R(8)+'</span><span><strong>Date Range:</strong> '+rDate()+' — '+rDate()+'</span><span><strong>Assigned Agents:</strong> '+R(10)+', '+R(8)+'</span><span><strong>Classification:</strong> TOP SECRET // SI</span><span><strong>Camera Systems:</strong> Fixed CCTV + Mobile Field Units</span></div>'+
      '<div class="surv-grid">'+photoCards+'</div>'+
      '<div class="surv-meta" style="margin-top:12px"><span><strong>Location 1:</strong> '+locs[0]+' — '+times[0]+' EST</span><span><strong>Location 2:</strong> '+locs[1]+' — '+times[1]+' EST</span><span><strong>Location 3:</strong> '+locs[2]+' — '+times[2]+' EST</span><span><strong>Location 4:</strong> '+locs[3]+' — '+times[3]+' EST</span></div>'+
      '<div class="surv-notes"><p><strong>Field Agent Notes:</strong> Subject '+S(name)+' was observed arriving at the '+H('East 71st Street residence')+' at approximately '+times[0]+' hours via '+R(10)+'. Subject was carrying '+H('a large manila envelope')+' and what appeared to be '+R(12)+'. Subject remained inside the residence for approximately '+Math.floor(Math.random()*4+2)+' hours.</p><p>At '+times[1]+' hours, subject was photographed at the '+H('pool area')+' of Little St. James Island in the company of '+R(8)+' and '+Math.floor(Math.random()*4+2)+' unidentified individuals. Subject appeared to be '+R(18)+' while simultaneously '+H('making several phone calls')+'.</p><p>NOTE: In image CAM-12, subject appears to be holding a document with the header "'+R(14)+'." Enhancement of this image has been requested from the '+H('FBI Forensic Imaging Unit')+'. Preliminary analysis suggests '+R(22)+'.</p><p>RECOMMENDATION: Continue '+H('24-hour surveillance')+'. Subject is classified as '+R(6)+'. All photographic evidence to be catalogued under Operation '+R(8)+'.</p></div>'+
      '<div class="doc-footer" style="border-top-color:#333;color:#444"><span>SURVEILLANCE LOG — '+Math.floor(Math.random()*50+1)+' images catalogued</span><span>THIS IS A PARODY</span></div>';
  }
  else if (selectedTemplate === 'newspaper') {
    page.classList.add('doc-newspaper');
    var yr = 2000+Math.floor(Math.random()*24);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var mo = months[Math.floor(Math.random()*12)];
    var dy = Math.floor(Math.random()*28)+1;
    page.innerHTML =
      '<div class="news-masthead"><div class="news-name">The New York Herald</div><div class="news-tagline">"All the News That\'s Fit to Redact"</div></div>'+
      '<div class="news-dateline"><span>Vol. CLXXII · No. '+Math.floor(Math.random()*900+100)+'</span><span>'+mo+' '+dy+', '+yr+'</span><span>Late Edition — Final · $3.00</span></div>'+
      '<div class="news-headline">Previously Unnamed Figure '+name+'<br>Surfaces in Newly Released Epstein Documents</div>'+
      '<div class="news-subhead">Connections to island visits, financial transfers, and a mysterious individual known only as "Gerald" raise new questions</div>'+
      '<div class="news-byline">By '+R(8)+' and '+R(10)+' · Special Report</div>'+
      '<div class="news-photo-wrap"><img src="'+uploadedImage+'" alt="'+name+'" class="news-photo"><div class="news-caption">'+name+', photographed at '+R(8)+' in '+yr+'. '+R(10)+' / The New York Herald</div></div>'+
      '<div class="news-body"><p class="drop-cap">Federal prosecutors have confirmed that newly unsealed court documents identify '+name+' as a previously unnamed associate in the sprawling Jeffrey Epstein investigation, according to three people familiar with the matter who spoke on the condition of anonymity.</p><p>The documents, released late '+['Monday','Tuesday','Wednesday','Thursday','Friday'][Math.floor(Math.random()*5)]+' as part of ongoing litigation in the Southern District of New York, include flight manifests, financial records, and what appears to be a handwritten guest ledger from Epstein\'s private island in the U.S. Virgin Islands.</p><p>"This is a significant development," said '+R(8)+', a former federal prosecutor not involved in the case. "The scope of the network continues to expand in ways that '+R(14)+'."</p><p>According to the documents, '+name+' appears on at least '+Math.floor(Math.random()*8+3)+' flight manifests for aircraft N908JE, the Boeing 727 commonly referred to as the "Lolita Express." Manifest notations indicate '+name+' was a frequent passenger between '+Math.floor(Math.random()*3+1999)+' and '+Math.floor(Math.random()*5+2005)+'.</p><p>Perhaps most intriguing to investigators is a series of wire transfers totaling over $'+Math.floor(Math.random()*900+100)+',000 from shell companies linked to Epstein to accounts associated with '+name+'. The transfers were labeled "consulting services," though no evidence of any consulting arrangement has been found.</p><p>Multiple references throughout the documents mention an individual known only as "Gerald," who appears to serve as an intermediary. Despite appearing in numerous financial records and handwritten notes, no person named Gerald has been identified in connection with any Epstein-linked entity. The FBI has declined to comment on this aspect of the investigation.</p><p>Representatives for '+name+' did not respond to multiple requests for comment. A lawyer previously associated with '+name+' said only that their client "categorically denies '+R(16)+'" before hanging up the phone.</p><p>The documents are expected to be the subject of a hearing scheduled for '+R(8)+' in federal court in Manhattan.</p></div>'+
      '<div class="news-footer">A version of this article appears in print on '+mo+' '+dy+', '+yr+', Section A, Page 1 of the New York edition. · THIS IS A PARODY</div>';
  }
  else {
    var tpl = getTemplate(selectedTemplate, name);
    page.classList.add(tpl.theme);
    page.innerHTML = stdLayout(tpl, name);
  }

  document.querySelector('.app-container').style.display = 'none';
  document.getElementById('outputSection').classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function restart() {
  document.querySelector('.app-container').style.display = 'block';
  document.getElementById('outputSection').classList.remove('visible');
  window.scrollTo({ top: document.getElementById('generator').offsetTop - 100, behavior: 'smooth' });
}

function downloadDoc() {
  alert('Tip: Right-click the document and select "Save as Image" or take a screenshot to share!');
}

function copyCA() {
  var val = document.getElementById('caValue').textContent;
  navigator.clipboard.writeText(val).then(function() {
    var btn = document.querySelector('.ca-copy');
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
  });
}
