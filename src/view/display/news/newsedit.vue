<!-- NewsEdit.vue (FULL: Fetch by id + Update + Flatpickr + GSAP + Sharp WebP + Confirm + Result Popup) -->
<template>
  <div class="page tech">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <main class="layout">
      <!-- Sidebar -->
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

      <!-- Right content -->
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
              <div class="title">ແກ້ໄຂຂ່າວສານ ແລະ ກິດຈະກຳ</div>
              <div class="sub">
                ແກ້ໄຂຂ່າວສານເກົ່າ (ID:
                <span class="mono">#{{ newsId || "—" }}</span
                >)
              </div>
            </div>
          </div>

          <div class="headRight js-reveal">
            <span class="pill"><i class="fa-solid fa-pen-to-square"></i> Edit</span>
          </div>
        </header>

        <section ref="cardEl" class="card js-card">
          <div class="cardTop">
            <div class="cardTitle"><i class="fa-solid fa-newspaper"></i> Edit News Information</div>

            <div class="cardHint">
              <span v-if="loadingData" class="busyPill"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</span>
              <span v-else-if="loadError" class="errInline"><i class="fa-solid fa-triangle-exclamation"></i> {{ loadError }}</span>
              <span v-else class="okInline"><i class="fa-solid fa-circle-check"></i> Ready</span>
            </div>
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <!-- Basic -->
            <div class="row">
              <label class="label">
                <span>ID</span>
                <div class="inputWrap readonly">
                  <i class="fa-solid fa-hashtag"></i>
                  <input class="inp" type="text" :value="newsId || ''" readonly />
                </div>
              </label>

              <label class="label">
                <span>Header</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-heading"></i>
                  <input v-model.trim="form.title" class="inp" type="text" placeholder="News header..." />
                </div>
                <div v-if="errors.title" class="err">{{ errors.title }}</div>
              </label>
            </div>

            <div class="row">
              <label class="label">
                <span>Category</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-list"></i>
                  <select v-model="form.category" class="inp select">
                    <option value="" disabled>Select category</option>
                    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div v-if="errors.category" class="err">{{ errors.category }}</div>
              </label>

              <!-- Date -->
              <label class="label">
                <span>Date</span>
                <div class="inputWrap">
                  <i class="fa-regular fa-calendar"></i>
                  <input ref="dateEl" class="inp" type="text" placeholder="Select date..." />
                </div>
                <div v-if="errors.date" class="err">{{ errors.date }}</div>
              </label>
            </div>

            <div class="row">
              <label class="label">
                <span>Timestamp (Auto)</span>
                <div class="inputWrap readonly">
                  <i class="fa-regular fa-clock"></i>
                  <input class="inp" type="text" :value="form.timestamp" readonly />
                </div>
              </label>

              <label class="label">
                <span>Sub header (optional)</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-link"></i>
                  <input v-model.trim="form.slug" class="inp" type="text" placeholder="Sub header..." />
                </div>
              </label>
            </div>

            <!-- Tags -->
            <div class="label">
              <span>Tags</span>
              <div class="tagRow js-reveal">
                <div class="inputWrap tagInput">
                  <i class="fa-solid fa-tags"></i>
                  <input
                    v-model.trim="tagDraft"
                    class="inp"
                    type="text"
                    placeholder="Type tag and press Enter (or ,)"
                    @keydown.enter.prevent="addTagFromDraft"
                    @keydown="onTagKeyDown"
                  />
                </div>

                <button class="miniBtn" type="button" @click="addTagFromDraft" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
                  <i class="fa-solid fa-plus"></i> Add
                </button>

                <button class="miniBtn ghostBtn" type="button" @click="clearTags" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
                  <i class="fa-solid fa-broom"></i> Clear
                </button>
              </div>

              <div class="tagChips js-reveal">
                <span v-for="t in form.tags" :key="t" class="tagChip">
                  <i class="fa-solid fa-tag"></i> {{ t }}
                  <button class="x" type="button" @click="removeTag(t)" title="Remove tag">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </span>

                <span v-if="form.tags.length === 0" class="tagChip ghost">
                  <i class="fa-solid fa-tag"></i> No tags
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="label">
              <span>Content</span>
              <div class="textareaWrap js-reveal">
                <i class="fa-regular fa-pen-to-square"></i>
                <textarea v-model.trim="form.content" class="textarea" rows="8" placeholder="Write news content..."></textarea>
              </div>
              <div v-if="errors.content" class="err">{{ errors.content }}</div>
            </div>

            <!-- Main Image -->
            <div class="label">
              <span>Main image (hero_img)</span>

              <div class="imgPanel js-reveal">
                <div class="imgPanelTop">
                  <div class="imgPanelTitle">
                    <i class="fa-solid fa-image"></i>
                    Main image
                    <span v-if="isOptimizingMain" class="busyPill"><i class="fa-solid fa-spinner fa-spin"></i> Optimizing...</span>
                    <span v-if="form.heroRemoved" class="warnPill"><i class="fa-solid fa-triangle-exclamation"></i> Will remove hero image</span>
                  </div>

                  <button
                    v-if="mainPreview"
                    class="miniBtn"
                    type="button"
                    :disabled="isOptimizingMain"
                    @click="clearMainImage"
                    @mouseenter="btnHover($event, true)"
                    @mouseleave="btnHover($event, false)"
                  >
                    <i class="fa-solid fa-trash"></i> Remove
                  </button>
                </div>

                <input ref="mainFileEl" class="fileHidden" type="file" accept="image/*" @change="onPickMain" />

                <div class="dualPreview">
                  <div class="imgBox big clickable" @click="triggerPickMain" title="Click to upload image">
                    <img v-if="mainPreview" :src="mainPreview" alt="hero preview" />
                    <div v-else class="imgEmpty">
                      <i class="fa-regular fa-image"></i>
                      <div>No image (Hero)</div>
                      <div class="imgHint">Click to upload</div>
                    </div>
                  </div>

                  <div class="imgBox clickable" @click="triggerPickMain" title="Click to upload image">
                    <img v-if="mainPreview" :src="mainPreview" alt="side preview" />
                    <div v-else class="imgEmpty">
                      <i class="fa-regular fa-image"></i>
                      <div>No image (Side)</div>
                      <div class="imgHint">Click to upload</div>
                    </div>
                  </div>
                </div>

                <div v-if="errors.mainImage" class="err" style="margin-top: 10px">{{ errors.mainImage }}</div>
              </div>
            </div>

            <!-- Gallery -->
            <div class="label">
              <span>Gallery images (optional)</span>

              <div
                ref="galleryDropEl"
                class="galleryDrop js-reveal"
                :class="{ drag: isGalleryDragging }"
                @dragenter.prevent="isGalleryDragging = true"
                @dragover.prevent="isGalleryDragging = true"
                @dragleave.prevent="isGalleryDragging = false"
                @drop.prevent="onGalleryDrop"
                @click="triggerPickGallery"
              >
                <input ref="galleryFileEl" class="fileHidden" type="file" accept="image/*" multiple @change="onPickGallery" />

                <div class="galleryDropInner">
                  <div class="dropIcon"><i class="fa-regular fa-images"></i></div>

                  <div class="dropText">
                    <div class="dropTitle">Add gallery images</div>
                    <div class="dropSub">Click or drag & drop (no minimum)</div>
                  </div>

                  <div class="galleryMeta">
                    <span class="countPill">
                      <i class="fa-solid fa-layer-group"></i>
                      {{ galleryPreviews.length }}
                    </span>

                    <span v-if="isOptimizingGallery" class="busyPill">
                      <i class="fa-solid fa-spinner fa-spin"></i> Optimizing...
                    </span>

                    <button
                      v-if="galleryPreviews.length"
                      class="miniBtn ghostBtn"
                      type="button"
                      :disabled="isOptimizingGallery"
                      @click.stop="clearGalleryAll"
                      @mouseenter="btnHover($event, true)"
                      @mouseleave="btnHover($event, false)"
                    >
                      <i class="fa-solid fa-broom"></i> Clear
                    </button>
                  </div>
                </div>
              </div>

              <div class="galleryGrid js-reveal" v-if="galleryPreviews.length">
                <div v-for="(src, idx) in galleryPreviews" :key="src + idx" class="gItem">
                  <img :src="src" alt="gallery preview" />
                  <button class="gRemove" type="button" :disabled="isOptimizingGallery" @click="removeGalleryAt(idx)" title="Remove">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                  <div class="gIdx">#{{ idx + 1 }}</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div ref="actionsEl" class="actions js-reveal">
              <button class="btn ghost" type="button" :disabled="isSubmitting || confirm.open || loadingData" @click="resetToOriginal" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
                <i class="fa-solid fa-rotate-left"></i> Reset
              </button>

              <button class="btn primary" type="submit" :disabled="isSubmitting || confirm.open || loadingData" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
                <i v-if="!isSubmitting" class="fa-solid fa-floppy-disk"></i>
                <i v-else class="fa-solid fa-spinner fa-spin"></i>
                {{ isSubmitting ? "Updating..." : "Update News" }}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>

    <!-- ✅ Confirm Popup -->
    <Teleport to="body">
      <div v-if="confirm.open" ref="confirmOverlayEl" class="popOverlay" @click.self="closeConfirm">
        <div ref="confirmModalEl" class="popModal">
          <div class="popTop">
            <div class="popTitle">
              <i class="fa-solid fa-circle-question"></i>
              {{ confirm.title }}
            </div>

            <button class="iconClose" type="button" aria-label="Close" @click="closeConfirm" :disabled="confirm.busy">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="popBody">
            <div class="popMsg">{{ confirm.message }}</div>
          </div>

          <div class="popActions">
            <button class="btn ghost" type="button" @click="closeConfirm" :disabled="confirm.busy">
              <i class="fa-solid fa-xmark"></i> Cancel
            </button>

            <button class="btn primary" type="button" @click="confirmSave" :disabled="confirm.busy">
              <i v-if="!confirm.busy" class="fa-solid fa-floppy-disk"></i>
              <i v-else class="fa-solid fa-spinner fa-spin"></i>
              {{ confirm.busy ? "Updating..." : "Confirm Update" }}
            </button>
          </div>

          <span class="popGlow" />
        </div>
      </div>
    </Teleport>

    <!-- ✅ Result Popup -->
    <Teleport to="body">
      <div v-if="popup.open" ref="popOverlayEl" class="popOverlay" @click.self="closePopup">
        <div ref="popModalEl" class="popModal">
          <div class="popTop">
            <div class="popTitle" :class="{ ok: popup.type === 'success', bad: popup.type === 'error' }">
              <i v-if="popup.type === 'success'" class="fa-solid fa-circle-check"></i>
              <i v-else class="fa-solid fa-triangle-exclamation"></i>
              {{ popup.title }}
            </div>

            <button class="iconClose" type="button" aria-label="Close" @click="closePopup">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="popBody">
            <div class="popMsg">{{ popup.message }}</div>
          </div>

          <div class="popActions">
            <router-link to="/news">
              <button class="btn ghost" type="button">
                <i class="fa-solid fa-arrow-left"></i> Back to News
              </button>
            </router-link>

            <button class="btn primary" type="button" @click="closePopup">
              ປິດ
            </button>
          </div>

          <span class="popGlow" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";

