<!-- BoardDirectorInsert.vue (UPDATED: success alert -> View / Close, route: /board_directorview) -->
<template>
  <div class="page tech">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <!-- ✅ COOL TOAST ALERT (with actions on success) -->
    <div class="toastWrap" aria-live="polite" aria-atomic="true">
      <div v-if="toast.show" ref="toastEl" class="toast" :class="toast.type" role="status">
        <div class="toastIcon">
          <i v-if="toast.type === 'success'" class="fa-solid fa-circle-check"></i>
          <i v-else class="fa-solid fa-triangle-exclamation"></i>
        </div>

        <div class="toastBody">
          <div class="toastTitle">
            {{ toast.type === "success" ? "Saved!" : "Error" }}
          </div>
          <div class="toastText">{{ toast.message }}</div>

          <!-- ✅ ACTIONS: View / Close (only when success) -->
          <div v-if="toast.type === 'success'" class="toastActions">
            <button class="toastAct primary" type="button" @click="toastGoView">
              <i class="fa-solid fa-eye"></i> View
            </button>
            <button class="toastAct" type="button" @click="toastClose">
              <i class="fa-solid fa-xmark"></i> Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="layout">
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
              <div class="title">Board Director</div>
              <div class="sub">ເພີ່ມສະພາບໍລິຫານງານຂອງບໍລິສັດ</div>
            </div>
          </div>

          <div class="headRight js-reveal">
            <span class="pill"><i class="fa-solid fa-shield-halved"></i> Admin</span>
          </div>
        </header>

        <section ref="cardEl" class="card js-card">
          <div class="cardTop">
            <div class="cardTitle"><i class="fa-solid fa-people-group"></i> Board Director Information</div>
            <div class="cardHint"></div>
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <!-- ===================== -->
            <!-- COMMITTEE NAVBAR -->
            <!-- ===================== -->
            <div class="sectionTitle js-reveal">
              <i class="fa-solid fa-diagram-project"></i> Committee
            </div>

            <div class="committeeBar js-reveal">
              <button
                v-for="c in committees"
                :key="c.key"
                type="button"
                class="cBtn"
                :class="{ on: form.committee === c.key }"
                @click="setCommittee(c.key)"
                @mouseenter="chipHover($event, true)"
                @mouseleave="chipHover($event, false)"
              >
                <span class="cIcon"><i :class="c.icon"></i></span>
                <span class="cLabel">{{ c.label }}</span>
                <span class="cDot" :class="{ on: form.committee === c.key }"></span>
              </button>

              <span class="committeePill">
                <i class="fa-solid fa-tag"></i>
                {{ committeeLabel(form.committee) }}
              </span>
            </div>

            <div class="divider"></div>

            <!-- ===================== -->
            <!-- SECTION: Bank -->
            <!-- ===================== -->
            <div class="row">
              <label class="label">
                <span>Bank Name</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-building"></i>
                  <input v-model.trim="form.bankName" class="inp" type="text" placeholder="e.g. BCEL" />
                </div>
                <div v-if="errors.bankName" class="err">{{ errors.bankName }}</div>
              </label>

              <label class="label">
                <span>Role (Board Position)</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-id-badge"></i>
                  <input
                    v-model.trim="form.role"
                    class="inp"
                    type="text"
                    placeholder="e.g. Chairman / Director / President / Vice President"
                  />
                </div>
                <div v-if="errors.role" class="err">{{ errors.role }}</div>
              </label>
            </div>

            <div class="divider"></div>

            <!-- ===================== -->
            <!-- SECTION: Person -->
            <!-- ===================== -->
            <div class="sectionTitle js-reveal">
              <i class="fa-solid fa-user-tie"></i> Person Information
            </div>

            <label class="label">
              <span>Person Name</span>
              <div class="inputWrap">
                <i class="fa-solid fa-user"></i>
                <input v-model.trim="form.personName" class="inp" type="text" placeholder="Full name..." />
              </div>
              <div v-if="errors.personName" class="err">{{ errors.personName }}</div>
            </label>

            <div class="divider"></div>

            <!-- ===================== -->
            <!-- SECTION: Uploads + Preview -->
            <!-- ===================== -->
            <div class="sectionTitle js-reveal">
              <i class="fa-regular fa-image"></i> Upload & Preview
            </div>

            <div class="dualUpload js-reveal">
              <!-- Bank logo -->
              <div class="upCard">
                <div class="upTop">
                  <div class="upTitle"><i class="fa-solid fa-circle-nodes"></i> Bank Logo</div>
                  <button
                    v-if="logoPreview"
                    class="miniBtn"
                    type="button"
                    @click="clearLogo"
                    @mouseenter="btnHover($event, true)"
                    @mouseleave="btnHover($event, false)"
                  >
                    <i class="fa-solid fa-trash"></i> Remove
                  </button>
                </div>

                <input ref="logoEl" class="fileHidden" type="file" accept="image/*" @change="onPickLogo" />

                <div class="imgBox small clickable" @click="triggerPickLogo" title="Click to upload bank logo">
                  <img v-if="logoPreview" :src="logoPreview" alt="bank logo preview" />
                  <div v-else class="imgEmpty">
                    <i class="fa-regular fa-image"></i>
                    <div>No logo</div>
                    <div class="imgHint">Click to upload</div>
                  </div>
                </div>

                <div v-if="errors.bankLogo" class="err" style="margin-top: 10px">{{ errors.bankLogo }}</div>
              </div>

              <!-- Person profile -->
              <div class="upCard">
                <div class="upTop">
                  <div class="upTitle"><i class="fa-solid fa-user-astronaut"></i> Profile Person</div>
                  <button
                    v-if="profilePreview"
                    class="miniBtn"
                    type="button"
                    @click="clearProfile"
                    @mouseenter="btnHover($event, true)"
                    @mouseleave="btnHover($event, false)"
                  >
                    <i class="fa-solid fa-trash"></i> Remove
                  </button>
                </div>

                <input ref="profileEl" class="fileHidden" type="file" accept="image/*" @change="onPickProfile" />

                <div class="imgBox clickable" @click="triggerPickProfile" title="Click to upload person profile">
                  <img v-if="profilePreview" :src="profilePreview" alt="profile preview" />
                  <div v-else class="imgEmpty">
                    <i class="fa-regular fa-image"></i>
                    <div>No profile</div>
                    <div class="imgHint">Click to upload</div>
                  </div>
                </div>

                <div v-if="errors.profileImage" class="err" style="margin-top: 10px">{{ errors.profileImage }}</div>
              </div>
            </div>

            <!-- ===================== -->
            <!-- PREVIEW -->
            <!-- ===================== -->
            <div class="previewWrap js-reveal">
              <div class="previewTop">
                <div class="previewTitle">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  Preview
                </div>

                <div class="previewPills">
                  <span class="pillSoft">
                    <i class="fa-solid fa-tag"></i>
                    {{ committeeLabel(form.committee) }}
                  </span>

                  <span class="pillSoft">
                    <i class="fa-regular fa-clock"></i>
                    {{ form.timestamp }}
                  </span>
                </div>
              </div>

              <div class="previewCard">
                <div class="leftCol">
                  <div class="logoLine">
                    <div class="logoMini">
                      <img v-if="logoPreview" :src="logoPreview" alt="logo mini" />
                      <div v-else class="logoEmpty"><i class="fa-solid fa-circle-nodes"></i></div>
                    </div>
                    <div class="bankText">
                      <div class="bankName">{{ form.bankName || "Bank name" }}</div>
                      <div class="bankRole">{{ form.role || "Role" }}</div>
                    </div>
                  </div>

                  <div class="personLine">
                    <div class="personName">{{ form.personName || "Person name" }}</div>
                    <div class="mutedSmall">
                      {{ committeeLabel(form.committee) }} • Board Director profile
                    </div>
                  </div>
                </div>

                <div class="rightCol">
                  <div class="avatar">
                    <img v-if="profilePreview" :src="profilePreview" alt="profile" />
                    <div v-else class="avatarEmpty">
                      <i class="fa-solid fa-user"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ===================== -->
            <!-- ACTIONS -->
            <!-- ===================== -->
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
                <i class="fa-solid" :class="saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'"></i>
                {{ saving ? "Saving..." : "Save Director" }}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();

