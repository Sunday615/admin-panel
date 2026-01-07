<template>
  <div class="page tech">
    <div class="glow glow-a"></div>
    <div class="glow glow-b"></div>

    <main class="layout">
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
          @click="logout"
          @mouseenter="btnHover($event, true)"
          @mouseleave="btnHover($event, false)"
        >
          <span class="navIcon"><i class="fa-solid fa-right-from-bracket"></i></span>
          Log Out
        </button>
      </aside>

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
              <div class="title">ເພີ່ມທະນາຄານສະມາຊິກ</div>
              <div class="sub">ເພີ່ມຂໍ້ມູນທະນາຄານສະມາຊິກໃໝ່</div>
            </div>
          </div>

          <div class="headRight js-reveal">
            <span class="pill">
              <i class="fa-solid fa-shield-halved"></i>
              Admin
            </span>
          </div>
        </header>

        <section ref="cardEl" class="card js-card">
          <div class="cardTop">
            <div class="cardTitle">
              <i class="fa-solid fa-building-columns"></i>
              Commercial Bank Information
            </div>
            <div class="cardHint"></div>
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <div class="row">
              <label class="label">
                <span>Bank Code</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-hashtag"></i>
                  <input v-model.trim="form.bankcode" class="inp" type="text" placeholder="e.g. BCEL, APB, LDB..." />
                </div>
                <div v-if="errors.bankcode" class="err">{{ errors.bankcode }}</div>
              </label>

              <label class="label">
                <span>ຊື່ທະນາຄານ (ພາສາລາວ)</span>
                <div class="inputWrap">
                  <i class="fa-solid fa-heading"></i>
                  <input v-model.trim="form.title" class="inp" type="text" placeholder="e.g. ທະນາຄານ ..." />
                </div>
                <div v-if="errors.title" class="err">{{ errors.title }}</div>
              </label>
            </div>

            <label class="label">
              <span>ຊື່ທະນາຄານ (ພາສາອັງກິດ)</span>
              <div class="inputWrap">
                <i class="fa-solid fa-heading"></i>
                <input v-model.trim="form.subtitle" class="inp" type="text" placeholder="Short description" />
              </div>
            </label>

            <div class="label">
              <span>ເລືອກສີ Gradient Theme (2 ສີ)</span>

              <div class="colorRow js-reveal">
                <div class="colorPick">
                  <div class="colorLabel">
                    <i class="fa-solid fa-droplet"></i> Color A
                  </div>
                  <div class="colorWrap">
                    <input v-model="form.gradA" class="colorInp" type="color" />
                    <input v-model.trim="form.gradA" class="hexInp inp" type="text" placeholder="#38bdf8" />
                  </div>
                </div>

                <div class="colorPick">
                  <div class="colorLabel">
                    <i class="fa-solid fa-droplet"></i> Color B
                  </div>
                  <div class="colorWrap">
                    <input v-model="form.gradB" class="colorInp" type="color" />
                    <input v-model.trim="form.gradB" class="hexInp inp" type="text" placeholder="#6366f1" />
                  </div>
                </div>

                <div class="gradSwatch" :style="gradientSwatchStyle">
                  <div class="swatchText">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Preview
                  </div>
                </div>
              </div>

              <div v-if="errors.grad" class="err">{{ errors.grad }}</div>
            </div>

            <div class="row">
              <label class="label">
                <span>Link 1 Facebook <i class="fa-brands fa-facebook"></i></span>
                <div class="inputWrap">
                  <i class="fa-solid fa-link"></i>
                  <input v-model.trim="form.link1" class="inp" type="url" placeholder="https://..." />
                </div>
                <div v-if="errors.link1" class="err">{{ errors.link1 }}</div>
              </label>

              <label class="label">
                <span>Link 2 Website <i class="fa-solid fa-globe"></i></span>
                <div class="inputWrap">
                  <i class="fa-solid fa-link"></i>
                  <input v-model.trim="form.link2" class="inp" type="url" placeholder="https://..." />
                </div>
                <div v-if="errors.link2" class="err">{{ errors.link2 }}</div>
              </label>
            </div>

            <!-- ✅ ATM -->
            <div class="label">
              <div class="labelTopRow">
                <span>ສະມາຊິກລະບົບບັດທະນາຄານຮ່ວມກັນ</span>

                <div class="labelActions">
                  <button
                    type="button"
                    class="miniAction"
                    :class="{ on: isAllSelected('atm') }"
                    @click="toggleAll('atm')"
                    @mouseenter="chipHover($event, true)"
                    @mouseleave="chipHover($event, false)"
                    :title="isAllSelected('atm') ? 'Clear all' : 'Select all'"
                  >
                    <i class="fa-solid" :class="isAllSelected('atm') ? 'fa-xmark' : 'fa-check-double'"></i>
                    {{ isAllSelected('atm') ? "Clear all" : "Select all" }}
                  </button>

                  <button
                    type="button"
                    class="miniAction ghost"
                    @click="clearAll('atm')"
                    @mouseenter="chipHover($event, true)"
                    @mouseleave="chipHover($event, false)"
                  >
                    <i class="fa-solid fa-eraser"></i>
                    Clear
                  </button>
                </div>
              </div>

              <div class="filters js-reveal">
                <button
                  v-for="opt in productOptionsATM"
                  :key="opt"
                  type="button"
                  class="fBtn"
                  :class="{ on: form.CardATM.items.includes(opt) }"
                  @click="toggleItem('atm', opt)"
                  @mouseenter="chipHover($event, true)"
                  @mouseleave="chipHover($event, false)"
                >
                  <i class="fa-solid fa-layer-group"></i>
                  {{ opt }}
                </button>
              </div>
              <div v-if="errors.filterproduct" class="err">{{ errors.filterproduct }}</div>
            </div>

            <!-- ✅ Mbbanking (✅ ADDED: Select all / Clear) -->
            <div class="label">
              <div class="labelTopRow">
                <span>ສະມາຊິກລະບົບຊຳລະຂ້າມທະນາຄານເທິງມືຖື</span>

                <div class="labelActions">
                  <button
                    type="button"
                    class="miniAction"
                    :class="{ on: isAllSelected('mobile') }"
                    @click="toggleAll('mobile')"
                    @mouseenter="chipHover($event, true)"
                    @mouseleave="chipHover($event, false)"
                    :title="isAllSelected('mobile') ? 'Clear all' : 'Select all'"
                  >
                    <i class="fa-solid" :class="isAllSelected('mobile') ? 'fa-xmark' : 'fa-check-double'"></i>
                    {{ isAllSelected('mobile') ? "Clear all" : "Select all" }}
                  </button>

                  <button
                    type="button"
                    class="miniAction ghost"
                    @click="clearAll('mobile')"
                    @mouseenter="chipHover($event, true)"
                    @mouseleave="chipHover($event, false)"
                  >
                    <i class="fa-solid fa-eraser"></i>
                    Clear
                  </button>
                </div>
              </div>

              <div class="filters js-reveal">
                <button
                  v-for="opt in productOptionsMBbaking"
                  :key="opt"
                  type="button"
                  class="fBtn"
                  :class="{ on: form.Mbbanking.items.includes(opt) }"
                  @click="toggleItem('mobile', opt)"
                  @mouseenter="chipHover($event, true)"
                  @mouseleave="chipHover($event, false)"
                >
                  <i class="fa-solid fa-layer-group"></i>
                  {{ opt }}
                </button>
              </div>
              <div v-if="errors.filterproduct" class="err">{{ errors.filterproduct }}</div>
            </div>

            <!-- ✅ Crossborder (✅ ADDED: Select all / Clear) -->
            <div class="label">
              <div class="labelTopRow">
                <span>ສະມາຊິກລະບົບຊຳລະຂ້າມແດນຜ່ານ QR CODE</span>

                <div class="labelActions">
                  <button
                    type="button"
                    class="miniAction"
                    :class="{ on: isAllSelected('crossborder') }"
                    @click="toggleAll('crossborder')"
                    @mouseenter="chipHover($event, true)"
                    @mouseleave="chipHover($event, false)"
                    :title="isAllSelected('crossborder') ? 'Clear all' : 'Select all'"
                  >
                    <i class="fa-solid" :class="isAllSelected('crossborder') ? 'fa-xmark' : 'fa-check-double'"></i>
                    {{ isAllSelected('crossborder') ? "Clear all" : "Select all" }}
                  </button>

                  <button
                    type="button"
                    class="miniAction ghost"
                    @click="clearAll('crossborder')"
                    @mouseenter="chipHover($event, true)"
                    @mouseleave="chipHover($event, false)"
                  >
                    <i class="fa-solid fa-eraser"></i>
                    Clear
                  </button>
                </div>
              </div>

              <div class="filters js-reveal">
                <button
                  v-for="opt in productOptionscrossborder"
                  :key="opt"
                  type="button"
                  class="fBtn"
                  :class="{ on: form.Crossborder.items.includes(opt) }"
                  @click="toggleItem('crossborder', opt)"
                  @mouseenter="chipHover($event, true)"
                  @mouseleave="chipHover($event, false)"
                >
                  <span v-if="crossborderFlags[opt]" class="flagPair">
                    <img class="flag" :src="flagUrl(crossborderFlags[opt][0])" :alt="crossborderFlags[opt][0]" />
                    <i class="fa-solid fa-arrow-right-long"></i>
                    <img class="flag" :src="flagUrl(crossborderFlags[opt][1])" :alt="crossborderFlags[opt][1]" />
                  </span>
                  <span class="fLabel">{{ opt }}</span>
                </button>
              </div>
              <div v-if="errors.filterproduct" class="err">{{ errors.filterproduct }}</div>
            </div>

            <div class="previewWrap js-reveal" :style="{ '--g1': form.gradA, '--g2': form.gradB }">
              <div class="previewTop">
                <div class="previewTitle">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  Preview
                </div>

                <div class="previewActions">
                  <button
                    v-if="imagePreview"
                    class="miniBtn"
                    type="button"
                    @click="clearImage"
                    @mouseenter="btnHover($event, true)"
                    @mouseleave="btnHover($event, false)"
                  >
                    <i class="fa-solid fa-trash"></i>
                    Remove
                  </button>
                </div>
              </div>

              <input ref="fileEl" class="fileHidden" type="file" accept="image/*" @change="onPickFile" />

              <div class="previewCard">
                <div class="imgBox clickable" @click="triggerPickImage" title="Click to upload image">
                  <img v-if="imagePreview" :src="imagePreview" alt="preview" />
                  <div v-else class="imgEmpty">
                    <i class="fa-regular fa-image"></i>
                    <div>No image</div>
                    <div class="imgHint">Click to upload</div>
                  </div>
                </div>

                <div class="previewMeta">
                  <div class="pTitle">{{ form.title || "ຊື່ທະນາຄານ (ພາສາລາວ)" }}</div>
                  <div class="pSub">{{ form.subtitle || "ຊື່ທະນາຄານ (ພາສາອັງກິດ)" }}</div>

                  <div class="pLinks">
                    <a v-if="form.link1" :href="form.link1" target="_blank" rel="noreferrer" class="plink">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> Link 1
                    </a>
                    <a v-if="form.link2" :href="form.link2" target="_blank" rel="noreferrer" class="plink">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> Link 2
                    </a>
                    <div v-if="!form.link1 && !form.link2" class="plink muted">
                      <i class="fa-regular fa-circle"></i> ຍັງບໍ່ມີ links
                    </div>
                  </div>

                  <div class="chips">
                    <span v-for="p in allSelectedProducts" :key="p" class="chip">
                      <template v-if="crossborderFlags[p]">
                        <span class="chipFlagPair">
                          <img class="chipFlag" :src="flagUrl(crossborderFlags[p][0])" :alt="crossborderFlags[p][0]" />
                          <i class="fa-solid fa-arrow-right-long"></i>
                          <img class="chipFlag" :src="flagUrl(crossborderFlags[p][1])" :alt="crossborderFlags[p][1]" />
                        </span>
                        <span class="chipText">{{ p }}</span>
                      </template>

                      <template v-else>
                        <i class="fa-solid fa-filter"></i>
                        {{ p }}
                      </template>
                    </span>

                    <span v-if="allSelectedProducts.length === 0" class="chip ghost">
                      <i class="fa-solid fa-filter"></i> Filterproduct
                    </span>
                  </div>

                  <div v-if="errors.image" class="err" style="margin-top: 10px">{{ errors.image }}</div>
                </div>
              </div>
            </div>

            <div ref="actionsEl" class="actions js-reveal">
              <button
                class="btn ghost"
                type="button"
                @click="resetForm"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-rotate-left"></i>
                Reset
              </button>

              <button
                class="btn primary"
                type="submit"
                :disabled="isSaving"
                @mouseenter="btnHover($event, true)"
                @mouseleave="btnHover($event, false)"
              >
                <i class="fa-solid fa-floppy-disk"></i>
                {{ isSaving ? "Saving..." : "Save" }}
              </button>
            </div>

            <div v-if="serverError" class="err">{{ serverError }}</div>
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
                      ? "ກົດປຸ່ມເພື່ອໄປໜ້າ View All Commercial Bank"
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
                {{ overlay.type === "success" ? "Go to Members" : "OK" }}
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
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";
import axios from "axios";

