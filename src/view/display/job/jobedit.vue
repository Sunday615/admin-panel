<!-- JobEdit.vue (UPDATED: ✅ Fetch from /api/jobs-list + ✅ Read features.items + ✅ Preview can delete & edit inline) -->
<template>
  <div class="page tech">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <main class="layout">
      <!-- ===================== -->
      <!-- SIDEBAR -->
      <!-- ===================== -->
      <aside ref="sideEl" class="sidebar js-side">
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

        <nav class="nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.key"
            :to="item.to"
            class="navItem js-sideItem"
            active-class="active"
            @mouseenter="navHover($event, true)"
            @mouseleave="navHover($event, false)"
          >
            <span class="navIcon"><i :class="item.icon"></i></span>
            <span class="navLabel">{{ item.label }}</span>
            <span class="navPill" />
          </RouterLink>
        </nav>

        <div class="spacer"></div>

        <button
          class="logout js-sideItem"
          type="button"
          @mouseenter="btnHover($event, true)"
          @mouseleave="btnHover($event, false)"
        >
          <span class="navIcon"><i class="fa-solid fa-right-from-bracket"></i></span>
          Log Out
        </button>
      </aside>

      <!-- ===================== -->
      <!-- RIGHT CONTENT -->
      <!-- ===================== -->
      <section class="content">
        <header ref="headEl" class="head js-reveal">
          <div class="headLeft">
            <button
              class="backBtn"
              type="button"
              @click="goBack"
              @mouseenter="btnHover($event, true)"
              @mouseleave="btnHover($event, false)"
            >
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <div class="title">ແກ້ໄຂປະກາດຮັບສະມັກພະນັກງານ</div>
              <div class="sub">
                Edit Job Post
                <template v-if="jobId">
                  <span class="idPill">job_id: {{ jobId }}</span>
                </template>
              </div>
            </div>
          </div>

          <div class="headRight js-reveal">
            <span class="pill"><i class="fa-solid fa-pen-to-square"></i> Edit</span>
          </div>
        </header>

        <section ref="cardEl" class="card js-card">
          <div class="cardTop">
            <div class="cardTitle">
              <i class="fa-solid fa-user-pen"></i>
              Edit Job Post Information
            </div>
            <div class="cardHint">
              <template v-if="loading">Loading…</template>
              <template v-else-if="loadError" class="dangerText">{{ loadError }}</template>
              <template v-else>Update and Save</template>
            </div>
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <!-- Row 1 -->
            <div class="row">
              <label class="label">
                <span>ຕຳແໜ່ງທີຕ້ອງການ</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-briefcase"></i>
                  <input v-model.trim="form.position" class="inp" type="text" placeholder="e.g. Frontend Developer" />
                </div>
                <div v-if="errors.position" class="err">{{ errors.position }}</div>
              </label>

              <label class="label">
                <span>ພະແນກ</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-sitemap"></i>
                  <select v-model="form.department" class="inp select">
                    <option value="" disabled>Select department</option>
                    <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div v-if="errors.department" class="err">{{ errors.department }}</div>
              </label>
            </div>

            <!-- Row 2 -->
            <div class="row">
              <label class="label">
                <span>ລະດັບ</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-layer-group"></i>
                  <select v-model="form.level" class="inp select">
                    <option value="" disabled>Select level</option>
                    <option v-for="lv in levels" :key="lv" :value="lv">{{ lv }}</option>
                  </select>
                </div>
                <div v-if="errors.level" class="err">{{ errors.level }}</div>
              </label>

              <label class="label">
                <span>Timestamp Post</span>
                <div class="inputWrap readonly">
                  <i class="fa-regular fa-clock"></i>
                  <input class="inp" type="text" :value="form.postedAt" readonly />
                </div>
              </label>
            </div>

            <div class="divider"></div>

            <!-- DETAILS -->
            <label class="label">
              <span>ເນື້ອໃນລາຍລະອຽດ (feature_heading)</span>
              <div class="inputWrap">
                <i class="fa-solid fa-heading"></i>
                <input
                  v-model.trim="form.detailTitle"
                  class="inp"
                  type="text"
                  placeholder="e.g. Responsibilities / Requirements"
                />
              </div>
              <div v-if="errors.detailTitle" class="err">{{ errors.detailTitle }}</div>
            </label>

            <div class="label">
              <span>ຄຸນນະສົມບັດ (features.items / feature_items)</span>

              <div class="bulletRow js-reveal">
                <div class="inputWrap bulletInput">
                  <i class="fa-solid fa-list-ul"></i>
                  <input
                    v-model.trim="bulletDraft"
                    class="inp"
                    type="text"
                    placeholder="ພິມແລ້ວກົດ Enter ເພື່ອເພີ່ມຂໍ້ມູນ (ຫຼື ກົດປຸ່ມ Add)."
                    @keydown.enter.prevent="addBulletsFromDraft"
                    @paste="onPasteBullets"
                  />
                </div>

                <button
                  class="miniBtn"
                  type="button"
                  @click="addBulletsFromDraft"
                  @mouseenter="btnHover($event, true)"
                  @mouseleave="btnHover($event, false)"
                >
                  <i class="fa-solid fa-plus"></i> ເພີ່ມ
                </button>

                <button
                  class="miniBtn ghostBtn"
                  type="button"
                  @click="clearBullets"
                  @mouseenter="btnHover($event, true)"
                  @mouseleave="btnHover($event, false)"
                >
                  <i class="fa-solid fa-broom"></i> ລົບ
                </button>
              </div>

              <div v-if="errors.bullets" class="err">{{ errors.bullets }}</div>

              <div class="bulletPanel js-reveal">
                <div class="bulletTop">
                  <div class="bulletTitle">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    Preview (All Items)
                  </div>

                  <div class="previewRight">
                    <span class="countPill">
                      <i class="fa-solid fa-layer-group"></i>
                      {{ form.bullets.length }}
                    </span>
                  </div>
                </div>

                <ul v-if="form.bullets.length" class="dotList">
                  <li v-for="(b, idx) in form.bullets" :key="idx">
                    <span class="dot"></span>

                    <!-- Text or Edit input -->
                    <template v-if="editIdx !== idx">
                      <span class="txt" @dblclick="startEditBullet(idx)" :title="'Double click to edit'">
                        {{ b }}
                      </span>
                    </template>
                    <template v-else>
                      <input
                        class="editInp"
                        :data-edit-idx="idx"
                        v-model.trim="editDraft"
                        type="text"
                        @keydown.enter.prevent="saveEditBullet(idx)"
                        @keydown.esc.prevent="cancelEditBullet"
                        placeholder="Edit item..."
                      />
                    </template>

                    <!-- Edit / Save -->
                    <button
                      class="sBtn"
                      type="button"
                      :title="editIdx === idx ? 'Save' : 'Edit'"
                      @click="editIdx === idx ? saveEditBullet(idx) : startEditBullet(idx)"
                    >
                      <i :class="editIdx === idx ? 'fa-solid fa-check' : 'fa-regular fa-pen-to-square'"></i>
                    </button>

                    <!-- Cancel (only while editing) -->
                    <button
                      class="sBtn ghost"
                      type="button"
                      title="Cancel"
                      @click="cancelEditBullet"
                      :style="{ opacity: editIdx === idx ? 1 : 0, pointerEvents: editIdx === idx ? 'auto' : 'none' }"
                    >
                      <i class="fa-solid fa-xmark"></i>
                    </button>

                    <!-- Delete -->
                    <button class="xBtn" type="button" @click="removeBullet(idx)" title="Delete">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </li>
                </ul>

                <div v-else class="emptyHint">
                  <i class="fa-regular fa-circle"></i>
                  No items yet — add bullets above
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <!-- ACTIONS -->
            <div ref="actionsEl" class="actions js-reveal">
              <button
                class="btn ghost"
                type="button"
                @click="reloadJob"
                :disabled="loading || saving"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-rotate-right"></i> Reload
              </button>

              <button
                class="btn ghost"
                type="button"
                @click="resetToOriginal"
                :disabled="loading || saving || !originalLoaded"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-rotate-left"></i> Reset
              </button>

              <button
                class="btn primary"
                type="submit"
                :disabled="saving || loading || !jobId"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-floppy-disk"></i>
                {{ saving ? "Saving..." : "Save Changes" }}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>

    <!-- ✅ TECH OVERLAY ALERT -->
    <Teleport to="body">
      <div v-if="overlay.show" ref="overlayEl" class="ov" :class="overlay.type" @click.self="closeOverlay">
        <div ref="ovCardEl" class="ovCard">
          <div class="ovTop">
            <div class="ovIcon">
              <i v-if="overlay.type === 'success'" class="fa-solid fa-circle-check"></i>
              <i v-else class="fa-solid fa-triangle-exclamation"></i>
            </div>

            <div class="ovHead">
              <div class="ovTitle">{{ overlay.title }}</div>
              <div class="ovSub">
                <span class="ovTag">{{ overlay.type === "success" ? "TECH SUCCESS" : "TECH ERROR" }}</span>
                <span class="ovDot"></span>
                <span class="ovHint">
                  {{
                    overlay.type === "success"
                      ? "ກົດປຸ່ມເພື່ອໄປໜ້າ View All Job Posts"
                      : "ກົດປຸ່ມ OK ເພື່ອປິດ"
                  }}
                </span>
              </div>
            </div>

            <button class="ovX" type="button" aria-label="Close" @click="closeOverlay">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="ovBody">
            <div class="ovMsg">{{ overlay.message }}</div>

            <div class="ovActions">
              <button
                class="ovBtn ghost"
                type="button"
                @click="closeOverlay"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-circle-xmark"></i>
                Close
              </button>

              <button
                class="ovBtn primary"
                type="button"
                @click="overlay.type === 'success' ? goOverlay() : closeOverlay()"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid" :class="overlay.type === 'success' ? 'fa-arrow-right' : 'fa-circle-check'"></i>
                {{ overlay.type === "success" ? "Go to Job List" : "OK" }}
              </button>
            </div>
          </div>

          <span class="ovGlow"></span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const sideEl = ref(null);
