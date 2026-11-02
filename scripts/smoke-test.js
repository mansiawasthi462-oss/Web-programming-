// End-to-end CRUD smoke test. Usage: BASE_URL=http://localhost:5000 node scripts/smoke-test.js
const BASE = process.env.BASE_URL || "http://localhost:5000";

let failed = 0;
const check = (name, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name} ${cond ? "" : extra}`);
  if (!cond) failed++;
};

const call = async (method, path, body) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch (_) {}
  return { status: res.status, json };
};

(async () => {
  const email = `smoke-${Date.now()}@example.com`;

  const created = await call("POST", "/api/students", {
    name: "Smoke Test",
    email,
    age: 20,
    course: "Web Programming",
  });
  check("POST   /api/students -> 201", created.status === 201, JSON.stringify(created));
  const id = created.json && created.json.data && created.json.data._id;
  check("created student has _id", !!id);

  const dup = await call("POST", "/api/students", { name: "Dup", email });
  check("duplicate email -> 409", dup.status === 409, JSON.stringify(dup));

  const bad = await call("POST", "/api/students", { name: "No Email" });
  check("missing email -> 400", bad.status === 400, JSON.stringify(bad));

  const list = await call("GET", "/api/students");
  check("GET    /api/students -> 200", list.status === 200);
  check("list contains created student", list.json.data.some((s) => s._id === id));

  const one = await call("GET", `/api/students/${id}`);
  check("GET    /api/students/:id -> 200", one.status === 200 && one.json.data.email === email);

  const upd = await call("PUT", `/api/students/${id}`, { course: "Full Stack Development", age: 22 });
  check(
    "PUT    /api/students/:id -> 200 and updated",
    upd.status === 200 && upd.json.data.course === "Full Stack Development" && upd.json.data.age === 22,
    JSON.stringify(upd)
  );

  const badId = await call("GET", "/api/students/not-an-id");
  check("invalid id -> 400", badId.status === 400);

  const del = await call("DELETE", `/api/students/${id}`);
  check("DELETE /api/students/:id -> 200", del.status === 200);

  const gone = await call("GET", `/api/students/${id}`);
  check("deleted student -> 404", gone.status === 404);

  console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("Smoke test crashed:", e.message);
  process.exit(1);
});
