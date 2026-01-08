<template>
  <div ref="dashEl">
    <div class="statGrid">
      <!-- Member -->
      <div
        ref="statCardEl"
        class="statCard js-reveal clickable"
        role="button"
        tabindex="0"
        @click="goMembers"
        @keydown.enter.prevent="goMembers"
        @keydown.space.prevent="goMembers"
        @mouseenter="cardHover($event, true)"
        @mouseleave="cardHover($event, false)"
      >
        <div class="statTop">
          <div class="statIcon">
            <i class="fa-solid fa-building-columns"></i>
          </div>
          <button class="statRefresh" type="button" @click.stop="fetchMemberTotal" title="Refresh">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div class="statLabel">Total Member Bank</div>

        <div class="statValue">
          <span v-if="memberLoading" class="loadingWrap">
            <span class="spinner"></span>
            Loading...
          </span>
          <span v-else-if="memberError" class="statError">{{ memberError }}</span>
          <span v-else>{{ memberTotal }}</span>
        </div>

        <div class="statHint">
          {{ MEMBERS_API.replace(API_BASE, "") }}
        </div>
        <span class="statGlow" />
        <span class="cardSheen" />
      </div>

      <!-- News -->
      <div
        ref="newsCardEl"
        class="statCard js-reveal clickable"
        role="button"
        tabindex="0"
        @click="goNews"
        @keydown.enter.prevent="goNews"
        @keydown.space.prevent="goNews"
        @mouseenter="cardHover($event, true)"
        @mouseleave="cardHover($event, false)"
      >
        <div class="statTop">
          <div class="statIcon">
            <i class="fa-solid fa-newspaper"></i>
          </div>
          <button class="statRefresh" type="button" @click.stop="fetchNewsTotal" title="Refresh">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div class="statLabel">Total News</div>

        <div class="statValue">
          <span v-if="newsLoading" class="loadingWrap">
            <span class="spinner"></span>
            Loading...
          </span>
          <span v-else-if="newsError" class="statError">{{ newsError }}</span>
          <span v-else>{{ newsTotal }}</span>
        </div>

        <div class="statHint">
          {{ NEWS_API.replace(API_BASE, "") }}
        </div>
        <span class="statGlow" />
        <span class="cardSheen" />
      </div>

      <!-- Jobs -->
      <div
        ref="jobsCardEl"
        class="statCard js-reveal clickable"
        role="button"
        tabindex="0"
        @click="goJobs"
        @keydown.enter.prevent="goJobs"
        @keydown.space.prevent="goJobs"
        @mouseenter="cardHover($event, true)"
        @mouseleave="cardHover($event, false)"
      >
        <div class="statTop">
          <div class="statIcon">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <button class="statRefresh" type="button" @click.stop="fetchJobTotal" title="Refresh">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div class="statLabel">Total Jobs</div>

        <div class="statValue">
          <span v-if="jobLoading" class="loadingWrap">
            <span class="spinner"></span>
            Loading...
          </span>
          <span v-else-if="jobError" class="statError">{{ jobError }}</span>
          <span v-else>{{ jobTotal }}</span>
        </div>

        <div class="statHint">
          {{ JOBS_API.replace(API_BASE, "") }}
        </div>
        <span class="statGlow" />
        <span class="cardSheen" />
      </div>

      <!-- Announcement -->
      <div
        ref="announcementCardEl"
        class="statCard js-reveal clickable"
        role="button"
        tabindex="0"
        @click="goAnnouncement"
        @keydown.enter.prevent="goAnnouncement"
        @keydown.space.prevent="goAnnouncement"
        @mouseenter="cardHover($event, true)"
        @mouseleave="cardHover($event, false)"
      >
        <div class="statTop">
          <div class="statIcon">
            <i class="fa-solid fa-bullhorn"></i>
          </div>
          <button class="statRefresh" type="button" @click.stop="fetchAnnouncementTotal" title="Refresh">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div class="statLabel">Total Announcement</div>

        <div class="statValue">
          <span v-if="announcementLoading" class="loadingWrap">
            <span class="spinner"></span>
            Loading...
          </span>
          <span v-else-if="announcementError" class="statError">{{ announcementError }}</span>
          <span v-else>{{ announcementTotal }}</span>
        </div>

        <div class="statHint">
          {{ ANNOUNCE_API.replace(API_BASE, "") }}
        </div>
        <span class="statGlow" />
        <span class="cardSheen" />
      </div>

      <!-- Graph Card -->
      <div ref="chartCardEl" class="chartCard js-reveal">
        <div class="chartTop">
          <div class="chartTitle">
            <span class="chartBadge"><i class="fa-solid fa-chart-area"></i></span>
            <div class="chartTitleText">
              <div class="chartH">Posting Activity</div>
              <div class="chartSub">Overview + filter by category (7 days / 30 days / 3 months)</div>
            </div>
          </div>

          <div class="chartActions">
            <div class="segmented">
              <button
                v-for="r in ranges"
                :key="r.key"
                class="segBtn"
                type="button"
                :class="{ active: rangeKey === r.key }"
                @click="setRange(r.key)"
              >
                {{ r.label }}
              </button>
            </div>

            <button class="chartRefreshBtn" type="button" @click="refreshAll" title="Refresh all data">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        <div class="chipRow">
          <button
            v-for="c in categories"
            :key="c.key"
            class="chip"
            type="button"
            :class="[c.key, { active: categoryKey === c.key }]"
            @click="setCategory(c.key)"
          >
            <span class="chipDot"></span>
            <span class="chipText">{{ c.label }}</span>
          </button>
        </div>

        <div class="chartMeta">
          <div class="metaPill">
            <i class="fa-solid fa-calendar-days"></i>
            <span>Range:</span>
            <b>{{ rangeLabel }}</b>
          </div>

          <div class="metaPill">
            <i class="fa-solid fa-layer-group"></i>
            <span>View:</span>
            <b>{{ categoryLabel }}</b>
          </div>

          <div class="metaPill" v-if="anyLoading">
            <span class="spinner"></span>
            Loading data...
          </div>

          <div class="metaPill errorPill" v-else-if="anyError">
            <i class="fa-solid fa-triangle-exclamation"></i>
            {{ anyError }}
          </div>

          <div class="metaPill" v-else>
            <i class="fa-solid fa-signal"></i>
            <span>Total in range:</span>
            <b>{{ rangeTotal }}</b>
          </div>

          <div class="metaPill" v-if="!anyLoading && !anyError">
            <i class="fa-solid fa-chart-line"></i>
            <span>Avg / day:</span>
            <b>{{ avgPerDay }}</b>
          </div>

          <div class="metaPill subtle" v-if="!anyLoading && !anyError && unknownDateCount">
            <i class="fa-solid fa-circle-info"></i>
            <span>Items w/o date:</span>
            <b>{{ unknownDateCount }}</b>
          </div>
        </div>

        <div ref="chartWrapEl" class="chartWrap" @mouseleave="clearHover">
          <div class="chartBgNoise"></div>

          <svg class="chartSvg" viewBox="0 0 900 280" preserveAspectRatio="none" @mousemove="onChartMove" @touchmove.prevent="onChartMove">
            <defs>
              <linearGradient id="glowSweep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(56,189,248,0)" />
                <stop offset="50%" stop-color="rgba(56,189,248,0.22)" />
                <stop offset="100%" stop-color="rgba(56,189,248,0)" />
              </linearGradient>

              <linearGradient id="gradTotal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(255,255,255,0.55)" />
                <stop offset="50%" stop-color="rgba(255,255,255,0.92)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0.55)" />
              </linearGradient>

              <linearGradient id="gradBank" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(242,255,0,0.9)" />
                <stop offset="50%" stop-color="rgba(242,255,0,0.9)" />
                <stop offset="100%" stop-color="rgba(242,255,0,0.9)" />
              </linearGradient>

              <linearGradient id="gradNews" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(99,102,241,0.55)" />
                <stop offset="50%" stop-color="rgba(99,102,241,0.98)" />
                <stop offset="100%" stop-color="rgba(99,102,241,0.55)" />
              </linearGradient>
              <linearGradient id="gradJobs" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(14,165,233,0.55)" />
                <stop offset="50%" stop-color="rgba(14,165,233,0.98)" />
                <stop offset="100%" stop-color="rgba(14,165,233,0.55)" />
              </linearGradient>
              <linearGradient id="gradAnn" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(34,197,94,0.55)" />
                <stop offset="50%" stop-color="rgba(34,197,94,0.98)" />
                <stop offset="100%" stop-color="rgba(34,197,94,0.55)" />
              </linearGradient>

              <linearGradient id="areaGradActive" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" :stop-color="activeAreaTop" />
                <stop offset="100%" stop-color="rgba(56,189,248,0)" />
              </linearGradient>

              <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.4" result="b" />
                <feColorMatrix
                  in="b"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
                  result="c"
                />
                <feMerge>
                  <feMergeNode in="c" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect class="sweepGlow" x="0" y="0" width="900" height="280" />

            <g class="grid">
              <line v-for="y in 4" :key="'gy' + y" :x1="pad" :x2="900 - pad" :y1="gridY(y)" :y2="gridY(y)" />
              <line v-for="x in 6" :key="'gx' + x" :y1="pad" :y2="280 - pad" :x1="gridX(x)" :x2="gridX(x)" />
            </g>

            <g class="axisLabels">
              <text :x="pad" :y="pad + 6">{{ maxY }}</text>
              <text :x="pad" :y="gridY(2) + 6">{{ Math.round(maxY / 2) }}</text>
              <text :x="pad" :y="280 - pad + 10">0</text>
            </g>

            <g v-if="categoryKey === 'all' && !anyLoading && !anyError">
              <g class="bars">
                <g v-for="(d, i) in days" :key="'bar' + d.key">
                  <rect
                    v-for="seg in stackedRects(i)"
                    :key="seg.k"
                    class="barSeg"
                    :class="seg.k"
                    :x="seg.x"
                    :y="seg.y"
                    :width="seg.w"
                    :height="seg.h"
                    rx="10"
                    ry="10"
                  />
                  <rect
                    v-for="seg in stackedCaps(i)"
                    :key="seg.k + 'cap'"
                    class="barCap"
                    :class="seg.k"
                    :x="seg.x"
                    :y="seg.y"
                    :width="seg.w"
                    :height="seg.h"
                    rx="10"
                    ry="10"
                  />
                </g>
              </g>

              <path
                ref="totalLineEl"
                class="line total"
                :style="{ stroke: lineStrokeUrl }"
                filter="url(#softGlow)"
                :d="smoothLinePath(totalSeries)"
              />
              <circle
                v-if="hoverIdx !== null"
                class="dotHover total"
                :cx="dotX(hoverIdx)"
                :cy="dotY(totalSeries[hoverIdx]?.count ?? 0, maxY)"
                r="7"
              />
            </g>

            <g v-else-if="categoryKey !== 'all' && !anyLoading && !anyError">
              <path ref="areaEl" class="area" :d="smoothAreaPath(activeSeries)" />
              <path
                ref="lineEl"
                class="line active"
                :style="{ stroke: lineStrokeUrl }"
                filter="url(#softGlow)"
                :d="smoothLinePath(activeSeries)"
              />

              <circle
                v-if="hoverIdx !== null"
                :class="['dotHover', 'active', categoryKey]"
                :cx="dotX(hoverIdx)"
                :cy="dotY(activeSeries[hoverIdx]?.count ?? 0, maxY)"
                r="7"
              />
            </g>

            <g v-if="hoverIdx !== null && !anyLoading && !anyError" class="hoverLine">
              <line :x1="dotX(hoverIdx)" :x2="dotX(hoverIdx)" :y1="pad" :y2="280 - pad" />
            </g>

            <g class="xLabels" v-if="!anyLoading && !anyError">
              <text :x="pad" :y="280 - 6">{{ days[0]?.label }}</text>
              <text :x="900 - pad" :y="280 - 6" text-anchor="end">{{ days[days.length - 1]?.label }}</text>
            </g>
          </svg>

          <div v-if="hoverIdx !== null && !anyLoading && !anyError" class="tooltip" :style="tooltipStyle">
            <div class="tipDate">{{ days[hoverIdx]?.label }}</div>

            <div v-if="categoryKey === 'all'" class="tipRows">
              <div class="tipRow">
                <span class="tDot total"></span>
                <span class="tLabel">Total</span>
                <b class="tVal">{{ totalSeries[hoverIdx]?.count ?? 0 }}</b>
              </div>
              <div class="tipRow">
                <span class="tDot bank"></span>
                <span class="tLabel">Bank</span>
                <b class="tVal">{{ memberSeries[hoverIdx]?.count ?? 0 }}</b>
              </div>
              <div class="tipRow">
                <span class="tDot news"></span>
                <span class="tLabel">News</span>
                <b class="tVal">{{ newsSeries[hoverIdx]?.count ?? 0 }}</b>
              </div>
              <div class="tipRow">
                <span class="tDot jobs"></span>
                <span class="tLabel">Jobs</span>
                <b class="tVal">{{ jobSeries[hoverIdx]?.count ?? 0 }}</b>
              </div>
              <div class="tipRow">
                <span class="tDot announcement"></span>
                <span class="tLabel">Announcement</span>
                <b class="tVal">{{ announcementSeries[hoverIdx]?.count ?? 0 }}</b>
              </div>
            </div>

            <div v-else class="tipRows">
              <div class="tipRow">
                <span :class="['tDot', categoryKey]"></span>
                <span class="tLabel">{{ categoryLabel }}</span>
                <b class="tVal">{{ activeSeries[hoverIdx]?.count ?? 0 }}</b>
              </div>
            </div>
          </div>
        </div>

        <div class="legend">
          <div class="legItem"><span class="legDot total"></span> Total</div>
          <div class="legItem"><span class="legDot bank"></span> Bank</div>
          <div class="legItem"><span class="legDot news"></span> News</div>
          <div class="legItem"><span class="legDot jobs"></span> Jobs</div>
          <div class="legItem"><span class="legDot announcement"></span> Announcement</div>

          <div class="legHint">
            <i class="fa-solid fa-circle-info"></i>
            Hover / touch to see daily detail
          </div>
        </div>

        <span class="chartGlow" />
        <span class="cardSheen" />
      </div>


  
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const dashEl = ref(null);

