export default function LoadingSpinner({
    size = "md",
    center = false,
}) {
    const sizeClass =
        size === "sm"
            ? "loading-sm"
            : size === "lg"
                ? "loading-lg"
                : "loading-md";

    return (
        <div className={center ? "flex justify-center" : ""}>
            <span className={`loading loading-spinner ${sizeClass}`} />
        </div>
    );
}
