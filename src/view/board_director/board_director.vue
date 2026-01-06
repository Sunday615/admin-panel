<!-- BoardDirectorInsert.vue (UPDATED: Committee is OPTIONAL + can cancel/clear for President/Vice President) -->
<template>
  <div class="page tech">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <main class="layout">
      <!-- ===================== -->
      <!-- SIDEBAR -->
      <!-- ===================== -->
      <aside ref="sideEl" class="sidebar js-side">
        <div class="brand js-sideItem">
          <div class="brandMark">  <img src="/logolapnet/fullcircle.png " style="width: 100%; height:100%;" alt=""></div>
          <div class="brandText">
            <div class="brandName">LAPNet</div>
            <div class="brandSub">Admin Console</div>
          </div>
        </div>

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

        <button class="logout js-sideItem" type="button" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
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
            <button class="backBtn" type="button" @click="goBack" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
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
            <!-- COMMITTEE NAVBAR (OPTIONAL + CAN CLEAR) -->
            <!-- ===================== -->
            <div class="sectionTitle js-reveal">
              <i class="fa-solid fa-diagram-project"></i> Committee (Optional)
            </div>

            <div class="committeeBar js-reveal">
              <!-- No Committee / Cancel -->
              <button
                type="button"
                class="cBtn danger"
                :class="{ on: !form.committee }"
                @click="clearCommittee"
                @mouseenter="chipHover($event, true)"
                @mouseleave="chipHover($event, false)"
                title="No committee (President / Vice President)"
              >
                <span class="cIcon"><i class="fa-solid fa-ban"></i></span>
                <span class="cLabel">No Committee</span>
                <span class="cDot noneDot" :class="{ on: !form.committee }"></span>
              </button>

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

              <span class="committeePill" :class="{ empty: !form.committee }">
                <i class="fa-solid fa-tag"></i>
                {{ form.committee ? committeeLabel(form.committee) : "No committee" }}
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
                  <input v-model.trim="form.role" class="inp" type="text" placeholder="e.g. Chairman / Director / President / Vice President" />
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
                    {{ form.committee ? committeeLabel(form.committee) : "No committee" }}
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
                      {{ form.committee ? committeeLabel(form.committee) : "No committee" }} • Board Director profile
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
              <button class="btn ghost" type="button" @click="resetForm" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
                <i class="fa-solid fa-rotate-left"></i> Reset
              </button>

              <button class="btn primary" type="submit" @mouseenter="btnHover($event, true)" @mouseleave="btnHover($event, false)">
                <i class="fa-solid fa-floppy-disk"></i> Save Director
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();

const sideEl = ref(null);
const headEl = ref(null);
const cardEl = ref(null);
const actionsEl = ref(null);

const logoEl = ref(null);
const profileEl = ref(null);

const navItems = [
  { key: "dashboard", label: "ພາບລວມ", to: "/dashboard", icon: "fa-solid fa-chart-line" },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", icon: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", icon: "fa-solid fa-newspaper" },
  { key: "joblist", label: "ປະກາດຮັບສະມັກພະນັກງານ", to: "/joblist", icon: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດ", to: "/announcement", icon: "fa-solid fa-bullhorn" },
  { key: "boarddirector", label: "ເພີ່ມສະພາບໍລິຫານ", to: "/board_director", icon: "fa-solid fa-people-group" },
  { key: "lapnet", label: "ເພີ່ມພະນັກງານ LAPNet", to: "/lapnet_employee", icon: "fa-solid fa-users-rectangle" },
];

/* ===================== */
/* COMMITTEES (5)         */
/* ===================== */
const committees = [
  { key: "audit", label: "Audit Committee", icon: "fa-solid fa-clipboard-check" },
  { key: "risk", label: "Risk Committee", icon: "fa-solid fa-shield-virus" },
  { key: "hr", label: "HR Committee", icon: "fa-solid fa-user-group" },
  { key: "nomination", label: "Nomination Committee", icon: "fa-solid fa-award" },
  { key: "remuneration", label: "Remuneration Committee", icon: "fa-solid fa-coins" },
];

function committeeLabel(key) {
  return committees.find((x) => x.key === key)?.label || key;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}
function nowTimestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

