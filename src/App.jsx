import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://bfvvqwujofahaoapxkls.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "sb_publishable_E52vNK8neRHNNuU-7kwBvQ_d3v7hxPV";

const ALLOWED_DOMAIN = "vambe.ai";
const ADMIN_EMAILS = ["amparo.johnson@vambe.ai"];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_TOOLS = [
  {
    id: 1,
    name: "Project1 — Onboarding Tracker",
    description:
      "Centro de información entre cliente y onboarder. Guía al cliente a través del roadmap del proyecto, trackea el proceso de onboarding e incluye la fase de recopilación de información.",
    category: "Onboarding",
    url: "https://project1-vambe-ops.vercel.app/",
    owner_email: "tomas@vambe.ai",
    status: "active",
    created_at: "2025-01-01",
    accesses: 0,
    repo_url: "https://github.com/TomasHANNA00/Project1",
    stakeholder:
      "OBs L que quieren llevar un proceso estructurado y claro de cara al cliente",
    data_source: "Supabase",
    resources: [
      { label: "Sheet de seguimiento", url: "https://docs.google.com/spreadsheets" },
    ],
  },
];

const STATUS_LABELS = { active: "Activa", review: "En revisión", deprecated: "Deprecada" };
const STATUS_COLORS = { active: "#22c55e", review: "#f59e0b", deprecated: "#ef4444" };
const CATEGORIES = ["Todos", "Onboarding", "Analytics", "Operaciones", "Producto", "Ventas", "Flujos"];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const canSeeRepo = (tool, userEmail) =>
  !!userEmail &&
  (ADMIN_EMAILS.includes(userEmail) ||
    tool.owner_email?.toLowerCase() === userEmail.toLowerCase());