const headEl = ref(null);
const cardEl = ref(null);
const actionsEl = ref(null);

const logoEl = ref(null);
const profileEl = ref(null);

const saving = ref(false);

/* ===================== */
/* COMMITTEES */
/* ===================== */
const committees = [
  { key: "ປະທານສະພາບໍລິຫານ", label: "ປະທານສະພາບໍລິຫານ", icon: "fa-solid fa-crown" },
  { key: "ຮອງປະທານສະພາບໍລິຫານ", label: "ຮອງປະທານສະພາບໍລິຫານ", icon: "fa-solid fa-chess-king" },
  { key: "ຄະນະກຳມະການກວດກາ", label: "ຄະນະກຳມະການກວດກາ", icon: "fa-solid fa-clipboard-check" },
  { key: "ຄະນະກຳມະການຄົ້ນຄວ້ານະໂຍບາຍ", label: "ຄະນະກຳມະການຄົ້ນຄວ້ານະໂຍບາຍ", icon: "fa-solid fa-building-shield" },
  { key: "ຄະນະກຳມະການຄຸ້ມຄອງຄວາມສ່ຽງ", label: "ຄະນະກຳມະການຄຸ້ມຄອງຄວາມສ່ຽງ", icon: "fa-solid fa-triangle-exclamation" },
  { key: "ຄະນະກຳມະການຕິດຕາມພັດທະນາລະບົບ", label: "ຄະນະກຳມະການຕິດຕາມພັດທະນາລະບົບ", icon: "fa-solid fa-code" },
];



