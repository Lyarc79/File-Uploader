function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
    return `<i class="fa-solid fa-file-image"></i>`;
  if (["pdf", "doc", "docx"].includes(ext))
    return `<i class="fa-solid fa-file-lines"></i>`;
  if (["txt", "json"].includes(ext))
    return `<i class="fa-solid fa-file-code"></i>`;
  if (["csv", "xls", "xlsx"].includes(ext))
    return `<i class="fa-solid fa-file-excel"></i>`;
  if (["zip", "rar"].includes(ext))
    return `<i class="fa-solid fa-file-zipper"></i>`;
}

module.exports = { getFileIcon };