const api = axios.create({ baseURL: "" });

const router = useRouter();
const route = useRoute();

const sideEl = ref(null);
const headEl = ref(null);
const cardEl = ref(null);
const actionsEl = ref(null);
const fileEl = ref(null);

const isSaving = ref(false);
const serverError = ref("");

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
  nextRoute: "", // success => /members
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

  overlay.nextRoute = typeof nextRoute === "string" ? nextRoute : type === "success" ? "/members" : "";

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

  const go = overlay.nextRoute || "/members";

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: async () => {
      overlay.show = false;
      lockScroll(false);
      if (go && go !== route.fullPath) {
        try {
          await router.push(go);
        } catch {}
      }
    },
  });

  if (ovCardEl.value) tl.to(ovCardEl.value, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 }, 0);
  if (overlayEl.value) tl.to(overlayEl.value, { opacity: 0, duration: 0.16 }, 0);
}

function onKey(e) {
  if (e.key === "Escape" && overlay.show) closeOverlay();
}

const navItems = [
  { key: "dashboard", label: "ພາບລວມ", to: "/dashboard", icon: "fa-solid fa-chart-line" },
  { key: "member", label: "ເພີ່ມທະນາຄານສະມາຊິກ", to: "/memberinsert", icon: "fa-solid fa-building-columns" },
  { key: "news", label: "ເພີ່ມຂ່າວສານ ແລະ ກິດຈະກຳ", to: "/newinsert", icon: "fa-solid fa-newspaper" },
  { key: "joblist", label: "ປະກາດຮັບສະມັກພະນັກງານ", to: "/joblist", icon: "fa-solid fa-user-plus" },
  { key: "announcement", label: "ປະກາດ", to: "/announcement", icon: "fa-solid fa-bullhorn" },
  // { key: "boarddirector", label: "ເພີ່ມສະພາບໍລິຫານ", to: "/board_director", icon: "fa-solid fa-people-group" },
  // { key: "lapnet", label: "ເພີ່ມພະນັກງານ LAPNet", to: "/lapnet_employee", icon: "fa-solid fa-users-rectangle" },
];

