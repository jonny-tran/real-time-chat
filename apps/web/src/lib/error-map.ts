// Map HTTP status → Vietnamese error message for Auth flows.
// Use consistent messages across pages (login/register/forgot/reset/me).

export function mapServerError(status?: number, fallback?: string): string {
  if (status === 401) return "Username hoặc mật khẩu không đúng.";
  if (status == 409) return "Username/Email đã tồn tại.";
  if (status === 400) return "Token không hợp lệ hoặc đã hết hạn.";
  if (status === 403) return "Bạn không có quyền thực hiện hành động này";
  if (status === 404) return "Không tìm thấy tài khoản";
  if (status && status >= 500) return "Lỗi server, vui lòng thử lại sau.";
  return fallback || "Có lỗi xảy ra, vui lòng thử lại sau.";
}

// Optional helper: try read BE error message if provide else map by status
export function pickErrorMessage(
  beJson: unknown,
  status?: number,
  fallback?: string
) {
  const m = (beJson as { message?: unknown })?.message;
  if (Array.isArray(m) && m.length) return m[0];
  if (typeof m === "string" && m.trim()) return m;

  return mapServerError(status, fallback);
}