const headEl = ref(null);
const cardEl = ref(null);
const actionsEl = ref(null);

const navItems = [
  { key: "dashboard", label: "ພາບລວມ", to: "/dashboard", icon: "fa-solid fa-chart-line" },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", icon: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", icon: "fa-solid fa-newspaper" },
  { key: "joblist", label: "ປະກາດຮັບສະມັກພະນັກງານ", to: "/joblist", icon: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດ", to: "/announcement", icon: "fa-solid fa-bullhorn" },
  { key: "boarddirector", label: "ເພີ່ມສະພາບໍລິຫານ", to: "/board_director", icon: "fa-solid fa-people-group" },
  { key: "lapnet", label: "ເພີ່ມພະນັກງານ LAPNet", to: "/lapnet_employee", icon: "fa-solid fa-users-rectangle" },
];

const departments = ["Administration", "Accounting & Finance", "IT", "Operation", "Internal Audit"];
const levels = ["Intern", "Junior", "Mid", "Senior", "Lead", "Manager", "Director", "Other"];

/** ✅ API BASE */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/** ✅ job id from route (prefer query) */
const jobId = computed(() => {
  const qid = route.query?.id ?? route.query?.job_id ?? route.query?.jobId;
  const pid = route.params?.id;
  const id = qid ?? pid ?? "";
  return String(id || "").trim();
});

function nowTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

const form = reactive({
  position: "",
  department: "",
  level: "",
  postedAt: "",
  detailTitle: "",
  bullets: [],
});

const errors = reactive({
  position: "",
  department: "",
  level: "",
  detailTitle: "",
  bullets: "",
});

const bulletDraft = ref("");

/** ✅ inline edit state for preview items */
const editIdx = ref(-1);
const editDraft = ref("");

async function startEditBullet(idx) {
  if (idx < 0 || idx >= form.bullets.length) return;
  editIdx.value = idx;
  editDraft.value = String(form.bullets[idx] ?? "");
  await nextTick();
  const el = document.querySelector(`[data-edit-idx="${idx}"]`);
  if (el && typeof el.focus === "function") el.focus();
}

function cancelEditBullet() {
  editIdx.value = -1;
  editDraft.value = "";
}

function saveEditBullet(idx) {
  if (idx < 0 || idx >= form.bullets.length) return;
  const v = normalizeBullet(editDraft.value);
  if (!v) return;
  form.bullets[idx] = v;
  cancelEditBullet();
}

/** ✅ load/save state */
const loading = ref(false);
const loadError = ref("");
const saving = ref(false);

/** ✅ original snapshot for reset */
const original = ref(null);
const originalLoaded = computed(() => !!original.value);

