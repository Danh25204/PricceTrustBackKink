import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { campaignsApi } from "@/api/campaigns";
import { wpSitesApi } from "@/api/wp_sites";
import type { Campaign, BacklinkTask, BulkImportCampaignResult, PublishedLinkItem } from "@/types/campaign";
import type { WpSite } from "@/types/wp_site";

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const campaignId = Number(id);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tasks, setTasks] = useState<BacklinkTask[]>([]);
  const [sites, setSites] = useState<WpSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [importMode, setImportMode] = useState<"text" | "file">("text");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportCampaignResult | null>(null);
  const [importText, setImportText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [previewTask, setPreviewTask] = useState<BacklinkTask | null>(null);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [publishingAll, setPublishingAll] = useState(false);
  const [publishMsg, setPublishMsg] = useState<string | null>(null);
  const [checkingAnchorId, setCheckingAnchorId] = useState<number | null>(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkGenMsg, setBulkGenMsg] = useState<string | null>(null);
  const [campaignLanguage, setCampaignLanguage] = useState("vi");
  const [settingLanguage, setSettingLanguage] = useState(false);
  const [nicheMode, setNicheMode] = useState<"casino" | "custom">("casino");
  const [nicheCustom, setNicheCustom] = useState("");
  const [savingNiche, setSavingNiche] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [publishedLinks, setPublishedLinks] = useState<PublishedLinkItem[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [linksCopied, setLinksCopied] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const introImageRef = useRef<HTMLInputElement>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [camp, taskList, siteListResponse] = await Promise.all([
        campaignsApi.get(campaignId),
        campaignsApi.getTasks(campaignId),
        wpSitesApi.list(1, 9999),
      ]);
      setCampaign(camp);
      setTasks(taskList);
      setSites(siteListResponse.items.filter((s) => s.is_active));
      if (camp.niche === "casino" || camp.niche === null) {
        setNicheMode("casino");
      } else {
        setNicheMode("custom");
        setNicheCustom(camp.niche ?? "");
      }
      if (taskList.length > 0) setCampaignLanguage(taskList[0].language ?? "vi");
    } catch {
      setError("Không thể tải dữ liệu campaign.");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const hasProcessing = tasks.some((t) => t.status === "processing");
    if (!hasProcessing) return;
    const timer = setInterval(() => { fetchAll(); }, 5000);
    return () => clearInterval(timer);
  }, [tasks, fetchAll]);

  const handleStatusChange = async (newStatus: Campaign["status"]) => {
    if (!campaign) return;
    setError(null);
    try {
      const updated = await campaignsApi.update(campaignId, { status: newStatus });
      setCampaign(updated);
    } catch {
      setError("Cập nhật trạng thái thất bại.");
    }
  };

  const handleNicheSave = async () => {
    const niche = nicheMode === "casino" ? "casino" : nicheCustom.trim() || null;
    setSavingNiche(true);
    setError(null);
    try {
      const updated = await campaignsApi.update(campaignId, { niche: niche ?? undefined });
      setCampaign(updated);
    } catch {
      setError("Lưu chủ đề thất bại.");
    } finally {
      setSavingNiche(false);
    }
  };

  const handleAssignSite = async (taskId: number, wpSiteId: number | null) => {
    setAssigningId(taskId);
    setError(null);
    try {
      const updated = await campaignsApi.updateTask(campaignId, taskId, { wp_site_id: wpSiteId });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch {
      setError("Gán site thất bại.");
    } finally {
      setAssigningId(null);
    }
  };

  const handleBulkSetLanguage = async (lang: string) => {
    setCampaignLanguage(lang);
    if (tasks.length === 0) return;
    setSettingLanguage(true);
    setError(null);
    try {
      await campaignsApi.bulkSetLanguage(campaignId, lang);
      setTasks((prev) => prev.map((t) => ({ ...t, language: lang })));
    } catch {
      setError("Thay đổi ngôn ngữ thất bại.");
    } finally {
      setSettingLanguage(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Xóa task này?")) return;
    setError(null);
    try {
      await campaignsApi.deleteTask(campaignId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch {
      setError("Xóa task thất bại.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    setError(null);
    try {
      const result = await campaignsApi.bulkImport(campaignId, file);
      setImportResult(result);
      const taskList = await campaignsApi.getTasks(campaignId);
      setTasks(taskList);
      const updated = await campaignsApi.get(campaignId);
      setCampaign(updated);
    } catch {
      setError("Import CSV thất bại.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImportText = async () => {
    if (!importText.trim()) return;
    setImporting(true);
    setImportResult(null);
    setError(null);
    try {
      const result = await campaignsApi.bulkImportText(campaignId, importText);
      setImportResult(result);
      setImportText("");
      const taskList = await campaignsApi.getTasks(campaignId);
      setTasks(taskList);
      const updated = await campaignsApi.get(campaignId);
      setCampaign(updated);
    } catch {
      setError("Import thất bại.");
    } finally {
      setImporting(false);
    }
  };

  const handleGenerateContent = async (taskId: number) => {
    setGeneratingId(taskId);
    setError(null);
    try {
      const result = await campaignsApi.generateContent(campaignId, taskId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, ai_title: result.ai_title, ai_content: result.ai_content, meta_description: result.meta_description }
            : t
        )
      );
      setPreviewTask((prev) =>
        prev?.id === taskId
          ? { ...prev, ai_title: result.ai_title, ai_content: result.ai_content, meta_description: result.meta_description }
          : prev
      );
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail ? `Sinh nội dung thất bại: ${detail}` : "Sinh nội dung AI thất bại.");
    } finally {
      setGeneratingId(null);
    }
  };

  const handlePublishTask = async (taskId: number) => {
    setPublishingId(taskId);
    setPublishMsg(null);
    setError(null);
    try {
      const result = await campaignsApi.publishTask(campaignId, taskId);
      setPublishMsg(result.message);
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "processing" as const } : t));
    } catch {
      setError("Đưa vào hàng đợi thất bại.");
    } finally {
      setPublishingId(null);
    }
  };

  const handlePublishAll = async () => {
    setPublishingAll(true);
    setPublishMsg(null);
    setError(null);
    try {
      const result = await campaignsApi.publishAll(campaignId);
      setPublishMsg(`Đã queue ${result.queued} bài, bỏ qua ${result.skipped} bài không đủ điều kiện.`);
      await fetchAll();
    } catch {
      setError("Publish All thất bại.");
    } finally {
      setPublishingAll(false);
    }
  };

  const handleGetLinks = async () => {
    setLoadingLinks(true);
    setError(null);
    try {
      const result = await campaignsApi.getPublishedLinks(campaignId);
      setPublishedLinks(result.links);
      setShowLinksModal(true);
      setLinksCopied(false);
    } catch {
      setError("Lấy link thất bại.");
    } finally {
      setLoadingLinks(false);
    }
  };

  const handleCopyLinks = () => {
    const text = publishedLinks.map((l) => l.published_url).join("\n");
    navigator.clipboard.writeText(text);
    setLinksCopied(true);
    setTimeout(() => setLinksCopied(false), 2000);
  };

  const handleUploadIntroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const result = await campaignsApi.uploadIntroImage(campaignId, file, imageAlt);
      setCampaign((prev) =>
        prev
          ? { ...prev, intro_image_url: result.intro_image_url, intro_image_alt: result.intro_image_alt }
          : prev
      );
    } catch {
      setError("Upload ảnh thất bại.");
    } finally {
      setUploadingImage(false);
      if (introImageRef.current) introImageRef.current.value = "";
    }
  };

  const handleBulkGenerate = async () => {
    setBulkGenerating(true);
    setBulkGenMsg(null);
    setError(null);
    try {
      const result = await campaignsApi.bulkGenerate(campaignId);
      setBulkGenMsg(
        `Tạo AI xong: ${result.generated}/${result.total - result.failed} thành công` +
        (result.failed > 0 ? `, ${result.failed} thất bại` : "")
      );
      await fetchAll();
    } catch {
      setError("Bulk tạo AI thất bại.");
    } finally {
      setBulkGenerating(false);
    }
  };

  const handleCheckAnchor = async (taskId: number) => {
    setCheckingAnchorId(taskId);
    setError(null);
    try {
      const result = await campaignsApi.checkAnchor(campaignId, taskId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, anchor_check_status: result.anchor_check_status, anchor_check_message: result.anchor_check_message }
            : t
        )
      );
    } catch {
      setError("Kiểm tra backlink thất bại.");
    } finally {
      setCheckingAnchorId(null);
    }
  };

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Đang tải...</div>;
  if (!campaign) return <div className="p-6 text-sm text-destructive">Không tìm thấy campaign.</div>;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate("/campaigns")}
            className="text-xs text-muted-foreground hover:text-foreground mb-1 flex items-center gap-1"
          >
            ← Quay lại
          </button>
          <h1 className="text-xl font-bold text-foreground">{campaign.name}</h1>
          {campaign.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{campaign.description}</p>
          )}
        </div>
        <select
          value={campaign.status}
          onChange={(e) => handleStatusChange(e.target.value as Campaign["status"])}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center gap-3 flex-wrap rounded-lg border border-border bg-card px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">Chủ đề bài viết:</span>
        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={nicheMode === "casino"}
            onChange={() => setNicheMode("casino")}
            className="accent-primary"
          />
          Nhà cái / Cá cược
        </label>
        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={nicheMode === "custom"}
            onChange={() => setNicheMode("custom")}
            className="accent-primary"
          />
          Tự nhập
        </label>
        {nicheMode === "custom" && (
          <input
            value={nicheCustom}
            onChange={(e) => setNicheCustom(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-56"
            placeholder="Bất động sản, Sức khỏe..."
          />
        )}
        <button
          onClick={handleNicheSave}
          disabled={savingNiche}
          className="rounded-md border border-border px-3 py-1 text-xs hover:bg-accent transition-colors disabled:opacity-50 ml-1"
        >
          {savingNiche ? "Đang lưu..." : "Lưu"}
        </button>
        <span className="text-xs text-muted-foreground">
          Hiện tại: <span className="font-medium">{campaign.niche === "casino" ? "Nhà cái" : campaign.niche ? campaign.niche : "Chưa đặt"}</span>
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap rounded-lg border border-border bg-card px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Ảnh Intro:</span>
        {campaign.intro_image_url && (
          <img
            src={campaign.intro_image_url}
            alt={campaign.intro_image_alt ?? ""}
            className="h-12 w-20 rounded border border-border object-cover"
          />
        )}
        <input
          type="text"
          placeholder="Alt text (tùy chọn)"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-52"
        />
        <label
          className={`rounded-md border border-border px-3 py-1.5 text-sm cursor-pointer hover:bg-accent transition-colors ${uploadingImage ? "opacity-50 pointer-events-none" : ""}`}
        >
          {uploadingImage ? "Đang upload..." : campaign.intro_image_url ? "Đổi ảnh" : "Chọn ảnh"}
          <input
            ref={introImageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleUploadIntroImage}
          />
        </label>
        {campaign.intro_image_url && (
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {campaign.intro_image_alt || "(không có alt)"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Tổng tasks", value: campaign.task_count, color: "text-foreground" },
          { label: "Pending", value: campaign.pending_count, color: "text-yellow-600" },
          { label: "Done", value: campaign.done_count, color: "text-green-600" },
          { label: "Failed", value: campaign.failed_count, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-2 text-sm text-destructive">
          {error}
          <button className="ml-2 underline" onClick={() => setError(null)}>Đóng</button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-md border border-border overflow-hidden text-sm">
            <button
              onClick={() => setImportMode("text")}
              className={`px-3 py-1.5 transition-colors ${importMode === "text" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              Nhập text
            </button>
            <button
              onClick={() => setImportMode("file")}
              className={`px-3 py-1.5 transition-colors border-l border-border ${importMode === "file" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              File CSV
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Ngôn ngữ bài viết:</label>
            <select
              value={campaignLanguage}
              disabled={settingLanguage}
              onChange={(e) => handleBulkSetLanguage(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="th">ภาษาไทย</option>
              <option value="ms">Bahasa Melayu</option>
            </select>
            <button
              onClick={handleBulkGenerate}
              disabled={bulkGenerating}
              className="rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {bulkGenerating ? "Đang tạo AI..." : "Tạo AI tất cả"}
            </button>
            <button
              onClick={handlePublishAll}
              disabled={publishingAll}
              className="rounded-md bg-green-600 text-white px-4 py-1.5 text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {publishingAll ? "Đang queue..." : "Publish All"}
            </button>
            <button
              onClick={handleGetLinks}
              disabled={loadingLinks}
              className="rounded-md bg-blue-600 text-white px-4 py-1.5 text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loadingLinks ? "Đang lấy..." : "Lấy link bài viết"}
            </button>
          </div>
        </div>

        {importMode === "text" ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Paste trực tiếp từ Google Sheet. Mỗi dòng 1 domain, nhiều cặp anchor+URL tùy ý:<br />
              <code className="bg-muted px-1 rounded">domain | anchor1 | url1 | anchor2 | url2 | ...</code> — tất cả anchor/url được nhúng vào 1 bài viết. Cột cuối có thể là ngôn ngữ (vi/en/id/th/ms).
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={6}
              disabled={importing}
              placeholder={"https://site1.com\tanchor1\thttps://target.com/p1\tanchor2\thttps://target.com/p2\nsite2.com|anchor|https://target.com|en"}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y disabled:opacity-50"
            />
            <button
              onClick={handleImportText}
              disabled={importing || !importText.trim()}
              className="rounded-md bg-primary text-primary-foreground px-4 py-1.5 text-sm hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {importing ? "Đang import..." : "Import tasks"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <label className={`cursor-pointer rounded-md border border-border px-4 py-1.5 text-sm hover:bg-accent transition-colors ${importing ? "opacity-50 pointer-events-none" : ""}`}>
              {importing ? "Đang import..." : "Chọn file CSV"}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImport}
                disabled={importing}
              />
            </label>
            <span className="text-xs text-muted-foreground">Format: domain,anchor,target_url[,language]</span>
          </div>
        )}
      </div>

      {bulkGenMsg && (
        <div className="rounded-md bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-700 flex items-center justify-between">
          {bulkGenMsg}
          <button className="ml-2 underline text-xs" onClick={() => setBulkGenMsg(null)}>Đóng</button>
        </div>
      )}

      {publishMsg && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700 flex items-center justify-between">
          {publishMsg}
          <button className="ml-2 underline text-xs" onClick={() => setPublishMsg(null)}>Đóng</button>
        </div>
      )}

      {importResult && (
        <div className="rounded-md border border-border bg-card p-3 text-sm space-y-1">
          <p className="font-medium">
            Import: <span className="text-green-600">{importResult.imported} thành công</span>
            {importResult.failed > 0 && <span className="text-red-500 ml-2">{importResult.failed} thất bại</span>}
            <span className="text-muted-foreground ml-2">/ {importResult.total} tổng</span>
          </p>
          {importResult.errors.length > 0 && (
            <ul className="text-xs text-red-500 space-y-0.5 mt-1 max-h-24 overflow-y-auto">
              {importResult.errors.map((e, i) => <li key={i}>• {e}</li>)}
            </ul>
          )}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Chưa có tasks. Import CSV để thêm hàng loạt.
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Domain</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Anchor</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Target URL</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Trạng thái</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">WP Site</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-xs text-foreground">{task.domain}</td>
                  <td className="px-3 py-2.5 text-foreground">
                    <span>{task.anchor}</span>
                    {task.extra_links && (() => {
                      try {
                        const extra = JSON.parse(task.extra_links) as { anchor: string; url: string }[];
                        if (extra.length === 0) return null;
                        return (
                          <span className="ml-1.5 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-xs font-medium">
                            +{extra.length}
                          </span>
                        );
                      } catch { return null; }
                    })()}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-xs truncate">
                    <a href={task.target_url} target="_blank" rel="noreferrer" className="hover:underline">
                      {task.target_url}
                    </a>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[task.status]}`}>
                      {task.status}
                    </span>
                    {task.error_message && (
                      <p className="text-xs text-red-500 mt-0.5 max-w-xs truncate" title={task.error_message}>
                        {task.error_message}
                      </p>
                    )}
                    {task.published_url && (
                      <a href={task.published_url} target="_blank" rel="noreferrer"
                        className="text-xs text-green-600 hover:underline mt-0.5 block truncate max-w-xs">
                        Xem bài
                      </a>
                    )}
                    {task.anchor_check_status && (
                      <span
                        title={task.anchor_check_message ?? ""}
                        className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          task.anchor_check_status === "success"
                            ? "bg-emerald-100 text-emerald-700"
                            : task.anchor_check_status === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {task.anchor_check_status === "success" ? "✓ Link OK"
                          : task.anchor_check_status === "warning" ? "⚠ Cảnh báo"
                          : "✗ Lỗi"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <select
                      value={task.wp_site_id ?? ""}
                      disabled={assigningId === task.id}
                      onChange={(e) =>
                        handleAssignSite(task.id, e.target.value ? Number(e.target.value) : null)
                      }
                      className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    >
                      <option value="">-- Chưa gán --</option>
                      {sites.map((s) => (
                        <option key={s.id} value={s.id}>{s.site_url}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2.5 text-right space-x-1">
                    <button
                      onClick={() => setPreviewTask(task)}
                      disabled={!task.ai_title}
                      className="rounded px-2 py-1 text-xs border border-border hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title={task.ai_title ? "Xem nội dung AI" : "Chưa có nội dung"}
                    >
                      {task.ai_title ? "Xem" : "—"}
                    </button>
                    <button
                      onClick={() => handleGenerateContent(task.id)}
                      disabled={generatingId === task.id}
                      className="rounded px-2 py-1 text-xs border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                      {generatingId === task.id ? "Đang tạo..." : task.ai_title ? "Tạo lại" : "Tạo AI"}
                    </button>
                    <button
                      onClick={() => handlePublishTask(task.id)}
                      disabled={
                        publishingId === task.id ||
                        !task.ai_content ||
                        !task.wp_site_id ||
                        task.status === "processing" ||
                        task.status === "done"
                      }
                      className="rounded px-2 py-1 text-xs border border-green-400 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title={!task.ai_content ? "Cần tạo AI trước" : !task.wp_site_id ? "Cần gán WP Site" : ""}
                    >
                      {publishingId === task.id ? "..." : "Đăng"}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded px-2 py-1 text-xs text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Xóa
                    </button>
                    {task.published_url && (
                      <button
                        onClick={() => handleCheckAnchor(task.id)}
                        disabled={checkingAnchorId === task.id}
                        className="rounded px-2 py-1 text-xs border border-violet-300 text-violet-700 hover:bg-violet-50 transition-colors disabled:opacity-50"
                        title="Kiểm tra backlink trên trang đã đăng"
                      >
                        {checkingAnchorId === task.id ? "Đang check..." : "Check link"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {previewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-xl border border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <h2 className="font-semibold text-foreground text-sm">Nội dung AI</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{previewTask.domain} · {previewTask.anchor}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateContent(previewTask.id)}
                  disabled={generatingId === previewTask.id}
                  className="rounded px-3 py-1 text-xs border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-50"
                >
                  {generatingId === previewTask.id ? "Đang tạo..." : "Tạo lại"}
                </button>
                <button
                  onClick={() => setPreviewTask(null)}
                  className="rounded px-2 py-1 text-xs border border-border hover:bg-accent"
                >
                  ✕ Đóng
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-5 space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">TITLE</p>
                <p className="font-semibold text-foreground">{previewTask.ai_title}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">NỘI DUNG</p>
                <div
                  className="text-sm text-foreground leading-relaxed space-y-2 [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: previewTask.ai_content ?? "" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showLinksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h2 className="font-semibold text-foreground text-sm">Link bài viết đã đăng</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLinks}
                  className="rounded px-3 py-1.5 text-xs bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                >
                  {linksCopied ? "✓ Đã copy" : "Copy tất cả"}
                </button>
                <button
                  onClick={() => setShowLinksModal(false)}
                  className="rounded px-2 py-1 text-xs border border-border hover:bg-accent"
                >
                  Đóng
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-5 space-y-2">
              {publishedLinks.map((link, idx) => (
                <div key={idx} className="rounded border border-border bg-background p-3 text-sm">
                  <p className="font-medium text-foreground">{link.domain}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {link.anchor} → {link.target_url}
                  </p>
                  <a
                    href={link.published_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline mt-1 block"
                  >
                    {link.published_url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
