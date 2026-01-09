<!-- LapnetView.vue -->
<template>
  <div ref="rootEl" class="app tech">
    <!-- Ambient glow -->
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

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
          <input v-model="q" class="search" placeholder="Search employees..." />
        </div>

        <div class="topActions">
          <button
            class="iconBtn"
            type="button"
            aria-label="Refresh"
            title="Refresh"
            @click="fetchEmployees"
            @mouseenter="iconHover($event, true)"
            @mouseleave="iconHover($event, false)"
          >
            <i class="fa-solid fa-rotate-right"></i>
          </button>

          <div class="profile">
            <div class="avatarTop">A</div>
            <div class="profileText">
              <div class="profileName">Admin</div>
              <div class="profileRole">Lapnet</div>
            </div>
          </div>
        </div>
      </header>

      <section class="mainBody">
        <div class="membersPage">
          <!-- Header -->
          <div class="pageTop js-reveal">
            <div class="titleBlock">
              <div class="pageTitle">Employee (Lapnet)</div>
              <div class="pageSub">View / Edit / Delete + Highlight row after insert</div>
            </div>

            <div class="actions">
              <div class="filterWrap">
                <span class="filterIcon"><i class="fa-solid fa-filter"></i></span>
                <select v-model="filterKey" class="filterSelect">
                  <option value="">Filter by: (All)</option>
                  <option v-for="k in filterKeys" :key="k" :value="k">{{ colLabel(k) }}</option>
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
              <b>{{ employees.length }}</b>
              <span>records</span>
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
              <span>Found:</span>
              <b>{{ rows.length }}</b>
              <span>records</span>
            </div>

            <!-- ✅ ไปหน้า insert (แก้ path ได้ตาม route โปรเจค) -->
            <button class="metaPill addPill" type="button" @click="goInsert">
              <i class="fa-solid fa-plus"></i>
              <span>Add Employee</span>
            </button>
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
                  :data-rowid="String(rowKey(m, localIdx))"
                  class="tr"
                  @click="openOverlay(m)"
                  @mouseenter="rowHover($event, true)"
                  @mouseleave="rowHover($event, false)"
                >
                  <td v-for="col in tableCols" :key="col" class="td">
                    <!-- ✅ No + avatar mini -->
                    <template v-if="isNoCol(col)">
                      <div class="idCell">
                        <div>{{ pageStart + localIdx + 1 }}</div>
                        <img v-if="imageUrlOf(m)" class="logoMini" :src="imageUrlOf(m)" alt="employee" />
                        <div v-else class="logoMiniEmpty"><i class="fa-solid fa-user"></i></div>
                      </div>
                    </template>

                    <!-- ✅ Image column -->
                    <template v-else-if="isImageCol(col)">
                      <div class="imgMiniCell">
                        <img v-if="imageUrlOf(m)" class="imgMini" :src="imageUrlOf(m)" alt="employee" />
                        <div v-else class="imgMiniEmpty"><i class="fa-solid fa-user"></i></div>
                      </div>
                    </template>

                    <!-- ✅ Default -->
                    <template v-else>
                      {{ formatCell(getField(m, col), col) }}
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
                <button v-else class="pagerBtn num" type="button" :class="{ on: p === currentPage }" @click="goPage(p)">
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
                    <i class="fa-solid fa-id-card"></i>
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
                  <div class="imageRow">
                    <div class="imgCard">
                      <div class="imgLabel">Employee Image</div>
                      <img v-if="imageUrlOf(selected)" class="bigImg" :src="imageUrlOf(selected)" alt="employee" />
                      <div v-else class="imgEmpty">-</div>
                    </div>

                    <div class="imgCard">
                      <div class="imgLabel">Quick Info</div>
                      <div class="quickInfo">
                        <div class="qi"><span class="k">ID</span><span class="v">{{ rowKey(selected, "") }}</span></div>
                        <div class="qi"><span class="k">Name</span><span class="v">{{ getField(selected, "name") || "-" }}</span></div>
                        <div class="qi"><span class="k">Role</span><span class="v">{{ getField(selected, "role") || "-" }}</span></div>
                        <div class="qi">
                          <span class="k">Dept</span><span class="v">{{ getField(selected, "department") || "-" }}</span>
                        </div>
                        <div class="qi">
                          <span class="k">Position</span><span class="v">{{ getField(selected, "position") || "-" }}</span>
                        </div>
                        <div class="qi">
                          <span class="k">Created</span><span class="v">{{ formatDDMMYY(getField(selected, "create_at")) || "-" }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="kvGrid">
                    <div class="kv">
                      <div class="k">No</div>
                      <div class="v">{{ selectedRowNo }}</div>
                    </div>

                    <div v-for="item in flatEntries" :key="item.k" class="kv">
                      <div class="k">{{ item.k }}</div>
                      <div class="v">{{ item.v }}</div>
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
                  {{ confirmAction === "delete" ? "Delete Employee?" : "Edit Employee?" }}
                </div>

                <div class="confirmText">
                  {{ confirmAction === "delete" ? "You are about to delete:" : "You are about to edit:" }}
                  <b class="confirmName">{{ confirmName }}</b>

                  <div class="confirmHint">
                    {{
                      confirmAction === "delete"
                        ? "This action cannot be undone."
                        : "You will be redirected to /lapnetedit."
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
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const rootEl = ref(null);
const topbarEl = ref(null);

const userName = "Arkhan";

/* =========================
   API
   ========================= */
const API_BASE = import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL || "http://localhost:3000";
const EMP_API = `${API_BASE}/api/emp_lapnet`;

/* =========================
   DATA
   ========================= */
const employees = ref([]);
const loading = ref(false);
const error = ref("");

const q = ref("");
const filterKey = ref("");
const filterValue = ref("");

const sortKey = ref("create_at");
const sortDir = ref("desc");

const selected = ref(null);
const overlayEl = ref(null);
const modalEl = ref(null);

let abortCtrl = null;

/* =========================
   Busy state per row
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
   Confirm state (Edit/Delete)
   ========================= */
const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmTarget = ref(null);
const confirmAction = ref("delete"); // 'delete' | 'edit'
const confirmEl = ref(null);

const confirmName = computed(() => titleOf(confirmTarget.value));

/* =========================
   Toast
   ========================= */
const toast = ref({ open: false, type: "success", text: "" });
const toastEl = ref(null);
let toastTimer = null;

const reducedMotion =
  typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

const DUR = {
  fast: reducedMotion ? 0 : 0.18,
  base: reducedMotion ? 0 : 0.35,
  slow: reducedMotion ? 0 : 0.6,
};

const hoverQ = new WeakMap();
function ensureHoverQuick(el) {
  if (!el) return null;
  if (hoverQ.has(el)) return hoverQ.get(el);
  const q = {
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
    { autoAlpha: 0, y: 14, scale: 0.985, transformPerspective: 900, rotateX: 8, filter: "blur(6px)" },
    { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", duration: DUR.slow, ease: "expo.out", ...vars }
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
    { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: DUR.base, stagger: 0.035, ease: "power3.out", overwrite: true }
  );
}

function showToast(type, text) {
  toast.value = { open: true, type, text };
  if (toastTimer) clearTimeout(toastTimer);

  nextTick(() => {
    if (toastEl.value) popIn(toastEl.value, { y: 10, rotateX: 0, duration: reducedMotion ? 0 : 0.45 });
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
   Helpers: fields + media
   ========================= */
const NO_COL = "__no__";
function isNoCol(k) {
  return String(k) === NO_COL;
}
function isImageCol(k) {
  return String(k || "").toLowerCase() === "image";
}

function rowKey(m, i) {
  return m?.emp_id ?? m?.empId ?? m?.id ?? m?.ID ?? `${i}`;
}

function titleOf(m) {
  const nm = getField(m, "name");
  return nm || `Employee #${rowKey(m, "-")}`;
}

function getField(m, col) {
  if (!m) return "";
  const key = String(col || "").toLowerCase();

  // รองรับหลายชื่อ field จาก backend
  if (key === "create_at" || key === "createat") return m?.create_at ?? m?.createAt ?? m?.created_at ?? m?.create_date ?? m?.timestamp ?? "";
  if (key === "position") return m?.position ?? m?.row ?? m?.pos ?? "";
  if (key === "image") return m?.image ?? m?.imageprofile ?? m?.imageProfile ?? m?.profile ?? m?.img ?? "";
  if (key === "name") return m?.name ?? m?.empName ?? m?.employee_name ?? m?.employeeName ?? "";
  if (key === "role") return m?.role ?? m?.job ?? m?.title ?? "";
  if (key === "department") return m?.department ?? m?.dept ?? "";
  if (key === "emp_id" || key === "empid") return m?.emp_id ?? m?.empId ?? m?.id ?? "";

  // fallback direct
  return m?.[col] ?? m?.[key] ?? "";
}

function resolveMediaUrl(src) {
  if (!src) return "";
  const s = String(src).trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  if (s.startsWith("/")) return `${API_BASE}${s}`;
  return `${API_BASE}/${s}`;
}

function imageUrlOf(m) {
  return resolveMediaUrl(getField(m, "image"));
}

function colLabel(col) {
  if (isNoCol(col)) return "No";
  const k = String(col || "").toLowerCase();
  if (k === "emp_id") return "ID";
  if (k === "name") return "Employee Name";
  if (k === "role") return "Role";
  if (k === "department") return "Department";
  if (k === "position") return "Position";
  if (k === "create_at") return "Created";
  if (k === "image") return "Image";
  return col;
}

function formatDDMMYY(input) {
  const s = String(input ?? "").trim();
  if (!s || s === "-") return s || "-";

  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (m) {
    const yy = m[1].slice(2);
    const mm = m[2];
    const dd = m[3];
    return `${dd}/${mm}/${yy}`;
  }

  const ms = Date.parse(s);
  if (!Number.isNaN(ms)) {
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(2);
    return `${dd}/${mm}/${yy}`;
  }

  return s;
}

function formatCell(v, col = "") {
  if (v === null || v === undefined || v === "") return "-";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);

  const key = String(col || "").toLowerCase();
  if (key === "create_at") return formatDDMMYY(v);

  if (typeof v === "string") return v.length > 40 ? v.slice(0, 40) + "…" : v;

  return String(v);
}

/* =========================
   rows (filtered + sorted)
   ========================= */
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
  let arr = employees.value;

  const s = q.value.trim().toLowerCase();
  if (s) arr = arr.filter((m) => JSON.stringify(m).toLowerCase().includes(s));

  const fk = filterKey.value;
  const fv = filterValue.value.trim().toLowerCase();
  if (fk && fv) arr = arr.filter((m) => normalize(getField(m, fk)).includes(fv));

  if (sortKey.value && !isNoCol(sortKey.value)) {
    const key = sortKey.value;
    arr = [...arr].sort((x, y) => compare(getField(x, key), getField(y, key)));
    if (sortDir.value === "desc") arr.reverse();
  }

  return arr;
});

/* =========================
   Pagination (7 per page)
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

/* =========================
   Columns + Filters
   ========================= */
const tableCols = computed(() => [NO_COL, "name", "role", "department", "position", "create_at"]);
const filterKeys = computed(() => ["emp_id", "name", "role", "department", "position", "create_at"]);

function toggleSort(col) {
  if (isNoCol(col)) return;
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
  sortKey.value = "create_at";
  sortDir.value = "desc";
}

function goInsert() {
  // ✅ เปลี่ยน path ให้ตรงกับ route insert ของโปรเจคคุณ
  router.push({ path: "/lapnet_employee" });
}

/* =========================
   Actions (Edit/Delete via Confirm)
   ========================= */
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

    router.push({ path: "/lapnetedit", query: { id: String(id ?? "") } });

    setBusy(String(id), false);
    confirmLoading.value = false;
    return;
  }

  if (!id) return;

  const before = [...employees.value];
  employees.value = employees.value.filter((x) => String(rowKey(x, "")) !== String(id));

  try {
    confirmLoading.value = true;
    setBusy(String(id), true);
    error.value = "";

    const res = await fetch(`${EMP_API}/${encodeURIComponent(String(id))}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    if (selected.value && String(rowKey(selected.value, "")) === String(id)) selected.value = null;

    closeConfirm();
    showToast("success", `Deleted: ${name}`);
  } catch (e) {
    console.error(e);
    employees.value = before;
    closeConfirm();
    showToast("error", "Delete failed (backend must have DELETE /api/emp_lapnet/:id)");
  } finally {
    confirmLoading.value = false;
    setBusy(String(id), false);
  }
}

/* =========================
   Overlay
   ========================= */
let overlayTL = null;

const selectedRowNo = computed(() => {
  if (!selected.value) return "-";
  const sid = String(rowKey(selected.value, ""));
  const idx = rows.value.findIndex((r) => String(rowKey(r, "")) === sid);
  return idx >= 0 ? String(idx + 1) : "-";
});

const flatEntries = computed(() => {
  if (!selected.value) return [];
  const keys = ["emp_id", "name", "role", "department", "position", "create_at"];
  return keys.map((k) => ({
    k: colLabel(k),
    v: k === "create_at" ? formatDDMMYY(getField(selected.value, k)) : formatCell(getField(selected.value, k), k),
  }));
});

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
   Route highlight ✅ (template เดิม)
   ========================= */
const pendingHighlightId = ref("");

function getRouteHighlight() {
  const h = route.query?.highlight;
  return Array.isArray(h) ? (h[0] ? String(h[0]) : "") : h ? String(h) : "";
}

function clearRouteHighlight() {
  const q = { ...route.query };
  delete q.highlight;
  router.replace({ path: route.path, query: q });
}

async function highlightRowById(idStr) {
  if (!idStr || !rootEl.value) return;

  // หา index ใน rows (หลัง filter/sort)
  let idx = rows.value.findIndex((r) => String(rowKey(r, "")) === String(idStr));

  // ถ้าหาไม่เจอ (โดน filter) ให้เคลียร์ filter/search เพื่อให้เห็น
  if (idx < 0) {
    q.value = "";
    filterKey.value = "";
    filterValue.value = "";
    await nextTick();
    idx = rows.value.findIndex((r) => String(rowKey(r, "")) === String(idStr));
  }
  if (idx < 0) return;

  // ไปหน้าที่มีแถวนั้น (pagination)
  const targetPage = Math.floor(idx / pageSize) + 1;
  if (currentPage.value !== targetPage) currentPage.value = targetPage;

  await nextTick();
  await nextTick();

  const rowEl = rootEl.value.querySelector(`tr[data-rowid="${String(idStr)}"]`);
  if (!rowEl) return;

  try {
    rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {}

  rowEl.classList.add("rowHL");

  const dur = reducedMotion ? 0 : 5;
  gsap.fromTo(
    rowEl,
    {
      "--hlBg": "rgba(34,197,94,0.22)",
      "--hlShadow": "inset 0 0 0 1px rgba(34,197,94,0.28), inset 0 0 46px rgba(34,197,94,0.16)",
    },
    {
      "--hlBg": "rgba(34,197,94,0)",
      "--hlShadow": "inset 0 0 0 1px rgba(34,197,94,0), inset 0 0 46px rgba(34,197,94,0)",
      duration: dur || 0.2,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => rowEl.classList.remove("rowHL"),
    }
  );

  clearRouteHighlight();
}

async function applyRouteHighlightIfAny() {
  const id = pendingHighlightId.value || getRouteHighlight();
  if (!id) return;
  pendingHighlightId.value = "";

  const delay = reducedMotion ? 0 : DUR.base + 0.1;
  gsap.delayedCall(delay, () => highlightRowById(id));
}

watch(
  () => route.query.highlight,
  (v) => {
    const id = Array.isArray(v) ? (v[0] ? String(v[0]) : "") : v ? String(v) : "";
    pendingHighlightId.value = id;
    if (id) applyRouteHighlightIfAny();
  }
);

/* =========================
   Fetch
   ========================= */
function unwrapApiList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
}

function sortByCreateAtDesc(list) {
  const decorated = list.map((item, idx) => {
    const ms = Date.parse(String(getField(item, "create_at") ?? ""));
    return { item, idx, ms: Number.isNaN(ms) ? -Infinity : ms };
  });
  decorated.sort((a, b) => b.ms - a.ms || a.idx - b.idx);
  return decorated.map((x) => x.item);
}

async function fetchEmployees() {
  try {
    error.value = "";
    loading.value = true;

    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();

    const res = await fetch(EMP_API, {
      signal: abortCtrl.signal,
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const list = unwrapApiList(data);

    employees.value = sortByCreateAtDesc(list);

    await nextTick();
    animateRows();

    await nextTick();
    applyRouteHighlightIfAny();
  } catch (err) {
    if (err?.name === "AbortError") return;
    console.error(err);
    error.value = "Failed to load employees";
  } finally {
    loading.value = false;
  }
}

/* =========================
   Hover
   ========================= */
function iconHover(e, enter) {
  const el = e.currentTarget;
  const q = ensureHoverQuick(el);
  q?.scale(enter ? 1.06 : 1);
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
   Mount / Unmount
   ========================= */
onMounted(async () => {
  window.addEventListener("keydown", onKey);

  await nextTick();

  gsap.context(() => {
    const sel = gsap.utils.selector(rootEl.value);

    const revealEls = sel(".js-reveal");
    gsap.set(revealEls, { autoAlpha: 0, y: 12, filter: "blur(6px)" });

    const others = Array.from(revealEls).filter((el) => el !== topbarEl.value);

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(
      topbarEl.value,
      { autoAlpha: 0, y: -14, filter: "blur(10px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: DUR.slow },
      0
    ).to(others, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: DUR.base, stagger: 0.06, ease: "power3.out" }, 0.08);
  }, rootEl.value);

  await fetchEmployees();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  if (abortCtrl) abortCtrl.abort();
  if (toastTimer) clearTimeout(toastTimer);
  if (overlayTL) overlayTL.kill();
});
</script>

<style scoped>
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

  --txt: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.55);

  min-height: 100vh;
  display: block;
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
.avatarTop {
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

/* Page */
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
.pageSub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 800;
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

.addPill {
  cursor: pointer;
  background: rgba(40, 164, 117, 0.18);
  border-color: rgba(40, 164, 117, 0.22);
}
.addPill:hover {
  background: rgba(40, 164, 117, 0.26);
  border-color: rgba(40, 164, 117, 0.35);
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

/* ✅ Row highlight support */
.tr.rowHL td {
  background: var(--hlBg, rgba(34, 197, 94, 0.16));
  box-shadow: var(--hlShadow, none);
}

/* No cell + mini avatar */
.idCell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.logoMini {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
}
.logoMiniEmpty {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(0, 0, 0, 0.14);
}

/* Image col mini */
.imgMiniCell {
  display: inline-flex;
  align-items: center;
}
.imgMini {
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.18);
}
.imgMiniEmpty {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(0, 0, 0, 0.14);
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

.empty {
  padding: 18px;
  text-align: center;
  color: var(--muted);
  font-weight: 900;
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

.imageRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}
.imgCard {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px;
}
.imgLabel {
  font-weight: 900;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-bottom: 10px;
}
.bigImg {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.18);
}
.imgEmpty {
  height: 220px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.55);
  font-weight: 900;
}

.quickInfo {
  display: grid;
  gap: 10px;
}
.qi {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.qi .k {
  color: rgba(255, 255, 255, 0.62);
  font-weight: 950;
  font-size: 12px;
}
.qi .v {
  color: rgba(255, 255, 255, 0.92);
  font-weight: 900;
  font-size: 12px;
  text-align: right;
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

/* Toast */
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
    transform: translateY(0px);
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
  .imageRow {
    grid-template-columns: 1fr;
  }
}
</style>
