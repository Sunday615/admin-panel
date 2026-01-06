<template>
  <div ref="rootEl" class="app tech">
    <!-- Ambient glow -->
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <!-- Sidebar LEFT -->
    <aside ref="sidebarEl" class="sidebar">
      <router-link to="/" style="text-decoration: none;">
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

    <!-- Main -->
    <main class="main">
      <header ref="topbarEl" class="topbar js-reveal">
        <div class="welcome">
          <div class="hello">Welcome Back,</div>
          <div class="name">{{ userName }}</div>
        </div>

        <!-- Search this page -->
        <div class="searchWrap">
          <span class="searchIcon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input v-model="q" class="search" placeholder="Search members..." />
        </div>

        <div class="topActions">
          <button
            class="iconBtn"
            type="button"
            aria-label="Refresh"
            title="Refresh"
            @click="fetchMembers"
            @mouseenter="iconHover($event, true)"
            @mouseleave="iconHover($event, false)"
          >
            <i class="fa-solid fa-rotate-right"></i>
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

      <section class="mainBody">
        <!-- ===== Members Content ===== -->
        <div class="membersPage">
          <!-- Header -->
          <div class="pageTop js-reveal">
            <div class="titleBlock">
              <div class="pageTitle">Comercials Banks</div>
            </div>

            <div class="actions">
              <div class="filterWrap">
                <span class="filterIcon"><i class="fa-solid fa-filter"></i></span>
                <select v-model="filterKey" class="filterSelect">
                  <option value="">Filter by: (All)</option>
                  <option v-for="k in filterKeys" :key="k" :value="k">{{ k }}</option>
                </select>
                <input v-model="filterValue" class="filterInput" placeholder="value..." />
              </div>

              <button class="ghostBtn" type="button" @click="clearFilters">Clear</button>
            </div>
          </div>

          <!-- Meta -->
          <div class="metaRow js-reveal">
            <div class="metaPill">
              <i class="fa-solid fa-database"></i>
              <span>Total:</span>
              <b>{{ members.length }}</b>
            </div>

            <div class="metaPill" v-if="loading">
              <span class="spinner"></span>
              Loading...
            </div>

            <div class="metaPill errorPill" v-else-if="error">
              <i class="fa-solid fa-triangle-exclamation"></i>
              {{ error }}
            </div>

            <div class="metaPill" v-else>
              <i class="fa-solid fa-list"></i>
              <span>Filtered:</span>
              <b>{{ rows.length }}</b>
            </div>
          </div>

          <!-- Table -->
          <div class="tableWrap js-reveal">
            <table class="table">
              <thead>
                <tr>
                  <th
                    v-for="col in tableCols"
                    :key="col"
                    class="th"
                    role="button"
                    tabindex="0"
                    @click="toggleSort(col)"
                    @keydown.enter.prevent="toggleSort(col)"
                    @keydown.space.prevent="toggleSort(col)"
                  >
                    <span class="thLabel">{{ colLabel(col) }}</span>
                    <span class="sortIcon" v-if="sortKey === col">
                      <i :class="sortDir === 'asc' ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down'"></i>
                    </span>
                  </th>

                  <th class="th thLast">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(m, localIdx) in pageRows"
                  :key="rowKey(m, localIdx)"
                  class="tr"
                  @click="openOverlay(m)"
                  @mouseenter="rowHover($event, true)"
                  @mouseleave="rowHover($event, false)"
                >
                  <td v-for="col in tableCols" :key="col" class="td">
                    <!-- ✅ idmember = running number across ALL filtered rows -->
                    <template v-if="isIdMemberCol(col)">
                      <div class="idCell">
                        <div>{{ pageStart + localIdx + 1 }}</div>
                        <img v-if="logoUrlOf(m)" class="logoMini" :src="logoUrlOf(m)" alt="Logo" />
                      </div>
                    </template>

                    <template v-else>
                      {{ formatCell(m?.[col]) }}
                    </template>
                  </td>

                  <!-- ✅ Actions -->
                  <td class="td tdLast">
                    <div class="actionRow">
                      <button
                        class="pillBtn"
                        type="button"
                        title="View"
                        @click.stop="openOverlay(m)"
                        :disabled="isBusy(m)"
                        @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)"
                      >
                        <i class="fa-regular fa-eye"></i>
                        View
                      </button>

                      <button
                        class="pillBtn"
                        type="button"
                        title="Edit"
                        @click.stop="askEdit(m)"
                        :disabled="isBusy(m)"
                        @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)"
                      >
                        <i class="fa-regular fa-pen-to-square"></i>
                        Edit
                      </button>

                      <button
                        class="pillBtn danger"
                        type="button"
                        title="Delete"
                        @click.stop="askDelete(m)"
                        :disabled="isBusy(m)"
                        @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)"
                      >
                        <i class="fa-regular fa-trash-can"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="!loading && !error && rows.length === 0">
                  <td :colspan="tableCols.length + 1" class="empty">No results</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ✅ Pagination -->
          <div class="pager js-reveal" v-if="!loading && !error && pageCount > 1">
            <div class="pagerLeft">
              Showing <b>{{ rows.length ? pageStart + 1 : 0 }}</b>–<b>{{ pageEnd }}</b> of <b>{{ rows.length }}</b>
              <span class="pagerDot"></span>
              Page <b>{{ currentPage }}</b>/<b>{{ pageCount }}</b>
            </div>

            <div class="pagerRight">
              <button class="pagerBtn" type="button" @click="goFirst" :disabled="currentPage === 1">First</button>
              <button class="pagerBtn" type="button" @click="goPrev" :disabled="currentPage === 1">Prev</button>

              <template v-for="p in pageList" :key="`p-${p}`">
                <span v-if="p === '...'" class="pagerEllipsis">…</span>
                <button
                  v-else
                  class="pagerBtn num"
                  type="button"
                  :class="{ on: p === currentPage }"
                  @click="goPage(p)"
                >
                  {{ p }}
                </button>
              </template>

              <button class="pagerBtn" type="button" @click="goNext" :disabled="currentPage === pageCount">Next</button>
              <button class="pagerBtn" type="button" @click="goLast" :disabled="currentPage === pageCount">Last</button>
            </div>
          </div>

          <!-- Overlay -->
          <Teleport to="body">
            <div v-if="selected" ref="overlayEl" class="overlay" @click.self="closeOverlay">
              <div ref="modalEl" class="modal">
                <div class="modalTop">
                  <div class="modalTitle">
                    <i class="fa-solid fa-building-columns"></i>
                    {{ titleOf(selected) }}
                  </div>

                  <button
                    class="iconBtn"
                    type="button"
                    aria-label="Close"
                    @click="closeOverlay"
                    @mouseenter="iconHover($event, true)"
                    @mouseleave="iconHover($event, false)"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div class="modalBody">
                  <div class="kvGrid">
                    <div v-for="item in flatEntries" :key="item.k" class="kv">
                      <div class="k">{{ item.k }}</div>

                      <!-- ✅ Special list -->
                      <div v-if="item.type === 'list'" class="v">
                        <div class="listBox" :class="{ cross: item.kind === 'crossborder' }">
                          <div v-for="(it, i) in item.items" :key="`${item.k}-${i}`" class="neoItem">
                            <span class="neoDot"></span>

                            <span class="neoText">
                              {{ item.kind === "crossborder" ? (it?.text ?? "-") : it }}
                            </span>

                            <span v-if="item.kind === 'crossborder' && it?.flags" class="flagPair">
                              <img class="flag" :src="flagUrl(it.flags[0])" :alt="it.flags[0]" />
                              <i class="fa-solid fa-arrow-right-long"></i>
                              <img class="flag" :src="flagUrl(it.flags[1])" :alt="it.flags[1]" />
                            </span>
                          </div>

                          <div v-if="!item.items.length" class="neoEmpty">-</div>
                        </div>
                      </div>

                      <!-- ✅ Color.primary / Color.secondary => swatch -->
                      <div v-else-if="isColorField(item.k)" class="v">
                        <div class="colorValue">
                          <span
                            class="swatch"
                            :class="{ invalid: !normalizeHex(item.v) }"
                            :style="normalizeHex(item.v) ? { background: normalizeHex(item.v) } : undefined"
                            :title="normalizeHex(item.v) ? normalizeHex(item.v) : 'Invalid HEX'"
                          />
                          <span class="hexPill">{{ normalizeHex(item.v) || item.v || "-" }}</span>
                        </div>
                      </div>

                      <!-- ✅ Default -->
                      <div v-else class="v">
                        <div>{{ item.v }}</div>

                        <!-- ✅ Logo under idmember -->
                        <div v-if="isIdMemberCol(item.k) && selectedLogoUrl" class="logoUnderId">
                          <div class="logoLabel">Logo</div>
                          <img class="logoImg" :src="selectedLogoUrl" alt="Logo" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <span class="modalGlow" />
              </div>
            </div>
          </Teleport>

          <!-- ✅ Shared Confirm Modal (Edit/Delete) -->
          <Teleport to="body">
            <div v-if="confirmOpen" class="confirmOverlay" @click.self="closeConfirm">
              <div
                ref="confirmEl"
                class="confirmCard"
                :class="{ danger: confirmAction === 'delete', info: confirmAction === 'edit' }"
              >
                <div class="confirmIcon">
                  <div class="skull">
                    <i
                      :class="
                        confirmAction === 'delete'
                          ? 'fa-solid fa-triangle-exclamation'
                          : 'fa-regular fa-pen-to-square'
                      "
                    ></i>
                  </div>
                  <span class="ring ringA"></span>
                  <span class="ring ringB"></span>
                </div>

                <div class="confirmTitle">
                  {{ confirmAction === "delete" ? "Delete Member?" : "Edit Member?" }}
                </div>

                <div class="confirmText">
                  {{ confirmAction === "delete" ? "You are about to delete:" : "You are about to edit:" }}
                  <b class="confirmName">{{ confirmName }}</b>

                  <div class="confirmHint">
                    {{
                      confirmAction === "delete"
                        ? "This action cannot be undone."
                        : "You will be redirected to /membersedit."
                    }}
                  </div>
                </div>

                <div class="confirmActions">
                  <button class="cBtn ghost" type="button" @click="closeConfirm" :disabled="confirmLoading">
                    Cancel
                  </button>

                  <button
                    class="cBtn"
                    :class="confirmAction === 'delete' ? 'danger' : 'info'"
                    type="button"
                    @click="confirmProceed"
                    :disabled="confirmLoading"
                  >
                    <span v-if="confirmLoading" class="miniSpin"></span>
                    <span>
                      <template v-if="confirmAction === 'delete'">
                        {{ confirmLoading ? "Deleting..." : "Yes, Delete" }}
                      </template>
                      <template v-else>
                        {{ confirmLoading ? "Opening..." : "Yes, Edit" }}
                      </template>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Teleport>

          <!-- ✅ Toast -->
          <Teleport to="body">
            <div v-if="toast.open" ref="toastEl" class="toast" :class="toast.type">
              <i v-if="toast.type === 'success'" class="fa-solid fa-circle-check"></i>
              <i v-else-if="toast.type === 'error'" class="fa-solid fa-circle-xmark"></i>
              <i v-else class="fa-solid fa-circle-info"></i>
              <div class="toastText">{{ toast.text }}</div>
            </div>
          </Teleport>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();