const productOptionsATM = [
  "ກວດສອບຍອດເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM",
  "ຖອນເງິນສົດຂ້າມທະນາຄານຜ່ານຕູ້ ATM",
  "ໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM",
  "ໂອນເງິນຂ້າມທະນາຄານຜ່ານໂທລະສັບດ້ວຍເລກໜ້າບັດ",
];

const productOptionsMBbaking = [
  "ໂອນເງິນຂ້າມທະນາຄານເທິງມືຖືນຳໃຊ້ເລກບັນຊີ",
  "ໂອນເງິນຂ້າມທະນາຄານຜ່ານ QR CODE",
  "ຊຳລະຄ່າສິນຄ້າ ແລະ ບໍລິການ ໂດຍສະແກນ QR CODE",
];

const productOptionscrossborder = [
  "ກຳປູເຈຍ ສະແກນ ລາວ",
  "ລາວ ສະແກນ ກຳປູເຈຍ",
  "ໄທ ສະແກນ ລາວ",
  "ລາວ ສະແກນ ໄທ",
  "ຫວຽດນາມ ສະແກນ ລາວ",
  "ຈີນ ສະແກນ ລາວ",
];

const crossborderFlags = {
  "ກຳປູເຈຍ ສະແກນ ລາວ": ["KH", "LA"],
  "ລາວ ສະແກນ ກຳປູເຈຍ": ["LA", "KH"],
  "ໄທ ສະແກນ ລາວ": ["TH", "LA"],
  "ລາວ ສະແກນ ໄທ": ["LA", "TH"],
  "ຫວຽດນາມ ສະແກນ ລາວ": ["VN", "LA"],
  "ຈີນ ສະແກນ ລາວ": ["CN", "LA"],
};

