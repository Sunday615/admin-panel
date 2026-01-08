<!-- NewsInsert.vue (NO SIDEBAR) -->
<template>
  <div class="page tech">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <main class="layout">
      <!-- ✅ NO SIDEBAR -->

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
              <div class="title">ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ</div>
              <div class="sub">ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳໃໝ່ຂອງບໍລິສັດ</div>
            </div>
          </div>

          <div class="headRight js-reveal">
            <span class="pill"><i class="fa-solid fa-shield-halved"></i> Admin</span>
          </div>
        </header>

        <section ref="cardEl" class="card js-card">
          <div class="cardTop">
            <div class="cardTitle"><i class="fa-solid fa-newspaper"></i> News Information</div>
            <div class="cardHint"></div>
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <!-- Basic -->
            <div class="row">
              <label class="label">
                <span>ID (Auto)</span>
                <div class="inputWrap readonly">
                  <i class="fa-solid fa-hashtag"></i>
                  <input class="inp" type="text" value="AUTO" readonly />
                </div>
              </label>

              <label class="label">
                <span>ຫົວຂໍ້ຂ່າວສານ</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-heading"></i>
                  <input v-model.trim="form.title" class="inp" type="text" placeholder="News header..." />
                </div>
                <div v-if="errors.title" class="err">{{ errors.title }}</div>
              </label>
            </div>

            <div class="row">
              <label class="label">
                <span>ໝວດໝູ່</span>
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
                <span>ວັນທີຂ່າວສານ</span>
                <div class="inputWrap">
                  <i class="fa-regular fa-calendar"></i>
                  <input ref="dateEl" class="inp" type="text" placeholder="Select date..." />
                </div>
                <div v-if="errors.date" class="err">{{ errors.date }}</div>
              </label>
            </div>

            <div class="row">
              <label class="label">
                <span>ວັນທີເພີ່ມຂ່າວ (Auto)</span>
                <div class="inputWrap readonly">
                  <i class="fa-regular fa-clock"></i>
                  <input class="inp" type="text" :value="form.timestamp" readonly />
                </div>
              </label>

              <label class="label">
                <span>ຫົວຂໍ້ຍ່ອຍ (ຖ້າມີ)</span>
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

                <button
                  class="miniBtn"
                  type="button"
                  @click="addTagFromDraft"
                  @mouseenter="btnHover($event, true)"
                  @mouseleave="btnHover($event, false)"
                >
                  <i class="fa-solid fa-plus"></i> Add
                </button>

                <button
                  class="miniBtn ghostBtn"
                  type="button"
                  @click="clearTags"
                  @mouseenter="btnHover($event, true)"
                  @mouseleave="btnHover($event, false)"
                >
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
              <span>ເນື້ອໃນຂ່າວສານ</span>
              <div class="textareaWrap js-reveal">
                <i class="fa-regular fa-pen-to-square"></i>
                <textarea v-model.trim="form.content" class="textarea" rows="8" placeholder="Write news content..."></textarea>
              </div>
              <div v-if="errors.content" class="err">{{ errors.content }}</div>
            </div>

            <!-- Main Image -->
            <div class="label">
              <span>ຮູບພາບຫຼັກຂອງຂ່າວສານ</span>

              <div class="imgPanel js-reveal">
                <div class="imgPanelTop">
                  <div class="imgPanelTitle">
                    <i class="fa-solid fa-image"></i>
                    Cover image
                    <span v-if="isOptimizingMain" class="busyPill">
                      <i class="fa-solid fa-spinner fa-spin"></i> Optimizing...
                    </span>
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
              <span>Gallery images (ຖ້າມີ)</span>

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
                      {{ form.gallery.length }}
                    </span>

                    <span v-if="isOptimizingGallery" class="busyPill">
                      <i class="fa-solid fa-spinner fa-spin"></i> Optimizing...
                    </span>

                    <button
                      v-if="form.gallery.length"
                      class="miniBtn ghostBtn"
                      type="button"
                      :disabled="isOptimizingGallery"
                      @click.stop="clearGallery"
                      @mouseenter="btnHover($event, true)"
                      @mouseleave="btnHover($event, false)"
                    >
                      <i class="fa-solid fa-broom"></i> Clear
                    </button>
                  </div>
                </div>
              </div>

              <div class="galleryGrid js-reveal" v-if="galleryPreviews.length">
                <div v-for="(src, idx) in galleryPreviews" :key="src" class="gItem">
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
              <button
                class="btn ghost"
                type="button"
                :disabled="isSubmitting || confirm.open"
                @click="resetForm"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-rotate-left"></i> Reset
              </button>

              <button
                class="btn primary"
                type="submit"
                :disabled="isSubmitting || confirm.open"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i v-if="!isSubmitting" class="fa-solid fa-floppy-disk"></i>
                <i v-else class="fa-solid fa-spinner fa-spin"></i>
                {{ isSubmitting ? "Saving..." : "Save News" }}
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
            <button
              class="btn ghost"
              type="button"
              @click="closeConfirm"
              :disabled="confirm.busy"
              @mouseenter="btnHover($event, true)"
              @mouseleave="btnHover($event, false)"
            >
              <i class="fa-solid fa-xmark"></i> Cancel
            </button>

            <button
              class="btn primary"
              type="button"
              @click="confirmSave"
              :disabled="confirm.busy"
              @mouseenter="btnHover($event, true)"
              @mouseleave="btnHover($event, false)"
            >
              <i v-if="!confirm.busy" class="fa-solid fa-floppy-disk"></i>
              <i v-else class="fa-solid fa-spinner fa-spin"></i>
              {{ confirm.busy ? "Saving..." : "Confirm Save" }}
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
              <button class="btn ghost" type="button" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
                <i class="fa-solid fa-arrow-left"></i> ເບິ່ງຂ່າວທີ່ເພີ່ມ
              </button>
            </router-link>

            <button
              v-if="popup.type === 'success'"
              class="btn primary"
              type="button"
              @click="closePopup"
              @mouseenter="btnHover($event, true)"
              @mouseleave="btnHover($event, false)"
            >
              ປິດ
            </button>

            <button
              v-else
              class="btn primary"
              type="button"
              @click="closePopup"
              @mouseenter="btnHover($event, true)"
              @mouseleave="btnHover($event, false)"
            >
              <i class="fa-solid fa-rotate-right"></i> Try again
            </button>
          </div>

          <span class="popGlow" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

