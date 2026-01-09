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
        <!-- ✅ KEEP INDEX 0 AS NORMAL -->
        <RouterLink
          :to="mainNavItem.to"
          class="navItem"
          active-class="active"
          @mouseenter="navHover($event, true)"
          @mouseleave="navHover($event, false)"
        >
          <span class="navIcon"><i :class="mainNavItem.fa"></i></span>
          <span class="navLabel">{{ mainNavItem.label }}</span>
          <span class="navPill" />
        </RouterLink>

        <!-- ✅ NEW: Visitor under dashboard -->
        <div v-if="dashboardItems.length" class="dashSubNav js-reveal">
          <RouterLink
            v-for="item in dashboardItems"
            :key="item.key"
            :to="item.to"
            class="subNavItem dashSubItem"
            active-class="active"
            @mouseenter="subHover($event, true)"
            @mouseleave="subHover($event, false)"
          >
            <span class="subIcon"><i :class="item.fa"></i></span>
            <span class="subLabel">{{ item.label }}</span>
            <span class="subPill" />
          </RouterLink>
        </div>

        <!-- ✅ DROPDOWN GROUP: navItems[1..6] -->
        <div class="navGroup">
          <button
            type="button"
            class="navGroupBtn"
            :class="{ active: isInsertActive }"
            @click="toggleInsert"
            @mouseenter="navHover($event, true)"
            @mouseleave="navHover($event, false)"
            aria-haspopup="true"
            :aria-expanded="isInsertOpen ? 'true' : 'false'"
          >
            <span class="navIcon"><i class="fa-solid fa-circle-plus"></i></span>
            <span class="navLabel">ເພີ່ມຂໍ້ມູນ</span>

            <span class="navGroupRight">
              <span class="navGroupHint">{{ insertItems.length }}</span>
              <i ref="insertChevronEl" class="fa-solid fa-chevron-down navChevron"></i>
            </span>

            <span class="navPill" />
          </button>

          <div ref="insertMenuEl" class="subNav">
            <RouterLink
              v-for="item in insertItems"
              :key="item.key"
              :to="item.to"
              class="subNavItem"
              active-class="active"
              @mouseenter="subHover($event, true)"
              @mouseleave="subHover($event, false)"
              @click="ensureOpenAfterNavigate"
            >
              <span class="subIcon"><i :class="item.fa"></i></span>
              <span class="subLabel">{{ item.label }}</span>
              <span class="subPill" />
            </RouterLink>
          </div>
        </div>
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
      <!-- ✅ ROUTE PAGES -->
      <section class="mainBody">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import gsap from "gsap";

const sidebarEl = ref(null);
const topbarEl = ref(null);

const route = useRoute();

const userName = "Arkhan";

const navItems = [
  {
    key: "dashboard",
    label: "ພາບລວມ",
    to: "/dashboard",
    fa: "fa-solid fa-chart-line",
    // ✅ NEW: visitor under dashboard (eye icon)
    children: [{ key: "visitor", label: "Visitor", to: "/visitor", fa: "fa-solid fa-eye" }],
  },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", fa: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", fa: "fa-solid fa-newspaper" },
  { key: "protocols", label: "ປະກາດຮັບສະໝັກພະນັກງານ", to: "/joblist", fa: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດແຈ້ງການ", to: "/announcement", fa: "fa-solid fa-bullhorn" },
  { key: "board_director", label: "ເພີ່ມສະພາບໍລິຫານ", to: "/board_director", fa: "fa-solid fa-users" },
  { key: "lapnet_employee", label: "ເພີ່ມພະນັກງານ LAPNet", to: "/lapnet_employee", fa: "fa-solid fa-circle-user" },
];

// ✅ split nav
const mainNavItem = navItems[0];
const dashboardItems = computed(() => mainNavItem?.children || []);
const insertItems = navItems.slice(1, 7);

// ✅ dropdown state
const isInsertOpen = ref(false);
const insertMenuEl = ref(null);
const insertChevronEl = ref(null);

const isInsertActive = computed(() => insertItems.some((i) => route.path === i.to));

function logout() {
  console.log("logout");
}

/* GSAP hovers */
function btnHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.22, ease: "power2.out" });
}
function navHover(e, enter) {
  const el = e.currentTarget;
  if (el.classList?.contains("active")) return;
  gsap.to(el, { x: enter ? 3 : 0, duration: 0.18, ease: "power2.out" });
}
function subHover(e, enter) {
  const el = e.currentTarget;
  if (el.classList?.contains("active")) return;
  gsap.to(el, { x: enter ? 4 : 0, duration: 0.18, ease: "power2.out" });
}

function openInsertMenu(immediate = false) {
  const menu = insertMenuEl.value;
  const chev = insertChevronEl.value;
  if (!menu) return;

  gsap.killTweensOf(menu);
  gsap.killTweensOf(chev);

  // prepare
  gsap.set(menu, { display: "block" });

  // measure
  const h = menu.scrollHeight;

  if (immediate) {
    gsap.set(menu, { height: "auto", opacity: 1 });
    gsap.set(chev, { rotate: 180 });
    return;
  }

  gsap.fromTo(
    menu,
    { height: 0, opacity: 0 },
    {
      height: h,
      opacity: 1,
      duration: 0.28,
      ease: "power2.out",
      onComplete: () => gsap.set(menu, { height: "auto" }),
    }
  );

  gsap.to(chev, { rotate: 180, duration: 0.22, ease: "power2.out" });
}

