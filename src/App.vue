<template>
  <div class="app tech">
    <!-- Ambient glow -->
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <!-- ✅ GLOBAL SIDEBAR -->
    <aside ref="sidebarEl" class="sidebar">
      <router-link to="/" style="text-decoration: none">
        <div class="brand js-reveal">
          <div class="brandMark">
            <img src="/logolapnet/fullcircle.png" alt="" style="width: 100%; height: 100%" />
          </div>
          <div class="brandText">
            <div class="brandName">LAPNet</div>
            <div class="brandSub">Admin Console</div>
          </div>
        </div>
      </router-link>

      <nav class="nav js-reveal">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="navItem"
          active-class="active"
          @mouseenter="navHover($event, true)"
          @mouseleave="navHover($event, false)"
        >
          <span class="navIcon"><i :class="item.fa"></i></span>
          <span class="navLabel">{{ item.label }}</span>
          <span class="navPill" />
        </RouterLink>
      </nav>

      <div class="spacer" />

      <button
        class="logout js-reveal"
        type="button"
        @click="logout"
        @mouseenter="btnHover($event, true)"
        @mouseleave="btnHover($event, false)"
      >
        <span class="navIcon"><i class="fa-solid fa-right-from-bracket"></i></span>
        Log Out
      </button>
    </aside>

    <!-- ✅ GLOBAL MAIN -->
    <main class="main">
      <!-- ✅ GLOBAL TOPBAR -->
      <header ref="topbarEl" class="topbar js-reveal">
        <div class="welcome">
          <div class="hello">Welcome Back,</div>
          <div class="name">{{ userName }}</div>
        </div>

        <div class="searchWrap">
          <span class="searchIcon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input class="search" placeholder="Search" />
        </div>

        <div class="topActions">
          <button
            class="iconBtn"
            type="button"
            aria-label="Notifications"
            @mouseenter="iconHover($event, true)"
            @mouseleave="iconHover($event, false)"
          >
            <i class="fa-regular fa-bell"></i>
            <span class="dot"></span>
          </button>

          <div class="profile">
            <div class="avatar">P</div>
            <div class="profileText">
              <div class="profileName">Parisa</div>
              <div class="profileRole">Admin</div>
            </div>
          </div>
        </div>
      </header>

      <!-- ✅ ROUTE PAGES -->
      <section class="mainBody">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import gsap from "gsap";

const sidebarEl = ref(null);
const topbarEl = ref(null);

const userName = "Arkhan";

const navItems = [
  { key: "dashboard", label: "ພາບລວມ", to: "/dashboard", fa: "fa-solid fa-chart-line" },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", fa: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", fa: "fa-solid fa-newspaper" },
  { key: "protocols", label: "ປະກາດຮັບສະມັກພະນັກງານ", to: "/joblist", fa: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດ", to: "/announcement", fa: "fa-solid fa-bullhorn" },
];

function logout() {
  console.log("logout");
}

/* GSAP hovers */
function btnHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.22, ease: "power2.out" });
}
function iconHover(e, enter) {
  gsap.to(e.currentTarget, { scale: enter ? 1.06 : 1, duration: 0.18, ease: "power2.out" });
}
function navHover(e, enter) {
  const el = e.currentTarget;
  if (el.classList.contains("active")) return;
  gsap.to(el, { x: enter ? 3 : 0, duration: 0.18, ease: "power2.out" });
}

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  gsap.set(".js-reveal", { opacity: 0, y: 12 });

  tl.from(sidebarEl.value, { x: -24, opacity: 0, duration: 0.55 }, 0)
    .from(topbarEl.value, { y: -12, opacity: 0, duration: 0.45 }, 0.08)
    .to(".js-reveal", { opacity: 1, y: 0, stagger: 0.06, duration: 0.42 }, 0.14);
});
</script>

<style scoped>
:global(:root) {
  color-scheme: dark;
}
:global(*) {
  box-sizing: border-box;
}

