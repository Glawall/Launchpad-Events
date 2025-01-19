import { useState } from "react";
import { useEventTypes } from "../hooks/api-hooks";
import { useEventTypesContext } from "../context/EventTypesContext";
import Button from "./common/Button";
import FormField from "./common/FormField";
import ConfirmBox from "./common/ConfirmBox";

export default function EventTypeSelect({ value, onChange, className }) {
  const { createEventType, deleteEventType } = useEventTypes();
  const { eventTypes, refreshEventTypes } = useEventTypesContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [newType, setNewType] = useState({ name: "", description: "" });

  const handleAddType = async (e) => {
    e.preventDefault();
    try {
      const createdType = await createEventType(newType);
      await refreshEventTypes();
      onChange(createdType.id.toString());
      setShowAddForm(false);
      setNewType({ name: "", description: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (e, type) => {
    e.stopPropagation();
    e.preventDefault();
    setTypeToDelete(type);
    setShowConfirm(true);
    setShowDropdown(true);
  };

  const handleDeleteConfirm = async () => {
    if (!typeToDelete || parseInt(typeToDelete.event_count) > 0) return;
    try {
      await deleteEventType(typeToDelete.id);
      await refreshEventTypes();
      if (value === typeToDelete.id.toString()) {
        onChange("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setShowConfirm(false);
      setTypeToDelete(null);
    }
  };

  const selectedType = eventTypes.find((t) => t.id.toString() === value);

  return (
    <div className="event-type-select">
      <div className="custom-select">
        <div
          className="select-header"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span>
            {selectedType ? selectedType.name : "Select an event type"}
          </span>
          <span className="dropdown-hint">
            ▼ {showDropdown ? "Click to close options" : "Click to see options"}
          </span>
        </div>

        {showDropdown && (
          <div className="select-options">
            {eventTypes.map((type) => (
              <div
                key={type.id}
                className={`select-option ${
                  value === type.id.toString() ? "selected" : ""
                }`}
                onClick={() => {
                  onChange(type.id.toString());
                  setShowDropdown(false);
                }}
              >
                <span className="type-name">{type.name}</span>
                {type.event_count === "0" && (
                  <button
                    className="delete-cross"
                    onClick={(e) => handleDeleteClick(e, type)}
                    title="Delete event type"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="type-controls">
        <Button onClick={() => setShowAddForm(true)}>Add Type</Button>
      </div>

      {showAddForm && (
        <div className="add-type-form">
          <FormField
            label="Name"
            value={newType.name}
            onChange={(e) => setNewType({ ...newType, name: e.target.value })}
            required
          />
          <FormField
            label="Description"
            value={newType.description}
            onChange={(e) =>
              setNewType({ ...newType, description: e.target.value })
            }
            required
          />
          <div className="button-group">
            <Button onClick={handleAddType}>Add</Button>
            <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <ConfirmBox
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setTypeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Event Type"
        message="Are you sure you want to delete this event type?"
      />
    </div>
  );
}