function goMembers() {
  router.push("/members");
}
function goNews() {
  router.push("/news");
}
function goJobs() {
  router.push("/jobview");
}
function goAnnouncement() {
  router.push("/announcementviewer");
}

const statCardEl = ref(null);
const newsCardEl = ref(null);
const jobsCardEl = ref(null);
const announcementCardEl = ref(null);
const chartCardEl = ref(null);
const chartWrapEl = ref(null);
const calendarCardEl = ref(null);

/* API base */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const MEMBERS_API = `${API_BASE}/api/members`;
const NEWS_API = `${API_BASE}/api/news`;
const JOBS_API = `${API_BASE}/api/jobs`;
const ANNOUNCE_API = `${API_BASE}/api/announcement`;

/* Raw items */
const memberItems = ref([]);
const newsItems = ref([]);
const jobItems = ref([]);
const announcementItems = ref([]);

/* fetch helper */
async function fetchList(url, abortCtrlRef, loadingRef, errorRef, itemsRef) {
  try {
    errorRef.value = "";
    loadingRef.value = true;

    if (abortCtrlRef.value) abortCtrlRef.value.abort();
    abortCtrlRef.value = new AbortController();

    const res = await fetch(url, { signal: abortCtrlRef.value.signal });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}${txt ? ` • ${txt.slice(0, 140)}` : ""}`);
    }

    const data = await res.json();

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.members)
      ? data.members
      : Array.isArray(data?.news)
      ? data.news
      : Array.isArray(data?.jobs)
      ? data.jobs
      : Array.isArray(data?.announcement)
      ? data.announcement
      : [];

    itemsRef.value = list;
    return list;
  } catch (err) {
    if (err?.name === "AbortError") return null;
    const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1");
    errorRef.value = isLocalhost ? `Failed to load (check API_BASE / CORS)` : `Failed to load`;
    console.error("[fetchList]", url, err);
    return null;
  } finally {
    loadingRef.value = false;
  }
}

/* Members total */
const memberTotal = ref(0);
const memberLoading = ref(false);
const memberError = ref("");
const memberAbortCtrl = ref(null);

async function fetchMemberTotal() {
  const list = await fetchList(MEMBERS_API, memberAbortCtrl, memberLoading, memberError, memberItems);
  if (!list) return;
  memberTotal.value = list.length;
  if (statCardEl.value) gsap.fromTo(statCardEl.value, { y: 8 }, { y: 0, duration: 0.28, ease: "power2.out" });
}

/* News total */
const newsTotal = ref(0);
const newsLoading = ref(false);
const newsError = ref("");
const newsAbortCtrl = ref(null);

async function fetchNewsTotal() {
  const list = await fetchList(NEWS_API, newsAbortCtrl, newsLoading, newsError, newsItems);
  if (!list) return;
  newsTotal.value = list.length;
  if (newsCardEl.value) gsap.fromTo(newsCardEl.value, { y: 8 }, { y: 0, duration: 0.28, ease: "power2.out" });
}

/* Jobs total */
const jobTotal = ref(0);
const jobLoading = ref(false);
const jobError = ref("");
const jobAbortCtrl = ref(null);

async function fetchJobTotal() {
  const list = await fetchList(JOBS_API, jobAbortCtrl, jobLoading, jobError, jobItems);
  if (!list) return;
  jobTotal.value = list.length;
  if (jobsCardEl.value) gsap.fromTo(jobsCardEl.value, { y: 8 }, { y: 0, duration: 0.28, ease: "power2.out" });
}

/* Announcement total */
const announcementTotal = ref(0);
const announcementLoading = ref(false);
const announcementError = ref("");
const announcementAbortCtrl = ref(null);

async function fetchAnnouncementTotal() {
  const list = await fetchList(
    ANNOUNCE_API,
    announcementAbortCtrl,
    announcementLoading,
    announcementError,
    announcementItems
  );
  if (!list) return;
  announcementTotal.value = list.length;
  if (announcementCardEl.value) {
    gsap.fromTo(announcementCardEl.value, { y: 8 }, { y: 0, duration: 0.28, ease: "power2.out" });
  }
}

function refreshAll() {
  fetchMemberTotal();
  fetchNewsTotal();
  fetchJobTotal();
  fetchAnnouncementTotal();
}

/* Graph */
const ranges = [
  { key: "7d", label: "7D", days: 7 },
  { key: "30d", label: "30D", days: 30 },
  { key: "3m", label: "3M", days: 90 },
];

const categories = [
  { key: "all", label: "Overview" },
  { key: "bank", label: "Bank" },
  { key: "news", label: "News" },
  { key: "jobs", label: "Jobs" },
  { key: "announcement", label: "Announcement" },
];

const rangeKey = ref("7d");
const categoryKey = ref("all");

function setRange(k) {
  rangeKey.value = k;
}
function setCategory(k) {
  categoryKey.value = k;
}

const dateCache = new WeakMap();
function parseAnyDate(obj) {
  if (!obj) return null;
  if (typeof obj === "object" && dateCache.has(obj)) return dateCache.get(obj);

  const tryParse = (v) => {
    if (v === null || v === undefined) return null;

    if (typeof v === "number") {
      const ms = v > 1e12 ? v : v * 1000;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    if (typeof v === "string") {
      const s = v.trim();
      if (!s) return null;

      if (/^\d{10,13}$/.test(s)) {
        const n = Number(s);
        const ms = n > 1e12 ? n : n * 1000;
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? null : d;
      }

      const t = Date.parse(s);
      if (!Number.isNaN(t)) return new Date(t);
      return null;
    }

    return null;
  };

  const direct = tryParse(obj);
  if (direct) {
    if (typeof obj === "object") dateCache.set(obj, direct);
    return direct;
  }

  const fields = [
    "createdAt",
    "created_at",
    "created",
    "date_time",
    "dateTime",
    "date",
    "timestamp",
    "time",
    "postedAt",
    "publish_date",
    "publishedAt",
    "updatedAt",
  ];

  for (const f of fields) {
    const d = tryParse(obj?.[f]);
    if (d) {
      if (typeof obj === "object") dateCache.set(obj, d);
      return d;
    }
  }

  if (typeof obj === "object") dateCache.set(obj, null);
  return null;
}

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "short" });
function fmtLabel(d) {
  const mm = MONTH_FMT.format(d);
  return `${mm} ${d.getDate()}`;
}

function buildDays(nDays) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const out = [];
  for (let i = nDays - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    out.push({ key: toKey(d), label: fmtLabel(d), date: d });
  }
  return out;
}

function buildSeriesAgg(list, daysArr) {
  const map = new Map(daysArr.map((d) => [d.key, 0]));
  let unknown = 0;

  for (const item of list || []) {
    const dt = parseAnyDate(item);
    if (!dt) {
      unknown++;
      continue;
    }
    const day = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    const k = toKey(day);
    if (map.has(k)) map.set(k, (map.get(k) || 0) + 1);
  }

  const series = daysArr.map((d) => ({ key: d.key, label: d.label, count: map.get(d.key) || 0 }));
  return { series, unknown };
}

const rangeDays = computed(() => ranges.find((r) => r.key === rangeKey.value)?.days ?? 7);
const rangeLabel = computed(() => ranges.find((r) => r.key === rangeKey.value)?.label ?? "7D");
const categoryLabel = computed(() => categories.find((c) => c.key === categoryKey.value)?.label ?? "Overview");

const days = computed(() => buildDays(rangeDays.value));

const memberAgg = computed(() => buildSeriesAgg(memberItems.value, days.value));
const newsAgg = computed(() => buildSeriesAgg(newsItems.value, days.value));
const jobAgg = computed(() => buildSeriesAgg(jobItems.value, days.value));
const announcementAgg = computed(() => buildSeriesAgg(announcementItems.value, days.value));

const memberSeries = computed(() => memberAgg.value.series);
const newsSeries = computed(() => newsAgg.value.series);
const jobSeries = computed(() => jobAgg.value.series);
const announcementSeries = computed(() => announcementAgg.value.series);

const totalSeries = computed(() =>
  days.value.map((d, i) => ({
    key: d.key,
    label: d.label,
    count:
      (memberSeries.value[i]?.count ?? 0) +
      (newsSeries.value[i]?.count ?? 0) +
      (jobSeries.value[i]?.count ?? 0) +
      (announcementSeries.value[i]?.count ?? 0),
  }))
);

const activeSeries = computed(() => {
  switch (categoryKey.value) {
    case "bank":
      return memberSeries.value;
    case "news":
      return newsSeries.value;
    case "jobs":
      return jobSeries.value;
    case "announcement":
      return announcementSeries.value;
    default:
      return totalSeries.value;
  }
});

const anyLoading = computed(
  () => memberLoading.value || newsLoading.value || jobLoading.value || announcementLoading.value
);

const anyError = computed(() => {
  const e = memberError.value || newsError.value || jobError.value || announcementError.value;
  return e || "";
});

const unknownDateCount = computed(() => {
  if (anyLoading.value || anyError.value) return 0;
  if (categoryKey.value === "bank") return memberAgg.value.unknown;
  if (categoryKey.value === "news") return newsAgg.value.unknown;
  if (categoryKey.value === "jobs") return jobAgg.value.unknown;
  if (categoryKey.value === "announcement") return announcementAgg.value.unknown;
  return memberAgg.value.unknown + newsAgg.value.unknown + jobAgg.value.unknown + announcementAgg.value.unknown;
});

const rangeTotal = computed(() => {
  const s = categoryKey.value === "all" ? totalSeries.value : activeSeries.value;
  return s.reduce((acc, x) => acc + (x?.count ?? 0), 0);
});

const avgPerDay = computed(() => {
  const d = rangeDays.value;
  const v = d ? rangeTotal.value / d : 0;
  return v.toFixed(1);
});

/* SVG */
const pad = 26;
const W = 900;
const H = 280;

const maxY = computed(() => {
  const s = categoryKey.value === "all" ? totalSeries.value : activeSeries.value;
  const m = Math.max(1, ...s.map((x) => x.count || 0));
  if (m <= 5) return 5;
  if (m <= 10) return 10;
  if (m <= 20) return 20;
  return Math.ceil(m / 10) * 10;
});

function xFor(i, n) {
  if (n <= 1) return pad;
  const usable = W - pad * 2;
  return pad + (usable * i) / (n - 1);
}
function yFor(v, max) {
  const usable = H - pad * 2;
  const t = max ? v / max : 0;
  return H - pad - usable * t;
}
function dotX(i) {
  return xFor(i, days.value.length);
}
function dotY(v, max) {
  return yFor(v, max);
}
function gridY(step) {
  const usable = H - pad * 2;
  return pad + (usable * step) / 4;
}
function gridX(step) {
  const usable = W - pad * 2;
  return pad + (usable * step) / 6;
}

function smoothPathFromPoints(points, tension = 0.38) {
  if (points.length < 2) return "";
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function pointsFromSeries(series) {
  const s = series || [];
  const n = s.length;
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({ x: xFor(i, n), y: yFor(s[i].count || 0, maxY.value) });
  }
  return pts;
}

function smoothLinePath(series) {
  const pts = pointsFromSeries(series);
  return smoothPathFromPoints(pts, 0.9);
}

function smoothAreaPath(series) {
  const pts = pointsFromSeries(series);
  if (!pts.length) return "";
  const baseY = H - pad;
  const top = smoothPathFromPoints(pts, 0.9);
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${top} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
}

/* stacked bars */
function stackedRects(i) {
  const n = days.value.length;
  const cx = xFor(i, n);

  const usable = W - pad * 2;
  const gap = n <= 10 ? 18 : n <= 30 ? 10 : 7;
  const bw = Math.max(12, usable / n - gap);
  const x = cx - bw / 2;

  const bank = memberSeries.value[i]?.count ?? 0;
  const news = newsSeries.value[i]?.count ?? 0;
  const jobs = jobSeries.value[i]?.count ?? 0;
  const ann = announcementSeries.value[i]?.count ?? 0;

  const segs = [
    { k: "bank", v: bank },
    { k: "news", v: news },
    { k: "jobs", v: jobs },
    { k: "announcement", v: ann },
  ];

  let curY = H - pad;
  const out = [];

  for (const seg of segs) {
    if (!seg.v) continue;
    const h = (H - pad * 2) * (seg.v / maxY.value);
    curY -= h;
    out.push({ k: seg.k, x, y: curY, w: bw, h });
  }

  if (!out.length) out.push({ k: "ghost", x, y: H - pad - 2, w: bw, h: 2 });
  return out;
}

function stackedCaps(i) {
  const rects = stackedRects(i).filter((r) => r.k !== "ghost");
  if (!rects.length) return [];
  const top = rects[0];
  return [{ ...top, h: Math.min(4, top.h), y: top.y }];
}

/* tooltip hover */
const hoverIdx = ref(null);
const hoverPX = ref(0);
const hoverPY = ref(0);

function clearHover() {
  hoverIdx.value = null;
}

function onChartMove(e) {
  if (anyLoading.value || anyError.value) return;
  if (!chartWrapEl.value) return;

  const rect = chartWrapEl.value.getBoundingClientRect();
  const clientX = e.touches?.[0]?.clientX ?? e.clientX;
  const clientY = e.touches?.[0]?.clientY ?? e.clientY;

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const vx = (x / rect.width) * W;
  const n = days.value.length;
  const usable = W - pad * 2;
  const t = Math.min(1, Math.max(0, (vx - pad) / usable));
  const idx = Math.round(t * (n - 1));

  hoverIdx.value = idx;
  hoverPX.value = x;
  hoverPY.value = y;
}

const tooltipStyle = computed(() => {
  if (hoverIdx.value === null || !chartWrapEl.value) return {};
  const rect = chartWrapEl.value.getBoundingClientRect();
  const left = Math.min(rect.width - 230, Math.max(12, hoverPX.value + 14));
  const top = Math.min(rect.height - 130, Math.max(12, hoverPY.value - 18));
  return { left: `${left}px`, top: `${top}px` };
});

const lineStrokeUrl = computed(() => {
  if (categoryKey.value === "bank") return "url(#gradBank)";
  if (categoryKey.value === "news") return "url(#gradNews)";
  if (categoryKey.value === "jobs") return "url(#gradJobs)";
  if (categoryKey.value === "announcement") return "url(#gradAnn)";
  return "url(#gradTotal)";
});

const activeAreaTop = computed(() => {
  if (categoryKey.value === "bank") return "rgba(242,255,0,0.22)";
  if (categoryKey.value === "news") return "rgba(99,102,241,0.20)";
  if (categoryKey.value === "jobs") return "rgba(14,165,233,0.20)";
  if (categoryKey.value === "announcement") return "rgba(34,197,94,0.18)";
  return "rgba(255,255,255,0.12)";
});

const totalLineEl = ref(null);
const lineEl = ref(null);
const areaEl = ref(null);

function animatePath(el) {
  if (!el?.getTotalLength) return;
  const len = el.getTotalLength();
  if (!len) return;
  gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.95 });
  gsap.to(el, { strokeDashoffset: 0, duration: 0.85, ease: "power2.out" });
}

function animateBars() {
  gsap.killTweensOf(".barSeg");
  gsap.set(".barSeg", { transformOrigin: "50% 100%" });
  gsap.fromTo(
    ".barSeg",
    { scaleY: 0.2, opacity: 0.55 },
    { scaleY: 1, opacity: 0.95, duration: 0.7, stagger: 0.01, ease: "power2.out" }
  );
  gsap.fromTo(".barCap", { opacity: 0 }, { opacity: 0.95, duration: 0.4, ease: "power2.out", delay: 0.15 });
}

watch([rangeKey, categoryKey, anyLoading, anyError], async () => {
  if (anyLoading.value || anyError.value) return;

  await nextTick();

  if (chartCardEl.value) {
    gsap.fromTo(chartCardEl.value, { y: 10 }, { y: 0, duration: 0.28, ease: "power2.out" });
  }

  if (categoryKey.value === "all") {
    animateBars();
    if (totalLineEl.value) animatePath(totalLineEl.value);
  } else {
    if (areaEl.value) {
      gsap.fromTo(areaEl.value, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    }
    if (lineEl.value) animatePath(lineEl.value);
  }
});

/* Calendar */
const CAL_STORAGE_KEY = "lapnet_admin_calendar_events_v1";

const eventTypes = [
  { key: "general", label: "General" },
  { key: "bank", label: "Bank" },
  { key: "news", label: "News" },
  { key: "jobs", label: "Jobs" },
  { key: "announcement", label: "Announcement" },
];

function eventTypeLabel(k) {
  return eventTypes.find((x) => x.key === (k || "general"))?.label ?? "General";
}

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const nowCal = new Date();
const calMonth = ref(nowCal.getMonth());
const calYear = ref(nowCal.getFullYear());
const selectedDateKey = ref(toKey(nowCal));

const calEvents = ref([]);
const calLoaded = ref(false);

function loadCalendar() {
  try {
    const raw = localStorage.getItem(CAL_STORAGE_KEY);
    if (!raw) {
      calEvents.value = [];
      return;
    }
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      calEvents.value = [];
      return;
    }
    calEvents.value = data
      .filter((x) => x && typeof x === "object" && typeof x.dateKey === "string" && typeof x.title === "string")
      .slice(0, 2000);
  } catch {
    calEvents.value = [];
  }
}

function persistCalendar() {
  if (!calLoaded.value) return;
  try {
    localStorage.setItem(CAL_STORAGE_KEY, JSON.stringify(calEvents.value));
  } catch {
    // ignore
  }
}
watch(calEvents, persistCalendar, { deep: true });

const eventsByDay = computed(() => {
  const m = new Map();
  for (const ev of calEvents.value || []) {
    const dk = ev?.dateKey;
    if (!dk) continue;
    if (!m.has(dk)) m.set(dk, []);
    m.get(dk).push(ev);
  }
  return m;
});

const monthTitleFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const monthTitle = computed(() => monthTitleFmt.format(new Date(calYear.value, calMonth.value, 1)));

function prevMonth() {
  const d = new Date(calYear.value, calMonth.value - 1, 1);
  calYear.value = d.getFullYear();
  calMonth.value = d.getMonth();
  gsap.fromTo(calendarCardEl.value, { y: 8 }, { y: 0, duration: 0.22, ease: "power2.out" });
}
function nextMonth() {
  const d = new Date(calYear.value, calMonth.value + 1, 1);
  calYear.value = d.getFullYear();
  calMonth.value = d.getMonth();
  gsap.fromTo(calendarCardEl.value, { y: 8 }, { y: 0, duration: 0.22, ease: "power2.out" });
}
function goTodayCal() {
  const d = new Date();
  calYear.value = d.getFullYear();
  calMonth.value = d.getMonth();
  selectedDateKey.value = toKey(d);
}
function selectDay(key) {
  selectedDateKey.value = key;
}

const selectedDateLabelFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const selectedDateLabel = computed(() => {
  const k = selectedDateKey.value;
  if (!k || !/^\d{4}-\d{2}-\d{2}$/.test(k)) return "";
  const [y, m, d] = k.split("-").map((x) => Number(x));
  return selectedDateLabelFmt.format(new Date(y, m - 1, d));
});

const monthCells = computed(() => {
  const first = new Date(calYear.value, calMonth.value, 1);
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate();
  const start = (first.getDay() + 6) % 7; // Monday start
  const todayKey = toKey(new Date());

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - start + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push({ key: "", day: null, isToday: false, eventCount: 0, dots: [] });
      continue;
    }
    const key = toKey(new Date(calYear.value, calMonth.value, dayNum));
    const evs = eventsByDay.value.get(key) || [];
    const types = [...new Set(evs.map((e) => e?.type || "general"))].slice(0, 3);

    cells.push({
      key,
      day: dayNum,
      isToday: key === todayKey,
      eventCount: evs.length,
      dots: types,
    });
  }
  return cells;
});

const dayEvents = computed(() => {
  const list = (eventsByDay.value.get(selectedDateKey.value) || []).slice();
  return list.sort(
    (a, b) => (a.time || "99:99").localeCompare(b.time || "99:99") || (b.createdAt || 0) - (a.createdAt || 0)
  );
});

const showEventModal = ref(false);
const eventDraft = ref({ title: "", dateKey: selectedDateKey.value, time: "", type: "general" });
const eventError = ref("");

function openCreateEvent(dateKey = selectedDateKey.value) {
  eventError.value = "";
  eventDraft.value = {
    title: "",
    dateKey: dateKey || toKey(new Date()),
    time: "",
    type: "general",
  };
  showEventModal.value = true;

  nextTick(() => {
    gsap.fromTo(".calModal", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" });
  });
}

function closeEventModal() {
  showEventModal.value = false;
}

function createEvent() {
  const title = (eventDraft.value.title || "").trim();
  if (!title) {
    eventError.value = "Please enter a title.";
    return;
  }

  const dk = eventDraft.value.dateKey;
  if (!dk || !/^\d{4}-\d{2}-\d{2}$/.test(dk)) {
    eventError.value = "Invalid date.";
    return;
  }

  const ev = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    title,
    dateKey: dk,
    time: eventDraft.value.time || "",
    type: eventDraft.value.type || "general",
    createdAt: Date.now(),
  };

  calEvents.value = [ev, ...calEvents.value];
  selectedDateKey.value = dk;
  showEventModal.value = false;

  nextTick(() => {
    gsap.fromTo(".calEvent", { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out", stagger: 0.02 });
  });
}

function removeEvent(id) {
  calEvents.value = calEvents.value.filter((x) => x.id !== id);
}

/*D hovers */
function cardHover(e, enter) {
  gsap.to(e.currentTarget, { y: enter ? -3 : 0, duration: 0.22, ease: "power2.out" });
}

onMounted(() => {
  // dashboard reveal only (avoid touching App.vue .js-reveal)
  const els = dashEl.value?.querySelectorAll?.(".js-reveal") || [];
  gsap.set(els, { opacity: 0, y: 12 });
  gsap.to(els, { opacity: 1, y: 0, stagger: 0.06, duration: 0.42, ease: "power3.out" });

  loadCalendar();
  calLoaded.value = true;

  refreshAll();
  gsap.set(".tooltip", { transformOrigin: "0% 0%" });
});

onBeforeUnmount(() => {
  memberAbortCtrl.value?.abort?.();
  newsAbortCtrl.value?.abort?.();
  jobAbortCtrl.value?.abort?.();
  announcementAbortCtrl.value?.abort?.();
});
</script>

<style scoped>
/* Clickable focus */
.statCard.clickable {
  cursor: pointer;
}
.statCard.clickable:focus-visible {
  outline: none;
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.1), 0 18px 44px rgba(0, 0, 0, 0.28);
  border-color: rgba(56, 189, 248, 0.28);
}

/* Stats Grid + Cards */
.statGrid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  padding: 6px 0 14px;
}
.statCard,
.chartCard,
.calendarCard {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  padding: 14px 14px 12px;
  background: var(--glass);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
}
.statCard {
  grid-column: span 3;
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease, transform 180ms ease;
}
.statCard:hover {
  border-color: rgba(56, 189, 248, 0.2);
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 22px 56px rgba(56, 189, 248, 0.08);
  transform: translateY(-1px);
}
.statGlow {
  position: absolute;
  inset: -2px;
  pointer-events: none;
  background: radial-gradient(circle at 22% 18%, rgba(56, 189, 248, 0.18), transparent 58%),
    radial-gradient(circle at 82% 28%, rgba(99, 102, 241, 0.14), transparent 62%);
  opacity: 0.85;
  filter: blur(14px);
}
.cardSheen {
  position: absolute;
  inset: -2px;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    rgba(255, 255, 255, 0) 25%,
    rgba(255, 255, 255, 0.08) 45%,
    rgba(255, 255, 255, 0) 70%
  );
  transform: translateX(-40%);
  opacity: 0.12;
  animation: sheen 5.5s ease-in-out infinite;
}
@keyframes sheen {
  0% { transform: translateX(-60%); }
  55% { transform: translateX(60%); }
  100% { transform: translateX(60%); }
}

.statTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}
.statIcon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.14));
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
}
.statRefresh {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
}
.statRefresh:hover {
  border-color: rgba(56, 189, 248, 0.18);
  color: rgba(255, 255, 255, 0.92);
}
.statLabel {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  font-weight: 800;
  letter-spacing: 0.3px;
  position: relative;
  z-index: 1;
}
.statValue {
  margin-top: 6px;
  font-size: 30px;
  font-weight: 950;
  letter-spacing: 0.2px;
  position: relative;
  z-index: 1;
}
.statHint {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.48);
  position: relative;
  z-index: 1;
  font-weight: 850;
}
.statError {
  font-size: 14px;
  font-weight: 850;
  color: rgba(239, 68, 68, 0.95);
}

.loadingWrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.7);
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
  to { transform: rotate(360deg); }
}

/* Chart Card */
.chartCard {
  grid-column: span 12;
  background: rgba(255, 255, 255, 0.028);
  border-color: rgba(255, 255, 255, 0.08);
}
.chartGlow {
  position: absolute;
  inset: -2px;
  pointer-events: none;
  background: radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.14), transparent 58%),
    radial-gradient(circle at 82% 30%, rgba(99, 102, 241, 0.12), transparent 62%);
  opacity: 0.9;
  filter: blur(14px);
}

.chartTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.chartTitle {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.chartBadge {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.14));
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
}
.chartH {
  font-weight: 950;
  letter-spacing: 0.2px;
}
.chartSub {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 850;
}

.chartActions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.segmented {
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}
.segBtn {
  height: 32px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 950;
  cursor: pointer;
  transition: transform 140ms ease, border-color 160ms ease, background 160ms ease, color 160ms ease;
}
.segBtn:hover {
  border-color: rgba(56, 189, 248, 0.18);
  color: rgba(255, 255, 255, 0.92);
  transform: translateY(-1px);
}
.segBtn.active {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.12));
  border-color: rgba(56, 189, 248, 0.22);
  color: rgba(255, 255, 255, 0.95);
}
.chartRefreshBtn {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition: transform 140ms ease;
}
.chartRefreshBtn:hover {
  border-color: rgba(56, 189, 248, 0.18);
  color: rgba(255, 255, 255, 0.92);
  transform: translateY(-1px);
}

.chipRow {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
  z-index: 1;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.86);
  font-weight: 950;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}
.chip:hover {
  transform: translateY(-1px);
  border-color: rgba(56, 189, 248, 0.22);
  background: rgba(255, 255, 255, 0.03);
}
.chip.active {
  border-color: rgba(56, 189, 248, 0.28);
  background: rgba(56, 189, 248, 0.06);
}
.chipDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.12);
  flex: 0 0 auto;
}
.chipText {
  font-size: 12px;
  font-weight: 950;
}
.chip.bank .chipDot { background: rgba(242, 255, 0, 0.9); box-shadow: 0 0 0 6px rgba(242, 255, 0, 0.12); }
.chip.news .chipDot { background: rgba(99, 102, 241, 0.9); box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.12); }
.chip.jobs .chipDot { background: rgba(14, 165, 233, 0.9); box-shadow: 0 0 0 6px rgba(14, 165, 233, 0.12); }
.chip.announcement .chipDot { background: rgba(34, 197, 94, 0.9); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12); }
.chip.all .chipDot { background: rgba(255, 255, 255, 0.8); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.08); }

.chartMeta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
  z-index: 1;
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
.metaPill.subtle { opacity: 0.85; }
.errorPill {
  border-color: rgba(239, 68, 68, 0.25);
  color: rgba(239, 68, 68, 0.95);
}

.chartWrap {
  margin-top: 12px;
  position: relative;
  z-index: 1;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.016);
  overflow: hidden;
}
.chartBgNoise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.18;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 18px 18px;
  mask-image: radial-gradient(circle at 30% 20%, black 0%, transparent 72%);
}
.chartSvg {
  width: 100%;
  height: 300px;
  display: block;
}

.sweepGlow {
  fill: url(#glowSweep);
  opacity: 0.14;
  transform: translateX(-35%);
  animation: sweep 6.4s ease-in-out infinite;
}
@keyframes sweep {
  0% { transform: translateX(-55%); }
  60% { transform: translateX(55%); }
  100% { transform: translateX(55%); }
}

.grid line { stroke: rgba(255, 255, 255, 0.06); stroke-width: 1; }
.axisLabels text { fill: rgba(255, 255, 255, 0.35); font-size: 11px; font-weight: 850; }
.xLabels text { fill: rgba(255, 255, 255, 0.38); font-size: 11px; font-weight: 850; }

.area { fill: url(#areaGradActive); }
.line { fill: none; stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; }
.line.total { stroke-width: 2.8; opacity: 0.92; }
.hoverLine line { stroke: rgba(255, 255, 255, 0.14); stroke-width: 1; }

.dotHover { fill: rgba(255, 255, 255, 0.95); stroke: rgba(7, 14, 35, 0.95); stroke-width: 2; }
.dotHover.total { fill: rgba(255, 255, 255, 0.92); }
.dotHover.bank { fill: rgba(242, 255, 0, 0.98); }
.dotHover.news { fill: rgba(99, 102, 241, 0.98); }
.dotHover.jobs { fill: rgba(14, 165, 233, 0.98); }
.dotHover.announcement { fill: rgba(34, 197, 94, 0.98); }

.bars .barSeg {
  opacity: 0.92;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 1;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
}
.barSeg.bank { fill: rgba(242, 255, 0, 0.26); }
.barSeg.news { fill: rgba(99, 102, 241, 0.24); }
.barSeg.jobs { fill: rgba(14, 165, 233, 0.22); }
.barSeg.announcement { fill: rgba(34, 197, 94, 0.2); }
.barSeg.ghost { fill: rgba(255, 255, 255, 0.06); stroke: rgba(255, 255, 255, 0.04); filter: none; }

.barCap { opacity: 0.95; stroke: rgba(255, 255, 255, 0.08); stroke-width: 1; }
.barCap.bank { fill: rgba(242, 255, 0, 0.44); }
.barCap.news { fill: rgba(99, 102, 241, 0.4); }
.barCap.jobs { fill: rgba(14, 165, 233, 0.36); }
.barCap.announcement { fill: rgba(34, 197, 94, 0.34); }

/* tooltip */
.tooltip {
  position: absolute;
  width: 230px;
  padding: 10px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(7, 14, 35, 0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
  pointer-events: none;
  animation: tipIn 140ms ease-out;
}
@keyframes tipIn {
  from { transform: translateY(4px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
.tipDate { font-weight: 950; color: rgba(255, 255, 255, 0.92); margin-bottom: 8px; }
.tipRows { display: grid; gap: 6px; }
.tipRow {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 850;
  font-size: 12px;
}
.tDot { width: 10px; height: 10px; border-radius: 999px; }
.tDot.total { background: rgba(255, 255, 255, 0.85); }
.tDot.bank { background: rgba(242, 255, 0, 0.9); }
.tDot.news { background: rgba(99, 102, 241, 0.9); }
.tDot.jobs { background: rgba(14, 165, 233, 0.9); }
.tDot.announcement { background: rgba(34, 197, 94, 0.9); }
.tVal { color: rgba(255, 255, 255, 0.92); }

/* legend */
.legend {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: center;
  position: relative;
  z-index: 1;
}
.legItem {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 900;
  font-size: 12px;
}
.legDot { width: 10px; height: 10px; border-radius: 999px; }
.legDot.total { background: rgba(255, 255, 255, 0.85); }
.legDot.bank { background: rgba(242, 255, 0, 0.9); }
.legDot.news { background: rgba(99, 102, 241, 0.9); }
.legDot.jobs { background: rgba(14, 165, 233, 0.9); }
.legDot.announcement { background: rgba(34, 197, 94, 0.9); }
.legHint {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.58);
  font-weight: 850;
  font-size: 12px;
}

/* Calendar */
.calendarCard {
  grid-column: span 12;
  background: rgba(255, 255, 255, 0.024);
  border-color: rgba(255, 255, 255, 0.08);
}

/* (Calendar styles same asของเดิมคุณ) */
.calTop, .calTitle, .calActions, .calNav, .calMonth, .calNavBtn,
.calBtn, .calBtn.primary, .calBtn.small, .calBody, .calGridWrap, .calWeek,
.calWeekDay, .calGrid, .calCell, .calCell:hover, .calCell.empty, .calCell.selected,
.calCell.today::after, .calNum, .calDots, .calDot, .calDot.bank, .calDot.news,
.calDot.jobs, .calDot.announcement, .calDot.general, .calSide, .calSideTop,
.calSideTitle, .calEmpty, .calEvents, .calEvent, .calEventLeft, .evDot,
.evDot.bank, .evDot.news, .evDot.jobs, .evDot.announcement, .evDot.general,
.evTitle, .evMeta, .evMetaItem, .evType, .evDel, .evDel:hover, .calModalBackdrop,
.calModal, .calModalH, .calModalTitle, .calModalClose, .calModalClose:hover,
.calForm, .calRow, .calRow2, .calLabel, .calInput, .calInput:focus, .calErr,
.calModalActions {}

/* ✅ responsive (เฉพาะ dashboard) */
@media (max-width: 1100px) {
  .statCard { grid-column: span 6; }
  .legHint { margin-left: 0; width: 100%; }
}
@media (max-width: 920px) {
  .statCard { grid-column: span 12; }
  .chartActions { width: 100%; justify-content: space-between; }
  .calBody { grid-template-columns: 1fr; }
}
</style>