// ─── ICONS ────────────────────────────────────────────────────────────────────
function GitHubIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Avatar({ email = "", size = 30, fontSize = 13 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6366f1, #818cf8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        color: "#fff",
        fontWeight: 700,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {email[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function Badge({ status }) {
  return (
    <span
      style={{
        background: STATUS_COLORS[status] + "22",
        color: STATUS_COLORS[status],
        border: `1px solid ${STATUS_COLORS[status]}44`,
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 10px",
        letterSpacing: 0.3,
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#6366f1" : "#1e1e2e",
        color: active ? "#fff" : "#9ca3af",
        border: active ? "1px solid #6366f1" : "1px solid #2d2d3d",
        borderRadius: 99,
        padding: "5px 14px",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all .15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, color: "#6366f1", marginBottom: 16 }}>◆</div>
        <div style={{ fontSize: 14, color: "#6b7280" }}>Cargando...</div>
      </div>
    </div>
  );
}

// ─── TOOL CARD ────────────────────────────────────────────────────────────────
function ToolCard({ tool, onOpen, onAccess, isAdmin, onEdit, userEmail }) {
  const showRepo = canSeeRepo(tool, userEmail);
  return (
    <div
      style={{
        background: "#161622",
        border: "1px solid #2d2d3d",
        borderRadius: 14,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color .15s, box-shadow .15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.boxShadow = "0 0 0 1px #6366f120, 0 8px 24px #00000040";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#2d2d3d";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row: category + status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            color: "#6366f1",
            fontWeight: 600,
            background: "#6366f114",
            padding: "3px 9px",
            borderRadius: 6,
            border: "1px solid #6366f122",
          }}
        >
          {tool.category}
        </span>
        <Badge status={tool.status} />
      </div>

      {/* Name */}
      <div style={{ fontWeight: 700, fontSize: 16, color: "#f1f1f5", lineHeight: 1.3 }}>
        {tool.name}
      </div>

      {/* Description */}
      <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.65, flexGrow: 1, overflowWrap: "break-word", wordBreak: "break-word" }}>
        {tool.description}
      </div>

      {/* Data source */}
      {tool.data_source && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Datos:</span>
          <span style={{ fontSize: 11, color: "#a78bfa", background: "#6d28d914", border: "1px solid #6d28d930", borderRadius: 5, padding: "1px 7px", fontWeight: 600 }}>
            {tool.data_source}
          </span>
        </div>
      )}

      {/* Resources */}
      {tool.resources?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tool.resources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                color: "#34d399",
                background: "#059669" + "12",
                border: "1px solid #05966928",
                borderRadius: 6,
                padding: "2px 8px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background .15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#05966922")}
              onMouseLeave={e => (e.currentTarget.style.background = "#05966912")}
            >
              ↗ {r.label}
            </a>
          ))}
        </div>
      )}

      {/* Owner */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Avatar email={tool.owner_email} size={22} fontSize={10} />
        <span style={{ fontSize: 12, color: "#6b7280" }}>{tool.owner_email}</span>
      </div>

      {/* Repo link (owner/admin only) */}
      {showRepo && tool.repo_url && (
        <a
          href={tool.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#818cf8",
            background: "#6366f10e",
            border: "1px solid #6366f130",
            borderRadius: 8,
            padding: "5px 10px",
            textDecoration: "none",
            width: "fit-content",
            transition: "background .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#6366f120")}
          onMouseLeave={e => (e.currentTarget.style.background = "#6366f10e")}
        >
          <GitHubIcon size={13} /> Repositorio
          {ADMIN_EMAILS.includes(userEmail) && userEmail !== tool.owner_email && (
            <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 2 }}>(admin)</span>
          )}
        </a>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
        <button
          onClick={() => { onAccess(tool); window.open(tool.url, "_blank"); }}
          style={{
            flex: 1,
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 0",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
          onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
        >
          Abrir →
        </button>
        <button
          onClick={() => onOpen(tool)}
          style={{
            background: "#1e1e2e",
            color: "#9ca3af",
            border: "1px solid #2d2d3d",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Info
        </button>
        {isAdmin && (
          <button
            onClick={() => onEdit(tool)}
            style={{
              background: "#1e1e2e",
              color: "#9ca3af",
              border: "1px solid #2d2d3d",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ✏️
          </button>
        )}
      </div>

      <div style={{ fontSize: 11, color: "#374151" }}>{tool.accesses ?? 0} accesos totales</div>
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function Modal({ tool, onClose, accessLogs, userEmail }) {
  if (!tool) return null;
  const logs = accessLogs.filter(l => l.tool_id === tool.id).slice(0, 8);
  const showRepo = canSeeRepo(tool, userEmail);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#161622",
          border: "1px solid #2d2d3d",
          borderRadius: 18,
          padding: 32,
          width: 500,
          maxWidth: "100%",
          maxHeight: "85vh",
          overflow: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <Badge status={tool.status} />
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#6b7280", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        <div style={{ fontWeight: 800, fontSize: 21, color: "#f1f1f5", marginBottom: 10, lineHeight: 1.3 }}>
          {tool.name}
        </div>
        <div style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7, marginBottom: 18 }}>
          {tool.description}
        </div>

        {tool.stakeholder && (
          <div style={{ background: "#1e1e2e", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Usuario objetivo
            </div>
            <div style={{ fontSize: 13, color: "#e5e7eb" }}>{tool.stakeholder}</div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            ["Categoría", tool.category],
            ["Owner", tool.owner_email],
            ["Creada", tool.created_at],
            ["Accesos", tool.accesses ?? 0],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "#1e1e2e", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
              <div style={{ fontSize: 13, color: "#e5e7eb", fontWeight: 600, wordBreak: "break-word" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Data source */}
        {tool.data_source && (
          <div style={{ background: "#1e1e2e", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Origen de datos
            </div>
            <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>{tool.data_source}</span>
          </div>
        )}

        {/* Resources */}
        {tool.resources?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
              Recursos
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tool.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#34d399",
                    background: "#05966910",
                    border: "1px solid #05966928",
                    borderRadius: 8,
                    padding: "9px 14px",
                    textDecoration: "none",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#05966920")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#05966910")}
                >
                  <span style={{ fontSize: 14 }}>↗</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1, wordBreak: "break-all" }}>{r.url}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {showRepo && tool.repo_url && (
          <a
            href={tool.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "#818cf8",
              background: "#6366f10e",
              border: "1px solid #6366f130",
              borderRadius: 10,
              padding: "12px 16px",
              textDecoration: "none",
              marginBottom: 18,
            }}
          >
            <GitHubIcon size={16} />
            <div>
              <div style={{ fontWeight: 600 }}>Repositorio GitHub</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, wordBreak: "break-all" }}>
                {tool.repo_url}
              </div>
            </div>
          </a>
        )}

        {logs.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Últimos accesos
            </div>
            {logs.map((l, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #1e1e2e",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#e5e7eb" }}>{l.user_email}</span>
                <span style={{ color: "#6b7280" }}>
                  {new Date(l.accessed_at).toLocaleString("es-CL")}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── EDIT / CREATE MODAL ──────────────────────────────────────────────────────
const FIELD_DEFS = [
  ["Nombre", "name", "text"],
  ["URL de la app", "url", "text"],
  ["Owner email", "owner_email", "email"],
  ["Repo GitHub (solo visible para owner y admins)", "repo_url", "text"],
  ["Usuario objetivo / Stakeholder", "stakeholder", "text"],
];

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "Onboarding",
  url: "",
  owner_email: "",
  status: "active",
  repo_url: "",
  stakeholder: "",
  data_source: "",
  resources: [],
};

const TOOL_CATEGORIES = ["Onboarding", "Analytics", "Operaciones", "Producto", "Ventas", "Flujos"];

function EditModal({ tool, onClose, onSave }) {
  const [form, setForm] = useState(tool ?? EMPTY_FORM);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addResource = () =>
    setForm(p => ({ ...p, resources: [...(p.resources ?? []), { label: "", url: "" }] }));
  const removeResource = (i) =>
    setForm(p => ({ ...p, resources: p.resources.filter((_, idx) => idx !== i) }));
  const setResource = (i, field, value) =>
    setForm(p => ({
      ...p,
      resources: p.resources.map((r, idx) => idx === i ? { ...r, [field]: value } : r),
    }));

  const inputStyle = {
    width: "100%",
    background: "#0f0f1a",
    border: "1px solid #2d2d3d",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#f1f1f5",
    fontSize: 14,
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#161622",
          border: "1px solid #2d2d3d",
          borderRadius: 18,
          padding: 32,
          width: 520,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 800, fontSize: 18, color: "#f1f1f5", marginBottom: 22 }}>
          {tool?.id ? "Editar herramienta" : "Nueva herramienta"}
        </div>

        {FIELD_DEFS.map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>{label}</div>
            <input
              type={type}
              value={form[key] ?? ""}
              onChange={e => set(key, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>Descripción</div>
          <textarea
            value={form.description ?? ""}
            onChange={e => set("description", e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>Origen de datos</div>
          <input
            type="text"
            placeholder="ej: Supabase, Google Sheets, HubSpot, n8n..."
            value={form.data_source ?? ""}
            onChange={e => set("data_source", e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Resources */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Recursos / Links</div>
            <button
              onClick={addResource}
              style={{ background: "#1e1e2e", color: "#6366f1", border: "1px solid #6366f130", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
            >
              + Agregar
            </button>
          </div>
          {(form.resources ?? []).length === 0 && (
            <div style={{ fontSize: 12, color: "#4b5563", fontStyle: "italic" }}>Sin recursos añadidos.</div>
          )}
          {(form.resources ?? []).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
              <input
                placeholder="Nombre del link"
                value={r.label}
                onChange={e => setResource(i, "label", e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                placeholder="https://..."
                value={r.url}
                onChange={e => setResource(i, "url", e.target.value)}
                style={{ ...inputStyle, flex: 2 }}
              />
              <button
                onClick={() => removeResource(i)}
                style={{ background: "none", border: "none", color: "#6b7280", fontSize: 18, cursor: "pointer", flexShrink: 0, padding: "0 4px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>Categoría</div>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
              style={inputStyle}
            >
              {TOOL_CATEGORIES.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 5 }}>Estado</div>
            <select
              value={form.status}
              onChange={e => set("status", e.target.value)}
              style={inputStyle}
            >
              <option value="active">Activa</option>
              <option value="review">En revisión</option>
              <option value="deprecated">Deprecada</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => onSave(form)}
            style={{
              flex: 1,
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 0",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {tool?.id ? "Guardar cambios" : "Crear herramienta"}
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#1e1e2e",
              color: "#9ca3af",
              border: "1px solid #2d2d3d",
              borderRadius: 8,
              padding: "11px 18px",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS VIEW ───────────────────────────────────────────────────────────
function AnalyticsView({ tools }) {
  const sorted = [...tools].sort((a, b) => (b.accesses ?? 0) - (a.accesses ?? 0));
  const total = tools.reduce((s, t) => s + (t.accesses ?? 0), 0);
  const active = tools.filter(t => t.status === "active").length;
  const zombies = tools.filter(t => (t.accesses ?? 0) < 10);
  const maxAccesses = sorted[0]?.accesses || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        {[
          ["Total accesos", total, "#6366f1"],
          ["Apps activas", active, "#22c55e"],
          ["Apps zombies 🧟", zombies.length, "#ef4444"],
        ].map(([label, val, color]) => (
          <div
            key={label}
            style={{
              background: "#161622",
              border: `1px solid ${color}30`,
              borderRadius: 14,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 38, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: "#161622", border: "1px solid #2d2d3d", borderRadius: 14, padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f1f5", marginBottom: 22 }}>
          Accesos por herramienta
        </div>
        {sorted.map(t => (
          <div key={t.id} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#e5e7eb" }}>{t.name}</span>
              <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>
                {t.accesses ?? 0}
              </span>
            </div>
            <div style={{ background: "#1e1e2e", borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div
                style={{
                  background: "linear-gradient(90deg, #6366f1, #818cf8)",
                  borderRadius: 99,
                  height: "100%",
                  width: `${((t.accesses ?? 0) / maxAccesses) * 100}%`,
                  transition: "width .6s ease",
                  minWidth: (t.accesses ?? 0) > 0 ? 6 : 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Zombies */}
      {zombies.length > 0 && (
        <div style={{ background: "#161622", border: "1px solid #ef444430", borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#ef4444", marginBottom: 4 }}>
            ⚠️ Apps candidatas a revisar
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>
            Menos de 10 accesos totales
          </div>
          {zombies.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: i < zombies.length - 1 ? "1px solid #1e1e2e" : "none",
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: "#e5e7eb" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{t.owner_email}</div>
              </div>
              <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>
                {t.accesses ?? 0} accesos
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, loading, error }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 36,
        padding: 24,
      }}
    >
      {/* Branding */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            borderRadius: 18,
            fontSize: 30,
            color: "#fff",
            marginBottom: 18,
            boxShadow: "0 8px 32px #6366f140",
          }}
        >
          ◆
        </div>
        <div style={{ fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: -0.5 }}>
          Vambe Tool Hub
        </div>
        <div style={{ color: "#6b7280", fontSize: 15, marginTop: 8 }}>
          Portal interno de herramientas del equipo
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#161622",
          border: "1px solid #2d2d3d",
          borderRadius: 20,
          padding: "36px 32px",
          width: 380,
          maxWidth: "100%",
          textAlign: "center",
        }}
      >
        {error && (
          <div
            style={{
              background: "#ef444414",
              border: "1px solid #ef444430",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: 13,
              color: "#ef4444",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={onLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#2d2d3d" : "#fff",
            color: "#111",
            border: "none",
            borderRadius: 11,
            padding: "13px 0",
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: loading ? 0.6 : 1,
            transition: "background .15s, opacity .15s",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#f0f0f0"; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#fff"; }}
        >
          <GoogleIcon />
          {loading ? "Redirigiendo..." : "Continuar con Google"}
        </button>

        <div style={{ fontSize: 12, color: "#4b5563", marginTop: 16, lineHeight: 1.5 }}>
          Acceso exclusivo para cuentas <strong style={{ color: "#6b7280" }}>@vambe.ai</strong>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState("loading");
  const [authError, setAuthError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [tools, setTools] = useState([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [accessLogs, setAccessLogs] = useState([]);
  const [view, setView] = useState("hub");
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [editTool, setEditTool] = useState(null);
  const [showNewTool, setShowNewTool] = useState(false);

  const handleSession = useCallback((session) => {
    if (!session) {
      setUser(null);
      setAuthState("unauthenticated");
      return;
    }
    const email = session.user.email ?? "";
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      supabase.auth.signOut();
      setAuthError(`Solo cuentas @${ALLOWED_DOMAIN} pueden acceder. Intentaste con: ${email}`);
      setAuthState("unauthorized");
      return;
    }
    setUser({
      email,
      name: session.user.user_metadata?.full_name ?? email.split("@")[0],
    });
    setAuthState("authenticated");
    setAuthError(null);
  }, []);

  const loadTools = useCallback(async () => {
    setToolsLoading(true);
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setTools(data ?? []);
    setToolsLoading(false);
  }, []);

  const loadAccessLogs = useCallback(async () => {
    const { data } = await supabase
      .from("tool_access_logs")
      .select("*")
      .order("accessed_at", { ascending: false })
      .limit(200);
    setAccessLogs(data ?? []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSession]);

  useEffect(() => {
    if (authState === "authenticated") {
      loadTools();
      loadAccessLogs();
    }
  }, [authState, loadTools, loadAccessLogs]);

  const handleLogin = async () => {
    setLoginLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: { hd: ALLOWED_DOMAIN },
      },
    });
    if (error) {
      setAuthError(error.message);
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthState("unauthenticated");
    setAuthError(null);
  };

  const logAccess = useCallback(async (tool) => {
    if (!user) return;
    const newCount = (tool.accesses ?? 0) + 1;
    // Optimistic update
    setTools(prev => prev.map(t => t.id === tool.id ? { ...t, accesses: newCount } : t));
    setAccessLogs(prev => [
      { tool_id: tool.id, user_email: user.email, accessed_at: new Date().toISOString() },
      ...prev,
    ]);
    await Promise.all([
      supabase.from("tool_access_logs").insert({ tool_id: tool.id, user_email: user.email }),
      supabase.from("tools").update({ accesses: newCount }).eq("id", tool.id),
    ]);
  }, [user]);

  const handleSave = async (form) => {
    if (form.id) {
      const { id, accesses, ...fields } = form;
      await supabase.from("tools").update(fields).eq("id", id);
    } else {
      await supabase.from("tools").insert({
        ...form,
        accesses: 0,
        created_at: new Date().toISOString().slice(0, 10),
      });
    }
    await loadTools();
    setEditTool(null);
    setShowNewTool(false);
  };

  const handleArchive = async (tool) => {
    await supabase.from("tools").update({ status: "deprecated" }).eq("id", tool.id);
    setTools(prev => prev.map(t => t.id === tool.id ? { ...t, status: "deprecated" } : t));
  };

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email);

  const filtered = tools.filter(
    t =>
      (category === "Todos" || t.category === category) &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Auth guards ──
  if (authState === "loading") return <Spinner />;
  if (authState !== "authenticated") {
    return <LoginScreen onLogin={handleLogin} loading={loginLoading} error={authError} />;
  }

  // ── Navigation ──
  const navItems = [
    { id: "hub", label: "Herramientas" },
    { id: "analytics", label: "Analytics" },
    ...(isAdmin ? [{ id: "admin", label: "Admin" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", color: "#f1f1f5", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <header
        style={{
          borderBottom: "1px solid #1e1e2e",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          height: 60,
          gap: 4,
          position: "sticky",
          top: 0,
          background: "#0f0f1aee",
          backdropFilter: "blur(12px)",
          zIndex: 40,
        }}
      >
        {/* Logo */}
        <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: -0.3, marginRight: 20, whiteSpace: "nowrap" }}>
          <span style={{ color: "#6366f1" }}>◆</span> Vambe Tool Hub
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                background: "none",
                border: "none",
                color: view === item.id ? "#6366f1" : "#9ca3af",
                fontWeight: view === item.id ? 700 : 400,
                fontSize: 14,
                cursor: "pointer",
                padding: "0 14px",
                height: 60,
                borderBottom: view === item.id ? "2px solid #6366f1" : "2px solid transparent",
                transition: "color .15s",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
          <Avatar email={user.email} size={30} fontSize={12} />
          <span style={{ fontSize: 13, color: "#6b7280", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid #2d2d3d",
              color: "#6b7280",
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
              marginLeft: 4,
              whiteSpace: "nowrap",
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ padding: "32px 24px", maxWidth: 1140, margin: "0 auto" }}>
        {/* HUB */}
        {view === "hub" && (
          <>
            <div style={{ marginBottom: 26 }}>
              <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 4 }}>Herramientas internas</h1>
              <p style={{ color: "#9ca3af", fontSize: 14 }}>
                {tools.filter(t => t.status === "active").length} activas · {tools.length} en total
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar herramienta..."
                style={{
                  background: "#161622",
                  border: "1px solid #2d2d3d",
                  borderRadius: 10,
                  padding: "9px 16px",
                  color: "#f1f1f5",
                  fontSize: 14,
                  width: 240,
                }}
              />
              {CATEGORIES.map(c => (
                <CategoryPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>

            {toolsLoading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#4b5563" }}>
                <div style={{ fontSize: 28, color: "#6366f1", marginBottom: 12 }}>◆</div>
                <div style={{ fontSize: 14 }}>Cargando herramientas...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#4b5563" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 15 }}>No se encontraron herramientas</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
                {filtered.map(t => (
                  <ToolCard
                    key={t.id}
                    tool={t}
                    onOpen={setSelectedTool}
                    onAccess={logAccess}
                    isAdmin={isAdmin}
                    onEdit={setEditTool}
                    userEmail={user.email}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ANALYTICS */}
        {view === "analytics" && (
          <>
            <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 28 }}>Analytics</h1>
            <AnalyticsView tools={tools} />
          </>
        )}

        {/* ADMIN */}
        {view === "admin" && isAdmin && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h1 style={{ fontWeight: 800, fontSize: 26 }}>Administración</h1>
              <button
                onClick={() => setShowNewTool(true)}
                style={{
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                + Nueva herramienta
              </button>
            </div>

            <div style={{ background: "#161622", border: "1px solid #2d2d3d", borderRadius: 14, overflow: "hidden" }}>
              {tools.length === 0 && (
                <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
                  No hay herramientas aún
                </div>
              )}
              {tools.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "14px 20px",
                    gap: 16,
                    borderBottom: i < tools.length - 1 ? "1px solid #1e1e2e" : "none",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#f1f1f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
                      {t.owner_email} · {t.accesses ?? 0} accesos
                    </div>
                  </div>
                  <Badge status={t.status} />
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setEditTool(t)}
                      style={{
                        background: "#1e1e2e",
                        color: "#9ca3af",
                        border: "1px solid #2d2d3d",
                        borderRadius: 8,
                        padding: "6px 14px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    {t.status !== "deprecated" && (
                      <button
                        onClick={() => handleArchive(t)}
                        style={{
                          background: "#1e1e2e",
                          color: "#ef4444",
                          border: "1px solid #ef444430",
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        Archivar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Modals ── */}
      {selectedTool && (
        <Modal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          accessLogs={accessLogs}
          userEmail={user.email}
        />
      )}
      {editTool && (
        <EditModal tool={editTool} onClose={() => setEditTool(null)} onSave={handleSave} />
      )}
      {showNewTool && (
        <EditModal tool={null} onClose={() => setShowNewTool(false)} onSave={handleSave} />
      )}
    </div>
  );
}