import flatpickr from "flatpickr";
import { English } from "flatpickr/dist/l10n/default";
import "flatpickr/dist/flatpickr.css";

const router = useRouter();
const route = useRoute();

const sideEl = ref(null);
const headEl = ref(null);
const cardEl = ref(null);
const actionsEl = ref(null);

const mainFileEl = ref(null);
const galleryFileEl = ref(null);
const galleryDropEl = ref(null);

const dateEl = ref(null);
let datePicker = null;

const isGalleryDragging = ref(false);
const isOptimizingMain = ref(false);
const isOptimizingGallery = ref(false);
const isSubmitting = ref(false);

const loadingData = ref(false);
const loadError = ref("");

const newsId = computed(() => String(route.query.id || ""));

// ✅ If backend is different host, set VITE_API_BASE_URL=http://localhost:3000
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const NEWS_API = `${API_BASE}/api/news`;
const OPTIMIZE_URL = `${API_BASE}/api/optimize`;

const navItems = [
  { key: "dashboard", label: "ພາບລວມ", to: "/dashboard", icon: "fa-solid fa-chart-line" },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", icon: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", icon: "fa-solid fa-newspaper" },
  { key: "joblist", label: "ປະກາດຮັບສະມັກພະນັກງານ", to: "/joblist", icon: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດ", to: "/announcement", icon: "fa-solid fa-bullhorn" },
  { key: "boarddirector", label: "ເພີ່ມສະພາບໍລິຫານ", to: "/board_director", icon: "fa-solid fa-people-group" },
  { key: "lapnet", label: "ເພີ່ມພະນັກງານ LAPNet", to: "/lapnet_employee", icon: "fa-solid fa-users-rectangle" },
];