const rootEl = ref(null);
const sidebarEl = ref(null);
const topbarEl = ref(null);

const userName = "Arkhan";

const navItems = [
  { key: "dashboard", label: "ພາບລວມ", to: "/dashboard", fa: "fa-solid fa-chart-line" },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", fa: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", fa: "fa-solid fa-newspaper" },
  { key: "protocols", label: "ປະກາດຮັບສະມັກພະນັກງານ", to: "/joblist", fa: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດ", to: "/announcement", fa: "fa-solid fa-bullhorn" },
  { key: "boarddirector", label: "ເພີ່ມສະພາບໍລິຫານ", to: "/board_director", fa: "fa-solid fa-people-group" },
  { key: "lapnet", label: "ເພີ່ມພະນັກງານ LAPNet", to: "/lapnet_employee", fa: "fa-solid fa-users-rectangle" },
];

/* =========================
   DATA
   ========================= */
const members = ref([]);
const loading = ref(false);
const error = ref("");

const q = ref("");
const filterKey = ref("");
const filterValue = ref("");

const sortKey = ref("");
const sortDir = ref("asc");

const selected = ref(null);
const overlayEl = ref(null);
const modalEl = ref(null);

let abortCtrl = null;

/* =========================
   ✅ Busy state per row
   ========================= */
