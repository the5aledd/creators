/* Percent Labs Creator Agreement: shared renderer for the Creators Hub and the public signing page.
   Layout and wording follow the "Creator Agreement" template from Claude Design (A4, English + Arabic). */
(function(){
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const longDate = isoStr => { if(!isoStr) return ""; const d = new Date(String(isoStr).slice(0,10)+"T00:00:00"); return isNaN(d) ? String(isoStr) : d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}); };
  const FONTS = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Zain:wght@400;700;800&display=swap";
  const CLAUSES = [
    ['Scope of Work', 'نطاق العمل',
      'The Creator will produce and publish the content listed in the Deal Details (“the Content”) on the stated Platform for the Brand listed in the Deal Details (“the Brand”), following the brief provided, for the Total Fee stated above.',
      'يلتزم صانع المحتوى بإنتاج المحتوى المذكور في تفاصيل الاتفاق («المحتوى») ونشره على المنصة المحددة لصالح العلامة التجارية المذكورة في تفاصيل الاتفاق («العلامة التجارية»)، وفقاً للموجز المقدَّم، مقابل الأجر الإجمالي المذكور أعلاه.'],
    ['Content Usage Rights', 'حقوق استخدام المحتوى',
      'The Creator grants the Brand a worldwide, perpetual, irrevocable and royalty-free right to use, reproduce, edit, adapt and publish the Content, in whole or in part, on any channel or medium — including social media, websites and paid advertising — without further approval or payment.',
      'يمنح صانع المحتوى العلامة التجارية حقاً عالمياً دائماً غير قابل للإلغاء ومن دون أي رسوم إضافية، لاستخدام المحتوى ونسخه وتعديله وتكييفه ونشره كلياً أو جزئياً عبر أي قناة أو وسيلة، بما في ذلك وسائل التواصل الاجتماعي والمواقع الإلكترونية والإعلانات المدفوعة، دون الحاجة إلى موافقة أو دفع إضافي.'],
    ['Review & Approval', 'المراجعة والموافقة',
      'The Creator will share drafts with the Brand before publishing and make any reasonable revisions requested.',
      'يرسل صانع المحتوى المسودات إلى العلامة التجارية قبل النشر، ويُجري أي تعديلات معقولة تُطلب منه.'],
    ['Content Conduct', 'ضوابط المحتوى',
      'The Content will not include anything that could harm the reputation of the Brand.',
      'لا يتضمن المحتوى أي مادة قد تسيء إلى سمعة العلامة التجارية.'],
    ['Cancellation', 'الإلغاء',
      'If the Creator does not deliver the Content by the agreed dates, Percent Labs, as owner of the Brand, may cancel this agreement, and any unpaid amounts will no longer be due.',
      'إذا لم يسلّم صانع المحتوى المحتوى في المواعيد المتفق عليها، يحق لبرسنت لابس، بصفتها مالكة العلامة التجارية، إلغاء هذه الاتفاقية، ولا تُستحق عندها أي مبالغ غير مدفوعة.'],
    ['Electronic Signature', 'التوقيع الإلكتروني',
      'Both parties agree that electronic signatures on this agreement are binding and carry the same effect as handwritten signatures.',
      'يتفق الطرفان على أن التوقيعات الإلكترونية على هذه الاتفاقية مُلزِمة ولها الأثر القانوني ذاته للتوقيعات الخطية.'],
    ['Governing Law & Language', 'القانون الواجب التطبيق واللغة',
      'This agreement is governed by the laws of the Syrian Arab Republic. It is issued in Arabic and English; if the two versions differ, the Arabic version prevails.',
      'تخضع هذه الاتفاقية لقوانين الجمهورية العربية السورية، وقد حُرّرت باللغتين العربية والإنجليزية، وفي حال وجود أي اختلاف بينهما يُعتمد النص العربي.'],
  ];
  // Deal posts → "1 × Reel · 2 × Stories"
  function deliverablesText(deliverables){
    const d = (deliverables||[]); const r = d.filter(x=>x.type==="Reel").length, s = d.filter(x=>x.type==="Story").length;
    return [r ? `${r} × Reel${r>1?"s":""}` : "", s ? `${s} × Stor${s>1?"ies":"y"}` : ""].filter(Boolean).join(" · ") || "As agreed";
  }
  /* a: {no, brand, creatorName, handle, platform, deliverables, price, currency, dealDate,
         signatoryName, plSig, plSignedAt, creatorSig, creatorSignedName, signedAt, status} */
  /* Payment receipt (deals from Nov 2026 on, kind:"receipt"): the creator confirms they received the full fee
     for the listed content. Short, no terms, creator signature only. */
  function renderReceipt(a, opts){
    opts = opts || {};
    const logo = opts.logo || "agreement-logo.png";
    const price = `${Number(a.price||0).toLocaleString("en-US")} ${a.currency||"USD"}`;
    const signedDate = v => v ? longDate(typeof v==="string" ? v : (v.toDate ? v.toDate().toISOString() : new Date(v).toISOString())) : "";
    const sd = signedDate(a.signedAt);
    const handle = a.handle ? "@"+String(a.handle).replace(/^@/,"") : "";
    const name = a.creatorName || handle;
    const plat = a.platform || "Instagram";
    const rows = [
      ['Brand','العلامة التجارية', a.brand, 600], ['Creator name','اسم صانع المحتوى', name, 600],
      ['Account handle','الحساب', handle, 400], ['Platform','المنصة', plat, 400],
      ['Content','المحتوى', a.deliverables, 400], ['Amount received','المبلغ المستلم', price, 700], ['Deal date','تاريخ الاتفاق', longDate(a.dealDate), 400],
    ];
    const FS = 14;   // same text size for the English and Arabic statements
    const B = (t, ar) => `<strong${ar?` dir="ltr" style="font-family:'Space Grotesk',sans-serif;font-size:${FS}px;unicode-bidi:isolate"`:""}>${esc(t)}</strong>`;
    const BA = t => /[\u0600-\u06FF]/.test(String(t||"")) ? B(t) : B(t,1);   // Latin words inside the Arabic text keep their own direction
    const LT = t => `<span dir="ltr" style="font-family:'Space Grotesk',sans-serif;font-size:${FS}px;unicode-bidi:isolate">${esc(t)}</span>`;
    const whenEn = sd ? `on <strong>${esc(sd)}</strong>` : `on the date of signing below`;
    const whenAr = sd ? `بتاريخ ${B(sd,1)}` : `بتاريخ التوقيع أدناه`;
    const void_ = a.status==="void";
    return `<section class="agr-page" style="position:relative;width:794px;height:1123px;box-sizing:border-box;padding:22px 48px 16px;display:flex;flex-direction:column;gap:22px;background:#FFFFFF;color:#0C0D0C;font-family:'Space Grotesk',system-ui,sans-serif;overflow:hidden">
    ${void_?`<div style="position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;z-index:5"><div style="transform:rotate(-24deg);border:6px solid rgba(165,40,30,.55);color:rgba(165,40,30,.55);font-size:84px;font-weight:700;letter-spacing:.12em;padding:4px 30px;border-radius:14px">VOID</div></div>`:""}
    <header style="display:flex;flex-direction:column;align-items:center;gap:10px">
      <div style="align-self:stretch;height:5px;background:#FF301B;border-radius:3px"></div>
      <img src="${esc(logo)}" alt="percentlabs" style="height:52px;width:auto;display:block">
      <div style="align-self:stretch;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:baseline;padding-top:6px">
        <h1 style="margin:0;font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.02em">Payment Receipt</h1>
        <div dir="rtl" style="font-family:'Zain',sans-serif;font-size:27px;line-height:1.2;font-weight:800">إيصال استلام مبلغ</div>
      </div>
      <div style="align-self:stretch;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#7A0D08">
        <span>Receipt No. ${esc(a.no||"")}</span><span dir="rtl" style="font-family:'Zain',sans-serif;font-size:13px;letter-spacing:0;text-transform:none">رقم الإيصال <span dir="ltr" style="font-family:'Space Grotesk',sans-serif;font-size:10px;letter-spacing:.12em;unicode-bidi:isolate">${esc(a.no||"")}</span></span>
      </div>
    </header>
    <section style="display:grid;grid-template-columns:minmax(0,1fr) 1px minmax(0,1fr);gap:24px;padding:16px 0;border-top:1px solid #0C0D0C;border-bottom:1px solid #0C0D0C">
      <p style="margin:0;font-size:${FS}px;line-height:1.7">I, ${B(name)}${a.creatorName&&handle?` (${esc(handle)})`:""}, confirm that ${whenEn} I received the full amount of ${B(price)} from <strong>Percent Labs LLC</strong> (Damascus Commercial Register No. 0111024182), in return for creating and publishing the following content for ${B(a.brand)} on ${esc(plat)}: ${B(a.deliverables)}.</p>
      <div style="background:rgba(12,13,12,0.18)"></div>
      <p dir="rtl" style="margin:0;font-family:'Zain',sans-serif;font-size:${FS}px;line-height:1.7">أُقرّ أنا ${BA(name)}${a.creatorName&&handle?` (${B(handle,1)})`:""} بأنني استلمت ${whenAr} كامل المبلغ وقدره ${B(price,1)} من <strong>برسنت لابس محدودة المسؤولية</strong> (السجل التجاري بدمشق رقم ${LT("0111024182")})، وذلك مقابل إنتاج ونشر المحتوى التالي لصالح العلامة التجارية ${BA(a.brand)} على منصة ${LT(plat)}: ${BA(a.deliverables)}.</p>
    </section>
    <section style="display:flex;flex-direction:column;gap:6px">
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:baseline">
        <h2 style="margin:0;font-size:10.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase">Details</h2>
        <h2 dir="rtl" style="margin:0;font-family:'Zain',sans-serif;font-size:14px;line-height:1.2;font-weight:700">التفاصيل</h2>
      </div>
      <div style="background:#F3EEE3;border-radius:8px;padding:4px 16px">
        ${rows.map((r,i)=>`<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) minmax(0,1fr);gap:12px;align-items:center;padding:6px 0;border-bottom:${i===rows.length-1?"none":"1px solid rgba(12,13,12,0.12)"}">
          <div style="font-size:9.5px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#7A0D08">${r[0]}</div>
          <div style="font-size:11.5px;font-weight:${r[3]};text-align:center">${esc(r[2])}</div>
          <div dir="rtl" style="font-family:'Zain',sans-serif;font-size:13px;line-height:1.3;font-weight:700;color:#7A0D08">${r[1]}</div></div>`).join("")}
      </div>
    </section>
    <section style="display:flex;flex-direction:column;gap:6px;margin-top:10px;align-items:center">
      <div style="width:56%;border:1px solid #0C0D0C;border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:7px">
        <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:baseline">
          <div style="font-size:9.5px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase">Received by the creator</div>
          <div dir="rtl" style="font-family:'Zain',sans-serif;font-size:13px;font-weight:700">توقيع المستلِم</div></div>
        <div style="position:relative;height:70px;border:1.5px ${a.creatorSig?"solid rgba(12,13,12,.25)":"dashed #FF301B"};border-radius:6px;background:${a.creatorSig?"#FFFFFF":"#F3EEE3"};display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:end;padding:5px 8px">
          ${a.creatorSig?`<img src="${esc(a.creatorSig)}" alt="Signature" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-height:60px;max-width:80%">`:""}
          <span style="font-size:9px;color:#7A0D08;font-weight:500;position:relative">Signature</span>
          <span dir="rtl" style="font-family:'Zain',sans-serif;font-size:11px;color:#7A0D08;position:relative">التوقيع</span></div>
        <div style="display:grid;grid-template-columns:44px minmax(0,1fr) 44px;gap:4px 8px;font-size:10px;align-items:baseline">
          <span style="color:#7A0D08">Name</span><span style="border-bottom:1px solid rgba(12,13,12,0.3);padding-bottom:2px;font-weight:600;text-align:center">${esc(a.creatorSignedName||name)}</span><span dir="rtl" style="font-family:'Zain',sans-serif;font-size:12px;color:#7A0D08">الاسم</span>
          <span style="color:#7A0D08">Date</span><span style="border-bottom:1px solid rgba(12,13,12,0.3);padding-bottom:2px;text-align:center;color:${sd?"#0C0D0C":"rgba(12,13,12,0.6)"}">${esc(sd||"Auto-filled on signing")}</span><span dir="rtl" style="font-family:'Zain',sans-serif;font-size:12px;color:#7A0D08">التاريخ</span>
        </div></div>
      <div style="font-size:8.5px;color:rgba(12,13,12,.6)">Signed electronically · وُقّع إلكترونياً</div>
    </section>
    <footer style="display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:16px;padding-top:5px;margin-top:auto;border-top:1px solid #0C0D0C;font-size:8.5px;letter-spacing:0.16em;text-transform:uppercase">
      <span>percentlabs</span><span>Receipt No. ${esc(a.no||"")}</span><span dir="rtl" style="font-family:'Zain',sans-serif;font-size:11px;letter-spacing:0">برسنت لابس</span>
    </footer>
  </section>`;
  }
  function render(a, opts){
    if(a && a.kind==="receipt") return renderReceipt(a, opts);
    opts = opts || {};
    const logo = opts.logo || "agreement-logo.png";
    const price = `${Number(a.price||0).toLocaleString("en-US")} ${a.currency||"USD"}`;
    const dd = longDate(a.dealDate);
    const rows = [
      ['Brand','العلامة التجارية', a.brand, 600], ['Creator name','اسم صانع المحتوى', a.creatorName, 600],
      ['Account handle','الحساب', a.handle ? "@"+String(a.handle).replace(/^@/,"") : "", 400], ['Platform','المنصة', a.platform||"Instagram", 400],
      ['Content package','باقة المحتوى', a.deliverables, 400], ['Total fee','الأجر الإجمالي', price, 700], ['Deal date','تاريخ الاتفاق', dd, 400],
    ];
    const signedDate = v => v ? longDate(typeof v==="string" ? v : (v.toDate ? v.toDate().toISOString() : new Date(v).toISOString())) : "";
    const signers = [
      {en:'For Percent Labs', ar:'عن برسنت لابس', name:a.signatoryName||"", sig:a.plSig, date:signedDate(a.plSignedAt)},
      {en:'The Creator', ar:'صانع المحتوى', name:a.creatorSignedName||a.creatorName||"", sig:a.creatorSig, date:signedDate(a.signedAt)},
    ];
    const void_ = a.status==="void";
    return `<section class="agr-page" style="position:relative;width:794px;height:1123px;box-sizing:border-box;padding:22px 40px 16px;display:flex;flex-direction:column;gap:9px;background:#FFFFFF;color:#0C0D0C;font-family:'Space Grotesk',system-ui,sans-serif;overflow:hidden">
    ${void_?`<div style="position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;z-index:5"><div style="transform:rotate(-24deg);border:6px solid rgba(165,40,30,.55);color:rgba(165,40,30,.55);font-size:84px;font-weight:700;letter-spacing:.12em;padding:4px 30px;border-radius:14px">VOID</div></div>`:""}
    <header style="display:flex;flex-direction:column;align-items:center;gap:7px">
      <div style="align-self:stretch;height:5px;background:#FF301B;border-radius:3px"></div>
      <img src="${esc(logo)}" alt="percentlabs" style="height:52px;width:auto;display:block">
      <div style="align-self:stretch;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:baseline">
        <h1 style="margin:0;font-size:19px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;white-space:nowrap">Content Creator Agreement</h1>
        <div dir="rtl" style="font-family:'Zain',sans-serif;font-size:21px;line-height:1.2;font-weight:800">اتفاقية صانع محتوى</div>
      </div>
    </header>
    <section style="display:grid;grid-template-columns:minmax(0,1fr) 1px minmax(0,1fr);gap:20px;padding:7px 0;border-top:1px solid #0C0D0C;border-bottom:1px solid #0C0D0C">
      <p style="margin:0;font-size:9.5px;line-height:1.4;text-align:justify">This agreement is made on <strong>${esc(dd)}</strong> between <strong>Percent Labs LLC</strong>, registered in the Damascus Commercial Register under No. 0111024182 (“Percent Labs”), and the content creator named below (“the Creator”).</p>
      <div style="background:rgba(12,13,12,0.18)"></div>
      <p dir="rtl" style="margin:0;font-family:'Zain',sans-serif;font-size:11.5px;line-height:1.4;text-align:justify">أُبرمت هذه الاتفاقية بتاريخ <strong dir="ltr" style="font-family:'Space Grotesk',sans-serif;font-size:9.5px;unicode-bidi:isolate">${esc(dd)}</strong> بين <strong>برسنت لابس محدودة المسؤولية</strong> المسجلة بالسجل التجاري بدمشق برقم <span dir="ltr" style="unicode-bidi:isolate">0111024182</span> («برسنت لابس»)، وصانع المحتوى المذكور أدناه («صانع المحتوى»).</p>
    </section>
    <section style="display:flex;flex-direction:column;gap:4px">
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:baseline">
        <h2 style="margin:0;font-size:10.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase">Deal Details</h2>
        <h2 dir="rtl" style="margin:0;font-family:'Zain',sans-serif;font-size:14px;line-height:1.2;font-weight:700">تفاصيل الاتفاق</h2>
      </div>
      <div style="background:#F3EEE3;border-radius:8px;padding:2px 16px">
        ${rows.map((r,i)=>`<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) minmax(0,1fr);gap:12px;align-items:center;padding:3px 0;border-bottom:${i===rows.length-1?"none":"1px solid rgba(12,13,12,0.12)"}">
          <div style="font-size:9.5px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#7A0D08">${r[0]}</div>
          <div style="font-size:10.5px;font-weight:${r[3]};text-align:center">${esc(r[2])}</div>
          <div dir="rtl" style="font-family:'Zain',sans-serif;font-size:12px;line-height:1.3;font-weight:700;color:#7A0D08">${r[1]}</div></div>`).join("")}
      </div>
    </section>
    <section style="display:flex;flex-direction:column">
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:baseline;padding-bottom:3px;border-bottom:1px solid #0C0D0C">
        <h2 style="margin:0;font-size:10.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase">Terms</h2>
        <h2 dir="rtl" style="margin:0;font-family:'Zain',sans-serif;font-size:14px;line-height:1.2;font-weight:700">الشروط والأحكام</h2>
      </div>
      ${CLAUSES.map((c,i)=>{ const n=String(i+1).padStart(2,"0"); return `<div style="display:grid;grid-template-columns:minmax(0,1fr) 1px minmax(0,1fr);gap:20px;padding:3px 0;border-bottom:1px solid rgba(12,13,12,0.12)">
        <div style="display:flex;flex-direction:column;gap:1px"><div style="font-size:9.5px;font-weight:600"><span style="color:#7A0D08">${n}</span>  ${c[0]}</div><p style="margin:0;font-size:9px;line-height:1.35;text-align:justify">${c[2]}</p></div>
        <div style="background:rgba(12,13,12,0.18)"></div>
        <div dir="rtl" style="display:flex;flex-direction:column;gap:1px;font-family:'Zain',sans-serif"><div style="font-size:11.5px;font-weight:700;line-height:1.2"><span style="color:#7A0D08;font-family:'Space Grotesk',sans-serif;font-size:9.5px">${n}</span>  ${c[1]}</div><p style="margin:0;font-size:11px;line-height:1.3;text-align:justify">${c[3]}</p></div></div>`; }).join("")}
    </section>
    <section style="display:flex;flex-direction:column;gap:5px;margin-top:auto">
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:baseline">
        <h2 style="margin:0;font-size:10.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase">Signatures</h2>
        <h2 dir="rtl" style="margin:0;font-family:'Zain',sans-serif;font-size:14px;line-height:1.2;font-weight:700">التواقيع</h2>
      </div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px">
        ${signers.map(s=>`<div style="border:1px solid #0C0D0C;border-radius:8px;padding:7px 10px;display:flex;flex-direction:column;gap:5px">
          <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:baseline">
            <div style="font-size:9.5px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase">${s.en}</div>
            <div dir="rtl" style="font-family:'Zain',sans-serif;font-size:13px;font-weight:700">${s.ar}</div></div>
          <div style="position:relative;height:46px;border:1.5px ${s.sig?"solid rgba(12,13,12,.25)":"dashed #FF301B"};border-radius:6px;background:${s.sig?"#FFFFFF":"#F3EEE3"};display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:end;padding:5px 8px">
            ${s.sig?`<img src="${esc(s.sig)}" alt="Signature" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-height:40px;max-width:80%">`:""}
            <span style="font-size:9px;color:#7A0D08;font-weight:500;position:relative">Signature</span>
            <span dir="rtl" style="font-family:'Zain',sans-serif;font-size:11px;color:#7A0D08;position:relative">التوقيع</span></div>
          <div style="display:grid;grid-template-columns:44px minmax(0,1fr) 44px;gap:3px 8px;font-size:9.5px;align-items:baseline">
            <span style="color:#7A0D08">Name</span><span style="border-bottom:1px solid rgba(12,13,12,0.3);padding-bottom:2px;font-weight:600;text-align:center">${esc(s.name)}</span><span dir="rtl" style="font-family:'Zain',sans-serif;font-size:12px;color:#7A0D08">الاسم</span>
            <span style="color:#7A0D08">Date</span><span style="border-bottom:1px solid rgba(12,13,12,0.3);padding-bottom:2px;text-align:center;color:${s.date?"#0C0D0C":"rgba(12,13,12,0.6)"}">${esc(s.date||"Auto-filled on signing")}</span><span dir="rtl" style="font-family:'Zain',sans-serif;font-size:12px;color:#7A0D08">التاريخ</span>
          </div></div>`).join("")}
      </div>
    </section>
    <footer style="display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:16px;padding-top:5px;border-top:1px solid #0C0D0C;font-size:8.5px;letter-spacing:0.16em;text-transform:uppercase">
      <span>percentlabs</span><span>Agreement No. ${esc(a.no||"")}</span><span dir="rtl" style="font-family:'Zain',sans-serif;font-size:11px;letter-spacing:0">برسنت لابس</span>
    </footer>
  </section>`;
  }
  // Signature pad: draws with finger, mouse or pen; returns a trimmed PNG.
  function signaturePad(canvas){
    const ctx = canvas.getContext("2d"); let drawing=false, last=null, dirty=false;
    const fit = () => { const r=canvas.getBoundingClientRect(), dpr=Math.max(1,window.devicePixelRatio||1); const old = dirty ? canvas.toDataURL() : null;
      canvas.width=Math.round(r.width*dpr); canvas.height=Math.round(r.height*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.lineWidth=2.4; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle="#111";
      if(old){ const im=new Image(); im.onload=()=>ctx.drawImage(im,0,0,r.width,r.height); im.src=old; } };
    fit(); window.addEventListener("resize", fit);
    const pos = e => { const r=canvas.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; };
    canvas.style.touchAction="none";
    canvas.addEventListener("pointerdown", e=>{ drawing=true; last=pos(e); canvas.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.arc(last.x,last.y,1.1,0,Math.PI*2); ctx.fillStyle="#111"; ctx.fill(); dirty=true; canvas.dispatchEvent(new Event("sigchange")); });
    canvas.addEventListener("pointermove", e=>{ if(!drawing) return; const p=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p; });
    const up = ()=>{ drawing=false; }; canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
    return {
      isEmpty: () => !dirty,
      clear: () => { ctx.clearRect(0,0,canvas.width,canvas.height); dirty=false; canvas.dispatchEvent(new Event("sigchange")); },
      toPNG: () => { // trim to the drawn area, max 600px wide
        const w=canvas.width, h=canvas.height, data=ctx.getImageData(0,0,w,h).data; let x0=w,y0=h,x1=0,y1=0;
        for(let y=0;y<h;y+=2) for(let x=0;x<w;x+=2){ if(data[(y*w+x)*4+3]>10){ if(x<x0)x0=x; if(y<y0)y0=y; if(x>x1)x1=x; if(y>y1)y1=y; } }
        if(x1<=x0||y1<=y0) return null; const pad=8; x0=Math.max(0,x0-pad); y0=Math.max(0,y0-pad); x1=Math.min(w,x1+pad); y1=Math.min(h,y1+pad);
        const sc=Math.min(1, 600/(x1-x0)); const c=document.createElement("canvas"); c.width=Math.round((x1-x0)*sc); c.height=Math.round((y1-y0)*sc);
        c.getContext("2d").drawImage(canvas, x0,y0,x1-x0,y1-y0, 0,0,c.width,c.height); return c.toDataURL("image/png");
      },
    };
  }
  window.PLAgreement = { render, deliverablesText, longDate, signaturePad, FONTS, esc };
})();
