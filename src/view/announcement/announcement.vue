<!-- AnnouncementInsert.vue (UPDATED: Create + Edit + Image upload/update/remove) -->
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
              <div class="title">{{ isEdit ? "Edit Announcement" : "Create Announcement" }}</div>
              <div class="sub">
                {{ isEdit ? "ແກ້ໄຂແຈ້ງການຂອງບໍລິສັດ" : "ເພີ່ມແຈ້ງການຂອງບໍລິສັດ" }}
              </div>
            </div>
          </div>

          <div class="headRight js-reveal">
            <span class="pill"><i class="fa-solid fa-shield-halved"></i> Admin</span>
          </div>
        </header>

        <section ref="cardEl" class="card js-card">
          <div class="cardTop">
            <div class="cardTitle">
              <i class="fa-solid fa-bullhorn"></i>
              {{ isEdit ? "Edit Announcement Information" : "Announcement Information" }}
            </div>
            <div class="cardHint">
              <span v-if="isEdit" style="opacity: 0.8">ID: {{ editId }}</span>
            </div>
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <!-- Title -->
            <label class="label">
              <span>ຫົວຂໍ້ແຈ້ງການ</span>
              <div class="inputWrap">
                <i class="fa-solid fa-heading"></i>
                <input
                  v-model.trim="form.title"
                  class="inp"
                  type="text"
                  placeholder="ຫົວຂໍ້ແຈ້ງການຂອງບໍລິສັດ..."
                />
              </div>
              <div v-if="errors.title" class="err">{{ errors.title }}</div>
            </label>

            <!-- Description -->
            <label class="label">
              <span>ລາຍລະອຽດຂອງແຈ້ງການ (ຖ້າມີ)</span>
              <div class="textareaWrap js-reveal">
                <i class="fa-regular fa-message"></i>
                <textarea
                  v-model.trim="form.description"
                  class="textarea"
                  rows="5"
                  placeholder="ລາຍລະອຽດແຈ້ງການຂອງບໍລິສັດ..."
                ></textarea>
              </div>
            </label>

            <div class="divider"></div>

            <!-- ✅ Range + Link -->
            <div class="sectionTitle js-reveal">
              <i class="fa-solid fa-sliders"></i> Range + Link
            </div>

            <div class="row">
              <!-- Range -->
              <label class="label">
                <span>ໄລຍະເວລາສະແດງຜົນ / 1ຄັ້ງ</span>
                <div class="inputWrap">
                  <i class="fa-regular fa-hourglass-half"></i>
                  <select v-model.number="form.range" class="inp select">
                    <option :value="3">3 hours</option>
                    <option :value="7">7 hours</option>
                    <option :value="24">24 hours</option>
                  </select>
                </div>
                <div v-if="errors.range" class="err">{{ errors.range }}</div>
              </label>

              <!-- Link -->
              <label class="label">
                <span>Link (Optional)</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-link"></i>
                  <input v-model.trim="form.link" class="inp" type="text" placeholder="https://..." />
                </div>
                <div v-if="errors.link" class="err">{{ errors.link }}</div>
              </label>
            </div>

            <div class="divider"></div>

            <!-- Status -->
            <div class="sectionTitle js-reveal">
              <i class="fa-solid fa-toggle-on"></i> ສະຖານະ
            </div>

            <div class="row">
              <label class="label">
                <span>Active</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-circle-check"></i>
                  <select v-model.number="form.active" class="inp select">
                    <option :value="1">Active</option>
                    <option :value="0">Non Active</option>
                  </select>
                </div>
              </label>

              <label class="label">
                <span>Timestamp</span>
                <div class="inputWrap readonly">
                  <i class="fa-regular fa-clock"></i>
                  <input class="inp" type="text" :value="timestamp" readonly />
                </div>
              </label>
            </div>

            <div class="divider"></div>

            <!-- Image + Preview -->
            <div class="sectionTitle js-reveal">
              <i class="fa-regular fa-image"></i> Image + Preview
            </div>

            <div class="imgPanel js-reveal">
              <div class="imgPanelTop">
                <div class="imgPanelTitle">
                  <i class="fa-solid fa-image"></i>
                  {{ isEdit ? "Update announcement image" : "Upload announcement image" }}
                </div>

                <button
                  v-if="imagePreview"
                  class="miniBtn"
                  type="button"
                  @click="clearImage"
                  @mouseenter="btnHover($event, true)"
                  @mouseleave="btnHover($event, false)"
                >
                  <i class="fa-solid fa-trash"></i>
                  {{ isEdit ? "Remove / Clear" : "Remove" }}
                </button>
              </div>

              <!-- hidden file input -->
              <input ref="fileEl" class="fileHidden" type="file" accept="image/*" @change="onPickFile" />

              <!-- Preview Card -->
              <div class="previewCard">
                <div class="imgBox clickable" @click="triggerPickImage" title="Click to upload">
                  <img v-if="imagePreview" :src="imagePreview" alt="announcement preview" />
                  <div v-else class="imgEmpty">
                    <i class="fa-regular fa-image"></i>
                    <div>No image</div>
                    <div class="imgHint">Click to upload</div>
                  </div>
                </div>

                <div class="previewMeta">
                  <div class="pTitle">{{ form.title || "Announcement title" }}</div>
                  <div class="pSub">{{ form.description || "Description..." }}</div>

                  <div v-if="form.link" class="pSub" style="margin-top: 6px">
                    <i class="fa-solid fa-link" style="margin-right: 6px; opacity: 0.9"></i>
                    {{ form.link }}
                  </div>

                  <div class="metaRow">
                    <span class="statusPill" :class="form.active === 1 ? 'on' : 'off'">
                      <span class="dotGlow" :class="form.active === 1 ? 'green' : 'red'"></span>
                      {{ form.active === 1 ? "Active" : "Non Active" }}
                    </span>

                    <span class="timePill">
                      <i class="fa-regular fa-hourglass-half"></i>
                      {{ form.range }} hours
                    </span>

                    <span class="timePill">
                      <i class="fa-solid fa-image"></i>
                      {{ imageNameLabel }}
                    </span>
                  </div>

                  <div v-if="isEdit && imageRemoved && !form.image" class="pSub" style="margin-top: 8px; color: rgba(248,113,113,0.9); font-weight: 800">
                    Image will be removed (unless you upload a new one).
                  </div>

                  <div v-if="errors.image" class="err" style="margin-top: 10px">{{ errors.image }}</div>
                  <div v-if="errors.server" class="err" style="margin-top: 10px">{{ errors.server }}</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div ref="actionsEl" class="actions js-reveal">
              <button
                class="btn ghost"
                type="button"
                :disabled="saving"
                @click="resetForm"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-rotate-left"></i> Reset
              </button>

              <button
                class="btn primary"
                type="submit"
                :disabled="saving"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i v-if="!saving" class="fa-solid fa-floppy-disk"></i>
                <span v-else class="miniSpin"></span>
                {{ saving ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Announcement" : "Save Announcement") }}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>

    <!-- ✅ TECH OVERLAY ALERT (NO AUTO REDIRECT) -->
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
                      ? "ກົດປຸ່ມເພື່ອໄປໜ້າ View All Announcement"
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
                {{ overlay.type === "success" ? "Go to Announcement" : "OK" }}
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
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const sideEl = ref(null);
const headEl = ref(null);
const cardEl = ref(null);
const actionsEl = ref(null);
const fileEl = ref(null);

/* ✅ Overlay refs */
const overlayEl = ref(null);
const ovCardEl = ref(null);
let prevBodyOverflow = "";

/* ✅ Overlay state (NO countdown / NO auto redirect) */
const overlay = reactive({
  show: false,
  type: "success", // success | error
  title: "",
  message: "",
  nextRoute: "/announcementviewer",
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

  overlay.nextRoute = typeof nextRoute === "string" ? nextRoute : type === "success" ? "/announcementviewer" : "";

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

  const go = overlay.nextRoute || "/announcementviewer";

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: async () => {
      overlay.show = false;
      lockScroll(false);

      if (go && go !== route.fullPath) {
        try {
          await router.push(go);
        } catch {
          // ignore
        }
      }
    },
  });

  if (ovCardEl.value) tl.to(ovCardEl.value, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 }, 0);
  if (overlayEl.value) tl.to(overlayEl.value, { opacity: 0, duration: 0.16 }, 0);
}

