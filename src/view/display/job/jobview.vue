<!-- JobList.vue (UPDATED: ✅ Overlay hides duplicated features_heading / features_items (show only features.heading + features.items once) ) -->
<template>
  <div class="app tech">
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

        <!-- Search -->
        <div class="searchWrap">
          <span class="searchIcon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input v-model="q" class="search" placeholder="Search jobs..." />
        </div>

        <div class="topActions">
          <button
            class="iconBtn"
            type="button"
            aria-label="Refresh"
            title="Refresh"
            @click="fetchJobs"
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
        <div class="membersPage">
          <!-- Header -->
          <div class="pageTop js-reveal">
            <div class="titleBlock">
              <div class="pageTitle">Jobs</div>
              <div class="pageSub">
                Showing data from
                <span class="mono">{{ API_JOBS }}</span>
              </div>
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
              <b>{{ jobs.length }}</b>
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
                    <span class="thLabel">{{ col }}</span>
                    <span class="sortIcon" v-if="sortKey === col">
                      <i :class="sortDir === 'asc' ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down'"></i>
                    </span>
                  </th>

                  <th class="th thLast">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(j, idx) in rows"
                  :key="rowKey(j, idx)"
                  class="tr js-reveal"
                  @click="openOverlay(j)"
                  @mouseenter="rowHover($event, true)"
                  @mouseleave="rowHover($event, false)"
                >
                  <td v-for="col in tableCols" :key="col" class="td">
                    {{ formatCell(safeValue(j?.[col])) }}
                  </td>

                  <!-- Actions -->
                  <td class="td tdLast">
                    <div class="actionRow">
                      <!-- View -->
                      <button
                        class="pillBtn"
                        type="button"
                        title="View"
                        @click.stop="openOverlay(j)"
                        :disabled="isBusy(j)"
                        @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)"
                      >
                        <i class="fa-regular fa-eye"></i>
                        View
                      </button>

                      <!-- Toggle Active -->
                      <button
                        class="pillBtn toggleBtn"
                        type="button"
                        :class="{ on: isActive(j) }"
                        :disabled="isBusy(j)"
                        :title="isActive(j) ? 'Set Inactive' : 'Set Active'"
                        @click.stop="toggleActive(j)"
                        @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)"
                      >
                        <i :class="isActive(j) ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'"></i>
                        {{ isActive(j) ? "Active" : "Inactive" }}
                      </button>

                      <!-- ✅ Edit -->
                      <button
                        class="pillBtn"
                        type="button"
                        title="Edit"
                        :disabled="isBusy(j)"
                        @click.stop="askEdit(j)"
                        @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)"
                      >
                        <i class="fa-regular fa-pen-to-square"></i>
                        Edit
                      </button>

                      <!-- ✅ Delete -->
                      <button
                        class="pillBtn danger"
                        type="button"
                        title="Delete"
                        :disabled="isBusy(j)"
                        @click.stop="askDelete(j)"
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

          <!-- Overlay -->
          <Teleport to="body">
            <div v-if="selected" ref="overlayEl" class="overlay" @click.self="closeOverlay">
              <div ref="modalEl" class="modal" @click.stop>
                <div class="modalTop">
                  <div class="modalTitle">
                    <i class="fa-solid fa-briefcase"></i>
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

                      <!-- list -->
                      <div v-if="item.type === 'list'" class="v">
                        <div class="listBox">
                          <div v-for="(it, i) in item.items" :key="`${item.k}-${i}`" class="neoItem">
                            <span class="neoDot"></span>
                            <span class="neoText">{{ it }}</span>
                          </div>
                          <div v-if="!item.items.length" class="neoEmpty">-</div>
                        </div>
                      </div>

                      <!-- default -->
                      <div v-else class="v">
                        {{ item.v }}
                      </div>
                    </div>
                  </div>
                </div>

                <span class="modalGlow" />
              </div>
            </div>
          </Teleport>

          <!-- ✅ Newview-style Cool Confirm (Edit/Delete) -->
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
                  {{ confirmAction === "delete" ? "Delete Job?" : "Edit Job?" }}
                </div>

                <div class="confirmText">
                  {{ confirmAction === "delete" ? "You are about to delete:" : "You are about to edit:" }}
                  <b class="confirmName">{{ confirmName }}</b>

                  <div class="confirmHint">
                    {{
                      confirmAction === "delete"
                        ? "This action cannot be undone."
                        : "You will be redirected to the editor."
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

          <!-- ✅ Newview-style Toast -->
          <Teleport to="body">
            <div v-if="toast.open" class="toast" :class="toast.type">
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();

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
const API_JOBS = "http://localhost:3000/api/jobs";
const API_JOBS_LIST = "http://localhost:3000/api/jobs-list";

const jobs = ref([]);
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
   Busy state per row
   ========================= */
const busyById = ref({});
function setBusy(id, v) {
  busyById.value = { ...busyById.value, [String(id)]: v };
}
function isBusy(j) {
  const id = String(rowKey(j, ""));
  return !!busyById.value[id];
}

/* =========================
   ✅ API helper: try /api/jobs then fallback /api/jobs-list
   ========================= */
async function apiRequest(path, init = {}) {
  const url1 = `${API_JOBS}${path}`;
  const url2 = `${API_JOBS_LIST}${path}`;

  const res1 = await fetch(url1, init);
  if (res1.status !== 404) return res1;
  return fetch(url2, init);
}

/* =========================
   ✅ Newview-style Confirm (Edit/Delete)
   ========================= */
const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmTarget = ref(null);
const confirmAction = ref("delete"); // 'delete' | 'edit'
const confirmEl = ref(null);

const confirmName = computed(() => titleOf(confirmTarget.value));

async function openConfirm(action, job) {
  confirmAction.value = action;
  confirmTarget.value = job;
  confirmOpen.value = true;
  confirmLoading.value = false;

  await nextTick();
  if (confirmEl.value) {
    gsap.fromTo(
      confirmEl.value,
      { opacity: 0, y: 16, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power3.out" }
    );
  }
}

function closeConfirm() {
  if (!confirmOpen.value) return;
  confirmOpen.value = false;
  confirmLoading.value = false;
  confirmTarget.value = null;
}

/* =========================
   ✅ Toast (newview style)
   ========================= */
const toast = ref({ open: false, type: "success", text: "" });
let toastTimer = null;

function showToast(type, text) {
  toast.value = { open: true, type, text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value.open = false;
  }, 2200);
}

/* =========================
   Helpers
   ========================= */
function logout() {
  console.log("logout");
}

function rowKey(j, i) {
  return j?.job_id ?? j?.jobId ?? j?.id ?? j?._id ?? j?.uuid ?? `${i}`;
}

function titleOf(j) {
  return j?.title ?? j?.job_title ?? j?.position ?? j?.name ?? j?.job_id ?? j?.jobId ?? j?.id ?? j?._id ?? "Job";
}

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

/** ✅ Hide duplicated derived fields from overlay/table/filter */
function isDerivedFeaturesKey(k) {
  const s = String(k || "").toLowerCase();
  return s === "features_heading" || s === "features_items" || s === "featuresheading" || s === "featuresitems";
}
function isHiddenKey(k) {
  return isImageKey(k) || isDerivedFeaturesKey(k);
}

function safeValue(v) {
  if (typeof v !== "string") return v;
  const s = v.trim();
  if (!s) return v;
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const arr = JSON.parse(s);
      return arr;
    } catch {
      return v;
    }
  }
  return v;
}