const busyById = ref({});
function setBusy(id, v) {
  busyById.value = { ...busyById.value, [String(id)]: v };
}
function isBusy(m) {
  const id = rowKey(m, "");
  return !!busyById.value[String(id)];
}

/* =========================
   ✅ Shared Confirm state (Edit/Delete)
   ========================= */
const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmTarget = ref(null);
const confirmAction = ref("delete"); // 'delete' | 'edit'
const confirmEl = ref(null);

const confirmName = computed(() => titleOf(confirmTarget.value));

/* =========================
   ✅ Toast
   ========================= */
const toast = ref({ open: false, type: "success", text: "" });
const toastEl = ref(null);
let toastTimer = null;

/* =========================
   ✅ GSAP modern helpers
   ========================= */
let gsapCtx = null;
const reducedMotion =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const DUR = {
  fast: reducedMotion ? 0 : 0.18,
  base: reducedMotion ? 0 : 0.35,
  slow: reducedMotion ? 0 : 0.6,
};

const hoverQ = new WeakMap(); // WeakMap<Element, {x,y,scale}>
function ensureHoverQuick(el) {
  if (!el) return null;
  if (hoverQ.has(el)) return hoverQ.get(el);
  const q = {
    x: gsap.quickTo(el, "x", { duration: DUR.fast, ease: "power3.out" }),
    y: gsap.quickTo(el, "y", { duration: DUR.fast, ease: "power3.out" }),
    scale: gsap.quickTo(el, "scale", { duration: DUR.fast, ease: "power3.out" }),
  };
  hoverQ.set(el, q);
  return q;
}

function popIn(el, vars = {}) {
  if (!el) return;
  gsap.fromTo(
    el,
    {
      autoAlpha: 0,
      y: 14,
      scale: 0.985,
      transformPerspective: 900,
      rotateX: 8,
      filter: "blur(6px)",
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      duration: DUR.slow,
      ease: "expo.out",
      ...vars,
    }
  );
}

function animateRows() {
  if (!rootEl.value) return;
  const sel = gsap.utils.selector(rootEl.value);

  const trs = sel(".tableWrap tbody tr");
  if (!trs || !trs.length) return;

  gsap.killTweensOf(trs);
  gsap.fromTo(
    trs,
    { autoAlpha: 0, y: 10, filter: "blur(4px)" },
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: DUR.base,
      stagger: 0.035,
      ease: "power3.out",
      overwrite: true,
    }
  );
}

async function openConfirm(action, row) {
  confirmAction.value = action;
  confirmTarget.value = row;
  confirmOpen.value = true;
  confirmLoading.value = false;

  await nextTick();
  popIn(confirmEl.value, { y: 18, rotateX: 10, duration: reducedMotion ? 0 : 0.55 });
}

function closeConfirm() {
  if (!confirmOpen.value) return;

  const el = confirmEl.value;
  if (!el || reducedMotion) {
    confirmOpen.value = false;
    confirmLoading.value = false;
    confirmTarget.value = null;
    return;
  }

  gsap.to(el, {
    autoAlpha: 0,
    y: 10,
    scale: 0.985,
    duration: DUR.fast,
    ease: "power2.inOut",
    onComplete: () => {
      confirmOpen.value = false;
      confirmLoading.value = false;
      confirmTarget.value = null;
    },
  });
}

function showToast(type, text) {
  toast.value = { open: true, type, text };
  if (toastTimer) clearTimeout(toastTimer);

  nextTick(() => {
    if (toastEl.value) {
      popIn(toastEl.value, { y: 10, rotateX: 0, duration: reducedMotion ? 0 : 0.45 });
    }
  });

  toastTimer = setTimeout(() => {
    if (reducedMotion || !toastEl.value) {
      toast.value.open = false;
      return;
    }
    gsap.to(toastEl.value, {
      autoAlpha: 0,
      y: 10,
      duration: DUR.fast,
      ease: "power2.inOut",
      onComplete: () => (toast.value.open = false),
    });
  }, 2200);
}

/* =========================
   ✅ Remove Image Columns
   ========================= */
function isImageKey(k) {
  const s = String(k || "").toLowerCase();
  return (
    s === "image" ||
    s === "img" ||
    s.includes("image") ||
    s.includes("img") ||
    s.includes("logo") ||
    s.includes("avatar") ||
    s.includes("photo") ||
    s.includes("picture") ||
    s.includes("icon")
  );
}

/* =========================
   ✅ Hide backend id columns in table/filter
   ========================= */
const BACKEND_ID_KEYS = new Set(["id", "_id", "uuid", "member_id", "memberid"]);
function isBackendIdKey(k) {
  return BACKEND_ID_KEYS.has(String(k || "").toLowerCase());
}

/* =========================
   ✅ "idmember" display column
   ========================= */
const ID_MEMBER_COL = "idmember";
function isIdMemberCol(k) {
  return String(k || "").toLowerCase() === ID_MEMBER_COL;
}
function colLabel(col) {
  return isIdMemberCol(col) ? "No" : col;
}

/* =========================
   ✅ Logo from backend
   ========================= */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const MEMBERS_API = `${API_BASE}/api/members`;

function resolveMediaUrl(src) {
  if (!src) return "";
  const s = String(src).trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  if (s.startsWith("/")) return `${API_BASE}${s}`;
  return `${API_BASE}/${s}`;
}

function logoUrlOf(m) {
  const raw =
    m?.logo ??
    m?.bank_logo ??
    m?.bankLogo ??
    m?.logo_url ??
    m?.logoUrl ??
    m?.image ??
    m?.img ??
    m?.avatar ??
    m?.photo ??
    m?.picture ??
    m?.icon;

  return resolveMediaUrl(raw);
}

const selectedLogoUrl = computed(() => logoUrlOf(selected.value));

/* =========================
   ✅ Overlay hide ids
   ========================= */
function isHiddenOverlayIdKey(k) {
  const s = String(k || "").toLowerCase();
  return BACKEND_ID_KEYS.has(s);
}

/* =========================
   ✅ Sort members oldest -> newest
   ========================= */
function getDateMsFromRow(m) {
  const candidates = [m?.createdAt, m?.created_at, m?.date_time, m?.timestamp, m?.updatedAt, m?.updated_at];
  for (const c of candidates) {
    if (!c) continue;
    const ms = Date.parse(String(c));
    if (!Number.isNaN(ms)) return ms;
  }
  return null;
}

