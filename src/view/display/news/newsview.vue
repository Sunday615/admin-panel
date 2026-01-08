<template>
  <div class="app tech">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <!-- Sidebar LEFT -->
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
        <RouterLink v-for="item in navItems" :key="item.key" :to="item.to" class="navItem" active-class="active"
          @mouseenter="navHover($event, true)" @mouseleave="navHover($event, false)">
          <span class="navIcon"><i :class="item.fa"></i></span>
          <span class="navLabel">{{ item.label }}</span>
          <span class="navPill" />
        </RouterLink>
      </nav>

      <div class="spacer" />

      <button class="logout js-reveal" type="button" @click="logout" @mouseenter="btnHover($event, true)"
        @mouseleave="btnHover($event, false)">
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

        <div class="searchWrap">
          <span class="searchIcon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input v-model="q" class="search" placeholder="Search news..." />
        </div>

        <div class="topActions">
          <button class="iconBtn" type="button" aria-label="Refresh" title="Refresh" @click="fetchNews"
            @mouseenter="iconHover($event, true)" @mouseleave="iconHover($event, false)">
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
          <div class="pageTop js-reveal">
            <div class="titleBlock">
              <div class="pageTitle">News & Activities</div>
              <div class="pageSub">
                Showing data from
                <span class="mono">{{ NEWS_API }}</span>
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

          <div class="metaRow js-reveal">
            <div class="metaPill">
              <i class="fa-solid fa-database"></i>
              <span>ຂ່າວສານທັງໝົດ:</span>
              <b>{{ news.length }}</b>
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
              <span>ຄົ້ນຫາພົບ:</span>
              <b>{{ rows.length }}</b>
            </div>

            <div class="metaPill" v-if="!loading && !error && rows.length">
              <i class="fa-solid fa-book-open"></i>
              <span>ໜ້າ:</span>
              <b>{{ page }}/{{ totalPages }}</b>
            </div>

            <router-link to="/newinsert">
              <div class="metaPill" id="add_news">
                <i class="fa-solid fa-plus"></i>
                <span>ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ</span>
              </div>
            </router-link>
          </div>

          <!-- Table -->
          <div class="tableWrap js-reveal">
            <table class="table">
              <thead>
                <tr>
                  <th v-for="col in tableCols" :key="col" class="th" :class="{ colWide: isTitleCol(col) }" role="button"
                    tabindex="0" @click="toggleSort(col)" @keydown.enter.prevent="toggleSort(col)"
                    @keydown.space.prevent="toggleSort(col)">
                    <span class="thLabel">{{ colLabel(col) }}</span>
                    <span class="sortIcon" v-if="sortKey === col">
                      <i :class="sortDir === 'asc' ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down'"></i>
                    </span>
                  </th>

                  <th class="th thLast">Actions</th>
                </tr>
              </thead>

              <tbody ref="tbodyEl">
                <tr v-for="(n, idx) in pagedRows" :key="rowKey(n, idx)" class="tr js-reveal rowAnim"
                  @click="openOverlay(n)" @mouseenter="rowHover($event, true)" @mouseleave="rowHover($event, false)">
                  <td v-for="col in tableCols" :key="col" class="td" :class="{ colWide: isTitleCol(col) }">
                    <!-- NO -->
                    <template v-if="isNoCol(col)">
                      {{ rowOffset + idx + 1 }}
                    </template>

                    <!-- Title -->
                    <template v-else-if="isTitleCol(col)">
                      <div class="titleCell">
                        <!-- รูปอยู่ซ้าย -->
                        <img v-if="heroUrlOf(n)" class="thumbMini" :src="heroUrlOf(n)" alt="Hero"
                          @click.stop="openOverlay(n)" />

                        <!-- header_news อยู่ขวา -->
                        <div class="titleText">
                          <div class="tMain">{{ formatCell(n?.[col], col) }}</div>
                        </div>
                      </div>
                    </template>


                    <!-- Date dd/mm/yy -->
                    <template v-else-if="isDateTimeCol(col)">
                      {{ formatDDMMYY(n?.[col]) }}
                    </template>

                    <!-- Default -->
                    <template v-else>
                      {{ formatCell(n?.[col], col) }}
                    </template>
                  </td>

                  <!-- Actions -->
                  <td class="td tdLast">
                    <div class="actionRow">
                      <button class="pillBtn" type="button" title="View" @click.stop="openOverlay(n)"
                        :disabled="isBusy(n)" @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)">
                        <i class="fa-regular fa-eye"></i>
                        View
                      </button>

                      <button class="pillBtn" type="button" title="Edit" @click.stop="askEdit(n)" :disabled="isBusy(n)"
                        @mouseenter="pillHover($event, true)" @mouseleave="pillHover($event, false)">
                        <i class="fa-regular fa-pen-to-square"></i>
                        Edit
                      </button>

                      <button class="pillBtn danger" type="button" title="Delete" @click.stop="askDelete(n)"
                        :disabled="isBusy(n)" @mouseenter="pillHover($event, true)"
                        @mouseleave="pillHover($event, false)">
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

          <!-- Pagination -->
          <div ref="pagerEl" class="pager js-reveal" v-if="!loading && !error && rows.length > PAGE_SIZE">
            <div class="pagerInfo">
              Showing <b>{{ showingStart }}</b>–<b>{{ showingEnd }}</b> of <b>{{ rows.length }}</b>
            </div>

            <div class="pagerBtns">
              <button class="pBtn" type="button" :disabled="page <= 1" @click="goPage(page - 1, $event)">
                <i class="fa-solid fa-angle-left"></i>
                Prev
              </button>

              <button v-if="pageRange.start > 1" class="pBtn" type="button" @click="goPage(1, $event)">1</button>
              <span v-if="pageRange.start > 2" class="pDots">…</span>

              <button v-for="p in pageRange.pages" :key="'p' + p" class="pBtn" :class="{ active: p === page }"
                type="button" @click="goPage(p, $event)">
                {{ p }}
              </button>

              <span v-if="pageRange.end < totalPages - 1" class="pDots">…</span>
              <button v-if="pageRange.end < totalPages" class="pBtn" type="button" @click="goPage(totalPages, $event)">
                {{ totalPages }}
              </button>

              <button class="pBtn" type="button" :disabled="page >= totalPages" @click="goPage(page + 1, $event)">
                Next
                <i class="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>

          <!-- Overlay -->
          <Teleport to="body">
            <div v-if="selected" ref="overlayEl" class="overlay" @click.self="closeOverlay">
              <div ref="modalEl" class="modal" @click.stop>
                <div class="modalTop">
                  <div class="modalTitle">
                    <i class="fa-solid fa-newspaper"></i>
                    {{ titleOf(selected) }}
                  </div>

                  <button class="iconBtn" type="button" aria-label="Close" @click="closeOverlay"
                    @mouseenter="iconHover($event, true)" @mouseleave="iconHover($event, false)">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div class="modalBody">
                  <!-- MEDIA -->
                  <div v-if="heroUrlOf(selected) || galleryUrlsOf(selected).length" class="mediaBlock">
                    <div class="mediaTop">
                      <div class="mediaTitle">
                        <i class="fa-regular fa-image"></i>
                        Images
                      </div>
                      <div class="mediaHint">Click image to zoom</div>
                    </div>

                    <div class="mediaGrid">
                      <button v-if="heroUrlOf(selected)" class="mediaItem hero" type="button"
                        @click.stop="openImage(heroUrlOf(selected))" title="Click to view">
                        <img :src="heroUrlOf(selected)" alt="Hero" />
                        <span class="mediaTag">Hero</span>
                      </button>

                      <button v-for="(src, i) in galleryUrlsOf(selected)" :key="src + i" class="mediaItem" type="button"
                        @click.stop="openImage(src)" title="Click to view">
                        <img :src="src" :alt="`Gallery ${i + 1}`" />
                        <span class="mediaTag">#{{ i + 1 }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- TAGS (still shown in overlay, not in table column) -->
                  <div v-if="tagsOf(selected).length" class="tagBlock">
                    <div class="tagTitle"><i class="fa-solid fa-tags"></i> Tags</div>

                    <div class="tagChips">
                      <button v-for="t in tagsOf(selected)" :key="t" class="tagBtn" type="button" @click.stop>
                        <span class="tagDot"></span>
                        <span class="tagText">{{ t }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- KEY/VALUE -->
                  <div class="kvGrid">
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

          <!-- Image Viewer -->
          <Teleport to="body">
            <div v-if="imgViewer.open" class="imgOverlay" @click.self="closeImage">
              <div class="imgModal" @click.stop>
                <button class="imgClose" type="button" aria-label="Close" @click="closeImage">
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <img class="imgFull" :src="imgViewer.src" alt="Full" />
              </div>
            </div>
          </Teleport>

          <!-- Confirm Edit Modal -->
          <Teleport to="body">
            <div v-if="editOpen" class="confirmOverlay" @click.self="closeEdit">
              <div ref="editEl" class="confirmCard edit">
                <div class="confirmIcon">
                  <div class="skull">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </div>
                  <span class="ring ringA"></span>
                  <span class="ring ringB"></span>
                </div>

                <div class="confirmTitle">Edit News?</div>
                <div class="confirmText">
                  You are about to edit:
                  <b class="confirmName">{{ editName }}</b>
                  <div class="confirmHint">Continue to edit page?</div>
                </div>

                <div class="confirmActions">
                  <button class="cBtn ghost" type="button" @click="closeEdit">Cancel</button>
                  <button class="cBtn primary" type="button" @click="confirmEdit">Yes, Edit</button>
                </div>
              </div>
            </div>
          </Teleport>

          <!-- Cool Confirm Delete Modal -->
          <Teleport to="body">
            <div v-if="confirmOpen" class="confirmOverlay" @click.self="closeConfirm">
              <div ref="confirmEl" class="confirmCard">
                <div class="confirmIcon">
                  <div class="skull">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <span class="ring ringA"></span>
                  <span class="ring ringB"></span>
                </div>

                <div class="confirmTitle">Delete News?</div>
                <div class="confirmText">
                  You are about to delete:
                  <b class="confirmName">{{ confirmName }}</b>
                  <div class="confirmHint">This action cannot be undone.</div>
                </div>

                <div class="confirmActions">
                  <button class="cBtn ghost" type="button" @click="closeConfirm" :disabled="confirmLoading">
                    Cancel
                  </button>

                  <button class="cBtn danger" type="button" @click="confirmDelete" :disabled="confirmLoading">
                    <span v-if="confirmLoading" class="miniSpin"></span>
                    <span>{{ confirmLoading ? "Deleting..." : "Yes, Delete" }}</span>
                  </button>
                </div>
              </div>
            </div>
          </Teleport>

          <!-- Toast -->
          <Teleport to="body">
            <div v-if="toast.open" class="toast" :class="toast.type">
              <i v-if="toast.type === 'success'" class="fa-solid fa-circle-check"></i>
              <i v-else class="fa-solid fa-circle-xmark"></i>
              <div class="toastText">{{ toast.text }}</div>
            </div>
          </Teleport>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();

const sidebarEl = ref(null);
const topbarEl = ref(null);

const tbodyEl = ref(null);
const pagerEl = ref(null);

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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const NEWS_API = `${API_BASE}/api/news`;

const news = ref([]);
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

const imgViewer = reactive({ open: false, src: "" });

let abortCtrl = null;

/* =========================
   Pagination (7 per page)
   ========================= */
const PAGE_SIZE = 7;
const page = ref(1);

const rowOffset = computed(() => (page.value - 1) * PAGE_SIZE);

function clamp(n, a, b) {
  return Math.min(Math.max(n, a), b);
}

function tap(el) {
  if (!el) return;
  gsap.fromTo(el, { scale: 0.98 }, { scale: 1, duration: 0.18, ease: "power2.out" });
}

function goPage(p, ev) {
  tap(ev?.currentTarget);
  const tp = totalPages.value;
  page.value = clamp(Number(p) || 1, 1, tp);
}

async function animateRows(direction = 1) {
  await nextTick();
  const root = tbodyEl.value;
  if (!root) return;

  const els = Array.from(root.querySelectorAll("tr.rowAnim"));
  if (!els.length) return;

  gsap.killTweensOf(els);
  gsap.fromTo(
    els,
    { opacity: 0, y: 10, x: direction * 10, filter: "blur(2px)" },
    { opacity: 1, y: 0, x: 0, filter: "blur(0px)", duration: 0.28, stagger: 0.035, ease: "power2.out" }
  );
}

async function animatePagerIn() {
  await nextTick();
  if (!pagerEl.value) return;
  gsap.killTweensOf(pagerEl.value);
  gsap.fromTo(pagerEl.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" });
}

/* =========================
   Busy state per row
   ========================= */
const busyById = ref({});
function setBusy(id, v) {
  busyById.value = { ...busyById.value, [String(id)]: v };
}
function isBusy(n) {
  const id = rowKey(n, "");
  return !!busyById.value[String(id)];
}

/* =========================
   Confirm Delete state
   ========================= */
const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmTarget = ref(null);
const confirmEl = ref(null);

const confirmName = computed(() => titleOf(confirmTarget.value));

/* =========================
   Confirm Edit state
   ========================= */
const editOpen = ref(false);
const editTarget = ref(null);
const editEl = ref(null);

const editName = computed(() => titleOf(editTarget.value));

/* Toast */
const toast = ref({ open: false, type: "success", text: "" });
let toastTimer = null;

function showToast(type, text) {
  toast.value = { open: true, type, text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value.open = false;
  }, 2200);
}

function logout() {
  console.log("logout");
}

/* =========================
   Helpers (date / tags / media)
   ========================= */
function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function resolveMediaUrl(src) {
  if (!src) return "";
  const s = String(src).trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  if (s.startsWith("/")) return `${API_BASE}${s}`;
  return `${API_BASE}/${s}`;
}

function formatDDMMYY(input) {
  const s = String(input ?? "").trim();
  if (!s || s === "-") return "-";

  // YYYY-MM-DD or YYYY-MM-DD HH:mm:ss or ISO
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
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

/* images */
function heroUrlOf(n) {
  const raw =
    n?.hero_img ??
    n?.heroImage ??
    n?.heroimage ??
    n?.main_img ??
    n?.mainImage ??
    n?.image ??
    n?.img ??
    n?.photo ??
    n?.cover ??
    n?.thumbnail ??
    n?.thumb;
  return resolveMediaUrl(raw);
}

function galleryUrlsOf(n) {
  const raw =
    n?.gallery ??
    n?.gallery_images ??
    n?.galleryImages ??
    n?.gallery_files ??
    n?.galleryFiles ??
    n?.gallery_path ??
    n?.galleryPath ??
    n?.gallery_paths ??
    n?.galleryPaths;

  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(resolveMediaUrl).filter(Boolean);

  if (typeof raw === "string") {
    const s = raw.trim();
    const maybe = safeJsonParse(s);
    if (Array.isArray(maybe)) return maybe.map(resolveMediaUrl).filter(Boolean);
    if (s.includes(",")) return s.split(",").map((x) => resolveMediaUrl(x)).filter(Boolean);
    const one = resolveMediaUrl(s);
    return one ? [one] : [];
  }

  if (typeof raw === "object") {
    const vals = Object.values(raw).flat();
    return vals.map(resolveMediaUrl).filter(Boolean);
  }

  return [];
}

function tagsOf(n) {
  const raw = n?.tags ?? n?.tag ?? n?.keywords;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((x) => String(x).trim()).filter(Boolean);

  if (typeof raw === "string") {
    const s = raw.trim();
    const maybe = safeJsonParse(s);
    if (Array.isArray(maybe)) return maybe.map((x) => String(x).trim()).filter(Boolean);
    if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
    return [s];
  }

  return [];
}

/* =========================
   Key filters
   ========================= */
function isSubHeaderKey(k) {
  const s = String(k || "").toLowerCase();
  return s === "sub_header" || s === "subheader" || s === "sub-header";
}

function isCreatedAtKey(k) {
  const s = String(k || "").toLowerCase();
  return s === "createdat" || s === "created_at" || s === "create_at" || s === "created";
}
function isUpdatedAtKey(k) {
  const s = String(k || "").toLowerCase();
  return s === "updatedat" || s === "updated_at" || s === "update_at" || s === "updated";
}

function isIdKey(k) {
  const s = String(k || "").toLowerCase();
  return s === "idnews" || s === "news_id" || s === "newsid" || s === "id" || s === "_id" || s === "uuid";
}

function isTagKey(k) {
  const s = String(k || "").toLowerCase();
  return s === "tags" || s === "tag" || s === "keywords";
}

function isImageKey(k) {
  const s = String(k || "").toLowerCase();
  return (
    s === "image" ||
    s === "img" ||
    s.includes("image") ||
    s.includes("img") ||
    s.includes("hero") ||
    s.includes("cover") ||
    s.includes("thumb") ||
    s.includes("thumbnail") ||
    s.includes("photo") ||
    s.includes("icon") ||
    s.includes("logo")
  );
}
function isGalleryKey(k) {
  return String(k || "").toLowerCase().includes("gallery");
}

function isDateTimeCol(k) {
  const s = String(k || "").toLowerCase();
  return s === "date_time" || s === "date-time" || s === "datetime" || s === "datetime";
}

function dateValueOf(n) {
  return n?.date_time ?? n?.dateTime ?? n?.datetime ?? n?.timestamp ?? "-";
}

function rowKey(n, i) {
  return n?.idnews ?? n?.news_id ?? n?.newsId ?? n?.id ?? n?._id ?? n?.uuid ?? `${i}`;
}

function titleOf(n) {
  return n?.header_news ?? n?.title ?? n?.headline ?? n?.name ?? n?.idnews ?? n?.id ?? n?._id ?? "News";
}

function isTitleCol(k) {
  const s = String(k || "").toLowerCase();
  return s === "header_news" || s === "title" || s === "headline";
}

function isNoCol(k) {
  return String(k || "").toLowerCase() === "idnews";
}

function colLabel(k) {
  if (isNoCol(k)) return "NO";
  if (isDateTimeCol(k)) return "Date";
  return k;
}

/* =========================
   Formatting
   ========================= */
function formatCell(v, col) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);

  if (typeof v === "string") {
    if (isTitleCol(col)) return v; // show full title
    if (isDateTimeCol(col)) return formatDDMMYY(v);
    const s = v.trim();
    return s.length > 46 ? s.slice(0, 46) + "…" : s;
  }

  if (Array.isArray(v)) return v.length ? `(${v.length}) items` : "-";
  if (typeof v === "object") return "Object";
  return String(v);
}

