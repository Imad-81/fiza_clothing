"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  gender: string;
  description: string | null;
  image: string | null;
  productCount: number;
  createdAt: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  gender: string;
  description: string;
  image: string;
}

export function CategoryManagerClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const defaultFormData: CategoryFormData = {
    name: "",
    slug: "",
    gender: "women",
    description: "",
    image: "",
  };

  const [form, setForm] = useState<CategoryFormData>(defaultFormData);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

      const matchesGender =
        genderFilter === "all" ||
        c.gender.toLowerCase() === genderFilter.toLowerCase();

      return matchesSearch && matchesGender;
    });
  }, [categories, search, genderFilter]);

  // Counts
  const womenCount = useMemo(
    () => categories.filter((c) => c.gender.toLowerCase() === "women").length,
    [categories],
  );
  const menCount = useMemo(
    () => categories.filter((c) => c.gender.toLowerCase() === "men").length,
    [categories],
  );
  const unisexCount = useMemo(
    () => categories.filter((c) => !["women", "men"].includes(c.gender.toLowerCase())).length,
    [categories],
  );
  const totalProducts = useMemo(
    () => categories.reduce((sum, c) => sum + (c.productCount || 0), 0),
    [categories],
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(defaultFormData);
    setFieldErrors({});
    setServerError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      gender: cat.gender || "women",
      description: cat.description || "",
      image: cat.image || "",
    });
    setFieldErrors({});
    setServerError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFieldErrors({});
    setServerError("");
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => {
      const next = { ...prev, name };
      // Auto-generate slug when creating or if slug matches old slugified name
      if (!editingCategory || prev.slug === slugify(prev.name)) {
        next.slug = slugify(name);
      }
      return next;
    });
    if (fieldErrors.name) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.name;
        return copy;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setServerError("");

    try {
      // 1. Try S3 presigned upload
      const presignRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [{ contentType: file.type, fileName: file.name }],
        }),
      });

      const presignJson = await presignRes.json();
      if (presignJson.success && presignJson.data?.paths?.[0]?.uploadUrl) {
        const { uploadUrl, publicUrl } = presignJson.data.paths[0];
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (putRes.ok) {
          setForm((prev) => ({ ...prev, image: publicUrl }));
          return;
        }
      }

      // 2. Fallback to direct multipart/form-data upload (local dev or direct adapter)
      const formData = new FormData();
      formData.append("file", file);
      const directRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const directJson = await directRes.json();
      if (directJson.success && directJson.data?.publicUrl) {
        setForm((prev) => ({ ...prev, image: directJson.data.publicUrl }));
        return;
      }

      setServerError(
        directJson.message || presignJson.message || "Failed to upload image. You can also paste an image URL directly.",
      );
    } catch {
      setServerError("Network error while uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setServerError("");
    setFieldErrors({});

    const sanitizedSlug = slugify(form.slug || form.name);
    const payload = {
      ...form,
      name: form.name.trim(),
      slug: sanitizedSlug,
    };

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.message || "Failed to save category");
        if (json.errors) setFieldErrors(json.errors);
        return;
      }

      const savedCategory = json.data as CategoryItem;

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c.id === savedCategory.id ? savedCategory : c)),
        );
      } else {
        setCategories((prev) => [...prev, savedCategory]);
      }

      closeModal();
      router.refresh();
    } catch {
      setServerError("Network error while saving category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/admin/categories/${deletingCategory.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setDeleteError(json.message || "Failed to delete category");
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setDeletingCategory(null);
      router.refresh();
    } catch {
      setDeleteError("Network error while deleting category");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-primary">
            Categories
          </h1>
          <p className="mt-1 text-sm text-brand-text/60">
            Customize, rename, and add categories for your store catalog and navigation edits.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-gold"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Metrics Row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-brand-primary/15 bg-brand-bg p-4">
          <p className="text-xs font-medium text-brand-text/60 uppercase tracking-wider">Total Categories</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-primary">{categories.length}</p>
        </div>
        <div className="rounded-xl border border-brand-primary/15 bg-brand-bg p-4">
          <p className="text-xs font-medium text-brand-text/60 uppercase tracking-wider">Women</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#A85A50]">{womenCount}</p>
        </div>
        <div className="rounded-xl border border-brand-primary/15 bg-brand-bg p-4">
          <p className="text-xs font-medium text-brand-text/60 uppercase tracking-wider">Men</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-primary">{menCount}</p>
        </div>
        <div className="rounded-xl border border-brand-primary/15 bg-brand-bg p-4">
          <p className="text-xs font-medium text-brand-text/60 uppercase tracking-wider">Total Products</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-primary">{totalProducts}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, slug or description…"
            className="w-full rounded-lg border border-brand-primary/15 bg-brand-bg pl-9 pr-4 py-2 text-sm text-brand-text outline-none transition-colors focus:border-brand-gold"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-brand-text/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          {[
            { id: "all", label: `All (${categories.length})` },
            { id: "women", label: `Women (${womenCount})` },
            { id: "men", label: `Men (${menCount})` },
            ...(unisexCount > 0 ? [{ id: "unisex", label: `Unisex (${unisexCount})` }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setGenderFilter(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
                genderFilter === tab.id
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-brand-primary/5 text-brand-text/70 hover:bg-brand-primary/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Cards / Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-brand-primary/15 bg-brand-bg shadow-sm">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-brand-text/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-3 text-base font-medium text-brand-primary">No categories found</p>
            <p className="mt-1 text-xs text-brand-text/60">
              {search ? "Try refining your search term." : "Create your first category to get started."}
            </p>
            {!search && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-primary/90"
              >
                + Add Category
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-brand-primary/10">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col gap-4 p-4 transition-colors hover:bg-brand-primary/[0.02] sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-brand-primary/15 bg-brand-gold/10">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-brand-primary/40">
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-brand-primary truncate">
                        {cat.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          cat.gender.toLowerCase() === "women"
                            ? "bg-[#FAF0EE] text-[#9A564E] border border-[#9A564E]/20"
                            : cat.gender.toLowerCase() === "men"
                              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {cat.gender}
                      </span>
                      <span className="rounded-full bg-brand-primary/5 px-2 py-0.5 text-[11px] font-medium text-brand-text/70">
                        {cat.productCount} {cat.productCount === 1 ? "product" : "products"}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-text/60">
                      <span className="font-mono text-[11px] text-brand-gold">/shop/{cat.slug}</span>
                      {cat.description && (
                        <span className="truncate max-w-xs sm:max-w-md text-brand-text/50">
                          · {cat.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-stretch sm:self-center justify-between sm:justify-end shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-brand-primary/10">
                  <Link
                    href={`/shop/${cat.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-brand-primary/15 px-3 py-1.5 text-xs font-semibold text-brand-text/70 transition-colors hover:border-brand-primary hover:text-brand-primary min-h-[36px]"
                    title="View on storefront"
                  >
                    <span>Store</span>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-primary shadow-2xs transition-colors hover:bg-brand-primary/5 hover:border-brand-gold min-h-[36px]"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError("");
                        setDeletingCategory(cat);
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50 hover:border-red-300 min-h-[36px] min-w-[36px]"
                      title="Delete category"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-brand-primary/15 bg-brand-bg p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-primary/10 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-brand-primary">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Category"}
                </h2>
                <p className="mt-0.5 text-xs text-brand-text/60">
                  {editingCategory
                    ? "Update category details, images, and department."
                    : "Create a new product category for your store."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-brand-text/40 hover:bg-brand-primary/5 hover:text-brand-text"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Renaming Note */}
            {editingCategory && editingCategory.productCount > 0 && (
              <div className="mt-4 rounded-lg bg-brand-gold/10 border border-brand-gold/25 p-3 text-xs text-brand-text/80">
                <span className="font-semibold text-brand-primary">Note:</span> If you rename this category, all{" "}
                <strong>{editingCategory.productCount} product(s)</strong> currently assigned to &ldquo;
                {editingCategory.name}&rdquo; will be automatically updated to the new name.
              </div>
            )}

            {/* Error Banner */}
            {serverError && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Category Name */}
              <div>
                <label htmlFor="cat-name" className="block text-xs font-semibold text-brand-primary">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cat-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Kurtis, Sarees, Lehengas"
                  className="mt-1 w-full rounded-lg border border-brand-primary/15 bg-white px-3.5 py-2 text-sm text-brand-text outline-none transition-colors focus:border-brand-gold"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="cat-slug" className="block text-xs font-semibold text-brand-primary">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center rounded-lg border border-brand-primary/15 bg-white px-3 text-sm focus-within:border-brand-gold">
                  <span className="font-mono text-xs text-brand-text/40 shrink-0">/shop/</span>
                  <input
                    id="cat-slug"
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                    placeholder="kurtis"
                    className="w-full bg-transparent py-2 pl-1 pr-2 font-mono text-xs text-brand-text outline-none"
                  />
                </div>
                {fieldErrors.slug && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.slug[0]}</p>
                )}
              </div>

              {/* Department / Gender */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                  Department / Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "women", label: "Women" },
                    { id: "men", label: "Men" },
                    { id: "unisex", label: "Unisex" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, gender: g.id }))}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                        form.gender.toLowerCase() === g.id
                          ? "border-brand-primary bg-brand-primary text-white shadow-xs"
                          : "border-brand-primary/15 bg-white text-brand-text/70 hover:bg-brand-primary/5"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="cat-desc" className="block text-xs font-semibold text-brand-primary">
                  Description
                </label>
                <textarea
                  id="cat-desc"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Editorial description displayed in headers and SEO previews…"
                  className="mt-1 w-full rounded-lg border border-brand-primary/15 bg-white px-3.5 py-2 text-sm text-brand-text outline-none transition-colors focus:border-brand-gold"
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">
                  Category Image
                </label>

                {form.image ? (
                  <div className="relative mt-1 flex items-center gap-3 rounded-lg border border-brand-primary/15 bg-white p-2">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-brand-primary/10">
                      <Image
                        src={form.image}
                        alt="Category preview"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-mono text-brand-text/60">{form.image}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                      title="Remove image"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                    <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-brand-primary/25 bg-white p-3 text-center transition-colors hover:border-brand-gold">
                      <span className="text-xs font-medium text-brand-primary">
                        {uploading ? "Uploading…" : "Upload banner image"}
                      </span>
                      <span className="block text-[10px] text-brand-text/50">PNG, JPG, SVG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>

                    <div className="flex items-center text-xs text-brand-text/40 justify-center">or</div>

                    <input
                      type="text"
                      placeholder="Paste image URL…"
                      value={form.image}
                      onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                      className="flex-1 rounded-lg border border-brand-primary/15 bg-white px-3 py-2 text-xs text-brand-text outline-none focus:border-brand-gold"
                    />
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-brand-primary/10 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-brand-primary/15 px-4 py-2 text-xs font-semibold text-brand-text/70 transition-colors hover:bg-brand-primary/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-primary/90 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving…
                    </>
                  ) : editingCategory ? (
                    "Save Changes"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-brand-primary/15 bg-brand-bg p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-primary">
                  Delete Category
                </h3>
                <p className="text-xs text-brand-text/60">
                  {deletingCategory.name} (/shop/{deletingCategory.slug})
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                {deleteError}
              </div>
            )}

            {deletingCategory.productCount > 0 ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                  <p className="font-semibold">Cannot delete category with active products</p>
                  <p className="mt-1">
                    There are currently <strong>{deletingCategory.productCount} product(s)</strong> assigned to &ldquo;
                    {deletingCategory.name}&rdquo;. To protect your catalog from orphaned products, please reassign or delete these products first.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Link
                    href={`/admin/products?q=${encodeURIComponent(deletingCategory.name)}`}
                    className="rounded-lg border border-brand-primary/15 bg-white px-3.5 py-2 text-xs font-semibold text-brand-primary hover:border-brand-gold"
                  >
                    View Assigned Products →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(null)}
                    className="rounded-lg bg-brand-primary px-4 py-2 text-xs font-semibold text-white hover:bg-brand-primary/90"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-xs text-brand-text/70 leading-relaxed">
                  Are you sure you want to delete &ldquo;<strong>{deletingCategory.name}</strong>&rdquo;? This will remove the category from your catalog and navigation. This action cannot be undone.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(null)}
                    disabled={deleteLoading}
                    className="rounded-lg border border-brand-primary/15 px-4 py-2 text-xs font-semibold text-brand-text/70 hover:bg-brand-primary/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteLoading ? "Deleting…" : "Delete Category"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
