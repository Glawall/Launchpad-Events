import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useEvents } from "../hooks/api-hooks";
import EventCard from "./EventCard";

export default function EventList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [pageSize] = useState(10);
  const { getAllEvents } = useEvents();

  const currentPage = parseInt(searchParams.get("page") || "1");

  const fetchEvents = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const data = await getAllEvents({
          page,
          limit: pageSize,
          sort: "date",
          order: "asc",
        });
        setEventsList(data.events);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [getAllEvents, pageSize]
  );

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage, fetchEvents]);

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPreviousPage) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="wrapper">
      <h2 className="title">Events</h2>
      <div className="grid gap-6">
        {eventsList.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={!pagination.hasPreviousPage}
          className="btn-gray"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {pagination.currentPage} of {pagination.totalPages}
          {pagination.totalCount > 0 && ` (${pagination.totalCount} total)`}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!pagination.hasNextPage}
          className="btn-gray"
        >
          Next
        </button>
      </div>
    </div>
  );
}