/* =========================
   Overlay flatten (hide ids + tags + created/updated + images)
   ========================= */
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
    const lk = String(path || "").toLowerCase();
    if (lk.endsWith("date_time") || lk.endsWith("datetime")) {
      out.push({ k: path || "date_time", v: formatDDMMYY(val) });
      return;
    }
    out.push({ k: path || "value", v: String(val) });
    return;
  }

  if (Array.isArray(val)) {
    out.push({ k: path || "value", v: toText(val) });
    return;
  }

  if (t === "object") {
    const entries = Object.entries(val);
    if (!entries.length) {
      out.push({ k: path || "value", v: "-" });
      return;
    }

    for (const [k, v] of entries) {
      const lk = String(k || "").toLowerCase();
      if (lk === "password" || lk === "pwd") continue;
      if (isIdKey(k)) continue;
      if (isTagKey(k)) continue; // keep tags only in tagBlock
      if (isCreatedAtKey(k) || isUpdatedAtKey(k)) continue;
      if (isGalleryKey(k)) continue;
      if (isImageKey(k)) continue;

      const p = path ? `${path}.${k}` : k;
      if (p.toLowerCase().includes(".gallery")) continue;

      if (v && typeof v === "object") flattenAny(v, p, out);
      else {
        if (String(k).toLowerCase() === "date_time") out.push({ k: p, v: formatDDMMYY(v) });
        else out.push({ k: p, v: toText(v) });
      }
    }
    return;
  }

  out.push({ k: path || "value", v: String(val) });
}