function onKey(e) {
  if (e.key === "Escape" && overlay.show) closeOverlay();
}

/**
 * ✅ SET YOUR REAL API
 */
const API_URL = "http://localhost:3000/api/announcement";
const API_BASE = "http://localhost:3000";

const navItems = [
  { key: "dashboard", label: "ພາບລວມ", to: "/dashboard", icon: "fa-solid fa-chart-line" },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", icon: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", icon: "fa-solid fa-newspaper" },
  { key: "joblist", label: "ປະກາດຮັບສະມັກພະນັກງານ", to: "/joblist", icon: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດ", to: "/announcement", icon: "fa-solid fa-bullhorn" },
  { key: "boarddirector", label: "ເພີ່ມສະພາບໍລິຫານ", to: "/board_director", icon: "fa-solid fa-people-group" },
  { key: "lapnet", label: "ເພີ່ມພະນັກງານ LAPNet", to: "/lapnet_employee", icon: "fa-solid fa-users-rectangle" },
];

// ✅ edit mode (route param :id)
const editId = computed(() => {
  const raw = route.params?.id;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
});
const isEdit = computed(() => !!editId.value);

// ✅ existing server image state (for edit)
const existing = reactive({
  imageRel: "",
  imageUrl: "",
  loaded: false,
});

