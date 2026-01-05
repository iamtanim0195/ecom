export function validateCreateProduct(payload) {
    const errors = [];

    const title = (payload?.title || "").trim();
    const description = (payload?.description || "").trim();
    const category = (payload?.category || "").trim();

    const price = Number(payload?.price);
    const stock = Number(payload?.stock ?? 0);

    if (!title) errors.push("Title is required");
    if (Number.isNaN(price) || price <= 0) errors.push("Price must be > 0");
    if (!Number.isInteger(stock) || stock < 0) errors.push("Stock must be a non-negative integer");

    return {
        ok: errors.length === 0,
        errors,
        value: {
            title,
            description,
            category,
            price,
            stock,
            currency: (payload?.currency || "usd").toLowerCase(),
            images: Array.isArray(payload?.images) ? payload.images : [],
            isActive: payload?.isActive !== false,
        },
    };
}
