const API_MEMBERS = "http://localhost:3000/api/members";

function normalizeMember(x) {
  // พยายาม map field ให้ “ทน” ต่อชื่อคอลัมน์ต่างๆ
  return {
    id: x.id ?? x._id ?? x.member_id ?? crypto.randomUUID(),
    name:
      x.name ??
      x.bank_name ??
      x.memberbank_name ??
      x.member_name ??
      x.title ??
      "Unnamed",
    code: x.code ?? x.bank_code ?? x.swift ?? x.short_name ?? "",
    logoUrl: x.logoUrl ?? x.logo_url ?? x.logo ?? x.image ?? x.avatar ?? "",
    phone: x.phone ?? x.tel ?? x.mobile ?? "",
    email: x.email ?? "",
    address: x.address ?? x.location ?? "",
    website: x.website ?? x.web ?? "",
    raw: x, // เก็บไว้เผื่อแสดงเพิ่ม
  };
}

export async function fetchMembers() {
  const res = await fetch(API_MEMBERS, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

  const data = await res.json();

  // รองรับทั้งแบบ array และ {data:[...]}
  const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return arr.map(normalizeMember);
}