// ✅ if user clicks remove on edit without uploading new file
const imageRemoved = ref(false);

// ✅ timestamp helpers
function pad2(n) {
  return String(n).padStart(2, "0");
}
function nowTimestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(
    d.getMinutes()
  )}:${pad2(d.getSeconds())}`;
}

// ✅ timestamp state (ref)
const timestamp = ref(nowTimestamp());
let tsTimer = null;

function refreshTimestamp() {
  timestamp.value = nowTimestamp();
}

const form = reactive({
  title: "",
  description: "",
  active: 1,
  range: 3,
  link: "",
  image: null, // File
});

const errors = reactive({
  title: "",
  image: "",
  range: "",
  link: "",
  server: "",
});

const saving = ref(false);

const imagePreview = ref("");
let lastObjectUrl = "";

function goBack() {
  router.back();
}

function setError(key, msg) {
  errors[key] = msg || "";
}

function isValidUrlMaybe(v) {
  const s = String(v || "").trim();
  if (!s) return true; // optional
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const imageNameLabel = computed(() => {
  if (form.image?.name) return form.image.name;

  // edit + existing image
  if (isEdit.value && existing.imageRel && !imageRemoved.value) {
    const name = String(existing.imageRel).split("/").pop();
    return name || "Existing image";
  }

  return "No file selected";
});

function validate() {
  setError("title", form.title ? "" : "Title is required.");

  const okRange = [3, 7, 24].includes(Number(form.range));
  setError("range", okRange ? "" : "Range must be 3 / 7 / 24 hours.");

  setError("link", isValidUrlMaybe(form.link) ? "" : "Link must be a valid URL (http/https).");

  // ✅ image rules:
  // - create: image required
  // - edit: image optional if existing image still present; BUT if removed and no new file => required
  const hasExisting = !!existing.imageRel && !imageRemoved.value;
  const hasNew = !!form.image;
  const needsImage = isEdit.value ? (!hasExisting && !hasNew) : !hasNew;

  setError("image", needsImage ? "Image is required." : "");
  setError("server", "");

  return !Object.values(errors).some(Boolean);
}

function triggerPickImage() {
  fileEl.value?.click();
}

function setPreviewFromFile(file) {
  if (!file) return;
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
  lastObjectUrl = URL.createObjectURL(file);
  imagePreview.value = lastObjectUrl;
}

function onPickFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  form.image = file;

  // if user picks new file => no remove
  imageRemoved.value = false;

  setPreviewFromFile(file);
  e.target.value = "";
}

function clearImage() {
  // if currently showing objectUrl, revoke it
  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = "";
  }

  // if edit and existing image exists and user clears without selecting new => mark remove
  if (isEdit.value && existing.imageRel && !form.image) {
    imageRemoved.value = true;
  }

  form.image = null;
  imagePreview.value = "";
  if (fileEl.value) fileEl.value.value = "";
}

function resetForm() {
  // for edit: reload from server (safer)
  if (isEdit.value && editId.value) {
    loadForEdit(editId.value);
    Object.keys(errors).forEach((k) => (errors[k] = ""));
    return;
  }

  form.title = "";
  form.description = "";
  form.active = 1;
  form.range = 3;
  form.link = "";
  form.image = null;

  imageRemoved.value = false;
  existing.imageRel = "";
  existing.imageUrl = "";
  existing.loaded = false;

  clearImage();
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  refreshTimestamp();
}

function normalizeImageUrl(p) {
  const s = String(p || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return `${API_BASE}${s}`;
  return `${API_BASE}/${s}`;
}

async function loadForEdit(id) {
  try {
    setError("server", "");
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Failed to load announcement (HTTP ${res.status})`);

    const j = await res.json();
    const data = j?.data || null;
    if (!data) throw new Error("Invalid server response");

    form.title = String(data.title || "").trim();
    form.description = String(data.description || "").trim();
    form.active = Number(data.active) === 1 ? 1 : 0;

    const rr = Number(data.range);
    form.range = [3, 7, 24].includes(rr) ? rr : 3;

    form.link = String(data.link || "").trim();

    // keep existing timestamp (do not auto-update in edit mode)
    timestamp.value = String(data.time || "").trim() || nowTimestamp();

    // image from server
    existing.imageRel = String(data.image || data.Image || "").trim();
    existing.imageUrl = String(data.image_url || "").trim() || normalizeImageUrl(existing.imageRel);

    imageRemoved.value = false;
    form.image = null;

    // preview remote image
    if (existing.imageUrl) {
      // if objectUrl existed, revoke it
      if (lastObjectUrl) {
        URL.revokeObjectURL(lastObjectUrl);
        lastObjectUrl = "";
      }
      imagePreview.value = existing.imageUrl;
    } else {
      imagePreview.value = "";
    }

    existing.loaded = true;
  } catch (err) {
    console.error("LOAD EDIT ERROR:", err);
    setError("server", err?.message || "Failed to load announcement.");
    showOverlay({
      type: "error",
      title: "Load failed",
      message: err?.message || "Failed to load announcement.",
    });
  }
}