import flatpickr from "flatpickr";
import { English } from "flatpickr/dist/l10n/default";
import "flatpickr/dist/flatpickr.css";

const router = useRouter();

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

// ✅ If backend is different host, set VITE_API_BASE_URL=http://localhost:3000
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const NEWS_INSERT_URL = API_BASE ? `${API_BASE}/api/news/insert` : "/api/news/insert";
const OPTIMIZE_URL = API_BASE ? `${API_BASE}/api/optimize` : "/api/optimize";

const categories = ["Meeting", "Contract Signing", "Announcement", "Activity", "Launch Event", "Event"];

// ---------- Timestamp ----------
function nowTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

function buildDateTime(selectedYmd, timestamp) {
  const timePart = (timestamp || "").split(" ")[1] || "00:00:00";
  return `${selectedYmd} ${timePart}`;
}

const form = reactive({
  title: "",
  category: "",
  date: "", // YYYY-MM-DD
  timestamp: nowTimestamp(),
  slug: "",
  tags: [],
  content: "",
  heroImage: null,
  sideImage: null, // UI only
  gallery: [],
});

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
  title: "Confirm Save",
  message: "Do you want to save this news?",
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
    await showPopup("success", "Saved successfully", "News has been saved to database.");
  } catch (err) {
    closeConfirm();
    await sleep(210);
    await showPopup("error", "Save failed", err?.message || "Save failed");
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
  popup.title = title || (type === "success" ? "Saved" : "Error");
  popup.message = message || (type === "success" ? "Saved!" : "Something went wrong");
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
  form.tags = [];
}

// ---------- Image previews ----------
const mainPreview = ref("");
let mainObjectUrl = "";

const galleryPreviews = ref([]);
let galleryObjectUrls = [];

function revokeUrl(u) {
  if (u) URL.revokeObjectURL(u);
}

function setMainPreview(file) {
  revokeUrl(mainObjectUrl);
  mainObjectUrl = file ? URL.createObjectURL(file) : "";
  mainPreview.value = mainObjectUrl;
}

function setGalleryPreviews(files) {
  galleryObjectUrls.forEach(revokeUrl);
  galleryObjectUrls = [];
  galleryPreviews.value = (files || []).map((f) => {
    const u = URL.createObjectURL(f);
    galleryObjectUrls.push(u);
    return u;
  });
}

// ---------- ✅ Optimize ----------
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
  if (isOptimizingMain.value || isSubmitting.value || confirm.open) return;
  mainFileEl.value?.click();
}