function closeInsertMenu() {
  const menu = insertMenuEl.value;
  const chev = insertChevronEl.value;
  if (!menu) return;

  gsap.killTweensOf(menu);
  gsap.killTweensOf(chev);

  const h = menu.scrollHeight;
  gsap.set(menu, { height: h });

  gsap.to(menu, {
    height: 0,
    opacity: 0,
    duration: 0.22,
    ease: "power2.inOut",
    onComplete: () => gsap.set(menu, { display: "none" }),
  });

  gsap.to(chev, { rotate: 0, duration: 0.2, ease: "power2.inOut" });
}

async function toggleInsert() {
  isInsertOpen.value = !isInsertOpen.value;

  // wait DOM just in case
  await nextTick();

  if (isInsertOpen.value) openInsertMenu(false);
  else closeInsertMenu();
}

function ensureOpenAfterNavigate() {
  // keep menu open after clicking a child link (nice UX)
  if (!isInsertOpen.value) {
    isInsertOpen.value = true;
    openInsertMenu(true);
  }
}

// ✅ auto-open if user is on a dropdown route
watch(
  () => route.path,
  async () => {
    if (isInsertActive.value && !isInsertOpen.value) {
      isInsertOpen.value = true;
      await nextTick();
      openInsertMenu(false);
    }
  }
);

onMounted(async () => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  gsap.set(".js-reveal", { opacity: 0, y: 12 });

  tl.from(sidebarEl.value, { x: -24, opacity: 0, duration: 0.55 }, 0);

  // topbar is currently not in template; guard to avoid errors
  if (topbarEl.value) {
    tl.from(topbarEl.value, { y: -12, opacity: 0, duration: 0.45 }, 0.08);
  }

  tl.to(".js-reveal", { opacity: 1, y: 0, stagger: 0.06, duration: 0.42 }, 0.14);

  // dropdown initial state
  await nextTick();
  if (isInsertActive.value) {
    isInsertOpen.value = true;
    openInsertMenu(true);
  } else {
    // ensure closed visuals
    const menu = insertMenuEl.value;
    const chev = insertChevronEl.value;
    if (menu) gsap.set(menu, { display: "none", height: 0, opacity: 0 });
    if (chev) gsap.set(chev, { rotate: 0 });
  }
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

/* main nav item style */
.navItem,
.navGroupBtn {
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
  cursor: pointer;
}

.navItem:hover,
.navGroupBtn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.92);
  border-color: rgba(56, 189, 248, 0.22);
  box-shadow: 0 12px 30px rgba(56, 189, 248, 0.1);
  transform: translateY(-1px);
}
.navItem.active,
.navGroupBtn.active {
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
  font-size: 14px;
}

/* pill */
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
.navItem.active .navPill,
.navGroupBtn.active .navPill {
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.14);
}

/* ✅ NEW: dashboard sub items container */
.dashSubNav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 14px;
  margin-top: -2px; /* snug under dashboard */
}

/* re-use subNavItem but tweak for dashboard children */
.dashSubItem {
  margin-bottom: 0;
  padding: 10px 10px 10px 12px;
}

/* ✅ Dropdown group */
.navGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.navGroupRight {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.navGroupHint {
  font-size: 12px;
  font-weight: 850;
  padding: 4px 8px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.035);
}

.navChevron {
  font-size: 12px;
  opacity: 0.85;
  transform-origin: center;
}

/* submenu container (GSAP controls display/height/opacity) */
.subNav {
  display: none;
  height: 0px;
  opacity: 0;
  overflow: hidden;
  padding: 6px 6px 2px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
  position: relative;
}

.subNav::before {
  content: "";
  position: absolute;
  inset: -1px;
  pointer-events: none;
  border-radius: 16px;
  background: radial-gradient(420px 220px at 18% 20%, rgba(56, 189, 248, 0.12), transparent 60%),
    radial-gradient(420px 220px at 80% 50%, rgba(99, 102, 241, 0.1), transparent 62%);
  opacity: 0.9;
}

.subNavItem {
  position: relative;
  text-decoration: none;
  width: 100%;
  border-radius: 14px;
  padding: 10px 10px 10px 12px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;

  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.72);

  transition: background 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.subNavItem:hover {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(56, 189, 248, 0.18);
  box-shadow: 0 12px 26px rgba(56, 189, 248, 0.08);
}

.subNavItem.active {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.12));
  border-color: rgba(56, 189, 248, 0.2);
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 36px rgba(56, 189, 248, 0.1);
}

.subIcon {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  opacity: 0.95;
}
.subLabel {
  font-weight: 800;
  font-size: 13px;
}

.subPill {
  margin-left: auto;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0);
}
.subNavItem.active .subPill {
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.12);
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
  .navLabel {
    display: none;
  }
  .navGroupHint,
  .navChevron {
    display: none;
  }
  .subLabel {
    display: none;
  }
  .dashSubNav {
    padding-left: 0;
  }
}

@media (max-width: 920px) {
  .main {
    padding: 14px;
  }
}
</style>