/* DARK BLUE TECH THEME */
.app.tech {
  --bg0: #050914;
  --bg1: #070e23;
  --panel: rgba(255, 255, 255, 0.045);
  --panel2: rgba(255, 255, 255, 0.03);
  --stroke: rgba(255, 255, 255, 0.08);

  --blueA: rgba(56, 189, 248, 0.55);
  --blueB: rgba(99, 102, 241, 0.45);
  --blueC: rgba(14, 165, 233, 0.3);
  --txt: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.55);

  --glass: rgba(255, 255, 255, 0.035);
  --glass2: rgba(255, 255, 255, 0.02);

  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: radial-gradient(1100px 620px at 18% 14%, rgba(56, 189, 248, 0.16), transparent 58%),
    radial-gradient(900px 520px at 82% 18%, rgba(99, 102, 241, 0.14), transparent 60%),
    radial-gradient(800px 520px at 70% 90%, rgba(14, 165, 233, 0.1), transparent 62%),
    linear-gradient(180deg, var(--bg1), var(--bg0));
  color: var(--txt);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  overflow: hidden;
  position: relative;
}

.app.tech::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.22;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at 35% 18%, black 0%, transparent 60%);
}

/* ambient glows */
.glow {
  position: fixed;
  pointer-events: none;
  filter: blur(52px);
  opacity: 0.75;
}
.glow-a {
  width: 560px;
  height: 560px;
  left: -180px;
  top: 120px;
  background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.4), transparent 62%);
}
.glow-b {
  width: 560px;
  height: 560px;
  right: -200px;
  top: -160px;
  background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.34), transparent 62%);
}

/* Sidebar */
.sidebar {
  padding: 22px 18px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(8, 12, 28, 0.55);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 14px 0 44px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
}
.sidebar::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    rgba(56, 189, 248, 0.45),
    rgba(99, 102, 241, 0.25),
    rgba(14, 165, 233, 0.22),
    rgba(56, 189, 248, 0.45)
  );
  opacity: 0.14;
  filter: blur(14px);
  pointer-events: none;
  animation: holoShift 7s linear infinite;
}
@keyframes holoShift {
  0% {
    transform: translateX(-16%);
  }
  100% {
    transform: translateX(16%);
  }
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
}
.brandMark {
  width: 50px;
  height: 50px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 900;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.65), rgba(99, 102, 241, 0.45));
  box-shadow: 0 18px 42px rgba(56, 189, 248, 0.12);
  border: 1px solid rgb(255, 255, 255);
}
.brandName {
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.2px;
}
.brandSub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}
.navItem {
  text-decoration: none;
  position: relative;
  width: 100%;
  border-radius: 14px;
  padding: 12px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.78);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease,
    transform 180ms ease;
}
.navItem:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.92);
  border-color: rgba(56, 189, 248, 0.22);
  box-shadow: 0 12px 30px rgba(56, 189, 248, 0.1);
  transform: translateY(-1px);
}
.navItem.active {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.14));
  border-color: rgba(56, 189, 248, 0.24);
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 40px rgba(56, 189, 248, 0.12);
}
.navIcon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.9);
}
.navLabel {
  font-weight: 800;
}
.navPill {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0);
}
.navItem.active .navPill {
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.14);
}

.spacer {
  flex: 1;
}

.logout {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.78);
  border-radius: 14px;
  padding: 12px 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
}

/* Main */
.main {
  padding: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.topbar {
  display: grid;
  grid-template-columns: 1fr 380px 280px;
  gap: 14px;
  align-items: center;
  padding: 10px 6px 10px;
}
.hello {
  font-size: 13px;
  color: var(--muted);
}
.name {
  font-size: 22px;
  font-weight: 950;
  letter-spacing: 0.2px;
}

.searchWrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 10px 12px;
}
.searchWrap:focus-within {
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}
.searchIcon {
  color: rgba(255, 255, 255, 0.58);
}
.search {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.topActions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}
.iconBtn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.035);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.86);
}
.dot {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ef4444;
  box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.15);
}
.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 6px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 900;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(56, 189, 248, 0.14));
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.profileName {
  font-weight: 850;
  font-size: 13px;
}
.profileRole {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.mainBody {
  flex: 1;
  overflow: auto;
  padding-right: 6px;
}
.mainBody::-webkit-scrollbar {
  width: 10px;
}
.mainBody::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

/* responsive */
@media (max-width: 1100px) {
  .app.tech {
    grid-template-columns: 86px 1fr;
  }
  .brandText,
  .navLabel,
  .profileText {
    display: none;
  }
  .topbar {
    grid-template-columns: 1fr 1fr 160px;
  }
}

@media (max-width: 920px) {
  .topbar {
    grid-template-columns: 1fr 1fr;
  }
  .topActions {
    justify-content: flex-start;
  }
}
</style>