function formatCell(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v.length > 42 ? v.slice(0, 42) + "…" : v;
  if (Array.isArray(v)) return v.length ? `(${v.length}) items` : "-";
  if (typeof v === "object") return "Object";
  return String(v);
}

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

function toggleSort(col) {
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
   ✅ Active / Inactive logic (0/1)
   ========================= */
function isActive(j) {
  const raw =
    j?.active ??
    j?.is_active ??
    j?.isActive ??
    j?.enabled ??
    j?.status ??
    j?.state ??
    j?.publish_status ??
    j?.published;

  if (typeof raw === "number") return raw === 1;
  if (typeof raw === "boolean") return raw;

  const s = String(raw ?? "").trim().toLowerCase();
  if (!s) return false;
  return ["active", "enabled", "true", "1", "yes", "on", "open", "published"].includes(s);
}

function statusPatchFor(flag) {
  const v = flag ? 1 : 0;
  return { active: v };
}

function updateJobInList(id, patch) {
  jobs.value = jobs.value.map((x) => {
    const xid = String(rowKey(x, ""));
    if (xid !== String(id)) return x;
    return { ...x, ...patch };
  });
}

async function setActive(job, flag) {
  const id = rowKey(job, "");
  if (!id) return;

  const patch = statusPatchFor(flag);

  // optimistic
  const prev = { ...job };
  updateJobInList(id, patch);

  try {
    setBusy(String(id), true);
    error.value = "";

    const res = await apiRequest(`/${encodeURIComponent(String(id))}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json().catch(() => null);
    const updatedRow = json?.data ?? json?.row ?? json;

    if (updatedRow && typeof updatedRow === "object") updateJobInList(id, updatedRow);
    showToast("success", flag ? "Set to Active" : "Set to Inactive");
  } catch (e) {
    console.error(e);
    updateJobInList(id, prev);
    error.value = "Failed to update job status";
    showToast("error", "Update failed");
  } finally {
    setBusy(String(id), false);
  }
}

function toggleActive(job) {
  setActive(job, !isActive(job));
}

/* =========================
   ✅ Edit/Delete with Newview Confirm
   ========================= */
function askEdit(job) {
  openConfirm("edit", job);
}

function askDelete(job) {
  openConfirm("delete", job);
}

async function confirmProceed() {
  const job = confirmTarget.value;
  if (!job) return;

  const id = rowKey(job, "");
  const name = titleOf(job);

  if (confirmAction.value === "edit") {
    confirmLoading.value = true;
    setBusy(String(id), true);
    closeConfirm();
    showToast("info", "Opening editor…");
    router.push({ path: "/jobedit", query: { id: String(id ?? "") } });
    setBusy(String(id), false);
    confirmLoading.value = false;
    return;
  }

  // delete
  if (!id) return;

  const before = [...jobs.value];
  jobs.value = jobs.value.filter((x) => String(rowKey(x, "")) !== String(id));

  try {
    confirmLoading.value = true;
    setBusy(String(id), true);
    error.value = "";

    const res = await apiRequest(`/${encodeURIComponent(String(id))}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    closeConfirm();
    showToast("success", `Deleted: ${name}`);
  } catch (e) {
    console.error(e);
    jobs.value = before;
    closeConfirm();
    error.value = "Failed to delete job";
    showToast("error", "Delete failed");
  } finally {
    confirmLoading.value = false;
    setBusy(String(id), false);
  }
}

/* =========================
   Columns + Filters
   ========================= */
const tableCols = computed(() => {
  if (!jobs.value.length) return ["job_id", "title", "department", "levels", "time", "active"];

  const keysSet = new Set();
  jobs.value
    .slice(0, 20)
    .forEach((j) => Object.keys(j || {}).forEach((k) => !isHiddenKey(k) && keysSet.add(k)));

  const keys = Array.from(keysSet);

  const preferred = [
    "job_id",
    "jobId",
    "id",
    "_id",
    "title",
    "job_title",
    "position",
    "department",
    "dept",
    "division",
    "levels",
    "level",
    "time",
    "active",
    "created_at",
    "createdAt",
    "updatedAt",
    "features",
  ].filter((k) => !isHiddenKey(k));

  const picked = [];
  for (const k of preferred) if (keys.includes(k) && !picked.includes(k)) picked.push(k);

  const sample = jobs.value[0] || {};
  for (const k of keys) {
    if (picked.length >= 8) break;
    const v = sample[k];
    if (typeof v === "object" && v !== null) continue;
    if (!picked.includes(k)) picked.push(k);
  }

  return picked.slice(0, 8);
});

const filterKeys = computed(() => {
  if (!jobs.value.length) return [];
  const set = new Set();
  jobs.value.slice(0, 30).forEach((j) => {
    Object.entries(j || {}).forEach(([k, v]) => {
      if (k === "password" || k === "pwd") return;
      if (isHiddenKey(k)) return;
      if (typeof v === "object" && v !== null) return;
      set.add(k);
    });
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const rows = computed(() => {
  let arr = jobs.value;

  const s = q.value.trim().toLowerCase();
  if (s) arr = arr.filter((j) => JSON.stringify(j).toLowerCase().includes(s));

  const fk = filterKey.value;
  const fv = filterValue.value.trim().toLowerCase();
  if (fk && fv) arr = arr.filter((j) => normalize(j?.[fk]).includes(fv));

  if (sortKey.value) {
    const key = sortKey.value;
    arr = [...arr].sort((x, y) => compare(x?.[key], y?.[key]));
    if (sortDir.value === "desc") arr.reverse();
  }

  return arr;
});

/* =========================
   Flatten ALL fields for overlay
   ✅ HIDE duplicated: features_heading + features_items (only show features.heading + features.items)
   ========================= */
function toText(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;

  if (Array.isArray(v)) {
    if (!v.length) return "-";
    const allPrimitive = v.every((x) => x === null || x === undefined || ["string", "number", "boolean"].includes(typeof x));
    if (allPrimitive) return v.map((x) => (x == null ? "-" : String(x))).join(", ");
    return `(${v.length}) items`;
  }

  const keys = Object.keys(v);
  if (!keys.length) return "-";
  return `Object (${keys.length} keys)`;
}

function asArrayMaybe(v) {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr : null;
    } catch {
      return null;
    }
  }
  return null;
}

function flattenAny(val, path, out) {
  const name = path || "value";

  if (val === null || val === undefined) {
    out.push({ k: name, v: "-" });
    return;
  }

  const t = typeof val;

  if (t === "string" || t === "number" || t === "boolean") {
    const arr = asArrayMaybe(val);
    if (arr) {
      out.push({
        k: name,
        type: "list",
        items: arr
          .map((x) => {
            if (x === null || x === undefined) return "-";
            if (typeof x === "string" || typeof x === "number" || typeof x === "boolean") return String(x);
            try {
              return JSON.stringify(x);
            } catch {
              return "Object";
            }
          })
          .filter((x) => String(x).trim() !== ""),
      });
      return;
    }

    out.push({ k: name, v: String(val) });
    return;
  }

  if (Array.isArray(val)) {
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

    out.push({ k: name, type: "list", items });
    return;
  }

  if (t === "object") {
    const entries = Object.entries(val);
    if (!entries.length) {
      out.push({ k: name, v: "-" });
      return;
    }

    for (const [k, v] of entries) {
      if (k === "password" || k === "pwd") continue;
      if (isHiddenKey(k)) continue; // ✅ HERE: hides features_heading + features_items + images
      const p = path ? `${path}.${k}` : k;

      const maybeArr = asArrayMaybe(v);
      if (maybeArr) {
        flattenAny(maybeArr, p, out);
        continue;
      }

      if (v && typeof v === "object") flattenAny(v, p, out);
      else out.push({ k: p, v: toText(v) });
    }
    return;
  }

  out.push({ k: name, v: String(val) });
}

const flatEntries = computed(() => {
  if (!selected.value) return [];
  const out = [];
  flattenAny(selected.value, "", out);
  return out;
});

/* =========================
   Overlay
   ========================= */
async function openOverlay(j) {
  selected.value = j;
  await nextTick();

  gsap.fromTo(overlayEl.value, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "power2.out" });
  gsap.fromTo(
    modalEl.value,
    { opacity: 0, y: 12, scale: 0.985 },
    { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
  );
}

function closeOverlay() {
  if (!overlayEl.value || !modalEl.value) {
    selected.value = null;
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to(modalEl.value, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 }, 0)
    .to(overlayEl.value, { opacity: 0, duration: 0.18 }, 0)
    .add(() => (selected.value = null));
}

/* =========================
   Fetch Jobs
   ========================= */
async function fetchJobs() {
  try {
    error.value = "";
    loading.value = true;

    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();

    const res = await apiRequest("", {
      signal: abortCtrl.signal,
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.jobs)
      ? data.jobs
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
      ? data.data
      : [];

    jobs.value = list;

    requestAnimationFrame(() => {
      gsap.set(".membersPage .js-reveal", { opacity: 0, y: 10 });
      gsap.to(".membersPage .js-reveal", {
        opacity: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.04,
        ease: "power3.out",
      });
    });
  } catch (err) {
    if (err?.name === "AbortError") return;
    console.error(err);
    error.value = "Failed to load jobs";
    showToast("error", "Load failed");
  } finally {
    loading.value = false;
  }
}

/* =========================
   GSAP hovers / reveal
   ========================= */
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
function rowHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.18, ease: "power2.out" });
}
function pillHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -1 : 0, duration: 0.16, ease: "power2.out" });
}

