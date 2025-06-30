import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const getPagesToShow = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // Always show first page

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  return (
    <div className="flex justify-end items-center mt-4 gap-2 px-1 text-sm">
      {/* Previous */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-40"
      >
        <GrFormPrevious />
      </button>

      {/* Page Numbers */}
      {getPagesToShow().map((page, idx) => (
        <button
          key={idx}
          disabled={page === "..."}
          onClick={() => typeof page === "number" && setCurrentPage(page)}
          className={`px-3 py-1 border rounded ${
            page === currentPage
              ? "bg-green-100 border border-green-500 text-green-500"
              : "bg-white hover:bg-gray-100"
          } ${page === "..." && "cursor-default text-gray-400"}`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-40"
      >
        <GrFormNext />
      </button>
    </div>
  );
};

export default Pagination;