function flagUrl(code) {
  const STYLE = "flat";
  const SIZE = 32;
  return `https://flagsapi.com/${code}/${STYLE}/${SIZE}.png`;
}

const form = reactive({
  bankcode: "",
  title: "",
  subtitle: "",
  link1: "",
  link2: "",
  image: null,

  gradA: "#38bdf8",
  gradB: "#6366f1",

  CardATM: { items: [] },
  Mbbanking: { items: [] },
  Crossborder: { items: [] },
});

const allSelectedProducts = computed(() => {
  const a = Array.isArray(form.CardATM?.items) ? form.CardATM.items : [];
  const b = Array.isArray(form.Mbbanking?.items) ? form.Mbbanking.items : [];
  const c = Array.isArray(form.Crossborder?.items) ? form.Crossborder.items : [];
  return Array.from(new Set([...a, ...b, ...c]));
});

const memberFlags = computed(() => ({
  memberATM: (form.CardATM?.items?.length || 0) > 0 ? 1 : 0,
  membermobile: (form.Mbbanking?.items?.length || 0) > 0 ? 1 : 0,
  membercrossborder: (form.Crossborder?.items?.length || 0) > 0 ? 1 : 0,
}));

/** ✅ select all helpers */
function getSectionArray(section) {
  if (section === "atm") return form.CardATM.items;
  if (section === "mobile") return form.Mbbanking.items;
  if (section === "crossborder") return form.Crossborder.items;
  return null;
}
function getSectionOptions(section) {
  if (section === "atm") return productOptionsATM;
  if (section === "mobile") return productOptionsMBbaking;
  if (section === "crossborder") return productOptionscrossborder;
  return [];
}
function isAllSelected(section) {
  const arr = getSectionArray(section);
  const opts = getSectionOptions(section);
  if (!arr || !opts.length) return false;
  return opts.every((x) => arr.includes(x));
}
function setAll(section) {
  const opts = getSectionOptions(section);
  const arr = getSectionArray(section);
  if (!arr) return;
  const next = Array.from(new Set(opts));
  if (section === "atm") form.CardATM.items = next;
  if (section === "mobile") form.Mbbanking.items = next;
  if (section === "crossborder") form.Crossborder.items = next;
}
function clearAll(section) {
  if (section === "atm") form.CardATM.items = [];
  if (section === "mobile") form.Mbbanking.items = [];
  if (section === "crossborder") form.Crossborder.items = [];
}
function toggleAll(section) {
  if (isAllSelected(section)) clearAll(section);
  else setAll(section);
}