const categories = ["Meeting", "Contract Signing", "Announcement", "Activity", "Launch Event", "Event"];

// ---------- Timestamp ----------
function nowTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

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

function parseTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((x) => String(x)).filter(Boolean);
  if (typeof raw === "string") {
    const s = raw.trim();
    const j = safeJsonParse(s);
    if (Array.isArray(j)) return j.map((x) => String(x)).filter(Boolean);
    if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
    return s ? [s] : [];
  }
  return [];
}

function splitDateTime(dt) {
  const s = String(dt || "").trim();
  if (!s) return { date: "", time: "00:00:00" };
  const parts = s.split(" ");
  const date = parts[0] || "";
  const time = parts[1] || "00:00:00";
  return { date, time };
}

function buildDateTime(selectedYmd, timePart) {
  const time = (timePart || "").trim() || "00:00:00";
  return `${selectedYmd} ${time}`;
}

const form = reactive({
  title: "",
  category: "",
  date: "", // YYYY-MM-DD
  timePart: "00:00:00",
  timestamp: nowTimestamp(),
  slug: "",
  tags: [],
  content: "",

  // hero
  heroFile: null, // File when replaced
  heroUrl: "", // resolved URL for preview
  heroRaw: "", // original raw value from backend
  heroRemoved: false,

  // gallery
  galleryExisting: [], // [{ raw, url }]
  galleryNew: [], // File[]
});