const flatEntries = computed(() => {
  if (!selected.value) return [];
  const out = [];
  flattenAny(selected.value, "", out);

  const pri = ["header_news", "title", "category", "date_time", "description_news", "content"];
  out.sort((a, b) => {
    const ia = pri.findIndex((x) => a.k.toLowerCase().endsWith(x));
    const ib = pri.findIndex((x) => b.k.toLowerCase().endsWith(x));
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    return ra - rb;
  });

  return out;
});

/* =========================
   Columns (Tags column removed)
   - ✅ remove created_at / updated_at
   - ✅ do NOT include tags column in table
   ========================= */
function pickFirstExisting(keysSet, candidates) {
  for (const c of candidates) if (keysSet.has(c)) return c;
  return null;
}

const tableCols = computed(() => {
  if (!news.value.length) return ["idnews", "header_news", "category", "date_time"];

  const keysSet = new Set();
  news.value.slice(0, 40).forEach((n) => Object.keys(n || {}).forEach((k) => keysSet.add(k)));

  const cleaned = new Set(
    Array.from(keysSet).filter(
      (k) =>
        !isImageKey(k) &&
        !isGalleryKey(k) &&
        !isSubHeaderKey(k) &&
        !isCreatedAtKey(k) &&
        !isUpdatedAtKey(k)
    )
  );

  const noKey = cleaned.has("idnews")
    ? "idnews"
    : pickFirstExisting(cleaned, ["news_id", "newsId", "id", "_id"]) || "idnews";

  const titleKey = pickFirstExisting(cleaned, ["header_news", "title", "headline"]) || "header_news";
  const catKey = pickFirstExisting(cleaned, ["category", "type", "group"]);
  const dateKey = pickFirstExisting(cleaned, ["date_time", "dateTime", "datetime", "timestamp"]) || "date_time";

  return [noKey, titleKey, catKey, dateKey].filter(Boolean);
});