/** ✅ preset */
function applyPresetFromRoute() {
  const q = route.query || {};
  if (q.atm === "all" || q.preset === "atmAll") {
    setAll("atm");
  }
}

const errors = reactive({
  bankcode: "",
  title: "",
  link1: "",
  link2: "",
  filterproduct: "",
  image: "",
  grad: "",
});

const imagePreview = ref("");
let lastObjectUrl = "";

function goBack() {
  router.back();
}

function logout() {
  console.log("logout");
}

function setError(key, msg) {
  errors[key] = msg || "";
}

function isValidUrl(v) {
  if (!v) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function isHexColor(v) {
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test((v || "").trim());
}

const gradientSwatchStyle = computed(() => {
  const a = isHexColor(form.gradA) ? form.gradA : "#38bdf8";
  const b = isHexColor(form.gradB) ? form.gradB : "#6366f1";
  return { background: `linear-gradient(135deg, ${a}, ${b})` };
});

function validate() {
  setError("bankcode", form.bankcode ? "" : "Bank code is required.");
  setError("title", form.title ? "" : "Title is required.");
  setError("link1", isValidUrl(form.link1) ? "" : "Link 1 must be a valid URL.");
  setError("link2", isValidUrl(form.link2) ? "" : "Link 2 must be a valid URL.");
  setError("image", "");

  if (!isHexColor(form.gradA) || !isHexColor(form.gradB)) setError("grad", "Gradient colors must be valid HEX  #38bdf8");
  else setError("grad", "");

  setError("filterproduct", "");

  return !Object.values(errors).some(Boolean);
}

function toggleItem(section, opt) {
  let arr = null;

  if (section === "atm") arr = form.CardATM.items;
  else if (section === "mobile") arr = form.Mbbanking.items;
  else if (section === "crossborder") arr = form.Crossborder.items;

  if (!arr) return;

  const idx = arr.indexOf(opt);
  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(opt);
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
  setPreviewFromFile(file);
}

function clearImage() {
  form.image = null;
  imagePreview.value = "";
  if (fileEl.value) fileEl.value.value = "";
  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = "";
  }
}