/* =========================
   ✅ Overlay State
   ========================= */
const overlayEl = ref(null);
const ovCardEl = ref(null);
let prevBodyOverflow = "";

const overlay = reactive({
  show: false,
  type: "success", // success | error
  title: "",
  message: "",
  nextRoute: "", // success => /jobview
});

function lockScroll(on) {
  const body = document.body;
  if (on) {
    prevBodyOverflow = body.style.overflow;
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = prevBodyOverflow || "";
  }
}

function showOverlay({ type = "success", title = "", message = "", nextRoute } = {}) {
  overlay.type = type;
  overlay.title = title || (type === "success" ? "Success" : "Error");
  overlay.message = message || "";
  overlay.nextRoute = typeof nextRoute === "string" ? nextRoute : type === "success" ? "/jobview" : "";

  overlay.show = true;
  lockScroll(true);

  requestAnimationFrame(() => {
    if (overlayEl.value) gsap.set(overlayEl.value, { opacity: 0 });
    if (ovCardEl.value) gsap.set(ovCardEl.value, { opacity: 0, y: 14, scale: 0.985 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    if (overlayEl.value) tl.to(overlayEl.value, { opacity: 1, duration: 0.18 }, 0);
    if (ovCardEl.value) tl.to(ovCardEl.value, { opacity: 1, y: 0, scale: 1, duration: 0.26 }, 0.02);
  });
}

function closeOverlay() {
  if (!overlay.show) return;

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: () => {
      overlay.show = false;
      lockScroll(false);
    },
  });

  if (ovCardEl.value) tl.to(ovCardEl.value, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 }, 0);
  if (overlayEl.value) tl.to(overlayEl.value, { opacity: 0, duration: 0.16 }, 0);
}

async function goOverlay() {
  if (!overlay.show) return;

  const go = overlay.nextRoute || "/jobview";

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: async () => {
      overlay.show = false;
      lockScroll(false);
      try {
        await router.push(go);
      } catch {
        // ignore
      }
    },
  });

  if (ovCardEl.value) tl.to(ovCardEl.value, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 }, 0);
  if (overlayEl.value) tl.to(overlayEl.value, { opacity: 0, duration: 0.16 }, 0);
}

function onKey(e) {
  if (e.key === "Escape" && overlay.show) closeOverlay();
}

/* =========================
   ✅ Page helpers
   ========================= */
function goBack() {
  router.back();
}

function btnHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.22, ease: "power2.out" });
}
function navHover(e, enter) {
  const el = e.currentTarget;
  if (el.classList.contains("active")) return;
  gsap.to(el, { x: enter ? 3 : 0, duration: 0.18, ease: "power2.out" });
}

function setError(key, msg) {
  errors[key] = msg || "";
}

function normalizeBullet(v) {
  return (v || "").trim().replace(/\s+/g, " ").replace(/^[-•\u2022]\s*/, "");
}

function addBullet(v) {
  const b = normalizeBullet(v);
  if (!b) return;
  form.bullets.push(b);
}