async function onPickMain(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  isOptimizingMain.value = true;
  try {
    const out = await optimizeWithSharp(file, "main");
    form.heroImage = out;
    form.sideImage = out;
    setMainPreview(out);
  } finally {
    isOptimizingMain.value = false;
    e.target.value = "";
  }
}

function clearMainImage() {
  form.heroImage = null;
  form.sideImage = null;
  setMainPreview(null);
  if (mainFileEl.value) mainFileEl.value.value = "";
}

// ---------- Gallery ----------
function triggerPickGallery() {
  if (isOptimizingGallery.value || isSubmitting.value || confirm.open) return;
  galleryFileEl.value?.click();
}

async function addGalleryFiles(filesLike) {
  const incoming = Array.from(filesLike || []).filter(Boolean);
  if (!incoming.length) return;

  isOptimizingGallery.value = true;
  try {
    for (const f of incoming) {
      const out = await optimizeWithSharp(f, "gallery");
      form.gallery.push(out);
    }
    setGalleryPreviews(form.gallery);
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
  if (idx < 0 || idx >= form.gallery.length) return;
  form.gallery.splice(idx, 1);
  setGalleryPreviews(form.gallery);
}

function clearGallery() {
  form.gallery = [];
  setGalleryPreviews([]);
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
  setError("mainImage", form.heroImage ? "" : "hero_img is required.");
  return !Object.values(errors).some(Boolean);
}

// ---------- Actions ----------
function goBack() {
  router.back();
}

function resetForm() {
  form.title = "";
  form.category = "";
  form.date = "";
  form.timestamp = nowTimestamp();
  form.slug = "";
  form.tags = [];
  form.content = "";
  clearMainImage();
  clearGallery();
  datePicker?.clear();
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  tagDraft.value = "";
}

async function onSubmit() {
  if (isSubmitting.value || confirm.open) return;

  form.timestamp = nowTimestamp();

  if (!validate()) {
    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
    return;
  }

  await showConfirm();
}

async function doSubmitReal() {
  const date_time = buildDateTime(form.date, form.timestamp);

  const fd = new FormData();
  fd.append("header_news", form.title);
  fd.append("category", form.category);
  fd.append("date_time", date_time);
  fd.append("sub_header", form.slug || "");
  fd.append("tags", JSON.stringify(form.tags || []));
  fd.append("description_news", form.content);

  fd.append("hero_img", form.heroImage);
  for (const f of form.gallery) fd.append("gallery_files[]", f);

  isSubmitting.value = true;
  try {
    const res = await fetch(NEWS_INSERT_URL, { method: "POST", body: fd });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Insert failed: HTTP ${res.status}`);
    }

    const data = await res.json().catch(() => ({}));

    gsap.to(actionsEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
    resetForm();

    return data;
  } finally {
    isSubmitting.value = false;
  }
}

/* GSAP hover helpers */
function btnHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.22, ease: "power2.out" });
}

function onKey(e) {
  if (e.key !== "Escape") return;
  if (confirm.open) closeConfirm();
  else if (popup.open) closePopup();
}

onMounted(() => {
  window.addEventListener("keydown", onKey);

  gsap.set(".js-card", { opacity: 0, y: 14, scale: 0.985 });
  gsap.set(".js-reveal", { opacity: 0, y: 10 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".js-card", { opacity: 1, y: 0, scale: 1, duration: 0.55 }, 0).to(".js-reveal", { opacity: 1, y: 0, stagger: 0.06, duration: 0.45 }, 0.06);

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
      defaultDate: form.date || null,
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
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  revokeUrl(mainObjectUrl);
  galleryObjectUrls.forEach(revokeUrl);
  datePicker?.destroy();
  datePicker = null;
});
</script>

<style scoped>
/* =========================
   TECH THEME (DARK BLUE)
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

/* ✅ Layout (NO SIDEBAR) */
.layout {
  display: block;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 1200px;
  margin: 0 auto;
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
@keyframes holo {
  0% {
    transform: translateX(-16%);
  }
  100% {
    transform: translateX(16%);
  }
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
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.4), rgba(99, 102, 241, 0.22), rgba(14, 165, 233, 0.18), rgba(56, 189, 248, 0.4));
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

/* Date input */
:deep(.dateInp) {
  font-weight: 900;
  letter-spacing: 0.2px;
}

/* Calendar */
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
@media (max-width: 980px) {
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
