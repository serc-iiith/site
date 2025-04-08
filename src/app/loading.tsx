export default function Loading() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-[var(--primary-color)] border-b-[var(--primary-color)] border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-[var(--text-color)]">Loading...</h2>
                <p className="text-[var(--secondary-color)] mt-2">Please wait while we prepare the content</p>
            </div>
        </div>
    )
}