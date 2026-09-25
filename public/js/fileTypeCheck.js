function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼";
  if (["pdf", "doc", "docx"].includes(ext)) return "📄";
  if (["txt", "json"].includes(ext)) return "📝";
  if (["csv", "xls", "xlsx"].includes(ext)) return "📊";
  if (["zip", "rar"].includes(ext)) return "📁";
}

module.exports = { getFileIcon };