const originalSnapshot = ref(null);

const errors = reactive({
  title: "",
  category: "",
  date: "",
  content: "",
  mainImage: "",
});

// ---------- ✅ Confirm Popup ----------
const confirm = reactive({
  open: false,
  busy: false,
  title: "Confirm Update",
  message: "Do you want to update this news?",
});

const confirmOverlayEl = ref(null);
const confirmModalEl = ref(null);

async function showConfirm() {
  if (confirm.open) return;
  confirm.open = true;
  confirm.busy = false;

  await nextTick();
  gsap.fromTo(confirmOverlayEl.value, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "power2.out" });
  gsap.fromTo(confirmModalEl.value, { opacity: 0, y: 12, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" });
}

function closeConfirm() {
  if (!confirmOverlayEl.value || !confirmModalEl.value) {
    confirm.open = false;
    confirm.busy = false;
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to(confirmModalEl.value, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 }, 0)
    .to(confirmOverlayEl.value, { opacity: 0, duration: 0.18 }, 0)
    .add(() => {
      confirm.open = false;
      confirm.busy = false;
    });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function confirmSave() {
  if (confirm.busy || isSubmitting.value) return;

  confirm.busy = true;
  try {
    await doSubmitReal();
    closeConfirm();
    await sleep(210);
    await showPopup("success", "Updated successfully", "News has been updated.");
  } catch (err) {
    closeConfirm();
    await sleep(210);
    await showPopup("error", "Update failed", err?.message || "Update failed");
  } finally {
    confirm.busy = false;
  }
}

// ---------- ✅ Result Popup ----------
const popup = reactive({
  open: false,
  type: "success",
  title: "",
  message: "",
});

const popOverlayEl = ref(null);
const popModalEl = ref(null);

async function showPopup(type, title, message) {
  popup.type = type;
  popup.title = title || (type === "success" ? "Updated" : "Error");
  popup.message = message || (type === "success" ? "Updated!" : "Something went wrong");
  popup.open = true;

  await nextTick();
  gsap.fromTo(popOverlayEl.value, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "power2.out" });
  gsap.fromTo(popModalEl.value, { opacity: 0, y: 12, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" });
}

function closePopup() {
  if (!popOverlayEl.value || !popModalEl.value) {
    popup.open = false;
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to(popModalEl.value, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 }, 0)
    .to(popOverlayEl.value, { opacity: 0, duration: 0.18 }, 0)
    .add(() => (popup.open = false));
}

// ---------- Tags ----------
const tagDraft = ref("");

function normalizeTag(v) {
  return (v || "").trim().replace(/\s+/g, " ").replace(/^#/, "");
}
function addTag(tag) {
  const t = normalizeTag(tag);
  if (!t) return;
  if (form.tags.includes(t)) return;
  form.tags.push(t);
}
function addTagFromDraft() {
  const raw = tagDraft.value || "";
  raw.split(",").forEach((x) => addTag(x));
  tagDraft.value = "";
}
function onTagKeyDown(e) {
  if (e.key === ",") {
    e.preventDefault();
    addTagFromDraft();
  }
}
function removeTag(t) {
  const i = form.tags.indexOf(t);
  if (i >= 0) form.tags.splice(i, 1);
}
function clearTags() {
  form.tags.splice(0, form.tags.length);
}

// ---------- Image previews ----------
const mainPreview = ref("");
let mainObjectUrl = "";

// ✅ FIX: make gallery object urls reactive
const galleryObjectUrls = ref([]); // string[]

const galleryPreviews = computed(() => {
  const existing = form.galleryExisting.map((x) => x.url).filter(Boolean);
  const newOnes = (galleryObjectUrls.value || []).filter(Boolean);
  return [...existing, ...newOnes];
});

function revokeUrl(u) {
  if (u) URL.revokeObjectURL(u);
}

function setMainPreviewFromFile(file) {
  revokeUrl(mainObjectUrl);
  mainObjectUrl = file ? URL.createObjectURL(file) : "";
  mainPreview.value = mainObjectUrl;
}

function setMainPreviewFromUrl(url) {
  revokeUrl(mainObjectUrl);
  mainObjectUrl = "";
  mainPreview.value = url || "";
}

function rebuildGalleryObjectUrls() {
  // revoke old
  for (const u of galleryObjectUrls.value) revokeUrl(u);
  // assign new (reactive)
  galleryObjectUrls.value = form.galleryNew.map((f) => URL.createObjectURL(f));
}

// ---------- ✅ Optimize (SAFE) ----------
async function optimizeWithSharp(file, preset) {
  try {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${OPTIMIZE_URL}?preset=${encodeURIComponent(preset)}`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) return file;

    const blob = await res.blob();
    const base = (file.name || "image").replace(/\.[^/.]+$/, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

// ---------- Main image ----------
function triggerPickMain() {
  if (isOptimizingMain.value || isSubmitting.value || confirm.open || loadingData.value) return;
  mainFileEl.value?.click();
}

async function onPickMain(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  isOptimizingMain.value = true;
  try {
    const out = await optimizeWithSharp(file, "main");
    form.heroFile = out;
    form.heroRemoved = false;
    setMainPreviewFromFile(out);
  } finally {
    isOptimizingMain.value = false;
    e.target.value = "";
  }
}

function clearMainImage() {
  form.heroFile = null;
  form.heroRemoved = true;
  form.heroUrl = "";
  form.heroRaw = "";
  setMainPreviewFromUrl("");
  if (mainFileEl.value) mainFileEl.value.value = "";
}

// ---------- Gallery ----------
function triggerPickGallery() {
  if (isOptimizingGallery.value || isSubmitting.value || confirm.open || loadingData.value) return;
  galleryFileEl.value?.click();
}

async function addGalleryFiles(filesLike) {
  const incoming = Array.from(filesLike || []).filter(Boolean);
  if (!incoming.length) return;

  isOptimizingGallery.value = true;
  try {
    for (const f of incoming) {
      const out = await optimizeWithSharp(f, "gallery");
      form.galleryNew.push(out);
    }
    rebuildGalleryObjectUrls(); // ✅ FIX: now reactive -> previews update
  } finally {
    isOptimizingGallery.value = false;
  }
}

async function onPickGallery(e) {
  const files = e.target.files;
  if (!files || !files.length) return;
  await addGalleryFiles(files);
  e.target.value = "";
}

async function onGalleryDrop(e) {
  isGalleryDragging.value = false;
  const files = e.dataTransfer?.files;
  if (!files || !files.length) return;
  await addGalleryFiles(files);
}

function removeGalleryAt(idx) {
  const existingCount = form.galleryExisting.length;

  if (idx < existingCount) {
    form.galleryExisting.splice(idx, 1);
    return;
  }

  const newIdx = idx - existingCount;
  if (newIdx >= 0 && newIdx < form.galleryNew.length) {
    form.galleryNew.splice(newIdx, 1);
    rebuildGalleryObjectUrls(); // ✅ keep previews in sync
  }
}

function clearGalleryAll() {
  form.galleryExisting.splice(0, form.galleryExisting.length);
  form.galleryNew.splice(0, form.galleryNew.length);
  rebuildGalleryObjectUrls();
  if (galleryFileEl.value) galleryFileEl.value.value = "";
}

// ---------- Validate ----------
function setError(key, msg) {
  errors[key] = msg || "";
}

function validate() {
  setError("title", form.title ? "" : "header_news is required.");
  setError("category", form.category ? "" : "category is required.");
  setError("date", form.date ? "" : "date_time is required.");
  setError("content", form.content ? "" : "description_news is required.");

  // ✅ FIX: allow intentional remove hero (heroRemoved=true)
  const heroOk = (!!mainPreview.value && !form.heroRemoved) || form.heroRemoved;
  setError("mainImage", heroOk ? "" : "hero_img is required.");
  return !Object.values(errors).some(Boolean);
}

// ---------- Actions ----------
function goBack() {
  router.back();
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function resetToOriginal() {
  if (!originalSnapshot.value) return;

  revokeUrl(mainObjectUrl);
  for (const u of galleryObjectUrls.value) revokeUrl(u);
  mainObjectUrl = "";
  galleryObjectUrls.value = [];

  const snap = deepClone(originalSnapshot.value);

  form.title = snap.title || "";
  form.category = snap.category || "";
  form.date = snap.date || "";
  form.timePart = snap.timePart || "00:00:00";
  form.timestamp = nowTimestamp();
  form.slug = snap.slug || "";
  form.tags.splice(0, form.tags.length, ...(snap.tags || []));
  form.content = snap.content || "";

  // hero
  form.heroFile = null;
  form.heroUrl = snap.heroUrl || "";
  form.heroRaw = snap.heroRaw || "";
  form.heroRemoved = false;
  setMainPreviewFromUrl(form.heroUrl);

  // gallery
  form.galleryExisting.splice(0, form.galleryExisting.length, ...(snap.galleryExisting || []));
  form.galleryNew.splice(0, form.galleryNew.length);
  rebuildGalleryObjectUrls();

  datePicker?.setDate(form.date || null, true);
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  tagDraft.value = "";
}

// ✅ Submit entrypoint (Confirm ก่อน)
async function onSubmit() {
  if (isSubmitting.value || confirm.open || loadingData.value) return;

  form.timestamp = nowTimestamp();

  if (!validate()) {
    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
    return;
  }

  await showConfirm();
}

// ---------- Fetch existing ----------
async function fetchNewsById() {
  if (!newsId.value) {
    loadError.value = "Missing id. Open like /newsedit?id=123";
    return;
  }

  loadingData.value = true;
  loadError.value = "";

  try {
    let res = await fetch(`${NEWS_API}/${encodeURIComponent(newsId.value)}`);
    let item = null;

    if (res.ok) {
      const data = await res.json();
      item = data?.data ?? data?.news ?? (Array.isArray(data) ? data[0] : data);
    } else {
      const listRes = await fetch(NEWS_API);
      if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);

      const data = await listRes.json();
      const list = Array.isArray(data) ? data : Array.isArray(data?.news) ? data.news : Array.isArray(data?.data) ? data.data : [];
      item = list.find((n) => String(n?.idnews ?? n?.news_id ?? n?.id ?? n?._id ?? n?.uuid) === String(newsId.value));
    }

    if (!item) throw new Error("News not found");

    form.title = item?.header_news ?? item?.title ?? item?.headline ?? "";
    form.category = item?.category ?? "";

    const dt = item?.date_time ?? item?.datetime ?? item?.date ?? "";
    const { date, time } = splitDateTime(dt);
    form.date = date;
    form.timePart = time;

    form.slug = item?.sub_header ?? item?.subheader ?? item?.slug ?? "";
    form.tags.splice(0, form.tags.length, ...parseTags(item?.tags ?? item?.tag ?? item?.keywords));
    form.content = item?.description_news ?? item?.content ?? "";

    // hero
    const heroRaw =
      item?.hero_img ??
      item?.heroImage ??
      item?.main_img ??
      item?.mainImage ??
      item?.image ??
      item?.img ??
      item?.photo ??
      item?.cover ??
      item?.thumbnail ??
      item?.thumb;

    form.heroRaw = heroRaw ? String(heroRaw) : "";
    form.heroUrl = resolveMediaUrl(heroRaw);
    form.heroFile = null;
    form.heroRemoved = false;
    setMainPreviewFromUrl(form.heroUrl);

    // gallery
    const galleryRaw =
      item?.gallery ??
      item?.gallery_images ??
      item?.galleryImages ??
      item?.gallery_files ??
      item?.galleryFiles ??
      item?.gallery_path ??
      item?.galleryPath ??
      item?.gallery_paths ??
      item?.galleryPaths;

    let arr = [];
    if (Array.isArray(galleryRaw)) arr = galleryRaw;
    else if (typeof galleryRaw === "string") {
      const s = galleryRaw.trim();
      const j = safeJsonParse(s);
      if (Array.isArray(j)) arr = j;
      else if (s.includes(",")) arr = s.split(",");
      else if (s) arr = [s];
    }

    form.galleryExisting.splice(
      0,
      form.galleryExisting.length,
      ...(arr || []).map((raw) => ({
        raw: String(raw || "").trim(),
        url: resolveMediaUrl(raw),
      }))
    );

    form.galleryNew.splice(0, form.galleryNew.length);
    rebuildGalleryObjectUrls();

    datePicker?.setDate(form.date || null, true);

    originalSnapshot.value = deepClone({
      title: form.title,
      category: form.category,
      date: form.date,
      timePart: form.timePart,
      slug: form.slug,
      tags: [...form.tags],
      content: form.content,
      heroUrl: form.heroUrl,
      heroRaw: form.heroRaw,
      galleryExisting: [...form.galleryExisting],
    });
  } catch (e) {
    loadError.value = e?.message || "Failed to fetch news";
  } finally {
    loadingData.value = false;
  }
}

// ---------- Update API ----------
async function tryRequest(method, url, body) {
  return fetch(url, { method, body });
}

async function doSubmitReal() {
  if (!newsId.value) throw new Error("Missing id");

  const date_time = buildDateTime(form.date, form.timePart);

  const fd = new FormData();
  fd.append("idnews", newsId.value);
  fd.append("id", newsId.value);

  fd.append("header_news", form.title);
  fd.append("category", form.category);
  fd.append("date_time", date_time);
  fd.append("sub_header", form.slug || "");
  fd.append("tags", JSON.stringify(form.tags || []));
  fd.append("description_news", form.content);

  // hero
  if (form.heroFile) {
    fd.append("hero_img", form.heroFile);
  } else if (form.heroRemoved) {
    fd.append("hero_remove", "1");
  } else if (form.heroRaw) {
    fd.append("keep_hero_img", form.heroRaw);
  }

  // gallery
  fd.append("keep_gallery", JSON.stringify(form.galleryExisting.map((x) => x.raw).filter(Boolean)));
  for (const f of form.galleryNew) fd.append("gallery_files[]", f);

  isSubmitting.value = true;
  try {
    let res = await tryRequest("PATCH", `${NEWS_API}/${encodeURIComponent(newsId.value)}`, fd);
    if (!res.ok) res = await tryRequest("PUT", `${NEWS_API}/${encodeURIComponent(newsId.value)}`, fd);

    if (!res.ok) {
      fd.append("_method", "PATCH");
      res = await tryRequest("POST", `${NEWS_API}/update`, fd);
    }
    if (!res.ok) res = await tryRequest("POST", `${NEWS_API}/edit`, fd);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Update failed: HTTP ${res.status}`);
    }

    const data = await res.json().catch(() => ({}));
    gsap.to(actionsEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });

    originalSnapshot.value = deepClone({
      title: form.title,
      category: form.category,
      date: form.date,
      timePart: form.timePart,
      slug: form.slug,
      tags: [...form.tags],
      content: form.content,
      heroUrl: mainPreview.value,
      heroRaw: form.heroRaw,
      galleryExisting: [...form.galleryExisting],
    });

    return data;
  } finally {
    isSubmitting.value = false;
  }
}

/* GSAP hover helpers */
function btnHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.22, ease: "power2.out" });
}
function navHover(e, enter) {
  const el = e.currentTarget;
  if (el.classList.contains("active")) return;
  gsap.to(el, { x: enter ? 3 : 0, duration: 0.18, ease: "power2.out" });
}

