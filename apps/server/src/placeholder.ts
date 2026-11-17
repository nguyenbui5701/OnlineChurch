export const placeholderHtml = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OnlineChurch — DEMO offline</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; background: #ebe8e1; color: #253b35; font-family: system-ui, sans-serif; }
    main { width: min(100%, 432px); min-height: 768px; aspect-ratio: 9 / 16; margin: auto; padding: 32px;
      background: #faf8f2; border: 1px solid #d4d6cc; display: flex; flex-direction: column; gap: 28px; }
    .label { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; background: #dfebdf; font-weight: 700; }
    h1 { font-family: Georgia, serif; font-size: clamp(30px, 8vw, 42px); font-weight: 400; margin: 16px 0; }
    p { line-height: 1.65; margin: 0; }
    .placeholder { flex: 1; min-height: 140px; border: 1px dashed #b5bcae; display: grid; place-content: center;
      text-align: center; padding: 20px; color: #53645b; }
    dl { display: grid; grid-template-columns: 1fr auto; gap: 12px; margin: 0; font-size: 14px; }
    dd { margin: 0; font-weight: 600; }
    nav { display: flex; flex-wrap: wrap; gap: 20px; }
    a { color: #254c3e; text-underline-offset: 4px; }
    a:focus-visible { outline: 3px solid #667a33; outline-offset: 5px; }
    footer { font-size: 12px; line-height: 1.6; color: #53645b; }
    @media (max-width: 400px) { body { padding: 12px; } main { padding: 24px; } }
  </style>
</head>
<body><main>
  <header><div class="label">OnlineChurch · Bản thử nghiệm</div><h1>Không gian mô phỏng</h1>
    <span class="badge">DEMO · Offline</span></header>
  <p><strong>DEMO — Không gian mô phỏng, không phải Thánh lễ</strong></p>
  <div class="placeholder"><p>Khung xem trước 9:16<br>Chưa có cảnh, nhân vật hoặc nến.</p></div>
  <dl><dt>Kết nối LIVE</dt><dd>Không kết nối</dd><dt>Nhân vật / nến</dt><dd>0 / 0</dd></dl>
  <nav aria-label="Kiểm tra DEMO"><a href="/overlay/">Mở canvas DEMO 2.5D</a><a href="/health">Kiểm tra hoạt động</a><a href="/api/demo/state">Xem trạng thái</a></nav>
  <footer>Đây là bản DEMO nền tảng. Hình ảnh và các hoạt động tương tác sẽ được bổ sung ở giai đoạn sau.</footer>
</main></body></html>`;