function addBulletsFromDraft() {
  const raw = bulletDraft.value || "";
  const parts = raw
    .split(/\n|,/g)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!parts.length) return;

  parts.forEach(addBullet);
  bulletDraft.value = "";

  gsap.fromTo(".dotList li", { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out", stagger: 0.02 });
}

function onPasteBullets(e) {
  const text = e.clipboardData?.getData("text") || "";
  if (!text.includes("\n")) return;
  e.preventDefault();

  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach(addBullet);

  gsap.fromTo(".dotList li", { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out", stagger: 0.02 });
}

function removeBullet(idx) {
  if (idx < 0 || idx >= form.bullets.length) return;
  form.bullets.splice(idx, 1);
  if (editIdx.value === idx) cancelEditBullet();
  if (editIdx.value > idx) editIdx.value -= 1;
}

function clearBullets() {
  form.bullets.splice(0);
  cancelEditBullet();
}

function validate() {
  setError("position", form.position ? "" : "Position is required.");
  setError("department", form.department ? "" : "Department is required.");
  setError("level", form.level ? "" : "Level is required.");
  setError("detailTitle", form.detailTitle ? "" : "Title is required.");
  setError("bullets", form.bullets.length ? "" : "Please add at least 1 feature item.");
  return !Object.values(errors).some(Boolean);
}

/* =========================
   ✅ Load / Map helpers (features.items)
   ========================= */
function safeArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    // try parse JSON array
    try {
      const p = JSON.parse(v);
      if (Array.isArray(p)) return p;
    } catch {
      // if comma-separated
      const parts = v.split(/\n|,/g).map((s) => s.trim()).filter(Boolean);
      if (parts.length) return parts;
    }
  }
  return [];
}

function extractFeatures(job) {
  const f = job?.features ?? job?.feature ?? null;

  const heading =
    job?.feature_heading ??
    job?.features_heading ??
    f?.heading ??
    f?.title ??
    job?.detailTitle ??
    "";

  let itemsRaw =
    f?.items ??
    f?.feature_items ??
    job?.feature_items ??
    job?.features_items ??
    job?.bullets ??
    job?.features;

  // If features is an object but items missing, try common field names
  if (itemsRaw && typeof itemsRaw === "object" && !Array.isArray(itemsRaw)) {
    itemsRaw = itemsRaw.items ?? itemsRaw.list ?? itemsRaw.data ?? itemsRaw.value ?? itemsRaw;
  }

  const items = safeArray(itemsRaw);

  return { heading, items };
}

function mapFromApi(job) {
  form.position = job?.title ?? job?.position ?? "";
  form.department = job?.department ?? "";
  form.level = job?.levels ?? job?.level ?? "";
  form.postedAt = job?.time ?? job?.postedAt ?? nowTimestamp();

  const { heading, items } = extractFeatures(job);
  form.detailTitle = heading ?? "";

  form.bullets.splice(0);
  items.forEach((x) => addBullet(x));
}

function snapshotCurrent() {
  return {
    position: form.position,
    department: form.department,
    level: form.level,
    postedAt: form.postedAt,
    detailTitle: form.detailTitle,
    bullets: [...form.bullets],
  };
}

function applySnapshot(snap) {
  form.position = snap?.position ?? "";
  form.department = snap?.department ?? "";
  form.level = snap?.level ?? "";
  form.postedAt = snap?.postedAt ?? nowTimestamp();
  form.detailTitle = snap?.detailTitle ?? "";
  form.bullets.splice(0);
  (snap?.bullets ?? []).forEach((x) => addBullet(x));
  cancelEditBullet();
}

function resetToOriginal() {
  if (!original.value) return;
  applySnapshot(original.value);
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  gsap.to(cardEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
}

/** ✅ GET job by id (PRIORITY: /api/jobs-list) */
async function fetchJobById(id) {
  const enc = encodeURIComponent(String(id));

  const paths = [
    `${API_BASE}/api/jobs-list/${enc}`,
    `${API_BASE}/api/jobs-list?id=${enc}`,
    `${API_BASE}/api/jobs-list/job?id=${enc}`,

    // fallback old
    `${API_BASE}/api/jobs/${enc}`,
    `${API_BASE}/api/jobs?id=${enc}`,
    `${API_BASE}/api/jobs/job?id=${enc}`,
  ];

  let lastErr = null;

  for (const url of paths) {
    try {
      const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));

      const job =
        (data && typeof data === "object" && !Array.isArray(data) ? data.data ?? data.job ?? data.row ?? data : null) ??
        null;

      if (job && typeof job === "object") return job;

      if (Array.isArray(data)) {
        const found = data.find((x) => String(x?.job_id ?? x?.id ?? x?._id ?? "") === String(id));
        if (found) return found;
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("Failed to load job");
}

async function loadJob() {
  const id = jobId.value;
  if (!id) {
    loadError.value = "Missing job id. Open like: /jobedit?id=123";
    showOverlay({ type: "error", title: "Missing job_id", message: loadError.value });
    return;
  }

  try {
    loading.value = true;
    loadError.value = "";

    const job = await fetchJobById(id);
    mapFromApi(job);

    original.value = snapshotCurrent();

    gsap.to(cardEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
  } catch (e) {
    console.error(e);
    loadError.value = e?.message || "Failed to load job";
    showOverlay({ type: "error", title: "Load failed", message: loadError.value });
  } finally {
    loading.value = false;
  }
}

function reloadJob() {
  loadJob();
}

/* =========================
   ✅ Update submit (PUT/PATCH to /api/jobs-list/:id first)
   ========================= */
async function onSubmit() {
  if (!jobId.value) return;

  if (!validate()) {
    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
    return;
  }

  // ✅ Send features as object + also legacy fields for compatibility
  const payload = {
    department: form.department,
    levels: form.level,
    time: form.postedAt,
    title: form.position,

    // legacy keys:
    feature_heading: form.detailTitle,
    feature_items: [...form.bullets],
    features_heading: form.detailTitle,

    // preferred object:
    features: {
      heading: form.detailTitle,
      items: [...form.bullets],
    },
  };

  try {
    saving.value = true;

    const enc = encodeURIComponent(jobId.value);

    // ✅ Prefer jobs-list endpoint
    const urls = [
      `${API_BASE}/api/jobs-list/${enc}`,
      `${API_BASE}/api/jobs/${enc}`, // fallback
    ];

    let lastRes = null;

    for (const putUrl of urls) {
      // PUT
      let res = await fetch(putUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // PATCH fallback
      if (!res.ok && (res.status === 404 || res.status === 405 || res.status === 501)) {
        res = await fetch(putUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      lastRes = res;

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.ok === false) throw new Error(data?.message || "Update failed");
        original.value = snapshotCurrent();
        gsap.to(actionsEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });

        showOverlay({
          type: "success",
          title: "ແກ້ໄຂປະກາດງານສຳເລັດ",
          message: `Updated successfully ✅\njob_id: ${jobId.value}\nກົດປຸ່ມ “View All Job Posts” ເພື່ອໄປຫນ້າລາຍການ`,
          nextRoute: "/jobview",
        });
        return;
      }
    }

    const data = await lastRes?.json().catch(() => ({}));
    throw new Error(data?.message || `HTTP ${lastRes?.status || 0}`);
  } catch (err) {
    console.error(err);
    const msg = err?.message || "Update failed";
    showOverlay({
      type: "error",
      title: "ແກ້ໄຂປະກາດງານບໍ່ສຳເລັດ",
      message: msg,
    });
  } finally {
    saving.value = false;
  }
}

/* =========================
   ✅ Mount / Animations
   ========================= */
onMounted(() => {
  window.addEventListener("keydown", onKey);

  gsap.set(".js-side", { opacity: 0, x: -18 });
  gsap.set(".js-sideItem", { opacity: 0, y: 10 });
  gsap.set(".js-card", { opacity: 0, y: 14, scale: 0.985 });
  gsap.set(".js-reveal", { opacity: 0, y: 10 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".js-side", { opacity: 1, x: 0, duration: 0.55 }, 0)
    .to(".js-sideItem", { opacity: 1, y: 0, stagger: 0.06, duration: 0.42 }, 0.12)
    .to(".js-card", { opacity: 1, y: 0, scale: 1, duration: 0.55 }, 0.12)
    .to(".js-reveal", { opacity: 1, y: 0, stagger: 0.06, duration: 0.45 }, 0.18);

  loadJob();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  lockScroll(false);
});
</script>

<style scoped>
/* =========================
   SAME STYLE AS INSERT (copied)
   ========================= */
.page.tech {
  --bg0: #050914;
  --bg1: #070e23;
  --glass2: rgba(255, 255, 255, 0.04);

  --txt: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.56);
  --danger: rgba(248, 113, 113, 0.95);

  min-height: 100vh;
  padding: 18px;
  color: var(--txt);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  background: radial-gradient(1100px 620px at 18% 14%, rgba(56, 189, 248, 0.16), transparent 58%),
    radial-gradient(900px 520px at 82% 18%, rgba(99, 102, 241, 0.14), transparent 60%),
    radial-gradient(800px 520px at 70% 90%, rgba(14, 165, 233, 0.1), transparent 62%),
    linear-gradient(180deg, var(--bg1), var(--bg0));
  position: relative;
  overflow: hidden;
}
.page.tech::before {
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
.divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
  margin: 6px 0 2px;
}
.layout {
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 14px;
  align-items: start;
}
.sidebar {
  position: sticky;
  top: 18px;
  height: calc(100vh - 36px);
  border-radius: 22px;
  padding: 16px;
  background: rgba(8, 12, 28, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sidebar::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    rgba(56, 189, 248, 0.45),
    rgba(99, 102, 241, 0.22),
    rgba(14, 165, 233, 0.2),
    rgba(56, 189, 248, 0.45)
  );
  opacity: 0.14;
  filter: blur(14px);
  pointer-events: none;
  animation: holo 7s linear infinite;
}
@keyframes holo {
  0% {
    transform: translateX(-16%);
  }
  100% {
    transform: translateX(16%);
  }
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brandMark {
  width: 50px;
  height: 50px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.5), rgba(99, 102, 241, 0.28));
  border: 1px solid #fff;
}
.brandName {
  font-weight: 900;
  letter-spacing: 0.2px;
}
.brandSub {
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 2px;
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
  cursor: pointer;
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
  color: rgba(255, 255, 255, 0.95);
  border-color: rgba(56, 189, 248, 0.24);
  box-shadow: 0 18px 40px rgba(56, 189, 248, 0.12);
}
.navIcon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
}
.navLabel {
  font-weight: 800;
  font-size: 13px;
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

.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.headLeft {
  display: flex;
  align-items: center;
  gap: 12px;
}
.title {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.2px;
}
.sub {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.idPill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  background: rgba(56, 189, 248, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 900;
}
.dangerText {
  color: var(--danger);
}
.backBtn {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.88);
  cursor: pointer;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.86);
  font-weight: 700;
}
.card {
  position: relative;
  background: var(--glass2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 14px;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
.card::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    rgba(56, 189, 248, 0.4),
    rgba(99, 102, 241, 0.22),
    rgba(14, 165, 233, 0.18),
    rgba(56, 189, 248, 0.4)
  );
  opacity: 0.18;
  filter: blur(14px);
  pointer-events: none;
  animation: holo 7s linear infinite;
}
.cardTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.cardTitle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
}
.cardHint {
  font-size: 12px;
  color: var(--muted);
  text-align: right;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.label > span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
}
.inputWrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}
.inputWrap i {
  opacity: 0.75;
}
.inputWrap.readonly {
  opacity: 0.85;
}
.inp {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
}
.select {
  appearance: none;
}
.inputWrap:focus-within {
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}
.err {
  margin-top: 8px;
  font-size: 12px;
  color: var(--danger);
}