/* filter dropdown: can still include tags for filtering (no table column) */
const filterKeys = computed(() => {
  if (!news.value.length) return [];
  const set = new Set();

  news.value.slice(0, 60).forEach((n) => {
    Object.entries(n || {}).forEach(([k, v]) => {
      const lk = String(k || "").toLowerCase();
      if (lk === "password" || lk === "pwd") return;
      if (isImageKey(k) || isGalleryKey(k) || isSubHeaderKey(k)) return;
      if (isCreatedAtKey(k) || isUpdatedAtKey(k)) return;

      // allow tags in filter
      if (isTagKey(k)) {
        set.add(k);
        return;
      }

      if (typeof v === "object" && v !== null) return;
      set.add(k);
    });
  });

  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

/* =========================
   Filter + sort
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
  let arr = news.value;

  const s = q.value.trim().toLowerCase();
  if (s) arr = arr.filter((n) => JSON.stringify(n).toLowerCase().includes(s));

  const fk = filterKey.value;
  const fv = filterValue.value.trim().toLowerCase();
  if (fk && fv) arr = arr.filter((n) => normalize(n?.[fk]).includes(fv));

  if (sortKey.value) {
    const key = sortKey.value;
    arr = [...arr].sort((x, y) => compare(x?.[key], y?.[key]));
    if (sortDir.value === "desc") arr.reverse();
  }

  return arr;
});

const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / PAGE_SIZE)));

const pagedRows = computed(() => {
  const start = rowOffset.value;
  return rows.value.slice(start, start + PAGE_SIZE);
});

const showingStart = computed(() => (rows.value.length ? rowOffset.value + 1 : 0));
const showingEnd = computed(() => Math.min(rowOffset.value + PAGE_SIZE, rows.value.length));

const pageRange = computed(() => {
  const tp = totalPages.value;
  const cur = clamp(page.value, 1, tp);

  let start = Math.max(1, cur - 2);
  let end = Math.min(tp, start + 4);
  start = Math.max(1, end - 4);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return { start, end, pages };
});

watch([q, filterKey, filterValue, sortKey, sortDir], () => {
  page.value = 1;
});

watch(
  rows,
  async () => {
    const tp = totalPages.value;
    if (page.value > tp) page.value = tp;
    if (page.value < 1) page.value = 1;

    await animateRows(1);
    if (tp > 1) await animatePagerIn();
  },
  { immediate: true }
);

watch(page, async (p, old) => {
  const dir = p >= (old ?? 1) ? 1 : -1;
  await animateRows(dir);
  if (totalPages.value > 1) await animatePagerIn();
});

function toggleSort(col) {
  // prevent sorting by NO (running number)
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
  sortKey.value = "";
  sortDir.value = "asc";
  page.value = 1;
}

/* =========================
   Actions
   ========================= */
function editNews(n) {
  const id = rowKey(n, "");
  router.push({ path: "/newsedit", query: { id: String(id ?? "") } });
}

async function askEdit(n) {
  editTarget.value = n;
  editOpen.value = true;

  await nextTick();
  if (editEl.value) {
    gsap.fromTo(
      editEl.value,
      { opacity: 0, y: 16, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power3.out" }
    );
  }
}
function closeEdit() {
  editOpen.value = false;
  editTarget.value = null;
}
function confirmEdit() {
  const n = editTarget.value;
  if (!n) return;
  closeEdit();
  editNews(n);
}

async function askDelete(n) {
  confirmTarget.value = n;
  confirmOpen.value = true;

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
  confirmTarget.value = null;
  confirmLoading.value = false;
}

async function confirmDelete() {
  const n = confirmTarget.value;
  const id = rowKey(n, "");
  if (!id) return;

  const before = [...news.value];
  news.value = news.value.filter((x) => String(rowKey(x, "")) !== String(id));

  try {
    confirmLoading.value = true;
    setBusy(String(id), true);
    error.value = "";

    const res = await fetch(`${NEWS_API}/${encodeURIComponent(String(id))}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    if (selected.value && String(rowKey(selected.value, "")) === String(id)) selected.value = null;

    closeConfirm();
    showToast("success", "Deleted successfully");
  } catch (e) {
    console.error(e);
    news.value = before;
    closeConfirm();
    showToast("error", "Delete failed (backend must have DELETE /api/news/:id)");
  } finally {
    confirmLoading.value = false;
    setBusy(String(id), false);
  }
}

/* Overlay */
async function openOverlay(n) {
  selected.value = n;
  await nextTick();

  gsap.fromTo(overlayEl.value, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "power2.out" });
  gsap.fromTo(modalEl.value, { opacity: 0, y: 12, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" });
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

/* Image viewer */
function openImage(src) {
  if (!src) return;
  imgViewer.src = src;
  imgViewer.open = true;
}
function closeImage() {
  imgViewer.open = false;
  imgViewer.src = "";
}

/* Fetch */
async function fetchNews() {
  try {
    error.value = "";
    loading.value = true;

    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();

    const res = await fetch(NEWS_API, {
      signal: abortCtrl.signal,
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const list = Array.isArray(data) ? data : Array.isArray(data?.news) ? data.news : Array.isArray(data?.data) ? data.data : [];

    news.value = list;
    page.value = 1;

    requestAnimationFrame(() => {
      gsap.set(".membersPage .js-reveal", { opacity: 0, y: 10 });
      gsap.to(".membersPage .js-reveal", { opacity: 1, y: 0, duration: 0.42, stagger: 0.04, ease: "power3.out" });
    });

    await animateRows(1);
  } catch (err) {
    if (err?.name === "AbortError") return;
    console.error(err);
    error.value = "Failed to load news";
  } finally {
    loading.value = false;
  }
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
function rowHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.18, ease: "power2.out" });
}
function pillHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -1 : 0, duration: 0.16, ease: "power2.out" });
}

function onKey(e) {
  if (e.key === "Escape") {
    if (editOpen.value) closeEdit();
    else if (confirmOpen.value) closeConfirm();
    else if (imgViewer.open) closeImage();
    else if (selected.value) closeOverlay();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKey);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  gsap.set(".js-reveal", { opacity: 0, y: 10 });

  tl.from(sidebarEl.value, { x: -24, opacity: 0, duration: 0.55 }, 0)
    .from(topbarEl.value, { y: -10, opacity: 0, duration: 0.45 }, 0.08)
    .to(".js-reveal", { opacity: 1, y: 0, stagger: 0.06, duration: 0.42 }, 0.14);

  fetchNews();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  if (abortCtrl) abortCtrl.abort();
  if (toastTimer) clearTimeout(toastTimer);
});
</script>


<style scoped>
/* ======= SMALL UPDATES: reduce header column size + actions column ======= */
#add_news {
  background-color: #28a475;
}

#add_news:hover {
  background-color: #1e6f56;
  transition: background-color 0.3s ease;
}

.th,
.td {
  padding: 10px 10px;
  font-size: 12px;
}

.thLabel {
  font-size: 12px;
  letter-spacing: 0.2px;
}

.sortIcon i {
  font-size: 12px;
}

/* Make title column wider */
.colWide {
  width: 46%;
  max-width: 760px;
}

/* Tags column width */
.colTags {
  width: 260px;
  max-width: 320px;
}

/* ✅ show full header_news with wrapping (no cut) */
.tMain {
  white-space: normal;
  overflow: visible;
  text-overflow: initial;
  word-break: break-word;
  line-height: 1.5;
}

/* ✅ Title meta row */
.titleMetaRow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.miniDate {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 950;
  color: rgba(255, 255, 255, 0.66);
  font-size: 12px;
}

.miniDate i {
  color: rgba(56, 189, 248, 0.8);
}

.miniTags {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tagMore {
  font-size: 12px;
  font-weight: 950;
  color: rgba(255, 255, 255, 0.62);
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
}

/* ✅ Tags cell (table) */
.tagsCell {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tagPill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  background: rgba(56, 189, 248, 0.1);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 950;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.mutedDash {
  color: rgba(255, 255, 255, 0.55);
  font-weight: 950;
}

/* ✅ Actions column width */
.thLast {
  cursor: default;
}

.tdLast {
  width: 320px;
}

/* ✅ Actions buttons */
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

/* ✅ Pagination bar */
.pager {
  margin-top: 12px;
  padding: 12px 12px;
  border-radius: 18px;
  background: var(--panel2);
  border: 1px solid var(--stroke);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.pagerInfo {
  color: rgba(255, 255, 255, 0.72);
  font-weight: 900;
  font-size: 12px;
}

.pagerInfo b {
  color: rgba(255, 255, 255, 0.92);
}

.pagerBtns {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.pBtn {
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.82);
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  will-change: transform;
}

.pBtn:hover {
  border-color: rgba(56, 189, 248, 0.18);
  color: rgba(255, 255, 255, 0.95);
}

.pBtn.active {
  border-color: rgba(56, 189, 248, 0.28);
  background: rgba(56, 189, 248, 0.12);
  color: rgba(255, 255, 255, 0.95);
  animation: pageActive 0.24s ease-out;
}

@keyframes pageActive {
  from {
    transform: scale(0.97);
  }

  to {
    transform: scale(1);
  }
}

.pBtn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pDots {
  color: rgba(255, 255, 255, 0.55);
  font-weight: 950;
  padding: 0 4px;
}

/* ======= Modern ambient animations ======= */
@keyframes floatGlowA {

  0%,
  100% {
    transform: translate(0px, 0px) scale(1);
  }

  50% {
    transform: translate(28px, -18px) scale(1.06);
  }
}

@keyframes floatGlowB {

  0%,
  100% {
    transform: translate(0px, 0px) scale(1);
  }

  50% {
    transform: translate(-22px, 16px) scale(1.05);
  }
}

@keyframes sheen {
  0% {
    transform: translateX(-70%);
    opacity: 0;
  }

  25% {
    opacity: 0.55;
  }

  55% {
    transform: translateX(70%);
    opacity: 0;
  }

  100% {
    transform: translateX(70%);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {

  .glow-a,
  .glow-b {
    animation: none !important;
  }

  .tableWrap::before {
    animation: none !important;
  }

  .pBtn.active {
    animation: none !important;
  }
}

/* ======= keep your existing styles (rest unchanged) ======= */
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
  animation: floatGlowA 10s ease-in-out infinite;
}

.glow-b {
  width: 560px;
  height: 560px;
  right: -200px;
  top: -160px;
  background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.34), transparent 62%);
  animation: floatGlowB 12s ease-in-out infinite;
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
  background: linear-gradient(90deg,
      rgba(56, 189, 248, 0.45),
      rgba(99, 102, 241, 0.25),
      rgba(14, 165, 233, 0.22),
      rgba(56, 189, 248, 0.45));
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

/* main */
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

/* page */
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
  will-change: transform;
}

/* meta */
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

/* table */
.tableWrap {
  border-radius: 18px;
  overflow: hidden;
  background: var(--panel2);
  border: 1px solid var(--stroke);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
  position: relative;
}

.tableWrap::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.07) 45%, transparent 70%);
  transform: translateX(-70%);
  animation: sheen 7.5s ease-in-out infinite;
  opacity: 0.18;
  mix-blend-mode: screen;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.th {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 950;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.06));
  user-select: none;
  cursor: pointer;
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

.empty {
  padding: 18px;
  text-align: center;
  color: var(--muted);
  font-weight: 900;
}

.titleCell {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
}

.titleText {
  flex: 1;
  min-width: 0;
}

/* ให้ข้อความห่อบรรทัดได้สวย */
.tMain {
  white-space: normal;
  overflow: visible;
  text-overflow: initial;
  word-break: break-word;
  line-height: 1.5;
}

.thumbMini {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  flex: 0 0 auto;
}
@media (max-width: 520px) {
  .titleCell {
    flex-direction: column;
  }
}

/* Overlay + image viewer styles (unchanged from your file) */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 9, 20, 0.7);
  backdrop-filter: blur(10px);
  padding: clamp(16px, 3vw, 36px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  width: min(980px, 96vw);
  max-height: 92vh;
  overflow: hidden;
  border-radius: 22px;
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
  padding: 18px 18px;
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
  padding: 18px 18px 26px;
  overflow: auto;
  max-height: calc(92vh - 76px);
  position: relative;
  z-index: 1;
  scrollbar-gutter: stable;
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

/* media/tags */
.mediaBlock,
.tagBlock {
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.mediaTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.mediaTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
}

.mediaHint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  font-weight: 850;
}

.mediaGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.mediaItem {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  aspect-ratio: 1 / 1;
  cursor: pointer;
  padding: 0;
}

.mediaItem.hero {
  grid-column: span 2;
  aspect-ratio: 2 / 1;
}

.mediaItem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mediaTag {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 950;
  font-size: 12px;
}

.tagTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
  margin-bottom: 10px;
}

.tagChips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tagBtn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  font-weight: 950;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.tagBtn::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.12), rgba(56, 189, 248, 0.22));
  opacity: 0.16;
  filter: blur(14px);
  pointer-events: none;
}

.tagBtn:hover {
  transform: translateY(-1px);
  border-color: rgba(56, 189, 248, 0.26);
  background: rgba(255, 255, 255, 0.04);
}

.tagBtn:active {
  transform: translateY(0px);
}

.tagDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.14);
  flex: 0 0 auto;
  position: relative;
  z-index: 1;
}

.tagText {
  position: relative;
  z-index: 1;
  line-height: 1.2;
}

/* image viewer */
.imgOverlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(5, 9, 20, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(14px, 3vw, 34px);
}

.imgModal {
  width: min(1100px, 98vw);
  max-height: 92vh;
  border-radius: 22px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.22);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.55);
}

.imgClose {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 1;
}

.imgFull {
  width: 100%;
  height: 92vh;
  object-fit: contain;
  display: block;
}

/* confirm + toast (unchanged from your file) */
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
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.35), rgba(99, 102, 241, 0.22), rgba(56, 189, 248, 0.18), rgba(239, 68, 68, 0.35));
  opacity: 0.18;
  filter: blur(16px);
  pointer-events: none;
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
  background: rgba(239, 68, 68, 0.16);
  border: 1px solid rgba(239, 68, 68, 0.22);
  box-shadow: 0 18px 44px rgba(239, 68, 68, 0.14);
  position: relative;
  z-index: 2;
}

.skull i {
  font-size: 22px;
  color: rgba(239, 68, 68, 0.95);
}

.ring {
  position: absolute;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  inset: 0;
  z-index: 1;
  animation: pulse 1.9s ease-in-out infinite;
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

.cBtn.danger {
  border-color: rgba(239, 68, 68, 0.28);
  background: rgba(239, 68, 68, 0.12);
}

.cBtn.danger:hover {
  border-color: rgba(239, 68, 68, 0.5);
}

.cBtn.primary {
  border-color: rgba(56, 189, 248, 0.28);
  background: rgba(56, 189, 248, 0.12);
}

.cBtn.primary:hover {
  border-color: rgba(56, 189, 248, 0.52);
}

.miniSpin {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-top-color: rgba(239, 68, 68, 0.95);
  animation: spin 0.75s linear infinite;
}

.confirmCard.edit::before {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.3), rgba(99, 102, 241, 0.18), rgba(14, 165, 233, 0.16), rgba(56, 189, 248, 0.3));
  opacity: 0.18;
}

.confirmCard.edit .skull {
  background: rgba(56, 189, 248, 0.16);
  border: 1px solid rgba(56, 189, 248, 0.22);
  box-shadow: 0 18px 44px rgba(56, 189, 248, 0.14);
}

.confirmCard.edit .skull i {
  color: rgba(56, 189, 248, 0.95);
}

.confirmCard.edit .ring {
  border: 1px solid rgba(56, 189, 248, 0.22);
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

.toastText {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

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

  .mediaGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mediaItem.hero {
    grid-column: span 2;
  }

  .colWide {
    width: auto;
    max-width: none;
  }

  .colTags {
    width: auto;
    max-width: none;
  }

  .tdLast {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .overlay {
    padding: 12px;
  }

  .modalTop {
    padding: 14px 14px;
  }

  .modalBody {
    padding: 14px 14px 20px;
    max-height: calc(92vh - 64px);
  }
}
</style>