function getNumericIdFromRow(m) {
  const id = m?.idmember ?? m?.member_id ?? m?.memberId ?? m?.id ?? m?._id ?? m?.uuid ?? null;
  if (id === null || id === undefined) return null;
  const n = Number(id);
  return Number.isNaN(n) ? null : n;
}

function sortMembersOldestFirst(list) {
  const hasDate = list.some((m) => getDateMsFromRow(m) !== null);

  const decorated = list.map((item, idx) => {
    const key = hasDate ? getDateMsFromRow(item) ?? Number.MAX_SAFE_INTEGER : getNumericIdFromRow(item) ?? Number.MAX_SAFE_INTEGER;
    return { item, idx, key };
  });

  decorated.sort((a, b) => {
    if (a.key !== b.key) return a.key - b.key;
    return a.idx - b.idx;
  });

  return decorated.map((x) => x.item);
}

/* =========================
   ✅ Color helpers
   ========================= */
function isColorField(k) {
  const kk = String(k || "");
  return /(^|\.)(color)\.(primary|secondary)$/i.test(kk);
}
function normalizeHex(input) {
  const s = String(input || "").trim();
  if (!s) return null;
  const raw = s.startsWith("#") ? s.slice(1) : s;

  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const r = raw[0],
      g = raw[1],
      b = raw[2];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw}`.toLowerCase();
  return null;
}

/* =========================
   ✅ Flags for Crossborder.items
   ========================= */
function flagUrl(code) {
  const STYLE = "flat";
  const SIZE = 32;
  return `https://flagsapi.com/${code}/${STYLE}/${SIZE}.png`;
}

const COUNTRY = [
  { code: "LA", keys: ["ລາວ", "laos", "lao"] },
  { code: "TH", keys: ["ໄທ", "ไทย", "thailand", "thai"] },
  { code: "KH", keys: ["ກຳປູເຈຍ", "กัมพูชา", "cambodia"] },
  { code: "VN", keys: ["ຫວຽດນາມ", "เวียดนาม", "vietnam"] },
  { code: "CN", keys: ["ຈີນ", "จีน", "china"] },
];

function detectCode(text) {
  const s = String(text || "").toLowerCase();
  for (const c of COUNTRY) {
    if (c.keys.some((k) => s.includes(String(k).toLowerCase()))) return c.code;
  }
  return null;
}

function extractPairFromText(text) {
  const raw = String(text || "");
  const s = raw.toLowerCase();

  const seps = ["ສະແກນ", "scan", "→", "->", "➡"];
  let left = raw,
    right = "";

  for (const sep of seps) {
    const idx = s.indexOf(sep);
    if (idx >= 0) {
      left = raw.slice(0, idx);
      right = raw.slice(idx + sep.length);
      break;
    }
  }

  const from = detectCode(left);
  const to = detectCode(right);
  if (from && to) return [from, to];

  const found = [];
  for (const c of COUNTRY) {
    if (c.keys.some((k) => s.includes(String(k).toLowerCase()))) found.push(c.code);
  }
  if (found.length >= 2) return [found[0], found[1]];

  return null;
}

/* =========================
   ✅ Special list detection
   ========================= */
function normPath(path) {
  return String(path || "")
    .toLowerCase()
    .replace(/\s+/g, "");
}
function isSpecialItemsPath(path) {
  const p = normPath(path);
  return (
    p.endsWith("cardatm.items") ||
    p.endsWith("card_atm.items") ||
    p.endsWith("atm.items") ||
    p.endsWith("mbbankking.items") ||
    p.endsWith("mbbanking.items") ||
    p.endsWith("mbbaking.items") ||
    p.endsWith("crossborder.items")
  );
}
function isCrossborderItemsPath(path) {
  const p = normPath(path);
  return p.endsWith("crossborder.items");
}

/* =========================
   Helpers
   ========================= */
function logout() {
  console.log("logout");
}

function rowKey(m, i) {
  return m?.idmember ?? m?.member_id ?? m?.memberId ?? m?.id ?? m?._id ?? m?.uuid ?? `${i}`;
}

function titleOf(m) {
  return (
    m?.bank_name ??
    m?.bankName ??
    m?.name ??
    m?.title ??
    m?.company ??
    m?.organization ??
    m?.idmember ??
    m?.id ??
    m?._id ??
    "Member"
  );
}

function formatCell(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v.length > 40 ? v.slice(0, 40) + "…" : v;
  if (Array.isArray(v)) return v.length ? `(${v.length}) items` : "-";
  if (typeof v === "object") return "Object";
  return String(v);
}

/* ✅ Flatten */
function toText(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;

  if (Array.isArray(v)) {
    if (!v.length) return "-";
    const allPrimitive = v.every(
      (x) => x === null || x === undefined || ["string", "number", "boolean"].includes(typeof x)
    );
    if (allPrimitive) return v.map((x) => (x == null ? "-" : String(x))).join(", ");
    return `(${v.length}) items`;
  }

  const keys = Object.keys(v);
  if (!keys.length) return "-";
  return `Object (${keys.length} keys)`;
}