.bulletRow {
  display: flex;
  gap: 10px;
  align-items: center;
}
.bulletInput {
  flex: 1 1 auto;
}
.bulletPanel {
  margin-top: 10px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}
.bulletTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.bulletTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
}
.countPill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.86);
  font-weight: 800;
  font-size: 12px;
}
.dotList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

/* ✅ IMPORTANT: keep ONE dotList li definition (with correct columns for edit buttons) */
.dotList li {
  display: grid;
  grid-template-columns: 10px 1fr auto auto auto; /* dot | text/input | edit/save | cancel | delete */
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.06));
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.12);
}
.txt {
  color: rgba(255, 255, 255, 0.92);
  font-weight: 700;
  font-size: 13px;
  line-height: 1.35;
}

/* ✅ Inline edit input */
.editInp {
  width: 100%;
  border: 1px solid rgba(56, 189, 248, 0.22);
  outline: none;
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 8px 10px;
  font-weight: 800;
  font-size: 13px;
}
.editInp:focus {
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}

/* ✅ Small action buttons inside list */
.sBtn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.sBtn:hover {
  border-color: rgba(56, 189, 248, 0.35);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}
.sBtn.ghost:hover {
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.06);
}

/* Delete button (kept) */
.xBtn {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}
.xBtn:hover {
  border-color: rgba(248, 113, 113, 0.35);
  box-shadow: 0 0 0 6px rgba(248, 113, 113, 0.08);
}
.xBtn i {
  font-size: 14px;
}