const form = reactive({
  committee: "", // ✅ optional
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

function clearCommittee() {
  form.committee = "";
  gsap.fromTo(".committeePill", { y: 2, opacity: 0.7 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" });
}

function validate() {
  // ✅ committee NOT required
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
  form.committee = "";
  form.bankName = "";
  form.personName = "";
  form.role = "";
  form.timestamp = nowTimestamp();

  clearLogo();
  clearProfile();

  Object.keys(errors).forEach((k) => (errors[k] = ""));
}

function onSubmit() {
  form.timestamp = nowTimestamp();

  if (!validate()) {
    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
    return;
  }

  const payload = {
    committee: form.committee || null,
    bankName: form.bankName,
    role: form.role,
    personName: form.personName,
    timestamp: form.timestamp,
    bankLogo: form.bankLogo ? { name: form.bankLogo.name, size: form.bankLogo.size, type: form.bankLogo.type } : null,
    profileImage: form.profileImage ? { name: form.profileImage.name, size: form.profileImage.size, type: form.profileImage.type } : null,
  };

  console.log("BOARD DIRECTOR SUBMIT:", payload);

  gsap.to(actionsEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
  resetForm();
}

/* GSAP hover helpers */
function btnHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -2 : 0, duration: 0.22, ease: "power2.out" });
}
function chipHover(e, enter) {
  gsap.to(e.currentTarget, { scale: enter ? 1.02 : 1, duration: 0.18, ease: "power2.out" });
}
function navHover(e, enter) {
  const el = e.currentTarget;
  if (el.classList.contains("active")) return;
  gsap.to(el, { x: enter ? 3 : 0, duration: 0.18, ease: "power2.out" });
}

onMounted(() => {
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

.glow { position: fixed; pointer-events: none; filter: blur(52px); opacity: 0.75; }
.glow-a {
  width: 560px; height: 560px; left: -180px; top: 120px;
  background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.4), transparent 62%);
}
.glow-b {
  width: 560px; height: 560px; right: -200px; top: -160px;
  background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.34), transparent 62%);
}

/* Layout */
.layout { display: grid; grid-template-columns: 270px 1fr; gap: 14px; align-items: start; }

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
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.45), rgba(99, 102, 241, 0.22), rgba(14, 165, 233, 0.2), rgba(56, 189, 248, 0.45));
  opacity: 0.14;
  filter: blur(14px);
  pointer-events: none;
  animation: holo 7s linear infinite;
}
@keyframes holo { 0% { transform: translateX(-16%); } 100% { transform: translateX(16%); } }

.brand { display: flex; align-items: center; gap: 12px; }
.brandMark {
  width: 50px; height: 50px; border-radius: 999px;
  display: grid; place-items: center;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.5), rgba(99, 102, 241, 0.28));
  border: 1px solid #fff;
  box-shadow: 0 18px 40px rgba(56, 189, 248, 0.12);
}
.brandName { font-weight: 900; letter-spacing: 0.2px; }
.brandSub { margin-top: 2px; font-size: 12px; color: var(--muted); }

.nav { display: flex; flex-direction: column; gap: 10px; margin-top: 2px; }
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
.navIcon { width: 22px; height: 22px; display: grid; place-items: center; }
.navLabel { font-weight: 800; font-size: 13px; }
.navPill {
  position: absolute; right: 10px; top: 50%;
  transform: translateY(-50%);
  width: 10px; height: 10px; border-radius: 999px;
  background: rgba(56, 189, 248, 0);
}
.navItem.active .navPill {
  background: rgba(56, 189, 248, 0.95);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.14);
}
.spacer { flex: 1; }
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

/* Content */
.content { display: flex; flex-direction: column; gap: 14px; }

