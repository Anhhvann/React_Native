const express = require("express");
const router = express.Router();
const db = require("../db");

// Lấy tất cả danh mục
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Category error:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.json(results);
  });
});

module.exports = router;