function flattenAny(val, path, out) {
  if (val === null || val === undefined) {
    out.push({ k: path || "value", v: "-" });
    return;
  }

  const t = typeof val;

  if (t === "string" || t === "number" || t === "boolean") {
    out.push({ k: path || "value", v: String(val) });
    return;
  }

  if (Array.isArray(val)) {
    if (isSpecialItemsPath(path)) {
      if (isCrossborderItemsPath(path)) {
        const items = val
          .map((x) => {
            if (x && typeof x === "object" && !Array.isArray(x)) {
              const from = x.from || x.src || x.origin || x.country_from || null;
              const to = x.to || x.dst || x.dest || x.country_to || null;
              const text =
                x.text ||
                x.label ||
                x.name ||
                (() => {
                  try {
                    return JSON.stringify(x);
                  } catch {
                    return "Object";
                  }
                })();

              const flags = from && to ? [String(from).toUpperCase(), String(to).toUpperCase()] : extractPairFromText(text);
              return { text, flags };
            }

            const text =
              x === null || x === undefined
                ? "-"
                : typeof x === "string" || typeof x === "number" || typeof x === "boolean"
                ? String(x)
                : (() => {
                    try {
                      return JSON.stringify(x);
                    } catch {
                      return "Object";
                    }
                  })();

            return { text, flags: extractPairFromText(text) };
          })
          .filter((it) => String(it?.text ?? "").trim() !== "");

        out.push({ k: path || "items", type: "list", kind: "crossborder", items });
        return;
      }

      const items = val
        .map((x) => {
          if (x === null || x === undefined) return "-";
          if (typeof x === "string" || typeof x === "number" || typeof x === "boolean") return String(x);
          try {
            return JSON.stringify(x);
          } catch {
            return "Object";
          }
        })
        .filter((x) => String(x).trim() !== "");

      out.push({ k: path || "items", type: "list", kind: "plain", items });
      return;
    }

    if (!val.length) {
      out.push({ k: path || "value", v: "-" });
      return;
    }
    const allPrimitive = val.every((x) => x === null || x === undefined || ["string", "number", "boolean"].includes(typeof x));
    if (allPrimitive) {
      out.push({ k: path || "value", v: val.map((x) => (x == null ? "-" : String(x))).join(", ") });
      return;
    }
    val.forEach((item, idx) => {
      const p = path ? `${path}.${idx}` : String(idx);
      flattenAny(item, p, out);
    });
    return;
  }

  if (t === "object") {
    const entries = Object.entries(val);
    if (!entries.length) {
      out.push({ k: path || "value", v: "-" });
      return;
    }
    for (const [k, v] of entries) {
      if (k === "password" || k === "pwd") continue;
      if (isImageKey(k)) continue;

      if (isHiddenOverlayIdKey(k)) continue;
      if (String(k).toLowerCase() === ID_MEMBER_COL) continue;

      const p = path ? `${path}.${k}` : k;

      if (Array.isArray(v)) {
        flattenAny(v, p, out);
        continue;
      }

      if (v && typeof v === "object") flattenAny(v, p, out);
      else out.push({ k: p, v: toText(v) });
    }
    return;
  }

  out.push({ k: path || "value", v: String(val) });
}

/* ✅ rows (filtered + sorted) */
function normalize(v) {
  if (v === null || v === undefined) return "";
  return String(v).toLowerCase();
}

function compare(a, b) {
  const na = Number(a),
    nb = Number(b);
  const bothNum = !Number.isNaN(na) && !Number.isNaN(nb);
  if (bothNum) return na - nb;

  const da = Date.parse(a),
    db = Date.parse(b);
  const bothDate = !Number.isNaN(da) && !Number.isNaN(db);
  if (bothDate) return da - db;

  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true, sensitivity: "base" });
}

const rows = computed(() => {
  let arr = members.value;

  const s = q.value.trim().toLowerCase();
  if (s) arr = arr.filter((m) => JSON.stringify(m).toLowerCase().includes(s));

  const fk = filterKey.value;
  const fv = filterValue.value.trim().toLowerCase();
  if (fk && fv) arr = arr.filter((m) => normalize(m?.[fk]).includes(fv));

  if (sortKey.value) {
    const key = sortKey.value;
    arr = [...arr].sort((x, y) => compare(x?.[key], y?.[key]));
    if (sortDir.value === "desc") arr.reverse();
  }

  return arr;
});

/* =========================
   ✅ Pagination (7 per page)
   ========================= */
const pageSize = 7;
const currentPage = ref(1);

const pageCount = computed(() => Math.max(1, Math.ceil(rows.value.length / pageSize)));
const pageStart = computed(() => (currentPage.value - 1) * pageSize);
const pageEnd = computed(() => Math.min(pageStart.value + pageSize, rows.value.length));
const pageRows = computed(() => rows.value.slice(pageStart.value, pageEnd.value));

function clampPage(p) {
  const n = Number(p);
  if (Number.isNaN(n)) return 1;
  return Math.min(Math.max(1, n), pageCount.value);
}
function goPage(p) {
  currentPage.value = clampPage(p);
}
function goFirst() {
  currentPage.value = 1;
}
function goLast() {
  currentPage.value = pageCount.value;
}
function goPrev() {
  currentPage.value = clampPage(currentPage.value - 1);
}
function goNext() {
  currentPage.value = clampPage(currentPage.value + 1);
}

const pageList = computed(() => {
  const total = pageCount.value;
  const cur = currentPage.value;

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out = [];
  const push = (x) => out.push(x);

  push(1);

  const left = Math.max(2, cur - 1);
  const right = Math.min(total - 1, cur + 1);

  if (left > 2) push("...");

  for (let i = left; i <= right; i++) push(i);

  if (right < total - 1) push("...");

  push(total);
  return out;
});

/* Reset page on filters/sort/search */
watch([q, filterKey, filterValue, sortKey, sortDir], async () => {
  currentPage.value = 1;
  await nextTick();
  animateRows();
});

/* Keep page in range + animate on page change */
watch(
  () => [rows.value.length, currentPage.value],
  async () => {
    if (currentPage.value > pageCount.value) currentPage.value = pageCount.value;
    if (currentPage.value < 1) currentPage.value = 1;

    await nextTick();
    animateRows();
  }
);

/* ✅ Selected row No (1..n) based on current filtered rows */
const selectedRowNo = computed(() => {
  if (!selected.value) return "-";
  const sid = String(rowKey(selected.value, ""));
  const idx = rows.value.findIndex((r) => String(rowKey(r, "")) === sid);
  return idx >= 0 ? String(idx + 1) : "-";
});

const flatEntries = computed(() => {
  if (!selected.value) return [];
  const out = [{ k: ID_MEMBER_COL, v: selectedRowNo.value }];
  flattenAny(selected.value, "", out);
  return out;
});

/* =========================
   Columns + Filters
   ========================= */
const tableCols = computed(() => {
  if (!members.value.length) return [ID_MEMBER_COL, "name", "bank_name"];

  const keysSet = new Set();
  members.value.slice(0, 25).forEach((m) => Object.keys(m || {}).forEach((k) => keysSet.add(k)));

  const keys = Array.from(keysSet).filter(
    (k) => !isImageKey(k) && !isBackendIdKey(k) && String(k).toLowerCase() !== ID_MEMBER_COL
  );

  const preferred = [
    "bank_name",
    "bankName",
    "name",
    "code",
    "phone",
    "tel",
    "email",
    "address",
    "province",
    "district",
    "createdAt",
    "updatedAt",
  ].filter((k) => !isImageKey(k) && !isBackendIdKey(k) && String(k).toLowerCase() !== ID_MEMBER_COL);

  const picked = [];
  for (const k of preferred) if (keys.includes(k) && !picked.includes(k)) picked.push(k);

  const sample = members.value[0] || {};
  for (const k of keys) {
    if (picked.length >= 6) break;
    if (k === "password" || k === "pwd") continue;
    const v = sample[k];
    if (typeof v === "object" && v !== null) continue;
    if (!picked.includes(k)) picked.push(k);
  }

  return [ID_MEMBER_COL, ...picked.slice(0, 6)];
});