function onKey(e) {
  if (e.key !== "Escape") return;

  if (confirmOpen.value) closeConfirm();
  else if (selected.value) closeOverlay();
}

onMounted(() => {
  window.addEventListener("keydown", onKey);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  gsap.set(".js-reveal", { opacity: 0, y: 10 });

  tl.from(sidebarEl.value, { x: -24, opacity: 0, duration: 0.55 }, 0)
    .from(topbarEl.value, { y: -10, opacity: 0, duration: 0.45 }, 0.08)
    .to(".js-reveal", { opacity: 1, y: 0, stagger: 0.06, duration: 0.42 }, 0.14);

  fetchJobs();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  if (abortCtrl) abortCtrl.abort();
  if (toastTimer) clearTimeout(toastTimer);
});
</script>

<style scoped>
/* =========================
   DARK BLUE TECH THEME (same as your page)
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
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: rgba(255, 255, 255, 0.78);
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
}
.tr:hover {
  background: rgba(255, 255, 255, 0.03);
}
.td {
  color: rgba(255, 255, 255, 0.86);
  font-weight: 800;
}
.tdLast {
  width: 420px;
}
.empty {
  padding: 18px;
  text-align: center;
  color: var(--muted);
  font-weight: 900;
}

/* Action buttons */
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
}
.pillBtn:hover {
  border-color: rgba(56, 189, 248, 0.18);
  color: rgba(255, 255, 255, 0.92);
}
.pillBtn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.pillBtn.on {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.1));
  border-color: rgba(56, 189, 248, 0.22);
  color: rgba(255, 255, 255, 0.95);
}
.pillBtn.danger {
  border-color: rgba(239, 68, 68, 0.26);
}
.pillBtn.danger:hover {
  border-color: rgba(239, 68, 68, 0.45);
}
.toggleBtn i {
  font-size: 16px;
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

/* list box */
.listBox {
  display: grid;
  gap: 10px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.18));
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.06);
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

/* ✅ Confirm Delete / Edit Modal (newview style) */
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
}
.confirmCard::before {
  content: "";
  position: absolute;
  inset: -2px;
  opacity: 0.18;
  filter: blur(16px);
  pointer-events: none;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.35), rgba(99, 102, 241, 0.22), rgba(56, 189, 248, 0.18), rgba(56, 189, 248, 0.35));
}
.confirmCard.danger::before {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.35), rgba(99, 102, 241, 0.22), rgba(56, 189, 248, 0.18), rgba(239, 68, 68, 0.35));
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
  inset: 0;
  z-index: 1;
  animation: pulse 1.9s ease-in-out infinite;
  border: 1px solid rgba(56, 189, 248, 0.2);
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

/* ✅ Toast (newview style) */
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
  .tdLast {
    width: 360px;
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
}
</style>