function onKey(e) {
  if (e.key !== "Escape") return;
  if (confirm.open) closeConfirm();
  else if (popup.open) closePopup();
}

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

  if (galleryDropEl.value) {
    gsap.to(galleryDropEl.value, { y: -2, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }

  if (dateEl.value) {
    datePicker = flatpickr(dateEl.value, {
      locale: English,
      disableMobile: true,
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d F Y",
      altInputClass: "inp dateInp",
      monthSelectorType: "static",
      defaultDate: null,
      onReady: (_selectedDates, _dateStr, instance) => instance.calendarContainer.classList.add("techCalendar"),
      onOpen: (_selectedDates, _dateStr, instance) => {
        gsap.fromTo(
          instance.calendarContainer,
          { opacity: 0, y: 10, scale: 0.985, filter: "blur(2px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.22, ease: "power3.out" }
        );
      },
      onChange: (_selectedDates, dateStr) => {
        form.date = dateStr;
      },
    });
  }

  fetchNewsById();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  revokeUrl(mainObjectUrl);
  for (const u of galleryObjectUrls.value) revokeUrl(u);
  galleryObjectUrls.value = [];
  datePicker?.destroy();
  datePicker = null;
});
</script>


<style scoped>
/* =========================
   TECH THEME (DARK BLUE) - same as your insert
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

/* Layout */
.layout {
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 14px;
  align-items: start;
}

/* Sidebar */
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

/* Right content */
.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Header */
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
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: rgba(255, 255, 255, 0.86);
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

/* Card */
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
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.errInline {
  color: rgba(248, 113, 113, 0.95);
  font-weight: 900;
}
.okInline {
  color: rgba(34, 197, 94, 0.95);
  font-weight: 900;
}

/* Form */
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

/* Date input "tech" */
:deep(.dateInp) {
  font-weight: 900;
  letter-spacing: 0.2px;
}

/* Tech Calendar Container (Flatpickr) */
:deep(.techCalendar) {
  background: rgba(6, 10, 26, 0.92);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 18px;
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(16px);
  overflow: hidden;
  position: relative;
}

/* Tags */
.tagRow {
  display: flex;
  gap: 10px;
  align-items: center;
}
.tagInput {
  flex: 1 1 auto;
}
.tagChips {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tagChip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.12));
  color: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  font-weight: 700;
}
.tagChip.ghost {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.7);
}
.tagChip .x {
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  padding: 0 2px;
}

