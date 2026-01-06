<!-- App.vue -->
<template>
  <!-- ✅ Global Theme Wrapper -->
  <div class="app tech">
    <RouterView />
  </div>
</template>

<script setup>
// nothing needed here
</script>

<style>
/* =========================
   GLOBAL DARK BLUE TECH THEME
   put ALL here (App.vue)
   ========================= */

:root{
  color-scheme: dark;
}

*{ box-sizing: border-box; }

html, body{
  height: 100%;
}

body{
  margin: 0;
  background: #050914;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
}

/* ✅ Main Theme Wrapper */
.app.tech{
  /* Theme Tokens */
  --bg0:#050914;                 /* deep navy */
  --bg1:#070e23;                 /* navy */
  --panel: rgba(255,255,255,.045);
  --panel2: rgba(255,255,255,.03);
  --stroke: rgba(255,255,255,.08);

  --blueA: rgba(56,189,248,.55); /* cyan */
  --blueB: rgba(99,102,241,.45); /* indigo */
  --blueC: rgba(14,165,233,.30); /* sky */

  --txt: rgba(255,255,255,.92);
  --muted: rgba(255,255,255,.55);

  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;

  /* Background */
  background:
    radial-gradient(1100px 620px at 18% 14%, rgba(56,189,248,.16), transparent 58%),
    radial-gradient(900px 520px at 82% 18%, rgba(99,102,241,.14), transparent 60%),
    radial-gradient(800px 520px at 70% 90%, rgba(14,165,233,.10), transparent 62%),
    linear-gradient(180deg, var(--bg1), var(--bg0));

  color: var(--txt);
}

/* subtle grid overlay (modern tech) */
.app.tech::before{
  content:"";
  position: fixed;
  inset:0;
  pointer-events:none;
  opacity:.22;
  background:
    linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at 35% 18%, black 0%, transparent 60%);
}

/* ✅ Optional helpers you can reuse anywhere */
a{ color: inherit; }
button, input, select{ font: inherit; }

/* Nice scrollbar (optional) */
::-webkit-scrollbar{ width: 10px; height: 10px; }
::-webkit-scrollbar-thumb{
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
}



</style>
