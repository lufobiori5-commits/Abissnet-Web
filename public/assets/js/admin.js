// Admin script: simple client-side auth using sessionStorage and job CRUD in localStorage
(function(){
  const AUTH_KEY = 'abiss_hr_auth';
  const JOBS_KEY = 'abiss_jobs_v1';
  const COMPAT_KEY = 'abissnet_jobs'; // key used by karriera.js

  function requireAuth(){
    // admin.html must be reached after karriera sets sessionStorage; otherwise redirect
    if(!sessionStorage.getItem(AUTH_KEY)){
      alert('You must login first from Karriera (Admin button). Redirecting...');
      window.location.href = 'karriera.html';
    }
  }

  function loadJobs(){
    try{
      const raw = localStorage.getItem(JOBS_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      return [];
    }
  }

  function saveJobs(list){
    // save to admin key
    localStorage.setItem(JOBS_KEY, JSON.stringify(list));
    try{
      // also save a compatible copy for the public careers page
      const compatible = list.map(j => ({
        id: j.id || ('job_'+Date.now()),
        title: j.title || '',
        department: j.department || '',
        location: j.location || j.location || '',
        type: j.type || '',
        description: j.description || j.desc || '',
        published: typeof j.published === 'boolean' ? j.published : true,
        created_at: j.created_at || j.date || new Date().toISOString().slice(0,10)
      }));
      localStorage.setItem(COMPAT_KEY, JSON.stringify(compatible));
    }catch(err){
      // ignore compat save errors
      console.warn('Failed to write compat jobs:', err);
    }
  }

  function renderJobs(){
    const list = loadJobs();
    const container = document.getElementById('jobsList');
    container.innerHTML = '';
    if(list.length===0){ container.innerHTML = '<p class="muted">Nuk ka pozicione të publikuara.</p>'; return }
    list.slice().reverse().forEach((job, idx)=>{
      const el = document.createElement('div'); el.className='job-item';
      const created = job.created_at || job.date || '';
      const desc = job.description || job.desc || '';
      el.innerHTML = `<strong>${escapeHtml(job.title)}</strong> <div class="muted">${escapeHtml(job.location||'')}${created? ' • '+created:''}</div><p>${escapeHtml(desc)}</p>`;
      const del = document.createElement('button'); del.textContent='Delete'; del.style.marginRight='8px'; del.className='danger';
      del.addEventListener('click', ()=>{
        if(!confirm('Fshi këtë pozicion?')) return;
        const original = loadJobs();
        // remove the specific item by matching id
        const id = job.id;
        const filtered = original.filter(j=>j.id!==id);
        saveJobs(filtered);
        renderJobs();
      });
      el.appendChild(del);
      container.appendChild(el);
    })
  }

  function escapeHtml(s){ return String(s||'').replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) }

  // hook form
  const form = document.getElementById('jobForm');
  if(form){
    requireAuth();
    form.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const title = form.title.value.trim();
      const location = form.location.value.trim();
      const date = form.date.value;
      const desc = form.desc.value.trim();
      if(!title||!desc){ alert('Title and description are required'); return }
      const jobs = loadJobs();
      const job = { id: 'job_' + Date.now(), title, location, date, desc };
      jobs.push(job);
      saveJobs(jobs);
      form.reset();
      renderJobs();
      alert('Puna u shtua. Po të ridrejtoj tek faqja e karrierave...');
      // redirect to careers page so the new job is visible immediately
      setTimeout(()=>{
        window.location.href = 'karriera.html';
      }, 600);
    });
  }

  // export JSON
  const btnExport = document.getElementById('btnExport');
  if(btnExport){
    btnExport.addEventListener('click', ()=>{
      const data = loadJobs();
      const blob = new Blob([JSON.stringify(data, null, 2)],{type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='abiss_jobs.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });
  }

  // logout
  const btnLogout = document.getElementById('btnLogout');
  if(btnLogout){ btnLogout.addEventListener('click', ()=>{ sessionStorage.removeItem(AUTH_KEY); alert('Logged out'); window.location.href='karriera.html'; }) }

  // initial render
  if(document.getElementById('jobsList')) renderJobs();

  // expose small API for karriera page to set session key
  window.__abiss_admin = {
    AUTH_KEY: AUTH_KEY,
    setAuth: function(){ sessionStorage.setItem(AUTH_KEY, '1') }
  }

})();