async function onSubmit() {
  if (saving.value) return;

  // create: update timestamp live
  if (!isEdit.value) refreshTimestamp();

  if (!validate()) {
    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
    return;
  }

  saving.value = true;

  try {
    const fd = new FormData();

    fd.append("title", form.title.trim());
    fd.append("description", (form.description || "").trim());
    fd.append("active", String(form.active));
    fd.append("range", String(form.range));
    fd.append("link", (form.link || "").trim());

    // create: send time
    if (!isEdit.value) {
      fd.append("time", timestamp.value);
    }

    // image: only send if new selected
    if (form.image) {
      fd.append("image", form.image);
    } else if (isEdit.value && imageRemoved.value) {
      // tell backend to remove old image if user cleared it
      fd.append("image_remove", "1");
    }

    const url = isEdit.value ? `${API_URL}/${editId.value}` : API_URL;
    const method = isEdit.value ? "PATCH" : "POST";

    const res = await fetch(url, { method, body: fd });

    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        const jj = await res.json();
        errMsg = jj?.message || jj?.error || errMsg;
      } catch {
        try {
          const t = await res.text();
          if (t) errMsg = t;
        } catch {}
      }
      throw new Error(errMsg);
    }

    const out = await res.json().catch(() => null);
    const saved = out?.data || null;

    // update local edit state after patch
    if (isEdit.value && saved) {
      existing.imageRel = String(saved.image || saved.Image || "").trim();
      existing.imageUrl = String(saved.image_url || "").trim() || normalizeImageUrl(existing.imageRel);
      imageRemoved.value = false;
      form.image = null;

      // show preview from server if exists
      if (existing.imageUrl) imagePreview.value = existing.imageUrl;
      else imagePreview.value = "";
    }

    gsap.to(actionsEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });

    showOverlay({
      type: "success",
      title: isEdit.value ? "ອັບເດດສຳເລັດ" : "ບັນທຶກສຳເລັດ",
      message:
        (isEdit.value ? "ອັບເດດ Announcement ສຳເລັດ ✅\n" : "ບັນທຶກ Announcement ສຳເລັດ ✅\n") +
        (saved?.image_url ? `Image URL: ${saved.image_url}\n` : "") +
        "ກົດປຸ່ມ “View All Announcement” ເພື່ອໄປຫນ້າລາຍການ",
      nextRoute: "/announcementviewer",
    });

    // create: reset form
    if (!isEdit.value) {
      resetForm();
    }
  } catch (err) {
    console.error("Save failed:", err);
    const msg = err?.message || "Save failed. Please check API_URL / backend response.";
    setError("server", msg);

    showOverlay({
      type: "error",
      title: "ບໍ່ສຳເລັດ",
      message: msg,
    });

    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
  } finally {
    saving.value = false;
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

onMounted(async () => {
  window.addEventListener("keydown", onKey);

  // create: auto timestamp
  if (!isEdit.value) {
    refreshTimestamp();
    tsTimer = setInterval(refreshTimestamp, 1000);
  }

  // edit: load existing
  if (isEdit.value && editId.value) {
    await loadForEdit(editId.value);
  }

  gsap.set(".js-side", { opacity: 0, x: -18 });
  gsap.set(".js-sideItem", { opacity: 0, y: 10 });
  gsap.set(".js-card", { opacity: 0, y: 14, scale: 0.985 });
  gsap.set(".js-reveal", { opacity: 0, y: 10 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".js-side", { opacity: 1, x: 0, duration: 0.55 }, 0)
    .to(".js-sideItem", { opacity: 1, y: 0, stagger: 0.06, duration: 0.42 }, 0.12)
    .to(".js-card", { opacity: 1, y: 0, scale: 1, duration: 0.55 }, 0.12)
    .to(".js-reveal", { opacity: 1, y: 0, stagger: 0.06, duration: 0.45 }, 0.18);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
  lockScroll(false);

  if (tsTimer) clearInterval(tsTimer);
  tsTimer = null;
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

  --green: rgba(34, 197, 94, 1);
  --red: rgba(239, 68, 68, 1);

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
  box-shadow: 0 18px 40px rgba(56, 189, 248, 0.12);
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

.divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
  margin: 6px 0 2px;
}

.sectionTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 0;
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
  min-height: 110px;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  line-height: 1.5;
}
.textareaWrap:focus-within {
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}

/* Image panel */
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

.fileHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

/* Preview card */
.previewCard {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 12px;
  align-items: start;
}
.imgBox {
  width: 170px;
  height: 170px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  display: grid;
  place-items: center;
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

.previewMeta .pTitle {
  font-weight: 900;
  font-size: 15px;
}
.previewMeta .pSub {
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
}

.metaRow {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.statusPill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 900;
  font-size: 12px;
}
.statusPill.on {
  border-color: rgba(34, 197, 94, 0.22);
}
.statusPill.off {
  border-color: rgba(239, 68, 68, 0.22);
}

.dotGlow {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}
.dotGlow.green {
  background: var(--green);
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.16), 0 0 18px rgba(34, 197, 94, 0.55);
}
.dotGlow.red {
  background: var(--red);
  box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.16), 0 0 18px rgba(239, 68, 68, 0.55);
}

.timePill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.82);
  font-weight: 800;
  font-size: 12px;
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

/* tiny spinner for saving */
.miniSpin {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-top-color: rgba(56, 189, 248, 0.95);
  animation: spin 0.75s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   ✅ OVERLAY ALERT (BIG, MODERN)
   ========================= */
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
  .previewCard {
    grid-template-columns: 1fr;
  }
  .imgBox {
    width: 100%;
    height: 220px;
  }
  .ovBtn {
    width: 100%;
  }
}
</style>