const DEFAULT_COMMITTEE = committees[0]?.key || "";

function committeeLabel(key) {
  return committees.find((x) => x.key === key)?.label || key;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}
function nowTimestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(
    d.getMinutes()
  )}:${pad2(d.getSeconds())}`;
}

const form = reactive({
  committee: DEFAULT_COMMITTEE,
  bankName: "",
  personName: "",
  role: "",
  timestamp: nowTimestamp(),
  bankLogo: null,
  profileImage: null,
});

const errors = reactive({
  bankName: "",
  personName: "",
  role: "",
  bankLogo: "",
  profileImage: "",
});

const logoPreview = ref("");
const profilePreview = ref("");
let logoUrl = "";
let profileUrl = "";

function goBack() {
  router.back();
}

function setError(k, msg) {
  errors[k] = msg || "";
}

function setCommittee(key) {
  form.committee = key;
  gsap.fromTo(".committeePill", { y: 2, opacity: 0.7 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" });
}

function validate() {
  setError("bankName", form.bankName ? "" : "Bank name is required.");
  setError("personName", form.personName ? "" : "Person name is required.");
  setError("role", form.role ? "" : "Role is required.");
  setError("bankLogo", form.bankLogo ? "" : "Bank logo is required.");
  setError("profileImage", form.profileImage ? "" : "Profile image is required.");
  return !Object.values(errors).some(Boolean);
}

function revoke(u) {
  if (u) URL.revokeObjectURL(u);
}

function triggerPickLogo() {
  logoEl.value?.click();
}
function triggerPickProfile() {
  profileEl.value?.click();
}

function setLogoPreview(file) {
  revoke(logoUrl);
  logoUrl = file ? URL.createObjectURL(file) : "";
  logoPreview.value = logoUrl;
}
function setProfilePreview(file) {
  revoke(profileUrl);
  profileUrl = file ? URL.createObjectURL(file) : "";
  profilePreview.value = profileUrl;
}

function onPickLogo(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  form.bankLogo = f;
  setLogoPreview(f);
  e.target.value = "";
}
function onPickProfile(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  form.profileImage = f;
  setProfilePreview(f);
  e.target.value = "";
}

function clearLogo() {
  form.bankLogo = null;
  setLogoPreview(null);
  if (logoEl.value) logoEl.value.value = "";
}
function clearProfile() {
  form.profileImage = null;
  setProfilePreview(null);
  if (profileEl.value) profileEl.value.value = "";
}

function resetForm() {
  form.committee = DEFAULT_COMMITTEE;
  form.bankName = "";
  form.personName = "";
  form.role = "";
  form.timestamp = nowTimestamp();

  clearLogo();
  clearProfile();

  Object.keys(errors).forEach((k) => (errors[k] = ""));
}

/* ===================== */
/* ✅ API URL */
/* ===================== */
const API_BASE = import.meta.env?.VITE_API_URL || "";
const INSERT_URL = API_BASE ? `${API_BASE}/api/boarddirector` : "/api/boarddirector";

/* ✅ helper: extract inserted id from backend response (flexible) */
function extractInsertedId(payload) {
  if (!payload) return null;

  const cands = [
    payload.idboarddirector,
    payload.idBoardDirector,
    payload.id,
    payload.insertId,

    payload?.data?.idboarddirector,
    payload?.data?.idBoardDirector,
    payload?.data?.id,
    payload?.data?.insertId,

    payload?.result?.idboarddirector,
    payload?.result?.id,
    payload?.result?.insertId,

    payload?.row?.idboarddirector,
    payload?.row?.id,
  ];

  const found = cands.find((x) => x !== undefined && x !== null && String(x).trim() !== "");
  return found ?? null;
}

/* ===================== */
/* ✅ COOL TOAST HELPERS */
/* ===================== */
const toastEl = ref(null);
const toast = reactive({
  show: false,
  type: "success", // success | error
  message: "",
  persistent: false, // success = persistent (wait user action)
});
let toastTimer = null;

// callbacks for success actions
let toastOnClose = null;
let toastOnView = null;

async function showToast(type, message, opts = {}) {
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  toast.type = type;
  toast.message = message;
  toast.persistent = !!opts.persistent;
  toast.show = true;

  toastOnClose = typeof opts.onClose === "function" ? opts.onClose : null;
  toastOnView = typeof opts.onView === "function" ? opts.onView : null;

  await nextTick();

  if (toastEl.value) {
    gsap.killTweensOf(toastEl.value);
    gsap.fromTo(
      toastEl.value,
      { y: -10, x: 8, opacity: 0, scale: 0.98, filter: "blur(4px)" },
      { y: 0, x: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.28, ease: "power3.out" }
    );
  }

  // ✅ error auto-hide, success waits for user (View / Close)
  if (!toast.persistent) {
    toastTimer = setTimeout(() => hideToast(), 3000);
  }
}

function hideToast(afterFn) {
  if (!toast.show) return;

  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  const el = toastEl.value;
  if (!el) {
    toast.show = false;
    toast.persistent = false;
    afterFn?.();
    return;
  }

  gsap.killTweensOf(el);
  gsap.to(el, {
    y: -8,
    opacity: 0,
    scale: 0.985,
    duration: 0.22,
    ease: "power2.in",
    onComplete: () => {
      toast.show = false;
      toast.persistent = false;
      afterFn?.();
    },
  });
}

// ✅ success actions
function toastClose() {
  hideToast(() => {
    toastOnClose?.();
    toastOnClose = null;
    toastOnView = null;
  });
}

function toastGoView() {
  hideToast(() => {
    toastOnView?.();
    toastOnClose = null;
    toastOnView = null;
  });
}

async function onSubmit() {
  form.timestamp = nowTimestamp();

  if (!validate()) {
    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
    return;
  }

  // ✅ multipart/form-data
  const fd = new FormData();
  fd.append("committee", form.committee);
  fd.append("bankName", form.bankName);
  fd.append("role", form.role);
  fd.append("personName", form.personName);
  fd.append("timestamp", form.timestamp);

  if (form.bankLogo) fd.append("bankLogo", form.bankLogo);
  if (form.profileImage) fd.append("profileImage", form.profileImage);

  saving.value = true;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(INSERT_URL, {
      method: "POST",
      body: fd,
      signal: controller.signal,
    });

    clearTimeout(t);

    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || `Insert failed (HTTP ${res.status})`);
    }

    // ✅ get new id for highlight
    const newId = extractInsertedId(data);

    // ✅ SUCCESS: show alert with View / Close
    await showToast("success", data?.message || "Board Director saved successfully!", {
      persistent: true,
      onClose: () => {
        gsap.to(actionsEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
        resetForm();
      },
      onView: () => {
        resetForm();
        // ✅ pass highlight id to view page
        if (newId) {
          router.push({ path: "/board_directorview", query: { highlight: String(newId) } });
        } else {
          router.push("/board_directorview");
        }
      },
    });
  } catch (err) {
    const msg =
      err?.name === "AbortError"
        ? "Request timeout. Server slow or route not responding."
        : err?.message || "Something went wrong.";

    await showToast("error", msg, { persistent: false });
  } finally {
    saving.value = false;
  }
}

/* GSAP hover helpers */
function btnHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.22, ease: "power2.out" });
}
function chipHover(e, enter) {
  gsap.to(e.currentTarget, { scale: enter ? 1.02 : 1, duration: 0.18, ease: "power2.out" });
}

onMounted(() => {
  gsap.set(".js-card", { opacity: 0, y: 14, scale: 0.985 });
  gsap.set(".js-reveal", { opacity: 0, y: 10 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".js-card", { opacity: 1, y: 0, scale: 1, duration: 0.55 }, 0).to(
    ".js-reveal",
    { opacity: 1, y: 0, stagger: 0.06, duration: 0.45 },
    0.08
  );
});

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer);
  revoke(logoUrl);
  revoke(profileUrl);
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

/* ✅ Toast */
.toastWrap {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 9999;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  min-width: 320px;
  max-width: 460px;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: start;

  padding: 12px 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  position: relative;
}
.toast::before {
  content: "";
  position: absolute;
  inset: -2px;
  opacity: 0.18;
  filter: blur(14px);
  pointer-events: none;
}
.toast.success {
  border-color: rgba(34, 197, 94, 0.28);
}
.toast.success::before {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.55), rgba(56, 189, 248, 0.22), rgba(34, 197, 94, 0.55));
}
.toast.error {
  border-color: rgba(248, 113, 113, 0.28);
}
.toast.error::before {
  background: linear-gradient(90deg, rgba(248, 113, 113, 0.55), rgba(99, 102, 241, 0.18), rgba(248, 113, 113, 0.55));
}

.toastIcon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
  font-size: 18px;
}
.toast.success .toastIcon {
  color: rgba(34, 197, 94, 0.95);
}
.toast.error .toastIcon {
  color: rgba(248, 113, 113, 0.95);
}
.toastBody {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.toastTitle {
  font-weight: 1000;
  letter-spacing: 0.2px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 13px;
}
.toastText {
  color: rgba(255, 255, 255, 0.72);
  font-weight: 800;
  font-size: 12px;
  line-height: 1.35;
}

/* ✅ Toast action buttons */
.toastActions {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.toastAct {
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 900;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.toastAct.primary {
  border-color: rgba(56, 189, 248, 0.35);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(99, 102, 241, 0.14));
}
.toastAct:hover {
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}

/* Layout (sidebar removed) */
.layout {
  width: 100%;
}

/* Content */
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
@keyframes holo {
  0% { transform: translateX(-16%); }
  100% { transform: translateX(16%); }
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
.inp {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
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
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0));
  margin: 6px 0 2px;
}
.sectionTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  color: rgba(255,255,255,0.9);
  padding: 6px 0;
}

/* =========================
   COMMITTEE NAVBAR
   ========================= */
.committeeBar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  align-items: center;
}
.cBtn {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.82);
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  font-size: 12px;
  position: relative;
}
.cBtn.on {
  border-color: rgba(56, 189, 248, 0.28);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.12));
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 16px 34px rgba(56, 189, 248, 0.12);
}
.cIcon {
  width: 18px;
  display: grid;
  place-items: center;
  opacity: 0.9;
}
.cLabel {
  line-height: 1.1;
}
.cDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  margin-left: 4px;
}
.cDot.on {
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.12);
}
.committeePill {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.86);
  font-weight: 900;
  font-size: 12px;
}

/* Upload cards */
.dualUpload {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: start;
}
.upCard {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}
.upTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.upTitle {
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
.imgBox.small {
  height: 160px;
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
.btn.primary {
  border-color: rgba(56, 189, 248, 0.3);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(99, 102, 241, 0.14));
}
.btn.ghost {
  background: rgba(255, 255, 255, 0.03);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Preview */
.previewWrap {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}
.previewTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.previewTitle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
}
.previewPills {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.pillSoft {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.82);
  font-weight: 800;
  font-size: 12px;
}
.previewCard {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 12px;
  align-items: stretch;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.14);
  overflow: hidden;
}
.leftCol {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.logoLine {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logoMini {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.03);
}
.logoMini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.logoEmpty {
  color: rgba(255, 255, 255, 0.65);
}
.bankName {
  font-weight: 900;
  letter-spacing: 0.2px;
}
.bankRole {
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 800;
}
.personLine .personName {
  font-weight: 900;
  font-size: 16px;
}
.mutedSmall {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
}
.rightCol {
  display: grid;
  place-items: center;
  padding: 12px;
}
.avatar {
  width: 180px;
  height: 180px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatarEmpty {
  color: rgba(255, 255, 255, 0.7);
  font-size: 34px;
}

/* responsive */
@media (max-width: 980px) {
  .row {
    grid-template-columns: 1fr;
  }
  .dualUpload {
    grid-template-columns: 1fr;
  }
  .previewCard {
    grid-template-columns: 1fr;
  }
  .avatar {
    width: 100%;
    height: 240px;
    border-radius: 18px;
  }
  .committeePill {
    margin-left: 0;
  }
  .toast {
    min-width: 280px;
  }
}
</style>