/* Header */
.head { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.headLeft { display: flex; align-items: center; gap: 12px; }
.title { font-size: 22px; font-weight: 900; letter-spacing: 0.2px; }
.sub { margin-top: 4px; font-size: 13px; color: var(--muted); }
.backBtn {
  width: 42px; height: 42px; border-radius: 14px;
  display: grid; place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.88);
  cursor: pointer;
}
.pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 12px; border-radius: 999px;
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
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.4), rgba(99, 102, 241, 0.22), rgba(14, 165, 233, 0.18), rgba(56, 189, 248, 0.4));
  opacity: 0.18;
  filter: blur(14px);
  pointer-events: none;
  animation: holo 7s linear infinite;
}
.cardTop { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.cardTitle { display: flex; align-items: center; gap: 10px; font-weight: 900; }
.cardHint { font-size: 12px; color: var(--muted); text-align: right; }

/* Form */
.form { display: flex; flex-direction: column; gap: 12px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.label > span { display: block; font-size: 12px; color: var(--muted); margin-bottom: 8px; }
.inputWrap {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}
.inputWrap i { opacity: 0.75; }
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
.err { margin-top: 8px; font-size: 12px; color: var(--danger); }

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

/* ✅ No Committee selected state */
.cBtn.danger.on {
  border-color: rgba(248, 113, 113, 0.28);
  background: linear-gradient(90deg, rgba(248, 113, 113, 0.16), rgba(56, 189, 248, 0.08));
  box-shadow: 0 16px 34px rgba(248, 113, 113, 0.10);
}

.cIcon { width: 18px; display: grid; place-items: center; opacity: 0.9; }
.cLabel { line-height: 1.1; }
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

/* ✅ red dot when "No Committee" is selected */
.noneDot.on {
  background: rgba(248, 113, 113, 0.95);
  box-shadow: 0 0 0 6px rgba(248, 113, 113, 0.12);
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
.committeePill.empty {
  color: rgba(255, 255, 255, 0.6);
}

/* Upload cards */
.dualUpload { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start; }
.upCard {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}
.upTop { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.upTitle { display: inline-flex; align-items: center; gap: 10px; font-weight: 900; }

.fileHidden { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }

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
.imgBox.small { height: 160px; }
.imgBox img { width: 100%; height: 100%; object-fit: cover; }
.imgBox.clickable { cursor: pointer; }
.imgBox.clickable:hover { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08); }
.imgEmpty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: rgba(255, 255, 255, 0.65); font-size: 12px; }
.imgHint { font-size: 12px; color: rgba(255, 255, 255, 0.55); }

/* Preview */
.previewWrap {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
}
.previewTop { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; }
.previewTitle { display: inline-flex; align-items: center; gap: 10px; font-weight: 900; }
.previewPills { display: inline-flex; gap: 10px; align-items: center; flex-wrap: wrap; }

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
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.14);
  overflow: hidden;
}
.leftCol { padding: 12px; display: flex; flex-direction: column; gap: 12px; }

.logoLine { display: flex; align-items: center; gap: 10px; }
.logoMini {
  width: 44px; height: 44px; border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.12);
  overflow: hidden;
  display: grid; place-items: center;
  background: rgba(255,255,255,0.03);
}
.logoMini img { width: 100%; height: 100%; object-fit: cover; }
.logoEmpty { color: rgba(255,255,255,0.65); }

.bankName { font-weight: 900; letter-spacing: 0.2px; }
.bankRole { margin-top: 2px; font-size: 12px; color: var(--muted); font-weight: 800; }

.personLine .personName { font-weight: 900; font-size: 16px; }
.mutedSmall { margin-top: 4px; font-size: 12px; color: var(--muted); font-weight: 700; }

.rightCol { display: grid; place-items: center; padding: 12px; }
.avatar {
  width: 180px; height: 180px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.12);
  overflow: hidden;
  background: rgba(255,255,255,0.03);
  box-shadow: 0 18px 50px rgba(0,0,0,0.35);
  display: grid; place-items: center;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatarEmpty { color: rgba(255,255,255,0.7); font-size: 34px; }

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
.actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 6px; }
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
.btn.primary { border-color: rgba(56, 189, 248, 0.3); background: linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(99, 102, 241, 0.14)); }
.btn.ghost { background: rgba(255, 255, 255, 0.03); }

/* responsive */
@media (max-width: 1100px) {
  .layout { grid-template-columns: 86px 1fr; }
  .brandText, .navLabel { display: none; }
  .sidebar { padding: 14px 10px; }
}
@media (max-width: 980px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: relative; height: auto; top: auto; }
  .row { grid-template-columns: 1fr; }
  .dualUpload { grid-template-columns: 1fr; }
  .previewCard { grid-template-columns: 1fr; }
  .avatar { width: 100%; height: 240px; border-radius: 18px; }
  .committeePill { margin-left: 0; }
}
</style>