.emptyHint {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.65);
  font-weight: 800;
  font-size: 12px;
}
.miniBtn {
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.86);
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-weight: 900;
  font-size: 12px;
}
.ghostBtn {
  background: rgba(255, 255, 255, 0.02);
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
  flex-wrap: wrap;
}
.btn {
  border-radius: 14px;
  padding: 12px 14px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.btn.primary {
  border-color: rgba(56, 189, 248, 0.3);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(99, 102, 241, 0.14));
}
.btn.ghost {
  background: rgba(255, 255, 255, 0.03);
}
.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Overlay (same as insert) */
.ov {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(5, 9, 20, 0.72);
  backdrop-filter: blur(12px);
}
.ovCard {
  width: min(980px, 96vw);
  border-radius: 22px;
  position: relative;
  overflow: hidden;
  background: rgba(7, 14, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 26px 90px rgba(0, 0, 0, 0.62);
}
.ovGlow {
  position: absolute;
  inset: -2px;
  pointer-events: none;
  opacity: 0.9;
  filter: blur(18px);
}
.ov.success .ovGlow {
  background: radial-gradient(circle at 18% 22%, rgba(56, 189, 248, 0.22), transparent 60%),
    radial-gradient(circle at 82% 26%, rgba(34, 197, 94, 0.18), transparent 62%),
    radial-gradient(circle at 70% 92%, rgba(99, 102, 241, 0.16), transparent 62%);
}
.ov.error .ovGlow {
  background: radial-gradient(circle at 18% 22%, rgba(248, 113, 113, 0.22), transparent 60%),
    radial-gradient(circle at 82% 26%, rgba(99, 102, 241, 0.16), transparent 62%),
    radial-gradient(circle at 70% 92%, rgba(56, 189, 248, 0.14), transparent 62%);
}
.ovTop {
  display: grid;
  grid-template-columns: 56px 1fr 42px;
  align-items: center;
  gap: 12px;
  padding: 16px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 1;
}
.ovIcon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.35);
  font-size: 20px;
}
.ov.success .ovIcon {
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 18px 44px rgba(56, 189, 248, 0.12);
}
.ov.error .ovIcon {
  border-color: rgba(248, 113, 113, 0.28);
  box-shadow: 0 18px 44px rgba(248, 113, 113, 0.12);
}
.ovHead {
  min-width: 0;
}
.ovTitle {
  font-size: 18px;
  font-weight: 950;
  letter-spacing: 0.2px;
  color: rgba(255, 255, 255, 0.94);
}
.ovSub {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 800;
}
.ovTag {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.18);
  letter-spacing: 0.4px;
}
.ovDot {
  width: 6px;
  height: 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.35);
}
.ovX {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.88);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.ovBody {
  padding: 16px;
  position: relative;
  z-index: 1;
}
.ovMsg {
  font-size: 14px;
  line-height: 1.6;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.86);
  padding: 14px 14px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  white-space: pre-line;
}
.ovActions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.ovBtn {
  border-radius: 14px;
  padding: 12px 14px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 170px;
  justify-content: center;
}
.ovBtn.ghost {
  background: rgba(255, 255, 255, 0.03);
}
.ov.success .ovBtn.primary {
  border-color: rgba(56, 189, 248, 0.32);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(34, 197, 94, 0.12));
}
.ov.error .ovBtn.primary {
  border-color: rgba(248, 113, 113, 0.28);
  background: linear-gradient(90deg, rgba(248, 113, 113, 0.22), rgba(99, 102, 241, 0.12));
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 86px 1fr;
  }
  .brandText,
  .navLabel {
    display: none;
  }
  .sidebar {
    padding: 14px 10px;
  }
}
@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: relative;
    height: auto;
    top: auto;
  }
  .row {
    grid-template-columns: 1fr;
  }
  .bulletRow {
    flex-direction: column;
    align-items: stretch;
  }
  .ovBtn {
    width: 100%;
  }
}
</style>
