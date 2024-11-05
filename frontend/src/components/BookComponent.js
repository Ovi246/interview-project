import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        {props.type === "cover" ? (
          <h1 className="text-4xl font-bold text-center">{props.content}</h1>
        ) : props.type === "text" ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Page {props.number}</h2>
            <p className="text-gray-700">{props.content}</p>
          </>
        ) : (
          <img
            src={props.content}
            alt={`Page ${props.number} illustration`}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
});

const BookComponent = ({ bookPages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);

  const handlePageChange = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="book-container relative mb-8">
      <HTMLFlipBook
        width={400}
        height={600}
        size="stretch"
        minWidth={300}
        maxWidth={400}
        minHeight={400}
        maxHeight={600}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={handlePageChange}
        className="demo-book"
        ref={bookRef}
      >
        {bookPages.map((page, index) => (
          <Page
            key={index}
            number={page.number}
            type={page.type}
            content={page.content}
          />
        ))}
      </HTMLFlipBook>
      {currentPage > 0 && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          onClick={() => bookRef.current.pageFlip().flipPrev()}
        >
          <FaChevronLeft className="text-blue-500" />
        </button>
      )}
      {currentPage < bookPages.length - 2 && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          onClick={() => bookRef.current.pageFlip().flipNext()}
        >
          <FaChevronRight className="text-blue-500" />
        </button>
      )}
    </div>
  );
};

export default BookComponent;