/* Textarea */
.textareaWrap {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}
.textareaWrap i {
  opacity: 0.75;
  margin-top: 3px;
}
.textarea {
  width: 100%;
  border: 0;
  outline: none;
  resize: vertical;
  min-height: 160px;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  line-height: 1.5;
}
.textareaWrap:focus-within {
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}

/* Upload panel */
.imgPanel {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}
.imgPanelTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.imgPanelTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
}

/* hidden file input */
.fileHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

/* Two previews */
.dualPreview {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 12px;
  align-items: start;
}

.imgBox {
  width: 100%;
  height: 220px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  display: grid;
  place-items: center;
}
.imgBox.big {
  height: 260px;
}
.imgBox img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.imgBox.clickable {
  cursor: pointer;
}
.imgBox.clickable:hover {
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}
.imgEmpty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
}
.imgHint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

/* Gallery */
.galleryDrop {
  position: relative;
  border-radius: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  cursor: pointer;
}
.galleryDrop.drag {
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}
.galleryDropInner {
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dropIcon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.26), rgba(99, 102, 241, 0.16));
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.dropTitle {
  font-weight: 900;
}
.dropSub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}
.galleryMeta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
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
.galleryGrid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}
.gItem {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  aspect-ratio: 1 / 1;
}
.gItem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gRemove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}
.gIdx {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* Buttons */
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
.busyPill {
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.86);
  font-weight: 900;
  font-size: 12px;
}
.warnPill {
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(248, 113, 113, 0.18);
  background: rgba(248, 113, 113, 0.08);
  color: rgba(248, 113, 113, 0.95);
  font-weight: 900;
  font-size: 12px;
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
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
.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn.primary {
  border-color: rgba(56, 189, 248, 0.3);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(99, 102, 241, 0.14));
}
.btn.ghost {
  background: rgba(255, 255, 255, 0.03);
}

/* ✅ Popup styles */
.popOverlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 9, 20, 0.72);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
}
.popModal {
  width: min(680px, 96vw);
  border-radius: 20px;
  position: relative;
  background: rgba(7, 14, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.55);
  overflow: hidden;
}
.popGlow {
  position: absolute;
  inset: -2px;
  pointer-events: none;
  background: radial-gradient(circle at 20% 18%, rgba(56, 189, 248, 0.18), transparent 60%),
    radial-gradient(circle at 82% 22%, rgba(99, 102, 241, 0.14), transparent 62%);
  opacity: 0.9;
  filter: blur(16px);
}
.popTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 1;
}
.popTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.92);
}
.popTitle.ok i {
  color: rgba(34, 197, 94, 0.95);
}
.popTitle.bad i {
  color: rgba(248, 113, 113, 0.95);
}
.iconClose {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.88);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.popBody {
  padding: 14px;
  position: relative;
  z-index: 1;
}
.popMsg {
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.55;
  font-weight: 800;
  word-break: break-word;
}
.popActions {
  padding: 14px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
}

/* responsive */
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
  .dualPreview {
    grid-template-columns: 1fr;
  }
  .galleryGrid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