function resetForm() {
  form.bankcode = "";
  form.title = "";
  form.subtitle = "";
  form.link1 = "";
  form.link2 = "";

  form.CardATM.items = [];
  form.Mbbanking.items = [];
  form.Crossborder.items = [];

  clearImage();
  form.gradA = "#38bdf8";
  form.gradB = "#6366f1";

  Object.keys(errors).forEach((k) => (errors[k] = ""));
  serverError.value = "";
}

async function onSubmit() {
  serverError.value = "";

  if (!validate()) {
    gsap.fromTo(cardEl.value, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.45)" });
    return;
  }

  if (isSaving.value) return;
  isSaving.value = true;

  try {
    const fd = new FormData();

    fd.append("bankcode", form.bankcode);
    fd.append("title", form.title);
    fd.append("subtitle", form.subtitle || "");
    fd.append("link1", form.link1 || "");
    fd.append("link2", form.link2 || "");

    fd.append("gradA", form.gradA);
    fd.append("gradB", form.gradB);

    fd.append("CardATM", JSON.stringify({ items: form.CardATM.items || [] }));
    fd.append("Mbbanking", JSON.stringify({ items: form.Mbbanking.items || [] }));
    fd.append("Crossborder", JSON.stringify({ items: form.Crossborder.items || [] }));

    fd.append("filterproduct", JSON.stringify(allSelectedProducts.value || []));

    fd.append("memberATM", String(memberFlags.value.memberATM));
    fd.append("membermobile", String(memberFlags.value.membermobile));
    fd.append("membercrossborder", String(memberFlags.value.membercrossborder));

    if (form.image) fd.append("image", form.image);

    const { data } = await api.post("/api/members", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("INSERT OK:", data);
    console.log("SENT FLAGS:", memberFlags.value);
    console.log("SENT ITEMS:", {
      CardATM: form.CardATM.items,
      Mbbanking: form.Mbbanking.items,
      Crossborder: form.Crossborder.items,
    });

    gsap.to(actionsEl.value, { y: -2, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });

    showOverlay({
      type: "success",
      title: "ເພີ່ມຂໍ້ມູນສຳເລັດ",
      message: "ບັນທຶກຂໍ້ມູນສຳເລັດ ✅\nກົດປຸ່ມ “View All Commercial Bank” ເພື່ອໄປຫນ້າລາຍການ",
      nextRoute: "/members",
    });

    resetForm();
  } catch (e) {
    console.error("INSERT FAIL:", e);
    const msg = e?.response?.data?.message || e?.message || "Insert Failed";
    serverError.value = msg;

    showOverlay({
      type: "error",
      title: "ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ",
      message: msg,
    });
  } finally {
    isSaving.value = false;
  }
}

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
  window.addEventListener("keydown", onKey);

  applyPresetFromRoute();

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

watch(
  () => route.query,
  () => applyPresetFromRoute(),
  { deep: true }
);

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
  lockScroll(false);
});
</script>