const filterKeys = computed(() => {
  if (!members.value.length) return [];
  const set = new Set();

  members.value.slice(0, 40).forEach((m) => {
    Object.entries(m || {}).forEach(([k, v]) => {
      if (k === "password" || k === "pwd") return;
      if (isImageKey(k)) return;
      if (isBackendIdKey(k)) return;
      if (String(k).toLowerCase() === ID_MEMBER_COL) return;
      if (typeof v === "object" && v !== null) return;
      set.add(k);
    });
  });

  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

function toggleSort(col) {
  if (isIdMemberCol(col)) return;

  if (sortKey.value !== col) {
    sortKey.value = col;
    sortDir.value = "asc";
    return;
  }
  sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
}

function clearFilters() {
  q.value = "";
  filterKey.value = "";
  filterValue.value = "";
  sortKey.value = "";
  sortDir.value = "asc";
}

/* =========================
   ✅ Actions (Edit/Delete via Confirm)
   ========================= */
function askEdit(m) {
  openConfirm("edit", m);
}
function askDelete(m) {
  openConfirm("delete", m);
}

async function confirmProceed() {
  const m = confirmTarget.value;
  if (!m) return;

  const id = rowKey(m, "");
  const name = titleOf(m);

  if (confirmAction.value === "edit") {
    confirmLoading.value = true;
    setBusy(String(id), true);

    closeConfirm();
    showToast("info", "Opening editor…");

    router.push({ path: "/membersedit", query: { id: String(id ?? "") } });

    setBusy(String(id), false);
    confirmLoading.value = false;
    return;
  }

  if (!id) return;

  const before = [...members.value];
  members.value = members.value.filter((x) => String(rowKey(x, "")) !== String(id));

  try {
    confirmLoading.value = true;
    setBusy(String(id), true);
    error.value = "";

    const res = await fetch(`${MEMBERS_API}/${encodeURIComponent(String(id))}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    if (selected.value && String(rowKey(selected.value, "")) === String(id)) selected.value = null;

    closeConfirm();
    showToast("success", `Deleted: ${name}`);
  } catch (e) {
    console.error(e);
    members.value = before;
    closeConfirm();
    showToast("error", "Delete failed (backend must have DELETE /api/members/:id)");
  } finally {
    confirmLoading.value = false;
    setBusy(String(id), false);
  }
}

/* =========================
   Overlay (modern GSAP)
   ========================= */
let overlayTL = null;

async function openOverlay(m) {
  selected.value = m;
  await nextTick();

  if (!overlayEl.value || !modalEl.value) return;

  if (overlayTL) overlayTL.kill();

  gsap.set(overlayEl.value, { autoAlpha: 0 });
  gsap.set(modalEl.value, {
    autoAlpha: 0,
    y: 22,
    scale: 0.97,
    rotateX: 10,
    transformPerspective: 1000,
    transformOrigin: "50% 20%",
  });

  overlayTL = gsap.timeline({ defaults: { ease: "expo.out" } });
  overlayTL
    .to(overlayEl.value, { autoAlpha: 1, duration: DUR.base, ease: "power2.out" }, 0)
    .to(modalEl.value, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: DUR.slow }, 0.04)
    .fromTo(
      modalEl.value.querySelectorAll(".kv"),
      { autoAlpha: 0, y: 10, filter: "blur(4px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: DUR.base, stagger: 0.03, ease: "power3.out" },
      0.12
    );
}

function closeOverlay() {
  if (!overlayEl.value || !modalEl.value) {
    selected.value = null;
    return;
  }

  if (reducedMotion) {
    selected.value = null;
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: () => {
      selected.value = null;
      overlayTL = null;
    },
  });

  tl.to(modalEl.value, { autoAlpha: 0, y: 10, scale: 0.985, rotateX: 6, duration: DUR.fast }, 0).to(
    overlayEl.value,
    { autoAlpha: 0, duration: DUR.fast },
    0
  );
}

/* =========================
   Fetch
   ========================= */
async function fetchMembers() {
  try {
    error.value = "";
    loading.value = true;

    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();

    const res = await fetch(MEMBERS_API, {
      signal: abortCtrl.signal,
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const list = Array.isArray(data) ? data : Array.isArray(data?.members) ? data.members : Array.isArray(data?.data) ? data.data : [];

    members.value = sortMembersOldestFirst(list);

    await nextTick();
    animateRows();
  } catch (err) {
    if (err?.name === "AbortError") return;
    console.error(err);
    error.value = "Failed to load members";
  } finally {
    loading.value = false;
  }
}

/* =========================
   Modern hover micro-interactions (quickTo)
   ========================= */
function btnHover(e, enter) {
  const el = e.currentTarget;
  const q = ensureHoverQuick(el);
  q?.y(enter ? -2 : 0);
}
function iconHover(e, enter) {
  const el = e.currentTarget;
  const q = ensureHoverQuick(el);
  q?.scale(enter ? 1.06 : 1);
}
function navHover(e, enter) {
  const el = e.currentTarget;
  if (el.classList.contains("active")) return;
  const q = ensureHoverQuick(el);
  q?.x(enter ? 4 : 0);
}
function rowHover(e, enter) {
  const el = e.currentTarget;
  const q = ensureHoverQuick(el);
  q?.y(enter ? -2 : 0);
}
function pillHover(e, enter) {
  const el = e.currentTarget;
  const q = ensureHoverQuick(el);
  q?.y(enter ? -1 : 0);
}

/* =========================
   Key handler
   ========================= */
function onKey(e) {
  if (e.key === "Escape") {
    if (confirmOpen.value) closeConfirm();
    else if (selected.value) closeOverlay();
  }
}

/* =========================
   Mount / Unmount (modern reveal)
   ========================= */
onMounted(async () => {
  window.addEventListener("keydown", onKey);

  await nextTick();

  if (gsapCtx) gsapCtx.revert();
  gsapCtx = gsap.context(() => {
    const sel = gsap.utils.selector(rootEl.value);

    // Base set
    gsap.set(sel(".js-reveal"), { autoAlpha: 0, y: 12, filter: "blur(6px)" });

    // Main intro
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(
      sidebarEl.value,
      { autoAlpha: 0, x: -28, filter: "blur(10px)" },
      { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: DUR.slow },
      0
    )
      .fromTo(
        topbarEl.value,
        { autoAlpha: 0, y: -14, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: DUR.slow },
        0.06
      )
      .to(
        sel(".js-reveal"),
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: DUR.base, stagger: 0.06, ease: "power3.out" },
        0.1
      );
  }, rootEl.value);

  await fetchMembers();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  if (abortCtrl) abortCtrl.abort();
  if (toastTimer) clearTimeout(toastTimer);
  if (overlayTL) overlayTL.kill();
  if (gsapCtx) gsapCtx.revert();
});
</script>

<style scoped>
/* =========================
   DARK BLUE TECH THEME
   ========================= */
:root {
  color-scheme: dark;
}
* {
  box-sizing: border-box;
}

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

/* subtle grid overlay */
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

/* Ambient glows */
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

/* =========================
   Sidebar
   ========================= */
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
  will-change: transform, opacity;
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
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.65), rgba(99, 102, 241, 0.45));
  box-shadow: 0 18px 42px rgba(56, 189, 248, 0.12);
  border: 1px solid rgb(255, 255, 255);
}
.brandName {
  font-weight: 900;
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
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  will-change: transform;
}
.navItem:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.92);
  border-color: rgba(56, 189, 248, 0.22);
  box-shadow: 0 12px 30px rgba(56, 189, 248, 0.1);
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
  will-change: transform;
}

/* =========================
   Main
   ========================= */
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
  will-change: transform, opacity;
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
  will-change: transform;
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

/* =========================
   Members Page styles
   ========================= */
.membersPage {
  padding: 6px 6px 18px;
  color: var(--txt);
}

.pageTop {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}
.pageTitle {
  font-size: 20px;
  font-weight: 950;
  letter-spacing: 0.2px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 520px;
}
.filterWrap {
  width: 360px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--panel2);
  border: 1px solid var(--stroke);
  border-radius: 16px;
  padding: 10px 12px;
}
.filterWrap:focus-within {
  border-color: rgba(56, 189, 248, 0.22);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.07);
}
.filterIcon {
  color: rgba(255, 255, 255, 0.55);
}
.filterSelect {
  width: 160px;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.84);
  font-weight: 850;
}
.filterInput {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.ghostBtn {
  height: 40px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 900;
  cursor: pointer;
  will-change: transform;
}
.ghostBtn:hover {
  border-color: rgba(56, 189, 248, 0.16);
  color: rgba(255, 255, 255, 0.92);
}

.metaRow {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
.metaPill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--panel2);
  border: 1px solid var(--stroke);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 850;
}
.errorPill {
  border-color: rgba(239, 68, 68, 0.25);
  color: rgba(239, 68, 68, 0.95);
}
.spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  border-top-color: rgba(56, 189, 248, 0.7);
  animation: spin 0.85s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.tableWrap {
  border-radius: 18px;
  overflow: hidden;
  background: var(--panel2);
  border: 1px solid var(--stroke);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.th,
.td {
  padding: 12px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  text-align: left;
  font-size: 13px;
}
.th {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 950;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.06));
  user-select: none;
  cursor: pointer;
}
.thLast {
  cursor: default;
}
.tr {
  cursor: pointer;
  transition: background 160ms ease;
  will-change: transform;
}
.tr:hover {
  background: rgba(255, 255, 255, 0.03);
}
.td {
  color: rgba(255, 255, 255, 0.86);
  font-weight: 800;
}
.tdLast {
  width: 320px;
}

.empty {
  padding: 18px;
  text-align: center;
  color: var(--muted);
  font-weight: 900;
}

/* Actions */
.actionRow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.pillBtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 900;
  cursor: pointer;
  line-height: 1;
  will-change: transform;
}
.pillBtn:hover {
  border-color: rgba(56, 189, 248, 0.18);
  color: rgba(255, 255, 255, 0.92);
}
.pillBtn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.pillBtn.danger {
  border-color: rgba(239, 68, 68, 0.26);
}
.pillBtn.danger:hover {
  border-color: rgba(239, 68, 68, 0.45);
}

/* Pagination */
.pager {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 16px;
  background: var(--panel2);
  border: 1px solid var(--stroke);
}
.pagerLeft {
  color: rgba(255, 255, 255, 0.72);
  font-weight: 850;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.pagerDot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.75);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.12);
}
.pagerRight {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.pagerBtn {
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.82);
  font-weight: 950;
  cursor: pointer;
  will-change: transform;
}
.pagerBtn:hover {
  border-color: rgba(56, 189, 248, 0.18);
  color: rgba(255, 255, 255, 0.92);
}
.pagerBtn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.pagerBtn.num {
  min-width: 38px;
  padding: 0 10px;
}
.pagerBtn.num.on {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.14));
  border-color: rgba(56, 189, 248, 0.24);
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 30px rgba(56, 189, 248, 0.08);
}
.pagerEllipsis {
  color: rgba(255, 255, 255, 0.55);
  font-weight: 950;
  padding: 0 4px;
}

/* Overlay modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 9, 20, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
}
.modal {
  width: min(980px, 96vw);
  max-height: 88vh;
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  background: rgba(7, 14, 35, 0.78);
  border: 1px solid var(--stroke);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.55);
  will-change: transform, opacity;
}
.modalGlow {
  position: absolute;
  inset: -2px;
  pointer-events: none;
  background: radial-gradient(circle at 20% 18%, rgba(56, 189, 248, 0.18), transparent 60%),
    radial-gradient(circle at 82% 22%, rgba(99, 102, 241, 0.14), transparent 62%);
  opacity: 0.9;
  filter: blur(16px);
}
.modalTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 1;
}
.modalTitle {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
  font-size: 22px;
}
.modalBody {
  padding: 16px;
  overflow: auto;
  max-height: calc(88vh - 70px);
  position: relative;
  z-index: 1;
}
.kvGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.kv {
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 12px;
  padding: 14px 14px;
  border-radius: 18px;
  background: var(--panel2);
  border: 1px solid var(--stroke);
}
.k {
  color: rgba(255, 255, 255, 0.62);
  font-weight: 950;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.v {
  color: rgba(255, 255, 255, 0.88);
  font-weight: 850;
  font-size: 14px;
  word-break: break-word;
  line-height: 1.65;
}

.listBox {
  display: grid;
  gap: 10px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.18));
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.06);
}
.listBox.cross {
  border-color: rgba(99, 102, 241, 0.18);
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.06);
}

.neoItem {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  position: relative;
  overflow: hidden;
}
.neoItem::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.12), rgba(56, 189, 248, 0.22));
  opacity: 0.16;
  filter: blur(14px);
  pointer-events: none;
}
.neoDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 7px;
  flex: 0 0 auto;
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.14);
}
.neoText {
  position: relative;
  z-index: 1;
  font-size: 14px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.9);
}
.neoEmpty {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 900;
  font-size: 14px;
}

.flagPair {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  background: rgba(0, 0, 0, 0.18);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.06);
  flex: 0 0 auto;
}
.flag {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
}

.colorValue {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.swatch {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
}
.swatch.invalid {
  background: rgba(255, 255, 255, 0.06);
  position: relative;
}
.swatch.invalid::after {
  content: "!";
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-weight: 950;
  font-size: 14px;
  color: rgba(239, 68, 68, 0.95);
}
.hexPill {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.22);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: 950;
  letter-spacing: 0.3px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

/* Logo under idmember */
.idCell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.logoMini {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
}
.logoUnderId {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}
.logoLabel {
  font-weight: 900;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}
.logoImg {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
}

/* Confirm Modal + Toast */
.confirmOverlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  background: rgba(5, 9, 20, 0.74);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  padding: 20px;
}
.confirmCard {
  width: min(520px, 95vw);
  border-radius: 22px;
  background: rgba(7, 14, 35, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.6);
  padding: 18px 18px 16px;
  position: relative;
  overflow: hidden;
  will-change: transform, opacity;
}
.confirmCard::before {
  content: "";
  position: absolute;
  inset: -2px;
  opacity: 0.18;
  filter: blur(16px);
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(56, 189, 248, 0.35),
    rgba(99, 102, 241, 0.22),
    rgba(56, 189, 248, 0.18),
    rgba(56, 189, 248, 0.35)
  );
}
.confirmCard.danger::before {
  background: linear-gradient(
    90deg,
    rgba(239, 68, 68, 0.35),
    rgba(99, 102, 241, 0.22),
    rgba(56, 189, 248, 0.18),
    rgba(239, 68, 68, 0.35)
  );
}
.confirmIcon {
  width: 92px;
  height: 92px;
  border-radius: 999px;
  margin: 8px auto 10px;
  display: grid;
  place-items: center;
  position: relative;
}
.skull {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  position: relative;
  z-index: 2;
  background: rgba(56, 189, 248, 0.16);
  border: 1px solid rgba(56, 189, 248, 0.22);
  box-shadow: 0 18px 44px rgba(56, 189, 248, 0.14);
}
.confirmCard.danger .skull {
  background: rgba(239, 68, 68, 0.16);
  border: 1px solid rgba(239, 68, 68, 0.22);
  box-shadow: 0 18px 44px rgba(239, 68, 68, 0.14);
}
.skull i {
  font-size: 22px;
  color: rgba(56, 189, 248, 0.95);
}
.confirmCard.danger .skull i {
  color: rgba(239, 68, 68, 0.95);
}
.ring {
  position: absolute;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  inset: 0;
  z-index: 1;
  animation: pulse 1.9s ease-in-out infinite;
}
.confirmCard.danger .ring {
  border-color: rgba(239, 68, 68, 0.2);
}
.ringB {
  inset: -10px;
  opacity: 0.55;
  animation-delay: 0.35s;
}
@keyframes pulse {
  0% {
    transform: scale(0.96);
    opacity: 0.55;
  }
  60% {
    transform: scale(1.05);
    opacity: 0.18;
  }
  100% {
    transform: scale(0.96);
    opacity: 0.55;
  }
}
.confirmTitle {
  text-align: center;
  font-weight: 950;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.92);
  position: relative;
  z-index: 2;
}
.confirmText {
  margin-top: 8px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 850;
  position: relative;
  z-index: 2;
  line-height: 1.5;
}
.confirmName {
  display: inline-block;
  margin-left: 6px;
  color: rgba(255, 255, 255, 0.92);
}
.confirmHint {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.58);
}
.confirmActions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: center;
  position: relative;
  z-index: 2;
}
.cBtn {
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.84);
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  will-change: transform;
}
.cBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.cBtn.ghost:hover {
  border-color: rgba(56, 189, 248, 0.18);
}
.cBtn.info {
  border-color: rgba(56, 189, 248, 0.22);
  background: rgba(56, 189, 248, 0.12);
}
.cBtn.info:hover {
  border-color: rgba(56, 189, 248, 0.45);
}
.cBtn.danger {
  border-color: rgba(239, 68, 68, 0.28);
  background: rgba(239, 68, 68, 0.12);
}
.cBtn.danger:hover {
  border-color: rgba(239, 68, 68, 0.5);
}
.miniSpin {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-top-color: rgba(56, 189, 248, 0.95);
  animation: spin 0.75s linear infinite;
}
.confirmCard.danger .miniSpin {
  border-top-color: rgba(239, 68, 68, 0.95);
}

.toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 11000;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(7, 14, 35, 0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.55);
  font-weight: 950;
  animation: toastIn 0.24s ease-out;
  will-change: transform, opacity;
}
@keyframes toastIn {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.toast.success {
  border-color: rgba(34, 197, 94, 0.22);
}
.toast.success i {
  color: rgba(34, 197, 94, 0.95);
}
.toast.error {
  border-color: rgba(239, 68, 68, 0.25);
}
.toast.error i {
  color: rgba(239, 68, 68, 0.95);
}
.toast.info {
  border-color: rgba(56, 189, 248, 0.22);
}
.toast.info i {
  color: rgba(56, 189, 248, 0.95);
}
.toastText {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
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
  .actions {
    min-width: 0;
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .filterWrap {
    width: 100%;
  }
  .kv {
    grid-template-columns: 1fr;
  }
  .tdLast {
    width: 100%;
  }
  .pager {
    flex-direction: column;
    align-items: stretch;
  }
  .pagerRight {
    justify-content: center;
  }
}
</style>