<style scoped>
/* =========================
   TECH THEME (DARK BLUE)
   ========================= */
.page.tech {
  --bg0: #050914;
  --bg1: #070e23;
  --glass: rgba(255, 255, 255, 0.06);
  --glass2: rgba(255, 255, 255, 0.04);
  --stroke: rgba(255, 255, 255, 0.08);

  --blueA: rgba(56, 189, 248, 0.55);
  --blueB: rgba(99, 102, 241, 0.45);
  --blueC: rgba(14, 165, 233, 0.28);

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

/* grid overlay */
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

/* =========================
   LAYOUT: sidebar + content
   ========================= */
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
  position: relative;
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
  color: rgba(255, 255, 255, 0.88);
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
  position: relative;
}

/* Right content area */
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

/* Card base */
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
  letter-spacing: 0.2px;
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

/* ✅ label row actions (Select all) */
.labelTopRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.labelTopRow > span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}
.labelActions {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
}
.miniAction {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.86);
  padding: 8px 10px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  font-size: 12px;
}
.miniAction.ghost {
  background: rgba(255, 255, 255, 0.02);
}
.miniAction.on {
  border-color: rgba(56, 189, 248, 0.28);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.12));
  box-shadow: 0 16px 34px rgba(56, 189, 248, 0.12);
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

/* =========================
   GRADIENT PICKER
   ========================= */
.colorRow {
  display: grid;
  grid-template-columns: 1fr 1fr 220px;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.colorPick {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.colorLabel {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 800;
}

.colorWrap {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.colorWrap:focus-within {
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}

.colorInp {
  width: 44px;
  height: 34px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
}

.hexInp {
  font-weight: 800;
  letter-spacing: 0.2px;
}

/* swatch preview */
.gradSwatch {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  min-height: 86px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.gradSwatch::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(400px 160px at 30% 30%, rgba(255, 255, 255, 0.22), transparent 60%);
  opacity: 0.35;
  pointer-events: none;
}

.swatchText {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 900;
  font-size: 12px;
}

/* Filter buttons */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.fBtn {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.82);
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 12px;
}

.fBtn.on {
  border-color: rgba(56, 189, 248, 0.28);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.12));
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 16px 34px rgba(56, 189, 248, 0.12);
}

/* Crossborder flags */
.flagPair {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.flag {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}

.fLabel {
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
  line-height: 1.2;
}

/* Preview full width */
.previewWrap {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  --g1: #38bdf8;
  --g2: #6366f1;
  position: relative;
}

.previewWrap::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  background: radial-gradient(circle at 50% 50%, var(--g1), var(--g2)) 50% 50% /
    calc(100% - 15px) calc(100% - 15px) no-repeat;
  opacity: 0.12;
  filter: blur(14px);
  pointer-events: none;
}

.previewWrap > * {
  position: relative;
  z-index: 1;
}

.previewTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.previewTitle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
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
  font-weight: 800;
  font-size: 12px;
}

.previewCard {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  align-items: start;
}

.fileHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.imgBox {
  width: 160px;
  height: 160px;
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
  font-weight: 600;
  font-size: 14px;
}

.previewMeta .pSub {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.pLinks {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.plink {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
}

.plink.muted {
  color: rgba(255, 255, 255, 0.6);
}

.chips {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.12));
  color: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  font-weight: 500;
}

.chip.ghost {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.7);
}

.chipFlagPair {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.chipFlag {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.chipText {
  margin-left: 8px;
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

.btn.primary {
  border-color: rgba(56, 189, 248, 0.3);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(99, 102, 241, 0.14));
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.03);
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
    height: 200px;
  }
  .colorRow {
    grid-template-columns: 1fr;
  }
  .gradSwatch {
    min-height: 110px;
  }
  .ovBtn {
    width: 100%;
  }
  .labelTopRow {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
